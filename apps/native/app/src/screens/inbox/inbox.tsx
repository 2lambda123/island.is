import { useQuery } from '@apollo/client'
import { EmptyList, ListItem } from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import {
  useNavigationSearchBarCancelPress,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks/dist'
import styled, { useTheme } from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/le-company-s3.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { client } from '../../graphql/client'
import { IDocument } from '../../graphql/fragments/document.fragment'
import {
  ListDocumentsResponse,
  LIST_DOCUMENTS_QUERY,
} from '../../graphql/queries/list-documents.query'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { useUiStore } from '../../stores/ui-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { navigateTo } from '../../utils/deep-linking'
import { testIDs } from '../../utils/test-ids'
import { useActiveTabItemPress } from '../../utils/use-active-tab-item-press'
import { useThemedNavigationOptions } from '../../utils/use-themed-navigation-options'

interface IndexedDocument extends IDocument {
  fulltext: string
}

const TopLine = styled(Animated.View)`
  background-color: ${(props) => props.theme.color.blue200};
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'inbox.screenTitle' }),
      },
      searchBar: {
        tintColor: theme.color.blue400,
      },
    },
    bottomTab: {
      iconColor: theme.color.blue400,
      text: initialized
        ? intl.formatMessage({ id: 'inbox.bottomTabText' })
        : '',
    },
  }),
  {
    topBar: {
      elevation: 0,
      height: 120,
      searchBar: {
        visible: true,
        placeholder: 'Leita að skjölum...',
        hideTopBarOnFocus: true,
      },
      background: {
        component:
          Platform.OS === 'android'
            ? {
                name: ComponentRegistry.AndroidSearchBar,
              }
            : undefined,
      },
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_INBOX,
      iconInsets: {
        bottom: -4,
      },
      icon: require('../../assets/icons/tabbar-inbox.png'),
      selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
    },
  },
)

const PressableListItem = React.memo(({ item }: { item: IDocument }) => {
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  return (
    <PressableHighlight onPress={() => navigateTo(`/inbox/${item.id}`, { title: item.senderName })}>
      <ListItem
        title={item.senderName}
        subtitle={item.subject}
        date={new Date(item.date)}
        swipable={false}
        icon={
          <Image
            source={{ uri: getOrganizationLogoUrl(item.senderName, 75) }}
            resizeMode="contain"
            style={{ width: 25, height: 25 }}
          />
        }
      />
    </PressableHighlight>
  )
});

const SearchHeaderHost = styled.View`
  height: 46px;
  background-color: ${(props) => props.theme.color.blue100};
  align-items: center;
  justify-content: center;
`
const SearchHeaderText = styled.Text`
  color: ${(props) => props.theme.shade.foreground};
`

function SearchHeader({ count, loading }: any) {
  return (
    <SearchHeaderHost>
      <SearchHeaderText>
        {loading ? 'Leita í skjölum...' : `${count} niðurstöður fundust`}
      </SearchHeaderText>
    </SearchHeaderHost>
  )
}

export const InboxScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const ui = useUiStore()
  const flatListRef = useRef<FlatList>(null)
  const [loading, setLoading] = useState(false)
  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, { client })
  const [indexedItems, setIndexedItems] = useState<IndexedDocument[]>([])
  const [inboxItems, setInboxItems] = useState<IDocument[]>([])
  const scrollY = useRef(new Animated.Value(0)).current

  const [searchLoading, setSearchLoading] = useState(false)

  useActiveTabItemPress(0, () => {
    flatListRef.current?.scrollToOffset({
      offset: -100,
      animated: true,
    })
  })

  useNavigationSearchBarUpdate((e) => {
    setSearchLoading(true)
    ui.setQuery(e.text)
  })

  useNavigationSearchBarCancelPress(() => {
    setSearchLoading(true)
    ui.setQuery('')
  })

  useEffect(() => {
    const items = res?.data?.listDocuments ?? []
    const indexedItems = items.map((item) => ({
      ...item,
      fulltext: `${item.subject.toLocaleLowerCase()} ${item.senderName.toLocaleLowerCase()}`,
    }))
    setIndexedItems(indexedItems)
    setInboxItems(indexedItems)
  }, [res.data])

  useEffect(() => {
    setSearchLoading(false)
    const q = ui.query.toLocaleLowerCase().trim()
    if (q !== '') {
      setInboxItems(indexedItems.filter((item) => item.fulltext.includes(q)))
    } else {
      setInboxItems(indexedItems)
    }
  }, [ui.query])

  const keyExtractor = useCallback((item) => {
    return item.id
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: IDocument }) => <PressableListItem item={item} />,
    [],
  )

  const isSearch = ui.query.length > 0
  const isLoading = res.loading
  const isEmpty = (res?.data?.listDocuments ?? []).length === 0

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (!isLoading && isEmpty) {
    return (
      <EmptyList
        title="Hér eru engin skjöl sem stendur"
        description="Þegar þú færð send rafræn skjöl frá hinu opinbera þá birtast þau hér."
        image={<Image source={illustrationSrc} height={176} width={134} />}
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <BottomTabsIndicator index={0} total={3} />
      <Animated.FlatList
        ref={flatListRef}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        style={{ marginHorizontal: 0, flex: 1 }}
        data={inboxItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        keyboardDismissMode="on-drag"
        stickyHeaderIndices={isSearch ? [0] : undefined}
        ListHeaderComponent={
          isSearch ? (
            <SearchHeader count={inboxItems.length} loading={searchLoading} />
          ) : undefined
        }
        refreshControl={
          isSearch ? undefined : (
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                setLoading(true)
                try {
                  res
                    ?.refetch?.()
                    ?.then(() => {
                      setLoading(false)
                    })
                    .catch((err) => {
                      setLoading(false)
                    })
                } catch (err) {
                  // noop
                  setLoading(false)
                }
              }}
            />
          )
        }
      />
      <TopLine
        style={{
          height: StyleSheet.hairlineWidth,
          opacity: scrollY.interpolate({
            inputRange: [0, 32],
            outputRange: [0, 1],
          }),
        }}
      />
    </View>
  )
}

InboxScreen.options = getNavigationOptions
