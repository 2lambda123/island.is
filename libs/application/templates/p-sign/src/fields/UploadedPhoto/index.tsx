import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { Application, formatText } from '@island.is/application/core'
import { gql, useQuery } from '@apollo/client'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface UploadedPhotoProps {
  application: Application
}

export const PresignedUrlQuery = gql`
  query attachmentPresignedURL($input: AttachmentPresignedUrlInput!) {
    attachmentPresignedURL(input: $input) {
      url
    }
  }
`

const UploadedPhoto = ({ application }: UploadedPhotoProps) => {
  const { formatMessage } = useLocale()

  const attachmentKey = (application.answers.attachments as Array<{
    key: string
    name: string
  }>)[0].key

  const { data: presignedUrl } = useQuery(PresignedUrlQuery, {
    variables: {
      input: {
        id: application.id,
        attachmentKey: attachmentKey,
      },
    },
  })

  return (
    <Box style={{ width: '191px', height: '242px' }}>
      <img
        alt={
          formatText(m.qualityPhotoAltText, application, formatMessage) || ''
        }
        src={presignedUrl?.attachmentPresignedURL.url}
        id="uploadedimage"
      />
    </Box>
  )
}

export default UploadedPhoto
