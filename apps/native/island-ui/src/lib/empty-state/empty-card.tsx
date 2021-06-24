import React from 'react'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  display: flex;
  flex-direction: row;
  padding: 20px 70px 20px 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.color.dark400
  }))};
  background-color: ${dynamicColor(({ theme }) => ({
    light: 'transparent',
    dark: theme.color.dark400
  }))};
  align-items: center;
  justify-content: space-between;
`

const Text = styled.Text`
  padding-right: 30px;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
`

const Img = styled.View``

interface EmptyCardProps {
  text: string
  image: React.ReactNode
}

export function EmptyCard({ text, image }: EmptyCardProps) {
  return (
    <Host>
      <Text>{text}</Text>
      <Img>{image}</Img>
    </Host>
  )
}
