import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'

import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { RightsPortalResolver } from './api-domains-rights-portal.resolver'
import { RightsPortalService } from './api-domains-rights-portal.service'

@Module({
  imports: [RightsPortalClientModule, AuthModule],
  providers: [RightsPortalResolver, RightsPortalService],
  exports: [RightsPortalService],
})
export class RightsPortalModule {}
