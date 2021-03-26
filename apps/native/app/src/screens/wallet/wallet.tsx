import { Card, ListItem } from '@island.is/island-ui-native'
import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useScreenOptions } from '../../contexts/theme-provider'
import { navigateTo } from '../../utils/deep-linking'
import { testIDs } from '../../utils/test-ids'
import { LIST_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query'
import { Logo } from '../../components/logo/logo'
import { LicenseType } from '../../types/license-type'
import { theme } from '@island.is/island-ui/theme'

function mapLicenseColor(type: LicenseType) {
  let backgroundColor = '#eeeeee'
  if (type === LicenseType.DRIVERS_LICENSE) {
    backgroundColor = '#f5e4ec'
  }
  if (type === LicenseType.IDENTIDY_CARD) {
    backgroundColor = '#fff7e7'
  }
  if (type === LicenseType.PASSPORT) {
    backgroundColor = '#ddefff'
  }
  if (type === LicenseType.WEAPON_LICENSE) {
    backgroundColor = '#fffce0'
  }
  return backgroundColor
}

export const WalletScreen: NavigationFunctionComponent = () => {
  const theme = useTheme()
  const res = useQuery(LIST_LICENSES_QUERY, { client })
  const licenseItems = res?.data?.listLicenses ?? []

  useScreenOptions(
    () => ({
      topBar: {
        title: {
          text: 'Skírteinin þín',
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_WALLET,
        selectedIconColor: theme.color.blue400,
        icon: require('../../assets/icons/tabbar-wallet.png'),
        selectedIcon: require('../../assets/icons/tabbar-wallet-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
      },
    }),
    [theme],
  )

  const myLicenses = licenseItems.length
    ? [licenseItems[1], licenseItems[0], licenseItems[2], licenseItems[3]]
    : []

  return (
    <>
      <ScrollView horizontal={false}>
        <ScrollView
          horizontal
          snapToInterval={260 + 30}
          showsHorizontalScrollIndicator={false}
          snapToAlignment={'start'}
          contentInset={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 30,
          }}
          contentInsetAdjustmentBehavior="automatic"
          decelerationRate={0}
          style={{ marginTop: 50, marginBottom: 10 }}
        >
          {myLicenses.map((license) => {
            const backgroundColor = mapLicenseColor(license.type)
            return (
              <TouchableOpacity
                key={license.id}
                onPress={() =>
                  navigateTo(`/wallet/${license.id}`, { backgroundColor })
                }
              >
                <Card backgroundColor={backgroundColor} title={license.title} />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        {licenseItems.map(
          ({
            id,
            title,
            serviceProvider,
            type,
          }: {
            id: string
            title: string
            serviceProvider: string
            type: LicenseType
          }) => (
            <ListItem
              key={id}
              title={serviceProvider}
              subtitle={title}
              icon={<Logo name={title} />}
              onPress={() =>
                navigateTo(`/wallet/${id}`, {
                  backgroundColor: mapLicenseColor(type),
                })
              }
            />
          ),
        )}
      </ScrollView>
      <BottomTabsIndicator index={2} total={3} />
    </>
  )
}
