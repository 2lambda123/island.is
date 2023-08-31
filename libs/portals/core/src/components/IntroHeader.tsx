import React from 'react'
import { MessageDescriptor } from 'react-intl'

import {
  Box,
  BoxProps,
  GridColumn,
  GridRow,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export interface IntroHeaderProps {
  title: MessageDescriptor | string
  intro?: MessageDescriptor | string
  img?: string
  hideImgPrint?: boolean
  translateTitle?: boolean
  marginBottom?: BoxProps['marginBottom']
  children?: React.ReactNode
}

export const IntroHeader = ({
  title,
  intro,
  img,
  hideImgPrint = false,
  translateTitle = true,
  marginBottom = 6,
  children,
}: IntroHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow marginBottom={marginBottom}>
      <GridColumn span={['8/8', '5/8']}>
        <Text variant="h3" as="h1" translate={translateTitle ? 'yes' : 'no'}>
          {formatMessage(title)}
        </Text>
        {intro && (
          <Text variant="default" paddingTop={2}>
            {formatMessage(intro)}
          </Text>
        )}
      </GridColumn>
      {img && (
        <GridColumn span={['8/8', '3/8']}>
          <Hidden print={hideImgPrint} below="lg">
            <Box textAlign="center" padding={[6, 0]}>
              <img src={img} alt="" />
            </Box>
          </Hidden>
        </GridColumn>
      )}
      {children}
    </GridRow>
  )
}
