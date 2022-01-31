import React, { ReactNode, useState } from 'react'
import { Box, Button, Inline, Text, Divider } from '@island.is/island-ui/core'
import { editorMsgs, impactMsgs, reviewMessagse } from '../messages'
import { useDraftingState } from '../state/useDraftingState'
import { useLocale } from '../utils'
import { downloadUrl } from '../utils/files'
import { Step } from '../types'
import { JumpToStep } from './EditReviewWarnings'
import { RegDraftForm } from '../state/types'
import {
  prettyName,
  combineTextAppendixesComments,
  toISODate,
} from '@island.is/regulations'
import { useImpactsByTarget } from '../utils/dataHooks'
import copyToClipboard from 'copy-to-clipboard'

/** Mock PDF fetchher.
 *
 * TODO: Implement true POST action that generates a full PDF
 * (signatureText and all) and downloads it automatically
 */
const generateAndDownloadPdf = (draft: RegDraftForm) => {
  new Promise<{ success: boolean }>((resolve) => {
    const fileName = draft.title.value + '.pdf'
    // import { downloadUrl } from '../utils/files'
    // downloadUrl (...)
    setTimeout(() => {
      alert(`Save your file "${fileName}"`)
      resolve({ success: true })
    }, 500)
  })
}

// ---------------------------------------------------------------------------

const prettyJoin = <T,>(arr: Array<T>): Array<string | T> =>
  arr.flatMap((item, i) => {
    const separator = i === 0 ? '' : i === arr.length - 1 ? ' og ' : ', '
    return separator ? [separator, item] : item
  })

// ---------------------------------------------------------------------------

type MicroActionProps = {
  text: string
  onClick: () => void
  clicked: boolean
  icon?: 'download' | 'copy'
}

const MicroAction = (props: MicroActionProps) => {
  const buttonProps = props.clicked
    ? ({
        variant: 'text',
        preTextIconType: 'outline',
        preTextIcon: 'checkmark',
      } as const)
    : ({
        variant: 'ghost',
        size: 'small',
        iconType: 'outline',
        icon: props.icon || 'copy',
      } as const)

  return (
    <Button as="button" onClick={props.onClick} {...buttonProps}>
      {props.text}
    </Button>
  )
}

// ---------------------------------------------------------------------------

type OverviewItemProps = {
  label: string
  children: ReactNode
  step?: Step
}
const OverviewItem = (props: OverviewItemProps) => {
  const { label, step } = props
  return (
    <Box marginBottom={2}>
      <Text fontWeight="semiBold">{label}:</Text>
      {step && <JumpToStep step={step} label={label} />} {props.children}
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type EditReviewOverviewProps = {
  hasWarnings: boolean
}

export const EditReviewOverview = (props: EditReviewOverviewProps) => {
  const { draft, lawChapters, isEditor } = useDraftingState()
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage
  const { hasWarnings } = props

  const impactsByTarget = useImpactsByTarget(draft.impacts)

  const [clicked, setClicked] = useState({
    title: false,
    html: false,
    filesZip: false,
    idealPublishDate: false,
    signatureDate: false,
    signedDocument: false,
    PDF: false,
  })
  const flagAsClick = (key: keyof typeof clicked) =>
    setClicked({ ...clicked, [key]: true })

  const formatDate = (date?: Date, format?: string) =>
    date ? formatDateFns(date, format || 'dd MMMM yyyy') : ''

  if (hasWarnings) {
    return null
  }

  const typeName = t(
    draft.type.value === 'amending'
      ? editorMsgs.type_amending
      : editorMsgs.type_base,
  )

  return (
    <Box marginBottom={4}>
      <OverviewItem label={t(editorMsgs.title)} step="basics">
        {draft.title.value}
        <br />({typeName})
      </OverviewItem>

      {draft.appendixes.length > 0 && (
        <OverviewItem label={t(editorMsgs.appendixes)} step="basics">
          {prettyJoin(draft.appendixes.map((a) => '„' + a.title.value + '“'))}
        </OverviewItem>
      )}

      <OverviewItem label={t(editorMsgs.effectiveDate)} step="meta">
        {formatDate(draft.effectiveDate.value) ||
          t(editorMsgs.effectiveDate_default)}
      </OverviewItem>

      <OverviewItem label={t(editorMsgs.lawChapters)} step="meta">
        {prettyJoin(
          draft.lawChapters.value.map(
            (slug) => '„' + lawChapters.bySlug[slug] + '“',
          ),
        )}
      </OverviewItem>

      <OverviewItem label={t(editorMsgs.signatureDate)} step="signature">
        {draft.ministry.value}nu, {formatDate(draft.signatureDate.value)}
      </OverviewItem>

      <OverviewItem label={t(editorMsgs.idealPublishDate)} step="signature">
        {formatDate(draft.idealPublishDate.value) ||
          t(editorMsgs.idealPublishDate_default)}
        {draft.fastTrack.value ? ` (${t(editorMsgs.applyForFastTrack)})` : ''}
      </OverviewItem>

      {impactsByTarget.length > 0 && (
        <Box marginTop={4} marginBottom={4}>
          <Text variant="h4" as="h4" marginBottom={2}>
            {t(reviewMessagse.impactsTitle)}
          </Text>
          {impactsByTarget.map(({ name, regTitle, impacts }) => {
            const label =
              name === 'self'
                ? t(impactMsgs.selfAffecting)
                : `${prettyName(name)} – ${regTitle}`

            return (
              <OverviewItem key={name} label={label} step="impacts">
                {impacts.map((impact) => (
                  <div key={impact.id}>
                    {formatDate(impact.date.value)}{' '}
                    {t(
                      impact.type === 'amend'
                        ? 'Textabreyting'
                        : 'Fellur úr gildi',
                    )}
                    {/* FIXME:
                        List secondary effects (i.e. existing impacts that will be updated,
                        or that simply won't apply anymore)
                        At least mention if there are any.
                      */}
                  </div>
                ))}
              </OverviewItem>
            )
          })}
        </Box>
      )}

      {isEditor && (
        <Box marginTop={[4, 4, 8]} marginBottom={[4, 4, 8]}>
          <Box marginBottom={[0, 0, 2]}>
            <Divider />
            {' '}
          </Box>

          <Inline space={[3, 3, 4, 5]} align="center" alignY="center">
            <MicroAction
              text={t(reviewMessagse.copyTitle)}
              clicked={clicked.title}
              icon="copy"
              onClick={() => {
                copyToClipboard(draft.title.value, {
                  format: 'text/plain',
                  onCopy: () => flagAsClick('title'),
                })
              }}
            />
            <MicroAction
              text={t(reviewMessagse.copyHtml)}
              clicked={clicked.html}
              icon="copy"
              onClick={() => {
                copyToClipboard(
                  // NÓTE: This HTML has not been run through
                  // `cleanupAndCombineEditorOutputs()` on the server side.
                  //...and also may need to be "dummified" for saving
                  // in Stjórnartíðindi's db
                  // See: https://app.asana.com/0/1200403571249062/1201743082260316
                  combineTextAppendixesComments(
                    draft.text.value,
                    draft.appendixes.map((a) => ({
                      title: a.title.value,
                      text: a.text.value,
                    })),
                    '',
                  ),
                  {
                    // NOTE: text/html format (the deafault mode) only copies
                    // rich-text content to the clipboard, which prevents pasting
                    // into plain-text editing contexts (like <textarea>s, plain-text
                    // editors, etc.)
                    // This is a known issue: https://github.com/sudodoki/copy-to-clipboard/issues/112
                    format: 'text/html',
                    // format: 'text/text',
                    onCopy: () => flagAsClick('html'),
                  },
                )
              }}
            />

            {/*
              TODO: Add MicroAction button (if needed) that downloads a ZIP
              containing all linked images and resources/attachments.
            */}

            <MicroAction
              text={t(reviewMessagse.copySignatureDate)}
              clicked={clicked.signatureDate}
              icon="copy"
              onClick={() => {
                copyToClipboard(toISODate(draft.signatureDate.value!), {
                  format: 'text/text',
                  onCopy: () => flagAsClick('signatureDate'),
                })
              }}
            />

            {draft.idealPublishDate.value && (
              <MicroAction
                text={t(reviewMessagse.copyIdealPublishDate)}
                clicked={clicked.idealPublishDate}
                icon="copy"
                onClick={() => {
                  copyToClipboard(toISODate(draft.idealPublishDate.value!), {
                    format: 'text/text',
                    onCopy: () => flagAsClick('idealPublishDate'),
                  })
                }}
              />
            )}

            <MicroAction
              text={t(reviewMessagse.downloadSignedDocument)}
              clicked={clicked.signedDocument}
              icon="download"
              onClick={() => {
                flagAsClick('signedDocument')
                downloadUrl(draft.signedDocumentUrl.value!)
              }}
            />

            <MicroAction
              text={t(reviewMessagse.downloadPDFVersion)}
              clicked={clicked.PDF}
              icon="download"
              onClick={() => {
                flagAsClick('PDF')
                generateAndDownloadPdf(draft)
              }}
            />
          </Inline>
        </Box>
      )}
    </Box>
  )
}
