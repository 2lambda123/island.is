import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Box,
  DatePicker,
  Input,
  Text,
  Checkbox,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { HTMLText } from '@island.is/regulations'
import startOfTomorrow from 'date-fns/startOfTomorrow'
import {
  RegDraftForm,
  useDraftingState,
  StepComponent,
} from '../state/useDraftingState'

type WrapProps = {
  legend?: string
  children: ReactNode
}
const Wrap = (props: WrapProps) => (
  <Box marginBottom={2} aria-label={props.legend}>
    {props.legend && (
      <Text
        variant="small"
        as="h4"
        color="blue400"
        fontWeight="medium"
        marginBottom={1}
      >
        {props.legend}
      </Text>
    )}
    {props.children}
  </Box>
)

export const EditBasics: StepComponent = (props) => {
  const t = useIntl().formatMessage
  const { draft, actions } = props

  const [titleValue, setTitleValue] = useState(draft.title?.value)
  const [dateValue, setDateValue] = useState(draft.idealPublishDate?.value)
  const [fastTrack, setFastTrack] = useState(false)

  const textRef = useRef(() => draft.text.value)

  const onAnyInputChange = useCallback(
    (data: { name: string; value: string | Date }) => {
      actions.updateState({ ...data })
    },
    [actions],
  )

  useEffect(() => {
    onAnyInputChange({
      name: 'title',
      value: titleValue,
    })
  }, [titleValue, onAnyInputChange])

  useEffect(() => {
    onAnyInputChange({
      name: 'idealPublishDate',
      value: dateValue as Date,
    })
  }, [dateValue, onAnyInputChange])

  const fastTrackDate = fastTrack ? new Date() : null
  const selectedDate = dateValue ? new Date(dateValue) : null
  return (
    <>
      <Wrap>
        <Input
          label={t(msg.title)}
          name="title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
        />
      </Wrap>

      <Wrap>
        <EditorInput
          label={t(msg.text)}
          baseText={'' as HTMLText}
          initialText={draft.text.value}
          isImpact={false}
          draftId={draft.id}
          valueRef={textRef}
          onChange={() =>
            onAnyInputChange({
              name: 'text',
              value: textRef.current(),
            })
          }
        />
      </Wrap>

      <Wrap>
        <DatePicker
          label={t(msg.idealPublishDate)}
          placeholderText={t(msg.idealPublishDate_soon)}
          minDate={startOfTomorrow()}
          selected={fastTrackDate || selectedDate}
          handleChange={(date: Date) => setDateValue(date)}
        />
        <Box marginTop={1}>
          <Checkbox
            label={t(msg.applyForFastTrack)}
            labelVariant="default"
            checked={fastTrack}
            onChange={(e) => setFastTrack(e.target.checked)}
          />
        </Box>
        {/*
          TODO: Add fast track toggler, but only make it shift the minDate to today
          Then let the up-stream state reducer decide if the selected date is indeed a fastTrack request

          draft.fastTrack should alaways be a derived value, based on idealPublishDate
          ...and **POSSIBLY** only when the draftingStatus is "draft" ??? Needs customer input... Not important to resolve right away.
        */}
      </Wrap>
    </>
  )
}
