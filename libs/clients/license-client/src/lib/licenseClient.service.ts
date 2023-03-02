import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import {
  CONFIG_PROVIDER,
  LICENSE_CLIENT_FACTORY,
  LicenseClient,
  LicenseType,
  LicenseUpdateClient,
} from './licenseClient.type'
import { Cache as CacheManager } from 'cache-manager'
import type { PassTemplateIds, LicenseTypeType } from './licenseClient.type'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { DRIVING_LICENSE_CLIENT_FACTORY } from './clients/driving-license-client'

@Injectable()
export class LicenseClientService {
  constructor(
    @Inject(DRIVING_LICENSE_CLIENT_FACTORY)
    private drivingLicenseFactory: (
      cacheManager: CacheManager,
    ) => Promise<LicenseClient<unknown | null>>,
    @Inject(LICENSE_CLIENT_FACTORY)
    private licenseClientFactory: (
      type: LicenseType,
    ) => Promise<LicenseClient<unknown | null>>,
    @Inject(CONFIG_PROVIDER) private config: PassTemplateIds,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
  ) {}

  private async getClient(type: LicenseType) {
    const client =
      type === LicenseType.DriversLicense
        ? this.drivingLicenseFactory(this.cacheManager)
        : this.licenseClientFactory(type)
    return await client
  }

  private getTypeByPassTemplateId(id: string) {
    for (const [key, value] of Object.entries(this.config)) {
      // some license Config id === barcode id
      if (value === id) {
        // firearmLicense => FirearmLicense
        const keyAsEnumKey = key.slice(0, 1).toUpperCase() + key.slice(1)

        const valueFromEnum: LicenseType | undefined =
          LicenseType[keyAsEnumKey as LicenseTypeType]

        if (!valueFromEnum) {
          throw new Error(`Invalid license type: ${key}`)
        }
        return valueFromEnum
      }
    }
    return null
  }

  getClientByLicenseType(type: LicenseType) {
    return this.getClient(type)
  }

  getClientByPassTemplateId(passTemplateId: string) {
    const type = this.getTypeByPassTemplateId(passTemplateId)

    return type ? this.getClient(type) : null
  }
}
