import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  AidsAndNutritionDTO,
  AidsandnutritionApi,
  TherapyApi,
  TherapyDTO,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { ApolloError } from 'apollo-server-express'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

/** Category to attach each log message to */
const LOG_CATEGORY = 'rights-portal-service'

@Injectable()
export class RightsPortalService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private therapyApi: TherapyApi,
    private aidsAndNutritionApi: AidsandnutritionApi,
  ) {}

  handleError(error: any, detail?: string): ApolloError | null {
    this.logger.error(detail || 'Rights portal error', {
      error: JSON.stringify(error),
      category: LOG_CATEGORY,
    })
    throw new ApolloError('Failed to resolve request', error.status)
  }

  private handle4xx(error: any, detail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, detail)
  }

  async getTherapies(user: User): Promise<TherapyDTO[] | null | ApolloError> {
    try {
      const res = await this.therapyApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .therapies()

      if (!res) return null
      return res
    } catch (e) {
      return this.handle4xx(e, 'Failed to get therapies list')
    }
  }

  async getAidsAndNutrition(
    user: User,
  ): Promise<AidsAndNutritionDTO | null | ApolloError> {
    try {
      const res = await this.aidsAndNutritionApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .aidsandnutrition()

      if (!res) return null
      return res
    } catch (e) {
      return this.handle4xx(e, 'Failed to get aids and nutrition list')
    }
  }
}
