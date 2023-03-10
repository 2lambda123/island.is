import { Module } from '@nestjs/common'

import { AuthAdminApiClientModule } from '@island.is/clients/auth/admin-api'

import { TenantResolver } from './tenant/tenant.resolver'
import { TenantEnvironmentResolver } from './tenant/tenant-environment.resolver'
import { TenantsService } from './tenant/tenants.service'
import { ApplicationEnvironmentResolver } from './application/applications-environment.resolver'
import { ApplicationResolver } from './application/application.resolver'
import { ApplicationsService } from './application/applications.service'

@Module({
  imports: [AuthAdminApiClientModule],
  controllers: [],
  providers: [
    TenantResolver,
    TenantEnvironmentResolver,
    TenantsService,
    ApplicationEnvironmentResolver,
    ApplicationResolver,
    ApplicationsService,
  ],
  exports: [
    TenantResolver,
    TenantEnvironmentResolver,
    ApplicationEnvironmentResolver,
    ApplicationResolver,
  ],
})
export class AuthAdminModule {}
