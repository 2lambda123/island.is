import { useQuery } from '@apollo/client'
import { dynamicColor, TopLine } from '@island.is/island-ui-native'
import React, { useCallback, useRef, useState } from 'react'
import {
  Animated,
  DynamicColorIOS,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet
} from 'react-native'
import CodePush from 'react-native-code-push'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { client } from '../../graphql/client'
import {
  ListApplicationsResponse,
  LIST_APPLICATIONS_QUERY
} from '../../graphql/queries/list-applications.query'
import { useActiveTabItemPress } from '../../hooks/use-active-tab-item-press'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { useUiStore } from '../../stores/ui-store'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { ApplicationsModule } from './applications-module'
import { NotificationsModule } from './notifications-module'
import { OnboardingModule } from './onboarding-module'

const iconInsets = {
  top: Platform.OS === 'ios' && Platform.isPad ? 8 : 16,
  bottom: Platform.OS === 'ios' && Platform.isPad ? 8 : -4,
};

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: initialized ? intl.formatMessage({ id: 'home.screenTitle' }) : '',
      },
      rightButtons: initialized ? getRightButtons({ theme } as any) : [],
    },
    bottomTab: {
      ...({
        accessibilityLabel: intl.formatMessage({ id: 'home.screenTitle' }),
      } as any),
      selectedIconColor: null as any,
      iconColor: null as any,
      textColor: initialized
        ? Platform.OS === 'android'
          ? theme.shade.foreground
          : DynamicColorIOS({ light: 'black', dark: 'white' })
        : theme.shade.background,
      icon: initialized
        ? require('../../assets/icons/tabbar-home.png')
        : undefined,
      selectedIcon: initialized
        ? require('../../assets/icons/tabbar-home-selected.png')
        : undefined,
    },
  }),
  {
    topBar: {
      rightButtons: [],
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_HOME,
      iconInsets,
      // iconWidth: 42,
      // iconHeight: 42,
      disableIconTint: false,
      disableSelectedIconTint: true,
    },
  },
)

export const MainHomeScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const flatListRef = useRef<FlatList>(null)
  const ui = useUiStore()

  useActiveTabItemPress(1, () => {
    flatListRef.current?.scrollToOffset({ offset: -100, animated: true })
  })

  const applicationsRes = useQuery<ListApplicationsResponse>(
    LIST_APPLICATIONS_QUERY,
    { client },
  )

  const [loading, setLoading] = useState(false)

  const renderItem = useCallback(({ item }: any) => item.component, [])
  const keyExtractor = useCallback((item) => item.id, [])
  const scrollY = useRef(new Animated.Value(0)).current

  const refetch = async () => {
    setLoading(true)
    try {
      await applicationsRes.refetch()
    } catch (err) {
      // noop
    }
    setLoading(false)
  }

  if (!ui.initializedApp) {
    return null
  }

  const data = [
    {
      id: 'onboarding',
      component: <OnboardingModule />,
    },
    {
      id: 'applications',
      component: (
        <ApplicationsModule
          applications={applicationsRes.data?.applicationApplications ?? []}
          loading={applicationsRes.loading}
          componentId={componentId}
        />
      ),
    },
    {
      id: 'notifications',
      component: <NotificationsModule componentId={componentId} />,
    },
  ]

  return (
    <>
      <BottomTabsIndicator index={1} total={3} />
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        keyExtractor={keyExtractor}
        contentInset={{
          bottom: 32
        }}
        data={data}
        renderItem={renderItem}
        style={{ flex: 1, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
      <TopLine scrollY={scrollY} />
    </>
  )
}

MainHomeScreen.options = getNavigationOptions

export const HomeScreen = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(MainHomeScreen)

HomeScreen.options = MainHomeScreen.options
