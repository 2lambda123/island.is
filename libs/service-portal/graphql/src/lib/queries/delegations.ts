import gql from 'graphql-tag'
import { authCustomDelegationFragment } from '../fragments/customDelegation'

export const AUTH_DELEGATION_QUERY = gql`
  query AuthDelegation($input: AuthDelegationInput!) {
    authDelegation(input: $input) {
      id
      type
      to {
        nationalId
        name
      }
      from {
        nationalId
      }
      ... on AuthCustomDelegation {
        ...AuthCustomDelegationFragment
      }
    }
  }
  ${authCustomDelegationFragment}
`

export const AUTH_DELEGATIONS_QUERY = gql`
  query AuthDelegations($input: AuthDelegationsInput!) {
    authDelegations(input: $input) {
      id
      type
      to {
        nationalId
        name
      }
      ... on AuthCustomDelegation {
        ...AuthCustomDelegationFragment
      }
    }
  }
  ${authCustomDelegationFragment}
`
