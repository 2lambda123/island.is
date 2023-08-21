import {
  GridColumn,
  GridRow,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { IntroHeaderProps } from '@island.is/portals/core'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import React, { useEffect, useState } from 'react'
import {
  Organization,
  useOrganizations,
} from '@island.is/service-portal/graphql'
import { useLocation } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  serviceProviderID?: string
  serviceProviderTooltip?: string
  narrow?: boolean
}
export const IntroHeader = (props: IntroHeaderProps & Props) => {
  const { marginBottom } = props
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const [currentOrganization, setCurrentOrganization] = useState<
    Organization | undefined
  >(undefined)
  const { pathname } = useLocation()
  const { data: organizations, loading } = useOrganizations()

  useEffect(() => {
    if (organizations && Array.isArray(organizations) && !loading) {
      const org = organizations?.find(
        (org: Organization) => org.id === props.serviceProviderID,
      )
      if (org) setCurrentOrganization(org)
      else setCurrentOrganization(undefined)
    }
  }, [loading, pathname])

  return (
    <GridRow marginBottom={marginBottom}>
      <GridColumn span={isMobile ? '8/8' : props.narrow ? '4/8' : '5/8'}>
        <Text variant="h3" as="h1">
          {formatMessage(props.title)}
        </Text>
        {props.intro && (
          <Text variant="default" paddingTop={1}>
            {formatMessage(props.intro)}
          </Text>
        )}
        {props.children}
      </GridColumn>
      {!isMobile && currentOrganization && (
        <GridColumn span={'2/8'} offset={'1/8'}>
          <InstitutionPanel
            loading={loading}
            linkHref={currentOrganization?.link ?? ''}
            img={currentOrganization?.logo?.url ?? ''}
            imgContainerDisplay="block"
            tooltipText={props.serviceProviderTooltip}
            backgroundColor="white"
          />
        </GridColumn>
      )}
    </GridRow>
  )
}

export default IntroHeader
