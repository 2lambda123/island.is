import React, { useEffect, useState } from 'react'
import { Case } from '@island.is/judicial-system/types'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import StepThreeForm from './StepThreeForm'

export const StepThree: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const router = useRouter()
  const id = router.query.id

  const [
    requestedCustodyEndDateIsValid,
    setRequestedCustodyEndDateIsValid,
  ] = useState(false)

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && resCase) {
      setRequestedCustodyEndDateIsValid(resCase.requestedCustodyEndDate != null)

      setWorkingCase(resCase)
    }
  }, [workingCase, setWorkingCase, resCase])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_THREE
      }
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <StepThreeForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          requestedCustodyEndDateIsValid={requestedCustodyEndDateIsValid}
          setRequestedCustodyEndDateIsValid={setRequestedCustodyEndDateIsValid}
        />
      ) : null}
    </PageLayout>
  )
}

export default StepThree
