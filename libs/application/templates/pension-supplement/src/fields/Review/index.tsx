import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useMutation } from '@apollo/client'
import get from 'lodash/get'
import has from 'lodash/has'

import { BaseInformation } from './review-groups/BaseInformation'
import { Payment } from './review-groups/Payment'
import { ApplicationReason } from './review-groups/ApplicationReason'
import { Attachments } from './review-groups/Attachments'

import { pensionSupplementFormMessage } from '../../lib/messages'
import { States } from '../../lib/constants'
import { handleServerError } from '@island.is/application/ui-components'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
  editable?: boolean
}
export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  refetch,
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()
  const { state } = application

  const hasError = (id: string) => get(errors, id) as string
  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))
  const childProps = {
    application,
    editable,
    groupHasNoErrors,
    hasError,
    goToScreen,
  }

  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const handleSubmit = async (event: string) => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event,
          answers: application.answers,
        },
      },
    })

    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }

  // TODO: Hvaða states eiga sjá þetta? Mega öll state sjá nema DRAFT og PREREQUISITES??
  const canView =
    state === States.TRYGGINGASTOFNUN_SUBMITTED ||
    state === States.TRYGGINGASTOFNUN_IN_REVIEW ||
    state === States.APPROVED ||
    state === States.REJECTED

  return (
    <>
      {state === `${States.DRAFT}` && (
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(pensionSupplementFormMessage.confirm.title)}
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Text variant="default">
              {formatMessage(pensionSupplementFormMessage.confirm.description)}
            </Text>
          </Box>
        </Box>
      )}

      {canView && (
        <Box
          display={['block', 'block', 'block', 'flex']}
          justifyContent="spaceBetween"
        >
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(
                pensionSupplementFormMessage.confirm.overviewTitle,
              )}
            </Text>
          </Box>

          {state === `${States.TRYGGINGASTOFNUN_SUBMITTED}` && (
            <Box>
              <Button
                colorScheme="default"
                iconType="filled"
                size="small"
                type="button"
                variant="text"
                icon="pencil"
                loading={loadingSubmit}
                disabled={loadingSubmit}
                onClick={() => handleSubmit('EDIT')}
              >
                {formatMessage(
                  pensionSupplementFormMessage.confirm.buttonsEdit,
                )}
              </Button>
            </Box>
          )}
        </Box>
      )}
      <BaseInformation {...childProps} />
      <Payment {...childProps} />
      <ApplicationReason {...childProps} />
      <Attachments {...childProps} />
    </>
  )
}
