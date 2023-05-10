import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { RightsPortalService } from './api-domains-rights-portal.service'
import { Therapies } from './models/getTherapies.model'
import { AidsAndNutrition } from './models/getAidsAndNutrition.model'
import { HealthCenterHistory } from './models/getHealthCenter.model'
import { Dentists } from './models/getDentists.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/rights-portal' })
export class RightsPortalResolver {
  constructor(private readonly rightsPortalService: RightsPortalService) {}

  @Scopes(ApiScope.internal)
  @Query(() => [Therapies], { nullable: true })
  @Audit()
  getRightsPortalTherapies(@CurrentUser() user: User) {
    return this.rightsPortalService.getTherapies(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => AidsAndNutrition, { nullable: true })
  @Audit()
  getRightsPortalAidsAndNutrition(@CurrentUser() user: User) {
    return this.rightsPortalService.getAidsAndNutrition(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => Dentists, { nullable: true })
  @Audit()
  getRightsPortalDentists(@CurrentUser() user: User) {
    return this.rightsPortalService.getDentists(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => HealthCenterHistory, { nullable: true })
  @Audit()
  getRightsPortalHealthCenterHistory(@CurrentUser() user: User) {
    return this.rightsPortalService.getHealthCenterHistory(user)
  }
}
