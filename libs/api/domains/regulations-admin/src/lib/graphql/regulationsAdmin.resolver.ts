import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { DeleteDraftRegulationInput } from './dto/deleteDraftRegulation.input'
import { EditDraftRegulationInput } from './dto/editDraftRegulation.input'
import { DraftRegulationModel } from './models/draftRegulation.model'
import { DeleteDraftRegulationModel } from './models/deleteDraftRegulation.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { RegulationsAdminApi } from '../client/regulationsAdmin.api'
import {
  Author,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraft,
} from '@island.is/regulations/admin'
import { extractAppendixesAndComments } from '@island.is/regulations-tools/textHelpers'
import {
  RegulationAppendix,
  RegulationViewTypes,
} from '@island.is/regulations/web'
import { PlainText, RegQueryName } from '@island.is/regulations'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
  ) {}

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() user: User,
  ): Promise<RegulationDraft | null> {
    const draft = await this.regulationsAdminApiService.getDraftRegulation(
      input.draftId,
      user.authorization,
    )

    if (!draft) {
      return null
    }

    const lawChapters =
      (draft.law_chapters &&
        (await this.regulationsService.getRegulationsLawChapters(
          false,
          draft.law_chapters,
        ))) ||
      undefined

    const [ministry] =
      (await this.regulationsService.getRegulationsMinistries(
        draft.ministry_id && [draft.ministry_id],
      )) || []

    const authors: Author[] = []
    draft?.authors?.forEach(async (nationalId) => {
      const author = await this.regulationsAdminApiService.getAuthorInfo(
        nationalId,
        user,
      )
      author && authors.push(author)
    })

    const impacts: (DraftRegulationCancel | DraftRegulationChange)[] = []
    draft.changes?.forEach(async (change) => {
      const changeTexts = extractAppendixesAndComments(change.text)

      impacts.push({
        id: change.id,
        type: 'amend',
        date: change.date,
        title: change.title,
        text: changeTexts.text,
        appendixes: changeTexts.appendixes,
        comments: changeTexts.comments,
        // About the impaced stofnreglugerð
        name: change.regulation, // primary-key reference to the stofnreglugerð
        regTitle: (
          await this.regulationsService.getRegulation(
            RegulationViewTypes.current,
            change.regulation.replace('/', '-') as RegQueryName,
          )
        )?.title as PlainText, // helpful for human-readable display in the UI
      })
    })
    if (draft.cancel) {
      impacts.push({
        id: draft.cancel.id,
        type: 'repeal',
        date: draft.cancel.date,
        // About the cancelled reglugerð
        name: draft.cancel.regulation, // primary-key reference to the reglugerð
        regTitle: (
          await this.regulationsService.getRegulation(
            RegulationViewTypes.current,
            draft.cancel.regulation.replace('/', '-') as RegQueryName,
          )
        )?.title as PlainText, // helpful for human-readable display in the UI
      })
    }

    const { text, appendixes, comments } = extractAppendixesAndComments(
      draft.text,
    )

    return {
      id: draft.id,
      draftingStatus: draft.drafting_status,
      title: draft.title,
      name: draft.name,
      text,
      lawChapters,
      ministry,
      authors,
      idealPublishDate: draft.ideal_publish_date as any, // TODO: Exclude original from response.
      draftingNotes: draft.drafting_notes, // TODO: Exclude original from response.
      appendixes: appendixes as RegulationAppendix[],
      comments,
      impacts,
      type: draft.type,
      effectiveDate: draft.effective_date,
      signatureDate: draft.signature_date,
      signatureText: draft.signature_text || '',
      signedDocumentUrl: draft.signed_document_url,
      // fastTrack: ??
    }
  }

  @Query(() => [DraftRegulationModel])
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return await this.regulationsAdminApiService.getShippedRegulations(
      authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(@CurrentUser() user: User) {
    const draftRegulations = await this.regulationsAdminApiService.getDraftRegulations(
      user.authorization,
    )

    const drafts: RegulationDraft[] = []
    for await (const draft of draftRegulations) {
      const authors: Author[] = []

      if (draft.authors) {
        for await (const nationalId of draft.authors) {
          try {
            const author = await this.regulationsAdminApiService.getAuthorInfo(
              nationalId,
              user,
            )

            authors.push({
              authorId: nationalId,
              name: author?.name ?? '',
            })
          } catch (e) {
            // Fallback to nationalId if fetching name fails
            authors.push({
              authorId: nationalId,
              name: nationalId,
            })
          }
        }
      }

      drafts.push({
        id: draft.id,
        draftingStatus: draft.drafting_status,
        title: draft.title,
        draftingNotes: draft.drafting_notes,
        idealPublishDate: draft.ideal_publish_date,
        signatureText: draft.signature_text || '',
        signatureDate: draft.signature_date,
        signedDocumentUrl: draft.signed_document_url,
        effectiveDate: draft.effective_date,
        type: draft.type,
        name: draft.name,
        // lawChapters: draft.law_chapters,
        // ministry: draft.ministry_id,
        // fastTrack: ???,
        impacts: [],
        authors,
        text: '',
        appendixes: [],
        comments: '',
      })
    }

    return drafts
  }

  @Mutation(() => graphqlTypeJson)
  // @Mutation(() => CreateDraftRegulationModel)
  async createDraftRegulation(
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(authorization ?? '')
  }

  @Mutation(() => graphqlTypeJson)
  // @Mutation(() => CreateDraftRegulationModel)
  async updateDraftRegulationById(
    @Args('input') input: EditDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.updateById(
      input.id,
      input.body,
      authorization ?? '',
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulation(
    @Args('input') input: DeleteDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    await this.regulationsAdminApiService.deleteById(
      input.draftId,
      authorization ?? '',
    )

    return {
      id: input.draftId,
    }
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsMinistries(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsLawChapters(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsLawChapters(false)
  }
}
