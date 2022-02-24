import * as s from './SaveDeleteButtons.css'
import { Box, Button } from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { buttonsMsgs, buttonsMsgs as msg } from '../messages'
import { useLocale } from '@island.is/localization'
import { RegDraftForm } from '../state/types'
import { useDraftingState } from '../state/useDraftingState'
import ConfirmModal from './ConfirmModal/ConfirmModal'

const isDraftEmpty = (draft: RegDraftForm): boolean => {
  const someContent =
    draft.title.value ||
    draft.text.value ||
    draft.appendixes.some(({ text, title }) => title.value || text.value) ||
    draft.impacts.length

  return !someContent
}

// ===========================================================================

export type SaveDeleteButtonsProps =
  | { wrap: true; classes?: undefined }
  | {
      wrap?: false
      classes: {
        deleteDraft: string
        saveDraft: string
        propose: string
      }
    }

export const SaveDeleteButtons = (props: SaveDeleteButtonsProps) => {
  const { wrap, classes = s } = props

  const t = useLocale().formatMessage
  const { draft, saving, actions } = useDraftingState()
  const { saveStatus, deleteDraft, propose } = actions
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const { formatMessage } = useLocale()

  const buttons = (
    <>
      <Box className={classes.saveDraft}>
        <Button
          onClick={() => saveStatus()}
          icon="save"
          iconType="outline"
          variant="text"
          size="small"
          disabled={saving}
        >
          {t(msg.save)}
        </Button>
      </Box>
      {propose && (
        <Box className={classes.saveDraft}>
          <Button
            onClick={() => propose()}
            icon="open"
            iconType="outline"
            variant="text"
            size="small"
            disabled={saving}
          >
            {t(msg.propose)}
          </Button>
        </Box>
      )}
      <Box className={classes.deleteDraft}>
        <Button
          onClick={() => setIsConfirmationVisible(true)}
          icon="trash"
          iconType="outline"
          variant="text"
          colorScheme="destructive"
          size="small"
        >
          {t(msg.delete)}
        </Button>
      </Box>{' '}
      <ConfirmModal
        isVisible={isConfirmationVisible}
        message={formatMessage(buttonsMsgs.confirmDelete)}
        onConfirm={deleteDraft}
        onVisibilityChange={(visibility: boolean) => {
          setIsConfirmationVisible(visibility)
        }}
      />
    </>
  )

  return wrap ? (
    <Box marginBottom={4} display="flex" flexDirection="row">
      {buttons}
    </Box>
  ) : (
    buttons
  )
}
