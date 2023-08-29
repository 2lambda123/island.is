import { NationalRegistryIndividual } from './individual'

export interface ApplicantChildCustodyInformation {
  nationalId: string
  givenName?: string | null
  familyName?: string | null
  fullName: string
  genderCode: string
  livesWithApplicant: boolean
  livesWithBothParents: boolean
  otherParent?: NationalRegistryIndividual | null
}
