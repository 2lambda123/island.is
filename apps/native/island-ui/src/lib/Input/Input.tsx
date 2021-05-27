import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'
import { Skeleton } from '../Skeleton/Skeleton'

const Host = styled.SafeAreaView`
  flex: 1;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${({ theme }) =>
    theme.isDark ? theme.shade.shade200 : theme.color.blue100};
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const Content = styled.View`
  padding-top: ${({ theme }) => theme.spacing[3]}px;
  padding-bottom: ${({ theme }) => theme.spacing[3]}px;
`

const Label = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontSize: 13,
    lineHeight: 17,
  })}
`

const Value = styled.Text`
  ${font({
    fontWeight: '600',
  })}
`

interface InputProps {
  label: string
  value?: string
  loading?: boolean
  error?: boolean
  valueTestID?: string
}

export function Input({
  label,
  value,
  loading,
  error,
  valueTestID,
}: InputProps) {
  return (
    <Host>
      <Content>
        <Label>{label}</Label>
        {loading || error ? (
          <Skeleton active={loading} error={error} />
        ) : (
          <Value testID={valueTestID}>{value ?? ''}</Value>
        )}
      </Content>
    </Host>
  )
}
