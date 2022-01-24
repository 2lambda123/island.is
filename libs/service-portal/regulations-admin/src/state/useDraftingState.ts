import React from 'react'
import {
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { useMutation, gql } from '@apollo/client'
import {
  HTMLText,
  LawChapterSlug,
  PlainText,
  Appendix,
  MinistryList,
} from '@island.is/regulations'
import { useAuth } from '@island.is/auth/react'
import { produce, setAutoFreeze, Draft } from 'immer'
import { useHistory } from 'react-router-dom'
import { Step } from '../types'
import { getInputFieldsWithErrors, useLocale } from '../utils'
import {
  findAffectedRegulationsInText,
  findRegulationType,
  findSignatureInText,
} from '../utils/guessers'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import { DraftingStatus, RegulationDraft } from '@island.is/regulations/admin'
import {
  StepNav,
  DraftField,
  HtmlDraftField,
  RegDraftForm,
  DraftingState,
  RegDraftFormSimpleProps,
  Action,
  ActionName,
  AppendixFormSimpleProps,
  AppendixDraftForm,
  InputType,
} from './types'
import { buttonsMsgs, errorMsgs } from '../messages'
import {} from '@island.is/regulations/web'
import { toast } from '@island.is/island-ui/core'
import { getEditUrl, getHomeUrl } from '../utils/routing'

export const UPDATE_DRAFT_REGULATION_MUTATION = gql`
  mutation UpdateDraftRegulationMutation($input: EditDraftRegulationInput!) {
    updateDraftRegulationById(input: $input)
  }
`

export const DELETE_DRAFT_REGULATION_MUTATION = gql`
  mutation DeleteDraftRegulationMutation($input: DeleteDraftRegulationInput!) {
    deleteDraftRegulation(input: $input) {
      id
    }
  }
`

// ---------------------------------------------------------------------------

export const steps: Record<Step, StepNav> = {
  basics: {
    name: 'basics',
    next: 'meta',
  },
  meta: {
    name: 'meta',
    prev: 'basics',
    next: 'signature',
  },
  signature: {
    name: 'signature',
    prev: 'meta',
    next: 'impacts',
  },
  impacts: {
    name: 'impacts',
    prev: 'signature',
    next: 'review',
  },
  review: {
    name: 'review',
    prev: 'impacts',
  },
}

// ---------------------------------------------------------------------------

const tidyUp = {
  text: (value: string) => value.trimLeft() as PlainText,
  html: (value: HTMLText) => value.trimLeft() as HTMLText,
  _: <T extends unknown>(value: T) => value,
} as const

// ---------------------------------------------------------------------------

const f = <T>(
  value: T,
  required?: true,
  type?: Exclude<InputType, 'html' | 'text'>,
): DraftField<T> => ({
  value,
  required,
  type,
})
const fText = <T extends string>(value: T, required?: true): DraftField<T> => ({
  value,
  required,
  type: 'text',
})
const fHtml = (value: HTMLText, required?: true): HtmlDraftField => ({
  value,
  required,
  type: 'html',
})

const makeDraftAppendixForm = (appendix: Appendix, key: string) => ({
  title: fText(appendix.title, true),
  text: fHtml(appendix.text, true),
  key,
})

const makeDraftForm = (draft: RegulationDraft): RegDraftForm => {
  const form: RegDraftForm = {
    id: draft.id,
    title: fText(draft.title, true),
    text: fHtml(draft.text, true),
    appendixes: draft.appendixes.map((a, i) =>
      makeDraftAppendixForm(a, String(i)),
    ),
    comments: fHtml(draft.comments),

    idealPublishDate: f(
      draft.idealPublishDate && new Date(draft.idealPublishDate),
    ),
    fastTrack: f(draft.fastTrack || false),

    effectiveDate: f(draft.effectiveDate && new Date(draft.effectiveDate)),

    signatureText: fHtml(draft.signatureText, true),
    signedDocumentUrl: f(draft.signedDocumentUrl, true),

    lawChapters: f((draft.lawChapters || []).map((chapter) => chapter.slug)),

    mentioned: [], // NOTE: Contains values derived from `text`

    impacts: draft.impacts.map((impact) => {
      return impact.type === 'amend'
        ? {
            type: impact.type,
            id: impact.id,
            name: impact.name,
            regTitle: impact.regTitle,
            date: f(new Date(impact.date), true),
            title: fText(impact.title, true),
            text: fHtml(impact.text, true),
            appendixes: impact.appendixes.map((a, i) =>
              makeDraftAppendixForm(a, String(i)),
            ),
            comments: fHtml(impact.comments),
          }
        : {
            type: impact.type,
            id: impact.id,
            name: impact.name,
            regTitle: impact.regTitle,
            date: f(new Date(impact.date), true),
          }
    }),

    draftingNotes: fHtml(draft.draftingNotes),
    draftingStatus: draft.draftingStatus,
    authors: f(draft.authors.map((author) => author.authorId)),

    type: f(undefined /* draft.type */, true), // NOTE: Regulation type is always a derived value
    ministry: f(undefined /* draft.ministry */, true), // NOTE: The ministry is always a derived value
    signatureDate: f(
      undefined /* draft.signatureDate && new Date(draft.signatureDate) */,
      true,
    ), // NOTE: Signature date is always a derived value
  }

  updateImpacts(form, draft.title, draft.text)

  return form
}

// ---------------------------------------------------------------------------

// const validate = (state: DraftingState) => {
//   return
// }

// const validateSingle = <Field extends keyof RegulationDraft>(
//   state: DraftingState,
//   name: Field,
//   value: RegulationDraft[Field],
// ) => {
//   return
// }

const updateImpacts = (
  draft: RegDraftForm,
  title: PlainText,
  text: HTMLText,
) => {
  const { impacts, mentioned, type } = draft

  const checkedTitle = type.value === 'amending' ? title : ''
  const newMentions = findAffectedRegulationsInText(checkedTitle, text)

  const mentionsChanged =
    newMentions.length !== mentioned.length ||
    mentioned.some((name, i) => name !== newMentions[i])

  if (mentionsChanged) {
    draft.mentioned = newMentions
    impacts.forEach((impact) => {
      if (impact.name === 'self') return

      if (newMentions.includes(impact.name)) {
        delete impact.error
      } else {
        impact.error = errorMsgs.impactingUnMentioned
      }
    })
  }
}

// ---------------------------------------------------------------------------

const specialUpdates: {
  [Prop in RegDraftFormSimpleProps]?: (
    state: DraftingState,
    newValue: RegDraftForm[Prop]['value'],
  ) => RegDraftForm[Prop]['value'] | null | void
} = {
  title: (state: DraftingState, newTitle) => {
    const { type, text } = state.draft
    type.value = findRegulationType(newTitle)
    updateImpacts(state.draft, newTitle, text.value)
  },

  text: (state, newValue) => {
    const { title } = state.draft
    updateImpacts(state.draft, title.value, newValue)
  },

  signatureText: (state, newValue) => {
    const draft = state.draft
    const { ministryName, signatureDate } = findSignatureInText(newValue)

    const normalizedValue = ministryName?.toLowerCase().replace(/-/g, '')
    const knownMinistry = normalizedValue
      ? state.ministries.find(
          (m) => m.name.toLowerCase().replace(/-/g, '') === normalizedValue,
        )
      : undefined

    // prefer official name over typed name (ignores casing, and punctuation differernces)
    draft.ministry.value = knownMinistry ? knownMinistry.name : ministryName
    // Ideally this ought to be flagged as a less-severe error
    draft.ministry.error =
      ministryName && !knownMinistry ? errorMsgs.ministryUnknown : undefined

    // TODO: Match the derived ministry up with original draft author's
    // ministry connnection (i.e. their "place of work")
    // and issue a WARNING if the two ministry values don't match up.

    draft.signatureDate.value = signatureDate && new Date(signatureDate)
  },
}

// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/naming-convention */
const actionHandlers: {
  [Type in ActionName]: (
    state: Draft<DraftingState>,
    action: Omit<Extract<Action, { type: Type }>, 'type'>,
  ) => Draft<DraftingState> | void
} = {
  CHANGE_STEP: (state, { stepName }) => {
    if (stepName === 'review' && !state.isEditor) {
      state.error = new Error('Must be an editor')
      return
    }
    state.step = steps[stepName]
  },

  SAVING_STATUS: (state) => {
    state.saving = true
  },
  SAVING_STATUS_DONE: (state, { error }) => {
    state.error = error
    state.saving = false
  },

  UPDATE_PROP: (state, { name, value, explicit }) => {
    const field = state.draft[name]
    // @ts-expect-error  (Fuu)
    value = tidyUp[field.type || '_'](value)

    if (value !== field.value) {
      specialUpdates[name]?.(
        state,
        // @ts-expect-error  (Pretty sure I'm holding this correctly,
        // and TS is in the weird here.
        // Name and value are intrinsically linked both in this action's
        // arguments and in the `specialUpdaters` signature.)
        value,
      )
    }
    if (value !== field.value || explicit === true) {
      field.value = value
      field.dirty = true
    }
    field.error =
      field.required && !value && field.dirty
        ? errorMsgs.fieldRequired
        : undefined
  },

  APPENDIX_ADD: (state) => {
    const { appendixes } = state.draft
    appendixes.push(
      makeDraftAppendixForm({ title: '', text: '' }, String(appendixes.length)),
    )
  },

  APPENDIX_SET_PROP: (state, { idx, name, value }) => {
    const appendix = state.draft.appendixes[idx]
    if (appendix) {
      const field = appendix[name]
      // @ts-expect-error  (Fuu)
      value = tidyUp[field.type || '_'](value)

      if (value !== field.value) {
        field.value = value
        field.dirty = true
      }
      field.error =
        field.required && !value && field.dirty
          ? errorMsgs.fieldRequired
          : undefined
    }
  },

  APPENDIX_DELETE: (state, { idx }) => {
    const { appendixes } = state.draft
    if (appendixes[idx]) {
      appendixes.splice(idx, 1)
    }
  },

  // // TODO: Adapt for impact appendixes
  // APPENDIX_REVOKE: (state, { idx, revoked }) => {
  //   const { appendixes } = state.draft
  //   const appendix = appendixes[idx]
  //   if (appendix) {
  //     appendix.revoked = revoked
  //   }
  // },

  APPENDIX_MOVE_UP: (state, { idx }) => {
    const prevIdx = idx - 1
    const { appendixes } = state.draft
    const appendix = appendixes[idx]
    const prevAppendix = appendixes[prevIdx]
    if (appendix && prevAppendix) {
      appendixes[prevIdx] = appendix
      appendixes[idx] = prevAppendix
    }
  },

  UPDATE_MULTIPLE_PROPS: (state, { multiData }) => {
    Object.assign(state.draft, multiData)
  },

  UPDATE_LAWCHAPTER_PROP: (state, { action, value }) => {
    const lawChaptersField = state.draft.lawChapters
    const lawChapters = lawChaptersField.value
    const includesValue = lawChapters.includes(value)
    if (action === 'add') {
      if (!includesValue) {
        lawChaptersField.value = lawChapters.concat(value).sort()
      }
    } else {
      if (includesValue) {
        lawChaptersField.value = lawChapters.filter((slug) => slug !== value)
      }
    }
  },

  SHIP: (state) => {
    if (!state.isEditor) {
      state.error = new Error('Must be an editor')
    } else {
      state.shipping = true
    }
  },
}
/* eslint-enable @typescript-eslint/naming-convention */

const draftingStateReducer: Reducer<DraftingState, Action> = (
  state,
  action,
) => {
  setAutoFreeze(false)
  const newState = produce(state, (sDraft) =>
    actionHandlers[action.type](
      sDraft,
      // @ts-expect-error  (Can't get this to work. FML)
      action,
    ),
  )
  setAutoFreeze(true)
  return newState
}

type StateInputs = {
  regulationDraft: RegulationDraft
  ministries: MinistryList
  stepName: Step
}

const useEditDraftReducer = (inputs: StateInputs) => {
  const { regulationDraft, ministries, stepName } = inputs

  const isEditor =
    useAuth().userInfo?.scopes?.includes(RegulationsAdminScope.manage) || false

  if (stepName === 'review' && !isEditor) {
    throw new Error()
  }

  return useReducer(draftingStateReducer, {}, () => {
    const state: DraftingState = {
      draft: makeDraftForm(regulationDraft),
      step: steps[stepName],
      ministries,
      isEditor,
    }
    // guess all guesssed values on start.
    Object.entries(specialUpdates).forEach(([prop, updaterFn]) => {
      updaterFn!(
        state,
        // @ts-expect-error  (because reasons)
        state.draft[prop as RegDraftFormSimpleProps].value,
      )
    })
    return state
  })
}

// ---------------------------------------------------------------------------

export const useMakeDraftingState = (inputs: StateInputs) => {
  const history = useHistory()
  const t = useLocale().formatMessage

  const [state, dispatch] = useEditDraftReducer(inputs)

  // NOTE: we assume that both input.draft nad input.ministries don't change

  useEffect(
    () => dispatch({ type: 'CHANGE_STEP', stepName: inputs.stepName }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs.stepName],
  )

  const [deleteDraftRegulationMutation] = useMutation(
    DELETE_DRAFT_REGULATION_MUTATION,
  )
  const [updateDraftRegulationById] = useMutation(
    UPDATE_DRAFT_REGULATION_MUTATION,
  )

  return useMemo(() => {
    const { draft, step } = state
    const nextStep = step.next
    const prevStep = step.prev

    const _saveStatus = (newStatus?: DraftingStatus) =>
      updateDraftRegulationById({
        variables: {
          input: {
            id: draft.id,
            body: {
              title: draft.title.value,
              text: draft.text.value,
              appendixes: draft.appendixes.map((apx) => ({
                title: apx.title.value,
                text: apx.text.value,
              })),
              comments: draft.comments.value,
              ministry: draft.ministry.value,
              draftingNotes: draft.draftingNotes.value,
              idealPublishDate: draft.idealPublishDate?.value,
              fastTrack: draft.fastTrack.value,
              lawChapters: draft.lawChapters.value,
              signatureDate: draft.signatureDate.value,
              signatureText: draft.signatureText.value,
              effectiveDate: draft.effectiveDate.value,
              type: draft.type.value,
              draftingStatus: newStatus || draft.draftingStatus,
              signedDocumentUrl: draft.signedDocumentUrl.value,
            },
          },
        },
      })
        .then((res) => {
          if (res.errors && res.errors.length > 1) {
            throw res.errors[0]
          }
          return { success: true, error: undefined }
        })
        .catch((error) => {
          return { success: false, error: error as Error }
        })

    const actions = {
      goBack: prevStep ? () => actions.goToStep(prevStep) : undefined,

      goForward:
        nextStep && (state.isEditor || nextStep !== 'review')
          ? () => {
              // BASICS
              if (step.name === 'basics') {
                const errorFields = getInputFieldsWithErrors(
                  ['title', 'text'],
                  draft,
                )

                if (errorFields) {
                  dispatch({
                    type: 'UPDATE_MULTIPLE_PROPS',
                    multiData: errorFields,
                  })
                  return // Prevent the user going forward
                }
              }

              actions.goToStep(nextStep)
            }
          : undefined,

      goToStep: (stepName: Step) => {
        actions.saveStatus(true)
        history.push(getEditUrl(draft.id, stepName))
      },
      // FIXME: rename to updateProp??
      updateState: <Prop extends RegDraftFormSimpleProps>(
        name: Prop,
        value: RegDraftForm[Prop]['value'],
        explicit?: boolean,
      ) => {
        // @ts-expect-error  (FML! FIXME: make this nicer)
        dispatch({ type: 'UPDATE_PROP', name, value, explicit })
      },

      setAppendixProp: <Prop extends AppendixFormSimpleProps>(
        idx: number,
        name: Prop,
        value: AppendixDraftForm[Prop]['value'],
      ) => {
        // @ts-expect-error  (FML! FIXME: make this nicer)
        dispatch({ type: 'APPENDIX_SET_PROP', idx, name, value })
      },

      deleteAppendix: (idx: number) => {
        dispatch({ type: 'APPENDIX_DELETE', idx })
      },

      /**
       * No-op for op-level draft appendixes.
       * Only implemented for action-interface compatilility with
       * impact appendix editing
       */
      revokeAppendix: (idx: number, revoked: boolean) => undefined,

      moveAppendixUp: (idx: number) => {
        dispatch({ type: 'APPENDIX_MOVE_UP', idx })
      },

      addAppendix: () => {
        dispatch({ type: 'APPENDIX_ADD' })
      },

      updateLawChapterProp: (
        action: 'add' | 'delete',
        value: LawChapterSlug,
      ) => {
        dispatch({ type: 'UPDATE_LAWCHAPTER_PROP', action, value })
      },

      deleteDraft: async () => {
        if (draft.draftingStatus === 'shipped') {
          return
        }
        try {
          await deleteDraftRegulationMutation({
            variables: {
              input: {
                draftId: draft.id,
              },
            },
          }).then(() => {
            // TODO: Láta notanda vita að færslu hefur verið eytt út?
            history.push(getHomeUrl())
          })
        } catch (e) {
          console.error('Failed to delete regulation draft: ', e)
          return
        }
      },

      saveStatus: (silent?: boolean) => {
        dispatch({ type: 'SAVING_STATUS' })
        _saveStatus().then(({ success, error }) => {
          if (error) {
            toast.error(t(buttonsMsgs.saveFailure))
            console.error(error)
          } else if (!silent) {
            toast.success(t(buttonsMsgs.saveSuccess))
          }
          dispatch({ type: 'SAVING_STATUS_DONE', error })
        })
      },

      propose: !state.isEditor
        ? () => {
            dispatch({ type: 'SAVING_STATUS' })
            _saveStatus('proposal').then(({ success, error }) => {
              if (error) {
                toast.error(t(buttonsMsgs.saveFailure))
                console.error(error)
                dispatch({ type: 'SAVING_STATUS_DONE', error })
              } else {
                history.push(getHomeUrl())
              }
            })
          }
        : undefined,
    }
    return { ...state, actions }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,

    dispatch, // NOTE Should be immutable
    history, // NOTE: Should be immutable
    updateDraftRegulationById, // NOTE: Should be immutable
    deleteDraftRegulationMutation, // NOTE: Should be immutable
    t, // NOTE: Should be immutable,
  ])
}

export type RegDraftActions = ReturnType<typeof useMakeDraftingState>['actions']

// ===========================================================================

const RegDraftingContext = createContext(
  {} as DraftingState & { actions: RegDraftActions },
)

type RegDraftingProviderProps = {
  regulationDraft: RegulationDraft
  stepName: Step
  ministries: MinistryList
  children: ReactNode
}

export const RegDraftingProvider = (props: RegDraftingProviderProps) => {
  const { regulationDraft, ministries, stepName, children } = props

  return React.createElement(RegDraftingContext.Provider, {
    value: useMakeDraftingState({
      regulationDraft,
      ministries,
      stepName,
    }),
    children: children,
  })
}

export const useDraftingState = () => useContext(RegDraftingContext)
