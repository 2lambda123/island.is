import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedDataProviderService } from './data-providers.service'
import { NationalRegistryModule } from './national-registry/national-registry.module'
import { PaymentCatalogModule } from './payment-catalog/payment-catalog.module'
import { UserProfileModule } from './user-profile/user-profile.module'

export class DataProvidersModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DataProvidersModule,
      imports: [
        NationalRegistryModule.register(config),
        UserProfileModule.register(config),
        PaymentCatalogModule.register(config),
      ],
      providers: [SharedDataProviderService],
      exports: [SharedDataProviderService],
    }
  }
}
