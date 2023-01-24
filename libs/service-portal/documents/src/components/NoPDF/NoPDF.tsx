import React from 'react'
import { useLocale } from '@island.is/localization'
import { Text, Box } from '@island.is/island-ui/core'
import { EmptyImageSmall } from './EmptyImage'
import { messages } from '../../utils/messages'

export const NoPDF = () => {
  const { formatMessage } = useLocale()
  return (
    <Box
      paddingTop={[0, 8]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="full"
    >
      <Box width="full" display="flex" justifyContent="center" marginBottom={3}>
        <EmptyImageSmall style={{ maxHeight: 140 }} />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        paddingTop={[3, 0]}
        style={{ maxWidth: 370 }}
      >
        <Text marginBottom={1} variant="h3">
          {formatMessage(messages.pickDocument)}
        </Text>
        <Text marginBottom={1} variant="medium">
          {formatMessage(messages.pickDocumentText)}
        </Text>
      </Box>
    </Box>
  )
}

export default NoPDF
