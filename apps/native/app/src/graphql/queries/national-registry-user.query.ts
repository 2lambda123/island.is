import { gql } from '@apollo/client';

export const NATION_REGISTRY_USER_QUERY = gql`
  query {
    nationalRegistryUser {
      nationalId
      fullName
      gender
      legalResidence
      birthday
      birthPlace
      religion
      maritalStatus
      age
      address {
        code
      }
    }
  }
`;
