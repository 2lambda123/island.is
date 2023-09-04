import React from 'react';
import {
  ImageSourcePropType,
  Platform,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import closeIcon from '../../assets/icons/close.png';
import {dynamicColor} from '../../utils/dynamic-color';
import {font} from '../../utils/font';

const Header = styled.View`
  padding-top: 20px;
  padding-bottom: ${({theme}) => theme.spacing[1]}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderTitle = styled.Text`
  margin-top: 32px;
  ${font({
    fontWeight: '600',
    fontSize: 26,
    lineHeight: 32,
    color: 'foreground',
  })}
`;

const Handle = styled.View`
  position: absolute;
  width: 120px;
  height: ${({theme}) => theme.spacing.smallGutter}px;
  border-radius: ${({theme}) => theme.spacing.smallGutter}px;
  background-color: ${dynamicColor('shade300')};
  top: 5px;
  left: 50%;
  margin-left: -60px;
  opacity: 1;
`;

const CloseButton = styled.TouchableOpacity`
  width: ${({theme}) => theme.spacing[3]}px;
  height: ${({theme}) => theme.spacing[3]}px;
  border-radius: ${({theme}) => theme.spacing[2]}px;
  background-color: ${dynamicColor(props => ({
    dark: props.theme.color.dark400,
    light: props.theme.color.blue100,
  }))};
  align-items: center;
  justify-content: center;
`;

const CloseIcon = styled.Image`
  width: ${({theme}) => theme.spacing[2]}px;
  height: ${({theme}) => theme.spacing[2]}px;
`;

export function NavigationBarSheet({
  title,
  componentId,
  onClosePress,
  style,
}: {
  title: string;
  componentId: string;
  onClosePress(): void;
  style?: any;
}) {
  const wd = useWindowDimensions();
  const theme = useTheme();
  const isLandscape = wd.width > wd.height;
  const isHandle = Platform.OS === 'ios' && !Platform.isPad && !isLandscape;

  // @todo use a store to register if a modal is beeing shown.
  // then do the same isHandle check there to toggle status-bar color

  return (
    <>
      {isHandle && <Handle />}
      <SafeAreaView>
        <Header style={style}>
          <HeaderTitle>{title}</HeaderTitle>
          <CloseButton
            onPress={onClosePress}
            testID="NAVBAR_SHEET_CLOSE_BUTTON"
            accessibilityLabel="Close"
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}>
            <CloseIcon
              style={{
                tintColor: theme.color.blue400,
              }}
              source={closeIcon as ImageSourcePropType}
            />
          </CloseButton>
        </Header>
      </SafeAreaView>
    </>
  );
}
