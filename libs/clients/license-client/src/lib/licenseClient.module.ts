import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { CacheModule, Module } from '@nestjs/common'
import {
  LICENSE_CLIENT_FACTORY,
  LicenseType,
  LicenseClient,
} from './licenseClient.type'
import { LicenseClientService } from './licenseClient.service'
import {
  FirearmClientModule,
  FirearmLicenseClient,
} from './clients/firearm-license-client'
import { AdrClientModule, AdrLicenseClient } from './clients/adr-license-client'
import {
  MachineClientModule,
  MachineLicenseClient,
} from './clients/machine-license-client'
import {
  DisabilityClientModule,
  DisabilityLicenseClient,
} from './clients/disability-license-client'
import { DrivingClientModule } from './clients/driving-license-client/drivingLicenseClient.module'
import { PassTemplateIdsProvider } from './providers/passTemplateIdsProvider'

@Module({
  imports: [
    CacheModule.register(),
    FirearmClientModule,
    AdrClientModule,
    MachineClientModule,
    DisabilityClientModule,
    DrivingClientModule,
  ],
  providers: [
    LicenseClientService,
    PassTemplateIdsProvider,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: LICENSE_CLIENT_FACTORY,
      useFactory: (
        firearmClient: FirearmLicenseClient,
        adrClient: AdrLicenseClient,
        machineClient: MachineLicenseClient,
        disabilityClient: DisabilityLicenseClient,
      ) => async (
        type: LicenseType,
      ): Promise<LicenseClient<unknown> | null> => {
        switch (type) {
          case LicenseType.FirearmLicense:
            return firearmClient
          case LicenseType.AdrLicense:
            return adrClient
          case LicenseType.MachineLicense:
            return machineClient
          case LicenseType.DisabilityLicense:
            return disabilityClient
          default:
            return null
        }
      },
      inject: [
        FirearmLicenseClient,
        AdrLicenseClient,
        MachineLicenseClient,
        DisabilityLicenseClient,
      ],
    },
  ],
  exports: [LicenseClientService],
})
export class LicenseClientModule {}
