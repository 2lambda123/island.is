import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import {
  Box,
  ToastContainer,
  Navigation,
  NavigationItem,
  Hidden,
  Button,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import {
  m,
  ServicePortalNavigationItem,
  ServicePortalPath,
  useScrollTopOnUpdate,
} from '@island.is/service-portal/core'
import { useLocation, matchPath } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import {
  GET_ORGANIZATIONS_QUERY,
  Organization,
  useAlertBanners,
} from '@island.is/service-portal/graphql'
import { useMeasure, useWindowSize } from 'react-use'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { useQuery } from '@apollo/client'
import SidebarLayout from './SidebarLayout'
import Sticky from '../Sticky/Sticky'
import { Link as ReactLink } from 'react-router-dom'
import Sidemenu from '../Sidemenu/Sidemenu'
import * as styles from './Layout.css'
import GoBack from '../GoBack/GoBack'
import { useDynamicRoutesWithNavigation } from '@island.is/service-portal/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { PortalNavigationItem } from '@island.is/portals/core'
import { theme } from '@island.is/island-ui/theme'

export const Layout: FC = ({ children }) => {
  useNamespaces(['service.portal', 'global'])
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const [isDashboard, setIsDashboard] = useState(true)
  const [isMailbox, setIsMailbox] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [currentOrganization, setCurrentOrganization] = useState<
    Organization | undefined
  >(undefined)
  const { data: orgData, loading } = useQuery(GET_ORGANIZATIONS_QUERY)
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const activeParent = navigation?.children?.find((item) => item.active)
  useScrollTopOnUpdate([pathname])
  const banners = useAlertBanners()
  const [ref, { height }] = useMeasure()
  const globalBanners = banners.filter((banner) =>
    banner.servicePortalPaths?.includes('*'),
  )
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const mapChildren = (item: ServicePortalNavigationItem): any => {
    if (item.children) {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: item.path && pathname.includes(item.path),
        items: item.children
          .filter((x) => !x.navHide)
          .map((child) => {
            return mapChildren(child)
          }),
        accordion: true,
      }
    } else {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: pathname === item.path,
      }
    }
  }

  const subNavItems: NavigationItem[] | undefined = activeParent?.children
    ?.filter((item) => !item.navHide)
    ?.map((item: ServicePortalNavigationItem) => {
      return mapChildren(item) as NavigationItem
    })

  useEffect(() => {
    if (
      pathname === ServicePortalPath.MinarSidurPath + '/' ||
      pathname === ServicePortalPath.MinarSidurRoot
    ) {
      setIsDashboard(true)
    } else {
      setIsDashboard(false)
    }
  }, [pathname])

  useEffect(() => {
    if (pathname === ServicePortalPath.ElectronicDocumentsRoot) {
      setIsMailbox(true)
    } else {
      setIsMailbox(false)
    }
  }, [pathname])

  useEffect(() => {
    const organizations = orgData?.getOrganizations?.items || {}
    const activeItem = activeParent?.children?.find(
      (item: PortalNavigationItem) => item.active,
    )

    if (organizations && !loading) {
      const org = organizations.find(
        (org: Organization) => org.id === activeItem?.serviceProvider,
      )
      if (org) setCurrentOrganization(org)
      else setCurrentOrganization(undefined)
    }
  }, [loading, pathname])

  return (
    <>
      <div className={sideMenuOpen ? styles.overlay : undefined}>
        <AuthOverlay />
        <ToastContainer useKeyframeStyles={false} />
        {globalBanners.length > 0 && (
          <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
        )}
        <Header
          setSideMenuOpen={(set: boolean) => setSideMenuOpen(set)}
          sideMenuOpen={sideMenuOpen}
          position={height ? height : 0}
        />

        {!isDashboard && !isMailbox && activeParent && (
          <SidebarLayout
            isSticky={true}
            sidebarContent={
              <Sticky>
                <Box style={{ marginTop: height }}>
                  <GoBack />
                  <Box marginBottom={3}>
                    {currentOrganization && (
                      <InstitutionPanel
                        loading={loading}
                        institution={currentOrganization?.title ?? ''}
                        institutionTitle={formatMessage(m.serviceProvider)}
                        locale="is"
                        linkHref={currentOrganization?.link ?? ''}
                        img={currentOrganization?.logo?.url ?? ''}
                        imgContainerDisplay="block"
                        size="small"
                      />
                    )}
                  </Box>
                  {subNavItems && subNavItems.length > 0 && (
                    <Box background="blue100">
                      <Navigation
                        renderLink={(link, item) => {
                          return item?.href ? (
                            <ReactLink to={item?.href}>{link}</ReactLink>
                          ) : (
                            link
                          )
                        }}
                        baseId={'service-portal-navigation'}
                        title={formatMessage(
                          activeParent.name ?? m.tableOfContents,
                        )}
                        items={subNavItems ?? []}
                        expand
                      />
                    </Box>
                  )}
                </Box>
              </Sticky>
            }
          >
            <Box as="main" component="main" style={{ marginTop: height }}>
              <ContentBreadcrumbs
                tag={
                  currentOrganization && {
                    variant: 'purple',
                    href: currentOrganization?.link ?? '',
                    children: currentOrganization?.title ?? '',
                    active: currentOrganization?.link ? true : false,
                  }
                }
              />

              {children}
            </Box>
          </SidebarLayout>
        )}

        {(isDashboard || isMailbox || !activeParent) && (
          <Box as="main" component="main" style={{ marginTop: height }}>
            {!isMailbox && !activeParent && <ContentBreadcrumbs />}
            {children}
          </Box>
        )}
      </div>

      <Sidemenu
        position={height}
        setSideMenuOpen={(set: boolean) => setSideMenuOpen(set)}
        sideMenuOpen={sideMenuOpen}
      />
      {isMobile && subNavItems && subNavItems.length > 0 && (
        <Box paddingTop={3} position="fixed" bottom={0} width="full">
          <Navigation
            renderLink={(link, item) => {
              return item?.href ? (
                <ReactLink to={item?.href}>{link}</ReactLink>
              ) : (
                link
              )
            }}
            baseId={'service-portal-mobile-navigation'}
            title={
              activeParent?.name
                ? formatMessage(activeParent?.name)
                : formatMessage(m.tableOfContents)
            }
            items={subNavItems}
            isMenuDialog={true}
            upwards
          />
        </Box>
      )}
    </>
  )
}
