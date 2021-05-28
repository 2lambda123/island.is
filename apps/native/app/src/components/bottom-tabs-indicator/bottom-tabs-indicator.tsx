import { dynamicColor } from '@island.is/island-ui-native'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Animated, SafeAreaView, useWindowDimensions, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { useUiStore } from '../../stores/ui-store'

const Host = styled.View`
  position: absolute;
  bottom: -29px;
  left: 0px;
  right: 0px;
  height: 30px;
  z-index: 1000;
  background-color: ${dynamicColor('background')};
`;

const Active = styled(Animated.View)`
  background-color: ${props => props.theme.color.blue400};
`;

export function BottomTabsIndicator({
  index,
  total,
}: {
  index: number
  total: number
}) {
  const theme = useTheme()
  const win = useWindowDimensions()
  const { selectedTab, unselectedTab } = useUiStore()
  const [width, setWidth] = useState(win.width)

  const p = 1.0
  const h = (1.0 - p) / 2
  const av = useRef(new Animated.Value(index)).current
  const tabWidth = width / total
  const anim = useRef<Animated.CompositeAnimation>()

  useEffect(() => {
    if (anim.current) {
      anim.current.stop()
    }
    av.setValue(unselectedTab)
    anim.current = Animated.spring(av, {
      overshootClamping: true,
      toValue: selectedTab,
      useNativeDriver: true,
    })
    anim.current.start()
  }, [selectedTab, unselectedTab])

  return (
    <Host style={{
      shadowColor: theme.color.blue400,
      shadowOffset: {
        width: 0,
        height: -26,
      },
      shadowOpacity: 0.08,
      shadowRadius: 30.0,
    }}>
      <SafeAreaView>
        <View
          onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width)
          }}
        >
          <Active
            style={{
              width: tabWidth * p,
              height: 1,
              transform: [
                {
                  translateX: av.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [
                      0,
                      tabWidth * 4 * h + tabWidth * p,
                      tabWidth * 8 * h + tabWidth * p * 2,
                    ],
                  }),
                },
              ],
            }}
          />
        </View>
      </SafeAreaView>
    </Host>
  )
}
