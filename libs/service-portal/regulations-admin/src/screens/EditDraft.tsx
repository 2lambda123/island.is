import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { RegulationDraftId } from '@island.is/regulations/admin'
import { isUuid } from 'uuidv4'
import { EditBasics } from '../components/EditBasics'
import { EditMeta } from '../components/EditMeta'
import { EditSignature } from '../components/EditSignature'
import { EditImpacts } from '../components/EditImpacts'
import { EditReview } from '../components/EditReview'
import { editorMsgs } from '../messages'
import { Step } from '../types'
import { ButtonBar } from '../components/ButtonBar'
import { SaveDeleteButtons } from '../components/SaveDeleteButtons'
import {
  useDraftingState,
  steps,
  StepComponent,
} from '../state/useDraftingState'
import { DraftIdFromParam } from '../state/types'
import { MessageDescriptor } from 'react-intl'
import { DraftingNotes } from '../components/DraftingNotes'
import { useLocale } from '../utils'

// ---------------------------------------------------------------------------

const stepData: Record<
  Step,
  {
    title: MessageDescriptor
    intro?: MessageDescriptor
    Component: StepComponent
  }
> = {
  basics: {
    title: editorMsgs.stepContentHeadline,
    Component: EditBasics,
  },
  meta: {
    title: editorMsgs.stepMetaHeadline,
    Component: EditMeta,
  },
  signature: {
    title: editorMsgs.stepSignatureHeadline,
    intro: editorMsgs.stepSignatureIntro,
    Component: EditSignature,
  },
  impacts: {
    title: editorMsgs.stepImpactHeadline,
    intro: editorMsgs.stepImpactIntro,
    Component: EditImpacts,
  },
  review: {
    title: editorMsgs.stepReviewHeadline,
    intro: editorMsgs.stepReviewIntro,
    Component: EditReview,
  },
}

// ---------------------------------------------------------------------------

const assertStep = (maybeStep?: string): Step => {
  if (!maybeStep) {
    return 'basics'
  }
  if (maybeStep in steps) {
    return maybeStep as Step
  }
  throw new Error('Invalid RegulationDraft editing Step')
}
const assertDraftId = (maybeId: string): DraftIdFromParam => {
  if (maybeId === 'new') {
    return maybeId
  }

  if (isUuid(maybeId)) {
    return maybeId as RegulationDraftId
  }
  throw new Error('Invalid RegulationDraft editing Id')
}

// ---------------------------------------------------------------------------

const EditDraft = () => {
  useNamespaces('ap.regulations-admin')
  const t = useLocale().formatMessage
  const params = useParams<{ id: string; step?: string }>()
  const id = assertDraftId(params.id)
  const stepName = assertStep(params.step)

  const { state, stepNav, actions } = useDraftingState(id, stepName)
  const { loading, draft } = state

  const step = stepData[stepName]

  if (!loading && !draft) {
    throw new Error(`Regulation ${id} not found`)
  }

  return (
    <Fragment key={id}>
      <Box marginBottom={[2, 2, 4]}>
        <Text as="h1" variant="h1">
          {t(step.title)}
        </Text>
        {step.intro && (
          <Text as="p" marginTop={1}>
            {t(step.intro)}
          </Text>
        )}
      </Box>

      <SaveDeleteButtons id={id} actions={actions} wrap />

      {draft ? (
        <step.Component actions={actions} new={id === 'new'} draft={draft} />
      ) : (
        <SkeletonLoader height={120} repeat={2} space={3} />
      )}

      {draft && (
        <DraftingNotes
          draft={draft}
          onChange={(text) => {
            actions.updateState('draftingNotes', text)
          }}
        />
      )}

      <ButtonBar id={id} stepNav={stepNav} actions={actions} />
    </Fragment>
  )
}

export default EditDraft
