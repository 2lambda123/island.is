import { DynamicModule } from '@nestjs/common'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { DocumentsConfig } from './types/documents.config'
import { DocumentBuilder } from './documentBuilder'

export class DocumentModule {
  static register(config: DocumentsConfig): DynamicModule {
    return {
      module: DocumentModule,
      imports: [DocumentsClientModule.register(config.documentClientConfig)],
      providers: [DocumentBuilder, DocumentResolver, DocumentService],
    }
  }
}
