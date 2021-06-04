import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  IdentityResource,
  IdentityResourceUserClaim,
  ApiScope,
  ApiScopeUserClaim,
  ApiResource,
  ApiResourceUserClaim,
  ApiResourceScope,
  ApiResourceSecret,
  ApiScopeUserAccess,
  ApiScopeUser,
  ApiScopeGroup,
  Domain,
  ResourcesService,
} from '@island.is/auth-api-lib'
import { ApiScopeController } from './api-scope.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      IdentityResource,
      IdentityResourceUserClaim,
      ApiScope,
      ApiScopeUserClaim,
      ApiResource,
      ApiResourceUserClaim,
      ApiResourceScope,
      ApiResourceSecret,
      ApiScopeUserAccess,
      ApiScopeUser,
      ApiScopeGroup,
      Domain,
    ]),
  ],
  controllers: [ApiScopeController],
  providers: [ResourcesService],
})
export class ApiScopeModule {}
