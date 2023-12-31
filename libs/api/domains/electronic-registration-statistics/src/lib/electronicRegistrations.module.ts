import { Module } from '@nestjs/common'
import { ElectronicRegistrationsResolver } from './electronicRegistrations.resolver'
import { ElectronicRegistrationsClientModule } from '@island.is/clients/electronic-registration-statistics'

@Module({
  imports: [ElectronicRegistrationsClientModule],
  providers: [ElectronicRegistrationsResolver],
})
export class ElectronicRegistrationsModule {}
