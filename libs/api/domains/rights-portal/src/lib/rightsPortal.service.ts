import { Injectable } from '@nestjs/common'
import {
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  TherapyApi,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import subYears from 'date-fns/subYears'
import {
  AidOrNutrition,
  PaginatedAidsAndNutritionResponse,
} from './models/aidsOrNutrition.model'
import {
  AidOrNutritionType,
  ExcludesFalse,
  generateAidOrNutrition,
} from './rightsPortal.types'
import {
  Dentist,
  PaginatedDentistsResponse,
  UserDentistRegistration,
} from './models/dentist.model'
import { Bill } from './models/bill.model'
import {
  HealthCenter,
  HealthCenterRegistration,
  PaginatedHealthCentersResponse,
  UserHealthCenterRegistration,
} from './models/healthCenter.model'
import { HealthCenterResponse } from './models/healthCenterResponse.model'

@Injectable()
export class RightsPortalService {
  constructor(
    private therapyApi: TherapyApi,
    private aidsAndNutritionApi: AidsandnutritionApi,
    private dentistApi: DentistApi,
    private healthCenterApi: HealthcenterApi,
  ) {}
  getTherapies = (user: User) =>
    this.therapyApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .therapies()
      .catch(handle404)

  async getAidsAndNutrition(
    user: User,
  ): Promise<PaginatedAidsAndNutritionResponse | null> {
    try {
      const res = await this.aidsAndNutritionApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .aidsandnutrition()

      if (!res) {
        return null
      }
      const nutrition: Array<AidOrNutrition> | null =
        res.nutrition
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.NUTRITION))
          .filter(Boolean as unknown as ExcludesFalse) ?? []

      const aids: Array<AidOrNutrition> | null =
        res.aids
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.AID))
          .filter(Boolean as unknown as ExcludesFalse) ?? []

      return {
        data: [...aids, ...nutrition],
        totalCount: aids?.length,
        pageInfo: {
          hasNextPage: false,
        },
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getDentistRegistrations(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<UserDentistRegistration | null> {
    const api = this.dentistApi.withMiddleware(new AuthMiddleware(user as Auth))
    try {
      const res = await Promise.all([
        api.dentistsCurrent(),
        api.dentistsBills({
          dateFrom: dateFrom
            ? dateFrom.toDateString()
            : subYears(new Date(), 5).toDateString(),
          dateTo: dateTo ? dateTo.toDateString() : new Date().toDateString(),
        }),
      ])

      if (!res) return null
      return {
        currentDentistName: res[0].name,
        billHistory: res[1] as Bill[],
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getDentists(user: User): Promise<PaginatedDentistsResponse | null> {
    try {
      const res = await this.dentistApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .dentists({ contractType: '' })

      if (!res || !res.dentists || !res.totalCount || !res.pageInfo) {
        return null
      }

      const dentists: Array<Dentist> = res.dentists
        .map((d) => {
          if (!d.id) {
            return null
          }
          return {
            ...d,
            id: d.id,
            address: {
              postalCode: d.postcode,
              municipality: d.region,
              streetAddress: d.address,
            },
          }
        })
        .filter(Boolean as unknown as ExcludesFalse)

      return {
        data: dentists,
        totalCount: res.totalCount,
        pageInfo: {
          hasNextPage: res.pageInfo.hasNextPage ?? false,
          hasPreviousPage: res.pageInfo.hasPreviousPage ?? undefined,
          startCursor: res.pageInfo.startCursor ?? undefined,
          endCursor: res.pageInfo.endCursor ?? undefined,
        },
      }
    } catch (e) {
      return handle404(e)
    }
  }
  async getHealthCenters(
    user: User,
  ): Promise<PaginatedHealthCentersResponse | null> {
    try {
      const res = await this.healthCenterApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .healthcenters({})

      if (!res || !res.healthCenters || !res.totalCount || !res.pageInfo) {
        return null
      }

      const healthCenters: Array<HealthCenter> = res.healthCenters
        .map((hc) => {
          if (!hc.id) {
            return null
          }
          return {
            ...hc,
            id: hc.id,
            address: {
              postalCode: hc.postalCode,
              municipality: hc.city,
              streetAddress: hc.address,
            },
          }
        })
        .filter(Boolean as unknown as ExcludesFalse)

      return {
        data: healthCenters,
        totalCount: res.totalCount,
        pageInfo: {
          hasNextPage: res.pageInfo.hasNextPage ?? false,
          hasPreviousPage: res.pageInfo.hasPreviousPage ?? undefined,
          startCursor: res.pageInfo.startCursor ?? undefined,
          endCursor: res.pageInfo.endCursor ?? undefined,
        },
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getUserHealthCenterRegistrations(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<UserHealthCenterRegistration | null> {
    const api = this.healthCenterApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

    try {
      const res = await Promise.all([
        api.healthcentersCurrent(),
        api.healthcentersHistory({
          dateFrom: dateFrom
            ? dateFrom.toDateString()
            : subYears(new Date(), 5).toDateString(),
          dateTo: dateTo ? dateTo.toDateString() : new Date().toDateString(),
        }),
      ])

      const history = res[1]
        ? res[1].map(
            (h) =>
              ({
                ...h,
                healthCenterName: h.healthCenter?.healthCenter,
                doctor: h.healthCenter?.doctor,
              } as HealthCenterRegistration),
          )
        : []

      if (!res) return null
      return {
        current: {
          ...res[0],
          healthCenterName: res[0].healthCenter ?? undefined,
        },
        history,
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async transferHealthCenter(
    user: User,
    id: string,
  ): Promise<HealthCenterResponse> {
    try {
      await this.healthCenterApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .healthcentersRegister({
          id,
        })
      return {
        success: true,
      }
    } catch (e) {
      if (e.response?.status === 400) handle404(e)

      return {
        success: false,
      }
    }
  }
}
