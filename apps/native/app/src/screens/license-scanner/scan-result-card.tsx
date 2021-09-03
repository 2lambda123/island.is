import { font, Skeleton } from '@island.is/island-ui-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import agencyLogo from '../../assets/temp/agency-logo.png'

import danger from '../../../../island-ui/src/assets/card/danger.png'
import success from '../../../../island-ui/src/assets/card/is-verified.png'
import backgroundPink from '../../../../island-ui/src/assets/card/okuskirteini.png'
import backgroundBlue from '../../../../island-ui/src/assets/card/skotvopnaleyfi.png'
import { useIntl } from 'react-intl'

const Host = styled.View`
  border-radius: 16px;
  margin-bottom: 32px;
  overflow: hidden;
`

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 24px;
`

const Subtitle = styled.View`
  flex-direction: row;
  align-items: center;
`

const SubtitleIcon = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  overflow: hidden;
  margin-left: -3px;
`

const SubtitleImage = styled.Image`
  margin-top: -2px;
`

const SubtitleText = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: '#000',
  })}
`

const Detail = styled.View`
  flex: 1;
`

const Title = styled.Text`
  margin-bottom: 4px;

  ${font({
    fontWeight: '600',
    color: '#000',
  })}
`

const Logo = styled.Image`
  width: 62px;
  height: 62px;
  margin-top: -8px;
`

const Content = styled.View`
  flex-direction: row;
  padding: 16px 24px;
  padding-top: 0px;
`

const Label = styled.Text`
  ${font({
    fontSize: 12,
    color: '#8D6679',
  })}
  margin-bottom: 8px;
`

const Value = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: '#000',
  })}
`

const LabelGroup = styled.View`
  margin-bottom: 16px;
`

const Photo = styled.Image`
  width: 79px;
  height: 109px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
`

const Left = styled.View`
  flex-direction: column;
  margin-right: 16px;
  flex: 1;
`

const Placeholder = styled.View`
  background-color: white;
  border-radius: 4px;
  opacity: 0.2;
  height: 16px;
`

const Background = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #e2c4d1;
  border-radius: 16px;
`

interface ScanResultCardProps {
  loading: boolean
  error?: boolean
  errorMessage?: string
  birthDate?: Date;
  name?: string
  licenseNumber?: string
  photo?: string
  backgroundColor?: 'pink' | 'blue'
}

export function ScanResultCard(props: ScanResultCardProps) {
  const {
    error,
    errorMessage,
    loading,
    birthDate,
    name,
    photo,
    backgroundColor = 'pink',
  } = props
  const intl = useIntl()
  const background =
    backgroundColor === 'pink' ? backgroundPink : backgroundBlue
  return (
    <Host>
      <Background source={background} resizeMode="stretch" />
      <Header>
        <Detail>
          <Title>
            {intl.formatMessage({ id: 'licenseScannerResult.title' })}
          </Title>
          <Subtitle>
            <SubtitleIcon>
              {loading ? (
                <ActivityIndicator
                  color="#000"
                  animating
                  size="small"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
              ) : error ? (
                <SubtitleImage source={danger} />
              ) : (
                <SubtitleImage source={success} />
              )}
            </SubtitleIcon>
            <SubtitleText>
              {loading
                ? intl.formatMessage({ id: 'licenseScannerResult.loading' })
                : error
                ? intl.formatMessage({ id: 'licenseScannerResult.error' })
                : intl.formatMessage({ id: 'licenseScannerResult.valid' })}
            </SubtitleText>
          </Subtitle>
        </Detail>
        <Logo source={agencyLogo} />
      </Header>
      {error ? (
        <Content>
          <Left>
            <LabelGroup>
              <Label>
                {intl.formatMessage({
                  id: 'licenseScannerResult.errorMessage',
                })}
              </Label>
              <Value>{errorMessage}</Value>
            </LabelGroup>
          </Left>
        </Content>
      ) : (
        <Content>
          <Left>
            <LabelGroup>
              <Label>
                {intl.formatMessage({ id: 'licenseScannerResult.name' })}
              </Label>
              {loading ? (
                <Placeholder style={{ width: 120 }} />
              ) : (
                <Value>{name}</Value>
              )}
            </LabelGroup>
            <LabelGroup>
              <Label>
                {intl.formatMessage({ id: 'licenseScannerResult.birthDate' })}
              </Label>
              {loading ? (
                <Placeholder style={{ width: 120 }} />
              ) : (
                <Value>
                  {birthDate ? intl.formatDate(birthDate, {}) : `---`}
                </Value>
              )}
            </LabelGroup>
          </Left>
          {photo && (
            <Photo source={{ uri: `data:image/png;base64,${photo}` }} />
          )}
        </Content>
      )}
    </Host>
  )
}
