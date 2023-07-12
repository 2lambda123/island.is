import {
  FirearmPropertyList,
  LicenseInfo,
} from '@island.is/clients/firearm-license'

export interface FirearmLicenseDto {
  licenseInfo: LicenseInfo | null
  properties: FirearmPropertyList | null
  categories: { [key: string]: string } | null
}
