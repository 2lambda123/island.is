import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import cn from 'classnames'

import {
  CaseFile,
  CaseFileState,
  CaseOrigin,
  PoliceCaseFile,
} from '@island.is/judicial-system/types'
import {
  CaseInfo,
  FormContentContainer,
  FormFooter,
  PageLayout,
  ParentCaseFiles,
} from '@island.is/judicial-system-web/src/components'
import { PoliceCaseFilesQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  icCaseFiles as m,
  errors,
} from '@island.is/judicial-system-web/messages'
import {
  useCase,
  useDeb,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  ContentBlock,
  Input,
  InputFileUpload,
  LoadingDots,
  Text,
  Tooltip,
  UploadFile,
} from '@island.is/island-ui/core'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import * as constants from '@island.is/judicial-system/consts'

import * as styles from './CaseFiles.css'
import { PoliceCaseFilesMessageBox } from '../../SharedComponents/PoliceCaseFilesMessageBox/PoliceCaseFilesMessageBox'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorCode?: string
}

interface PoliceCaseFileChecked extends PoliceCaseFile {
  checked: boolean
}

export const CaseFiles: React.FC = () => {
  const router = useRouter()
  const id = router.query.id
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()
  const { formatMessage } = useIntl()

  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useQuery(PoliceCaseFilesQuery, {
    variables: { input: { caseId: id } },
    fetchPolicy: 'no-cache',
    skip: workingCase.origin !== CaseOrigin.LOKE,
  })

  useEffect(() => {
    if (workingCase.origin !== CaseOrigin.LOKE) {
      setPoliceCaseFiles({
        files: [],
        isLoading: false,
        hasError: false,
      })
    } else if (policeData && policeData.policeCaseFiles) {
      setPoliceCaseFiles({
        files: policeData.policeCaseFiles,
        isLoading: false,
        hasError: false,
      })
    } else if (policeDataLoading) {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: false,
        hasError: true,
        errorCode: policeDataError?.graphQLErrors[0].extensions?.code,
      })
    }
  }, [policeData, policeDataLoading, policeDataError, workingCase.origin])

  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileChecked[]
  >([])
  const [checkAllChecked, setCheckAllChecked] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const {
    files,
    uploadErrorMessage,
    allFilesUploaded,
    uploadPoliceCaseFile,
    addFileToCase,
    onChange,
    onRemove,
    onRetry,
  } = useS3Upload(workingCase)
  const { updateCase } = useCase()
  const { user } = useContext(UserContext)

  useDeb(workingCase, 'caseFilesComments')

  useEffect(() => {
    if (policeCaseFiles) {
      const policeCaseFilesNotStoredInRVG = policeCaseFiles.files.filter(
        (p) => {
          const xFiles = files as CaseFile[]

          return !xFiles.find((f) => f.name === p.name && f.key)
        },
      )

      if (policeCaseFilesNotStoredInRVG.length !== policeCaseFileList.length) {
        setPoliceCaseFileList(
          policeCaseFilesNotStoredInRVG.map((policeCaseFile) => {
            return {
              id: policeCaseFile.id,
              name: policeCaseFile.name,
              checked:
                policeCaseFileList.find((p) => p.id === policeCaseFile.id)
                  ?.checked || false,
            }
          }),
        )
      }
    }
  }, [policeCaseFiles, files, policeCaseFileList])

  const toggleCheckbox = (
    evt: React.ChangeEvent<HTMLInputElement>,
    checkAll?: boolean,
  ) => {
    const newPoliceCaseFileList = [...policeCaseFileList]
    const target = policeCaseFileList.findIndex(
      (listItem) => listItem.id.toString() === evt.target.value,
    )

    if (checkAll) {
      setCheckAllChecked(!checkAllChecked)
      setPoliceCaseFileList(
        policeCaseFileList.map((l) => {
          return { id: l.id, name: l.name, checked: evt.target.checked }
        }),
      )
    } else {
      newPoliceCaseFileList[target].checked = !newPoliceCaseFileList[target]
        .checked
      setPoliceCaseFileList(newPoliceCaseFileList)
    }
  }

  const uploadToRVG = async () => {
    const filesToUpload = policeCaseFileList.filter((p) => p.checked)
    let newPoliceCaseFileList = [...policeCaseFileList]

    setIsUploading(true)

    filesToUpload.forEach(async (policeCaseFile, index) => {
      const { key, size } = await uploadPoliceCaseFile(
        policeCaseFile.id,
        policeCaseFile.name,
      )

      await addFileToCase({
        type: 'application/pdf',
        name: policeCaseFile.name,
        status: 'done',
        state: CaseFileState.STORED_IN_RVG,
        key,
        size,
      } as UploadFile)

      newPoliceCaseFileList = newPoliceCaseFileList.filter(
        (p) => p.id !== policeCaseFile.id,
      )

      if (index === filesToUpload.length - 1) {
        setIsUploading(false)
        setCheckAllChecked(false)
      }
    })

    setPoliceCaseFileList(newPoliceCaseFileList)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.STEP_FIVE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.caseFiles)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo
            workingCase={workingCase}
            userRole={user?.role}
            showAdditionalInfo
          />
        </Box>
        <Box marginBottom={5}>
          <ParentCaseFiles
            caseType={workingCase.type}
            files={workingCase.parentCase?.caseFiles}
          />
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.description.heading)}
            </Text>
          </Box>
          <MarkdownWrapper
            markdown={formatMessage(m.sections.description.list)}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.policeCaseFiles.heading, {
              policeCaseNumber: workingCase.policeCaseNumber,
            })}
          </Text>
          <Text marginTop={1}>
            {formatMessage(m.sections.policeCaseFiles.introduction)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          {workingCase.origin === CaseOrigin.LOKE && (
            <AnimateSharedLayout>
              <motion.div layout className={styles.policeCaseFilesContainer}>
                <motion.ul layout>
                  <motion.li
                    layout
                    className={cn(styles.policeCaseFile, {
                      [styles.selectAllPoliceCaseFiles]: true,
                    })}
                  >
                    <Checkbox
                      name="selectAllPoliceCaseFiles"
                      label={formatMessage(
                        m.sections.policeCaseFiles.selectAllLabel,
                      )}
                      checked={checkAllChecked}
                      onChange={(evt) => toggleCheckbox(evt, true)}
                      disabled={isUploading || policeCaseFileList.length === 0}
                      strong
                    />
                  </motion.li>
                  {policeCaseFiles?.isLoading ? (
                    <Box
                      textAlign="center"
                      paddingY={2}
                      paddingX={3}
                      marginBottom={2}
                    >
                      <LoadingDots />
                    </Box>
                  ) : policeCaseFiles?.hasError ? (
                    policeCaseFiles?.errorCode ===
                    'https://httpstatuses.org/404' ? (
                      <PoliceCaseFilesMessageBox
                        icon="warning"
                        iconColor="yellow400"
                        message={formatMessage(
                          m.sections.policeCaseFiles.caseNotFoundInLOKEMessage,
                        )}
                      />
                    ) : (
                      <PoliceCaseFilesMessageBox
                        icon="close"
                        iconColor="red400"
                        message={formatMessage(
                          m.sections.policeCaseFiles.couldNotGetFromLOKEMessage,
                        )}
                      />
                    )
                  ) : policeCaseFiles?.files.length === 0 ? (
                    <PoliceCaseFilesMessageBox
                      icon="warning"
                      iconColor="yellow400"
                      message={formatMessage(
                        m.sections.policeCaseFiles.noFilesFoundInLOKEMessage,
                      )}
                    />
                  ) : policeCaseFileList.length > 0 ? (
                    <AnimatePresence>
                      {policeCaseFileList.map((listItem) => {
                        return (
                          <motion.li
                            layout
                            className={styles.policeCaseFile}
                            key={listItem.name}
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                          >
                            <Checkbox
                              label={
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="spaceBetween"
                                >
                                  {listItem.name}
                                  {isUploading && listItem.checked && (
                                    <LoadingDots />
                                  )}
                                </Box>
                              }
                              name={listItem.id}
                              value={listItem.id}
                              checked={listItem.checked}
                              onChange={(evt) => toggleCheckbox(evt)}
                            />
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                  ) : (
                    <PoliceCaseFilesMessageBox
                      icon="checkmark"
                      iconColor="blue400"
                      message={formatMessage(errors.general)}
                    />
                  )}
                </motion.ul>
              </motion.div>
              <motion.div layout className={styles.uploadToRVGButtonContainer}>
                <Button
                  onClick={uploadToRVG}
                  loading={isUploading}
                  disabled={policeCaseFileList.length === 0}
                >
                  {formatMessage(m.sections.policeCaseFiles.uploadButtonLabel)}
                </Button>
              </motion.div>
            </AnimateSharedLayout>
          )}
          {workingCase.origin !== CaseOrigin.LOKE && (
            <AlertMessage
              type="info"
              title={formatMessage(
                m.sections.policeCaseFiles.originNotLokeTitle,
              )}
              message={formatMessage(
                m.sections.policeCaseFiles.originNotLokeMessage,
              )}
            ></AlertMessage>
          )}
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.files.heading)}
          </Text>
          <Text marginTop={1}>
            {formatMessage(m.sections.files.introduction)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <ContentBlock>
            <InputFileUpload
              name="fileUpload"
              fileList={files}
              header={formatMessage(m.sections.files.label)}
              buttonLabel={formatMessage(m.sections.files.buttonLabel)}
              onChange={onChange}
              onRemove={onRemove}
              onRetry={onRetry}
              errorMessage={uploadErrorMessage}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              {formatMessage(m.sections.comments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(m.sections.comments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(m.sections.comments.label)}
              placeholder={formatMessage(m.sections.comments.placeholder)}
              value={workingCase.caseFilesComments || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event.target.value,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(workingCase.id, {
                  caseFilesComments: evt.target.value,
                })
              }
              textarea
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded || isUploading}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
