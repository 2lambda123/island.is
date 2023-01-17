import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { LicensePaths } from './paths'

export const licenseNavigation: PortalNavigationItem = {
  name: m.licenses,
  path: LicensePaths.LicensesRoot,
  icon: {
    icon: 'wallet',
  },
  children: [
    {
      name: m.myLicenses,
      path: LicensePaths.LicensesRoot,
    },
    {
      navHide: true,
      name: m.detailInfo,
      path: LicensePaths.LicensesDetail,
    },
    {
      navHide: true,
      name: m.passport,
      path: LicensePaths.LicensesPassportDetail,
      serviceProvider: 'i5go5A4ikV8muPfvr9o2v',
      activeIfExact: false,
    },
  ],
  description: m.licensesDescription,
}
