import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import chevronForward  from '../../assets/icons/chevron-forward.png'
import { Avatar } from '../avatar/avatar'

const Host = styled.View`
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing[3]}px;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
  align-items: center;
  justify-content: space-between;
`

const Content = styled.View`
  flex: 1;
`;

const ImageWrap = styled.View`
  margin-right: ${({ theme }) => theme.spacing[3]}px;
`;

const Title = styled.Text`
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontWeight: '600',
    lineHeight: 24,
    fontSize: 18,
  })}
`

const Text = styled.Text`
  padding-right: ${({ theme }) => theme.spacing[2]}px;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
    fontSize: 16,
  })}
`

const Icon = styled.View`
  margin-left: auto;
`;

interface FamilyMemberCardProps {
  name: string
  nationalId: string
 }

export function FamilyMemberCard({ name, nationalId }: FamilyMemberCardProps) {
  return null;
  return (
    <Host>
      {/* <ImageWrap>
        <Avatar name={name} isSmall />
      </ImageWrap>
      <Content>
        <Title>{name}</Title>
        <Text>{nationalId}</Text>
      </Content>
      <Icon><Image source={chevronForward} height={24} width={24} /></Icon> */}
    </Host>
  )
}
