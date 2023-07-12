import { Module } from '@nestjs/common'
import { OpenFirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import { FirearmLicenseUpdateClient } from '../services/firearmLicenseUpdateClient.service'
import { SmartSolutionsFirearmModule } from './smartSolutionsFirearm.module'

@Module({
  imports: [OpenFirearmLicenseClientModule, SmartSolutionsFirearmModule],
  providers: [FirearmLicenseUpdateClient],
  exports: [FirearmLicenseUpdateClient],
})
export class FirearmUpdateClientModule {}
