import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { IdentityApi } from '@island.is/application/types'

const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: SAMGONGUSTOFA_NATIONAL_ID,
  },
  externalDataId: 'payment',
})

export const MyPlateOwnershipsApi = defineTemplateApi({
  action: 'getMyPlateOwnershipList',
  externalDataId: 'myPlateOwnershipList',
})