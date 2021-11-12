import React, { FC, useCallback, useEffect } from 'react'
import { Box, Button, SkeletonLoader, Text } from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  FormValue,
  getValueViaPath,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { SubmittedApplicationData } from '../../types'
import {
  isHomeActivitiesAccident,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  hasReceivedAllDocuments,
  getErrorMessageForMissingDocuments,
} from '../../utils'
import { inReview } from '../../lib/messages'
import { StatusStep } from './StatusStep'
import { getAccidentStatusQuery } from '../../hooks/useLazyStatusOfNotification'
import { useFormContext } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { hasReceivedConfirmation } from '../../utils/hasReceivedConfirmation'
import {
  AccidentNotificationStatusEnum,
  ApplicationStatusProps,
  Steps,
} from './StatusStep/types'
import { AccidentNotificationStatus } from '@island.is/api/schema'

export const ApplicationStatus: FC<ApplicationStatusProps & FieldBaseProps> = ({
  goToScreen,
  application,
  refetch,
  field,
}) => {
  const isAssignee = field?.props?.isAssignee || false
  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData
  const ihiDocumentID = +(subAppData.data?.documentId || 0)
  const { setValue } = useFormContext()
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const { locale, formatMessage } = useLocale()

  const { loading: loadingData, error, data } = useQuery(
    getAccidentStatusQuery,
    {
      variables: { input: { ihiDocumentID: ihiDocumentID } },
    },
  )

  const answers = application?.answers as FormValue

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const currentAccidentStatus = getValueViaPath(
    answers,
    'accidentStatus',
  ) as AccidentNotificationStatus

  const hasAccidentStatusChanged = useCallback(
    (
      newAccidentStatus: AccidentNotificationStatus,
      currentAccidentStatus: AccidentNotificationStatus,
    ) => {
      if (!currentAccidentStatus) {
        return true
      }
      if (
        newAccidentStatus.receivedAttachments?.InjuryCertificate !==
        currentAccidentStatus.receivedAttachments?.InjuryCertificate
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedAttachments?.PoliceReport !==
        currentAccidentStatus.receivedAttachments?.PoliceReport
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedAttachments?.ProxyDocument !==
        currentAccidentStatus.receivedAttachments?.ProxyDocument
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedConfirmations?.CompanyParty !==
        currentAccidentStatus.receivedConfirmations?.CompanyParty
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedConfirmations
          ?.InjuredOrRepresentativeParty !==
        currentAccidentStatus.receivedConfirmations
          ?.InjuredOrRepresentativeParty
      ) {
        return true
      }
      if (newAccidentStatus.status !== currentAccidentStatus.status) {
        return true
      }
      return false
    },
    [],
  )

  // assign to answers and refresh if accidentStatus answers are stale
  const assignValueToAnswersAndRefetch = useCallback(async (accidentStatus) => {
    if (accidentStatus) {
      setValue('accidentStatus', accidentStatus)
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              accidentStatus,
            },
          },
          locale,
        },
      })
      if (
        res.data &&
        refetch &&
        hasAccidentStatusChanged(accidentStatus, currentAccidentStatus)
      ) {
        refetch()
      }
    }
  }, [])

  // monitor data and if changes assign to answers
  useEffect(() => {
    if (data && data.HealthInsuranceAccidentStatus) {
      assignValueToAnswersAndRefetch(data.HealthInsuranceAccidentStatus)
    }
  }, [data, assignValueToAnswersAndRefetch])

  if (loadingData || loading || !currentAccidentStatus) {
    return (
      <>
        <SkeletonLoader height={120} />
        <SkeletonLoader height={800} />
      </>
    )
  }

  // Todo add sentry log and design
  if (error) {
    return (
      <Text>Ekki tókst að sækja stöðu umsóknar, eitthvað fór úrskeiðis.</Text>
    )
  }

  const tagMapperApplicationStatus = {
    [AccidentNotificationStatusEnum.ACCEPTED]: {
      variant: 'blue',
      text: inReview.tags.received,
    },
    [AccidentNotificationStatusEnum.REFUSED]: {
      variant: 'blue',
      text: inReview.tags.received,
    },
    [AccidentNotificationStatusEnum.INPROGRESS]: {
      variant: 'purple',
      text: inReview.tags.pending,
    },
    [AccidentNotificationStatusEnum.INPROGRESSWAITINGFORDOCUMENT]: {
      variant: 'purple',
      text: inReview.tags.pending,
    },
  }

  const hasReviewerSubmitted = isAssignee && hasReceivedConfirmation(answers)

  const steps = [
    {
      tagText: formatMessage(inReview.tags.received),
      tagVariant: 'blue',
      title: formatMessage(inReview.application.title),
      description: formatMessage(inReview.application.summary),
      hasActionMessage: false,
    },
    {
      tagText: hasReceivedAllDocuments(answers)
        ? formatMessage(inReview.tags.received)
        : formatMessage(inReview.tags.missing),
      tagVariant: hasReceivedAllDocuments(answers) ? 'blue' : 'rose',
      title: formatMessage(inReview.documents.title),
      description: formatMessage(inReview.documents.summary),
      hasActionMessage: !hasReceivedAllDocuments(answers),
      action: {
        cta: () => {
          changeScreens('addAttachmentScreen')
        },
        title: formatMessage(inReview.action.documents.title),
        description: formatMessage(inReview.action.documents.description),
        fileNames: getErrorMessageForMissingDocuments(answers, formatMessage), // We need to get this from first form
        actionButtonTitle: formatMessage(
          inReview.action.documents.actionButtonTitle,
        ),
        hasActionButtonIcon: true,
        showAlways: true,
      },
    },
    // If this was a home activity accident than we don't want the user to see this step
    {
      tagText: hasReviewerSubmitted
        ? formatMessage(inReview.tags.received)
        : formatMessage(inReview.tags.missing),
      tagVariant: hasReviewerSubmitted ? 'blue' : 'rose',
      title: formatMessage(
        hasReviewerSubmitted
          ? inReview.representative.titleDone
          : inReview.representative.title,
      ),
      description: formatMessage(
        hasReviewerSubmitted
          ? inReview.representative.summaryDone
          : inReview.representative.summary,
      ),
      hasActionMessage: !hasReviewerSubmitted,
      action: hasReviewerSubmitted
        ? undefined
        : {
            cta: () => changeScreens('inReviewOverviewScreen'),
            title: formatMessage(inReview.action.representative.title),
            description: formatMessage(
              inReview.action.representative.description,
            ),
            actionButtonTitle: formatMessage(
              inReview.action.representative.actionButtonTitle,
            ),
          },
      visible:
        !isHomeActivitiesAccident(answers) ||
        !isInjuredAndRepresentativeOfCompanyOrInstitute(answers),
    },
    {
      tagText: formatMessage(
        tagMapperApplicationStatus[currentAccidentStatus.status].text,
      ),
      tagVariant:
        tagMapperApplicationStatus[currentAccidentStatus.status].variant,
      title: formatMessage(inReview.sjukratrygging.title),
      description: formatMessage(inReview.sjukratrygging.summary),
      hasActionMessage: false,
    },
  ] as Steps[]

  return (
    <Box marginBottom={10}>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(inReview.general.title)}
      </Text>
      <Box marginTop={4} display="flex" justifyContent="flexEnd">
        <Button
          colorScheme="default"
          iconType="filled"
          size="small"
          type="button"
          variant="text"
          onClick={() => changeScreens('inReviewOverviewScreen')}
        >
          Skoða yfirlit
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <StatusStep
            key={index}
            title={step.title}
            description={step.description}
            hasActionMessage={step.hasActionMessage}
            action={step.action}
            tagText={step.tagText}
            tagVariant={step.tagVariant}
          />
        ))}
      </Box>
    </Box>
  )
}
