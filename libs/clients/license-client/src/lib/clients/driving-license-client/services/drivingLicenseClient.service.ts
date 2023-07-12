import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { format as formatNationalId } from 'kennitala'
import {
  DriverLicenseDto,
  DrivingLicenseApi,
  RemarkCode,
} from '@island.is/clients/driving-license'
import {
  LicenseClient,
  LicensePkPassAvailability,
  PkPassVerification,
  PkPassVerificationInputData,
  Result,
} from '../../../licenseClient.type'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { createPkPassDataInput } from '../drivingLicenseMapper'
/** Category to attach each log message to */
const LOG_CATEGORY = 'drivinglicense-service'

@Injectable()
export class DrivingLicenseClient implements LicenseClient<DriverLicenseDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private drivingApi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private checkLicenseValidity(
    license: DriverLicenseDto,
  ): LicensePkPassAvailability {
    if (!license || license.photo === undefined) {
      return LicensePkPassAvailability.Unknown
    }

    if (!license.photo.image) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  licenseIsValidForPkPass(payload: unknown): LicensePkPassAvailability {
    return this.checkLicenseValidity(payload as DriverLicenseDto)
  }

  private async fetchCategories() {
    try {
      const categories = await this.drivingApi.getRemarksCodeTable()
      return { ok: true, data: categories }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        error = {
          code: 13,
          message: 'Service failure',
          data: JSON.stringify(e.body),
        }
        this.logger.warn('Expected 200 status', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
        this.logger.warn('Unable to query categories', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      }

      return {
        ok: false,
        error,
      }
    }
  }

  private async fetchLicense(
    user: User,
  ): Promise<Result<DriverLicenseDto | null>> {
    try {
      const licenseInfo = await this.drivingApi.getCurrentLicenseV5({
        nationalId: user.nationalId,
        token: user.authorization.replace(/^bearer /i, ''),
      })
      return { ok: true, data: licenseInfo }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        error = {
          code: 13,
          message: 'Service failure',
          data: JSON.stringify(e.body),
        }
        this.logger.warn('Expected 200 status', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
        this.logger.warn('Unable to query data', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      }

      return {
        ok: false,
        error,
      }
    }
  }

  private async createPkPassPayload(
    data: DriverLicenseDto,
    categories: Array<RemarkCode>,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(data, categories)

    //slice out headers from base64 image string
    const image = data?.photo?.image

    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: data.dateValidTo?.toISOString(),
      thumbnail: image
        ? {
            imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
          }
        : null,
    }
    return payload
  }

  async getLicense(user: User): Promise<Result<DriverLicenseDto | null>> {
    const licenseData = await this.fetchLicense(user)
    if (!licenseData.ok) {
      this.logger.info(`Drivers license data fetch failed`)
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
        },
      }
    }

    //the user ain't got no license
    if (!licenseData.data) {
      return {
        ok: true,
        data: null,
      }
    }

    return licenseData
  }

  async getLicenseDetail(user: User): Promise<Result<DriverLicenseDto | null>> {
    return this.getLicense(user)
  }

  async getPkPass(user: User): Promise<Result<Pass>> {
    const licenseData = await Promise.all([
      this.fetchLicense(user),
      this.fetchCategories(),
    ])

    if (!licenseData[0].ok || !licenseData[0].data) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Drivers license data fetch failed',
        },
      }
    }
    if (!licenseData[1].ok || !licenseData[1].data) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Drivers license category fetch failed',
        },
      }
    }

    const valid = this.licenseIsValidForPkPass(licenseData[0].data)

    if (!valid) {
      return {
        ok: false,
        error: {
          code: 5,
          message: 'Pass is invalid for pkpass generation',
        },
      }
    }

    const payload = await this.createPkPassPayload(
      licenseData[0].data,
      licenseData[1].data,
    )

    if (!payload) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Payload creation failed',
        },
      }
    }

    const pass = await this.smartApi.generatePkPass(
      payload,
      formatNationalId(user.nationalId),
      () =>
        this.drivingApi.notifyOnPkPassCreation({
          nationalId: user.nationalId,
          token: user.authorization.replace(/^bearer /i, ''),
        }),
    )

    return pass
  }

  async getPkPassQRCode(user: User): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionQRCode) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution QR code in driving license',
      }

      this.logger.warn(error.message, {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error,
      }
    }

    return {
      ok: true,
      data: res.data.distributionQRCode,
    }
  }

  async getPkPassUrl(user: User): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionUrl) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution url in driving license',
      }

      this.logger.warn(error.message, {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error,
      }
    }

    return {
      ok: true,
      data: res.data.distributionUrl,
    }
  }

  async verifyPkPass(data: string): Promise<Result<PkPassVerification>> {
    const parsedInput = JSON.parse(data)

    const { code, date } = JSON.parse(data) as PkPassVerificationInputData
    const { passTemplateId } = parsedInput

    if (!passTemplateId) {
      const error = {
        code: 10,
        message: 'Missing passTemplateId from request',
      }
      this.logger.warn(error.message, {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error,
      }
    }

    const result = await this.smartApi.verifyPkPass({ code, date })

    if (!result.ok) {
      return result
    }

    const nationalIdFromPkPass = result.data.pass?.inputFieldValues
      .find((i) => i.passInputField.identifier === 'kennitala')
      ?.value?.replace('-', '')

    if (!nationalIdFromPkPass) {
      const error = {
        code: 10,
        message: 'Invalid Pkpass, missing national id',
      }
      this.logger.warn(error.message, {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error,
      }
    }

    const license = await this.drivingApi.getCurrentLicenseV4({
      nationalId: nationalIdFromPkPass,
    })
    if (!nationalIdFromPkPass) {
      const error = {
        code: 3,
        message: 'No license info found',
      }
      this.logger.warn(error.message, {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error,
      }
    }

    const licenseNationalId = license?.socialSecurityNumber
    const name = license?.name
    const photo = license?.photo?.image ?? ''

    const rawData = license ? JSON.stringify(license) : undefined

    const verifyData = {
      valid: result.data.valid,
      data: JSON.stringify({
        nationalId: licenseNationalId,
        name,
        photo,
        rawData,
      }),
    }

    return {
      ok: true,
      data: verifyData,
    }
  }
}
