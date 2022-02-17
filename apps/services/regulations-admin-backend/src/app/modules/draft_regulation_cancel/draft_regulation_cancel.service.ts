import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import {
  CreateDraftRegulationCancelDto,
  UpdateDraftRegulationCancelDto,
} from './dto'
import { DraftRegulationCancelModel } from './draft_regulation_cancel.model'

@Injectable()
export class DraftRegulationCancelService {
  constructor(
    @InjectModel(DraftRegulationCancelModel)
    private readonly draftRegulationCancelModel: typeof DraftRegulationCancelModel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(
    draftRegulationcancelToCreate: CreateDraftRegulationCancelDto,
  ): Promise<DraftRegulationCancelModel | null> {
    this.logger.debug('Creating a new DraftRegulationcancel')

    return await this.draftRegulationCancelModel.create(
      draftRegulationcancelToCreate,
    )
  }

  async update(
    id: string,
    update: UpdateDraftRegulationCancelDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulationCancel: DraftRegulationCancelModel
  }> {
    this.logger.debug(`Updating DraftRegulationCancel ${id}`)

    const [
      numberOfAffectedRows,
      [updatedDraftRegulationCancel],
    ] = await this.draftRegulationCancelModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedDraftRegulationCancel }
  }

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulationCancel ${id}`)

    return this.draftRegulationCancelModel.destroy({
      where: {
        id,
      },
    })
  }

  async deleteRegulationDraftCancels(draftId: string): Promise<number> {
    this.logger.debug(`Deleting RegulationDraftCancels for: ${draftId}`)

    return this.draftRegulationCancelModel.destroy({
      where: {
        changing_id: draftId,
      },
    })
  }
}
