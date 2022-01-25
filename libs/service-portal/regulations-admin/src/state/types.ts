import {
  DraftingStatus,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import {
  HTMLText,
  LawChapterSlug,
  PlainText,
  RegName,
  URLString,
} from '@island.is/regulations'
import { Kennitala, RegulationType, MinistryList } from '@island.is/regulations'
import { Step } from '../types'
import { MessageDescriptor } from 'react-intl'
import { WarningList } from '@island.is/regulations-tools/useTextWarnings'

export type StepNav = {
  name: Step
  prev?: Step
  next?: Step
}

// export type InputType = 'text' | 'html'

export type DraftField<Type, InputType extends string = ''> = {
  value: Type
  required?: boolean | MessageDescriptor
  dirty?: boolean
  error?: MessageDescriptor
  hideError?: boolean
  type?: InputType
}

// TODO: Figure out how the Editor components lazy valueRef.current() getter fits into this
export type HtmlDraftField = DraftField<HTMLText, 'html'> & {
  warnings: WarningList
}

export type AppendixDraftForm = {
  title: DraftField<PlainText, 'text'>
  text: HtmlDraftField

  /**
   * Appendixes may be revoked by `RegulationChange`s.
   *
   * Instead of being deleted, they're only emptied,
   * to guarantee sane diffing between arbitrary
   * historic versions of the regulation.
   *
   * The rules is that appendixes can neither be deleted
   * nor re-ordered by `RegulationChange`s.
   *
   * `RegulationChange`s may only add new appendixes,
   * or "revoke" (i.e. "empty") existing ones.
   *
   * However, to make the Regulation (or RegulationDiff) nicer to
   * consume, we filter out those empty appendixes on the API server.
   */
  revoked?: boolean
  key: string
}

export type BodyDraftFields = {
  title: DraftField<PlainText, 'text'>
  text: HtmlDraftField
  appendixes: Array<AppendixDraftForm>
  comments: HtmlDraftField
}

type DraftImpactBaseFields<
  ImpactType extends DraftRegulationChange | DraftRegulationCancel
> = Readonly<
  // always prefilled on "create" - non-editable
  Pick<ImpactType, 'id' | 'type' | 'name'>
> & {
  date: DraftField<Date>
  regTitle: string
  error?: MessageDescriptor | string
}

export type DraftChangeForm = DraftImpactBaseFields<DraftRegulationChange> &
  BodyDraftFields

export type DraftCancelForm = DraftImpactBaseFields<DraftRegulationCancel>

export type DraftImpactForm = DraftChangeForm | DraftCancelForm

// ---------------------------------------------------------------------------

export type RegDraftForm = BodyDraftFields & {
  id: RegulationDraftId
  readonly draftingStatus: DraftingStatus // non-editable except via saveStatus or propose actions

  idealPublishDate: DraftField<Date | undefined>
  effectiveDate: DraftField<Date | undefined>
  lawChapters: DraftField<Array<LawChapterSlug>>

  signatureDate: DraftField<Date | undefined>
  ministry: DraftField<PlainText | undefined, 'text'>
  type: DraftField<RegulationType | undefined>

  signatureText: HtmlDraftField
  signedDocumentUrl: DraftField<URLString | undefined>

  /** A list of likely `RegName`s found in the draft't `text`
   * that is used to populate a Selectbox for picking impacted
   * regulations.
   *
   * Mentioned is a 100% derived value, not to be saved on the server
   */
  mentioned: Array<RegName>
  impacts: Array<DraftImpactForm>

  draftingNotes: HtmlDraftField
  authors: DraftField<Array<Kennitala>>

  fastTrack: DraftField<boolean>
}

export type DraftingState = {
  isEditor: boolean
  step: StepNav
  draft: RegDraftForm
  ministries: MinistryList
  saving?: boolean
  shipping?: boolean
  error?: Error
}

// -----------------------------

export type AppendixFieldNameValuePair = {
  [Key in AppendixFormSimpleProps]: {
    name: Key
    value: AppendixDraftForm[Key]['value']
  }
}[AppendixFormSimpleProps]

export type AppendixFormSimpleProps = Extract<
  keyof AppendixDraftForm,
  'title' | 'text'
>

export type FieldNameValuePair = {
  [Key in RegDraftFormSimpleProps]: {
    name: Key
    value: RegDraftForm[Key]['value']
  }
}[RegDraftFormSimpleProps]

export type RegDraftFormSimpleProps = Extract<
  keyof RegDraftForm,
  | 'title'
  | 'text'
  | 'idealPublishDate' // This prop needs its own action that checks for working days and updates the `fastTrack` flag accordingly
  | 'fastTrack'
  | 'effectiveDate' // Need to be checked and must never be **before** `idealPublishDate`
  | 'signatureDate' // Need to be checked and must never be **after* `idealPublishDate`
  | 'signatureText'
  | 'signedDocumentUrl'
  // | 'lawChapters'
  | 'ministry'
  | 'type'
  | 'draftingNotes'
  | 'authors'
>

export type Action =
  | {
      type: 'CHANGE_STEP'
      stepName: Step
    }
  | {
      type: 'SAVING_STATUS'
    }
  | {
      type: 'SAVING_STATUS_DONE'
      error?: Error
    }
  | {
      type: 'UPDATE_LAWCHAPTER_PROP'
      action?: 'add' | 'delete'
      value: LawChapterSlug
    }
  | {
      type: 'UPDATE_MULTIPLE_PROPS'
      multiData: Partial<RegDraftForm>
    }
  | ({
      type: 'UPDATE_PROP'
      explicit?: boolean
    } & FieldNameValuePair)
  | {
      type: 'APPENDIX_ADD'
    }
  | ({
      type: 'APPENDIX_SET_PROP'
      idx: number
    } & AppendixFieldNameValuePair)
  | {
      type: 'APPENDIX_MOVE_UP'
      idx: number
    }
  | {
      type: 'APPENDIX_DELETE'
      idx: number
    }
  // // TODO: Adapt for impact appendixes
  // | {
  //     type: 'APPENDIX_REVOKE'
  //     idx: number
  //     revoked: boolean
  //   }
  | {
      type: 'SHIP'
    }

export type ActionName = Action['type']

export type UpdateAction = Extract<Action, { type: 'UPDATE_PROP' }>
