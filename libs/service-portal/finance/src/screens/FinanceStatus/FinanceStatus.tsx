import React from 'react'

import { Box, Text, Columns, Column, Button, DropdownMenu, } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

function FinanceStatus(): JSX.Element {
  useNamespaces('sp.finance-status')

  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'service.portal:finance-status-title',
          defaultMessage: 'Staða við ríkissjóð og stofnanir',
        })}
      </Text>
      <Columns collapseBelow="sm">
        <Column width="8/12">
          <Text variant="intro">
            {formatMessage({
              id: 'service.portal:finance-status-intro',
              defaultMessage:
                'Hafið samband við viðeigandi umsjónarmann til að fá frekari upplýsingar um stöðu og innheimtu.',
            })}
          </Text>
        </Column>
      </Columns>
      <Box marginTop={[3, 4, 4, 4, 7]}>
        <Columns space="p2" align="right">
          <Column width="content">
            <Button
              colorScheme="default"
              icon="documents" // Need to add Printer
              iconType="filled"
              onBlur={function noRefCheck() { }}
              onClick={function noRefCheck() { }}
              onFocus={function noRefCheck() { }}
              preTextIconType="filled"
              size="default"
              type="button"
              variant="utility"
            >
              Prenta
            </Button>
          </Column>
          <Column width="content">
            <DropdownMenu
              icon="ellipsisVertical" // Need to add ellipsisHorizontal
              items={[
                {
                  href: '#',
                  title: 'Staða í lok árs ...'
                },                {
                  href: '#',
                  title: 'Sækja sem PDF'
                },
                {
                  onClick: function noRefCheck() { },
                  title: 'Sækja sem Excel'
                }
              ]}
              title="Meira"
            />
          </Column>
        </Columns>
      </Box>
    </Box>
  )
}

export default FinanceStatus
