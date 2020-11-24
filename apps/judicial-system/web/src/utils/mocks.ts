import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseGender,
  CaseState,
  UpdateCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { CaseQuery, UpdateCaseMutation } from '../graphql'
import { UserQuery } from '../shared-components/UserProvider/UserProvider'

export const mockProsecutor = {
  role: UserRole.PROSECUTOR,
  name: 'Batman Robinson',
  title: 'saksóknari',
} as User

export const mockJudge = {
  role: UserRole.JUDGE,
  name: 'Wonder Woman',
  title: 'héraðsdómari',
} as User

const testCase1 = {
  id: 'test_id',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  state: 'DRAFT',
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-16T19:51:00.000Z',
  requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
  lawsBroken: 'string',
  custodyProvisions: [
    CaseCustodyProvisions._95_1_A,
    CaseCustodyProvisions._95_1_C,
  ],
  requestedCustodyRestrictions: ['ISOLATION', 'MEDIA'],
  caseFacts: 'string',
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: 'string',
  comments: 'string',
  prosecutor: null,
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: null,
  courtAttendees: null,
  policeDemands: null,
  accusedPlea: null,
  litigationPresentations: null,
  ruling:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Prioris generis est docilitas, memoria; Quod quidem nobis non saepe contingit. Quae qui non vident, nihil umquam magnum ac cognitione dignum amaverunt. Quasi vero, inquit, perpetua oratio rhetorum solum, non etiam philosophorum sit. Duo Reges: constructio interrete. Non est ista, inquam, Piso, magna dissensio. Quantum Aristoxeni ingenium consumptum videmus in musicis? ',
  rejecting: null,
  custodyEndDate: '2020-09-16T19:50:08.033Z',
  custodyRestrictions: null,
  accusedAppealDecision: CaseAppealDecision.APPEAL,
  accusedAppealAnnouncement: 'accusedAppealAnnouncement test',
  prosecutorAppealDecision: CaseAppealDecision.APPEAL,
  prosecutorAppealAnnouncement: 'prosecutorAppealAnnouncement test',
  judge: null,
}

const testCase2 = {
  id: 'test_id_2',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  state: CaseState.SUBMITTED,
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-12T14:51:00.000Z',
  requestedCustodyEndDate: '2020-09-16',
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: {
    name: 'Ruth Bader Ginsburg',
    title: 'saksóknari',
  },
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: null,
  courtAttendees: null,
  policeDemands: null,
  accusedPlea: null,
  litigationPresentations: null,
  ruling: null,
  rejecting: null,
  custodyEndDate: '2020-10-24',
  custodyRestrictions: null,
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  defenderName: 'Saul Goodman',
  defenderEmail: 'saul@goodman.com',
  requestedDefenderName: 'Saul Goodman',
  requestedDefenderEmail: 'saul@goodman.com',
}

const testCase3 = {
  id: 'test_id_3',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  state: 'DRAFT',
  policeCaseNumber: '010-0000-0191',
  accusedNationalId: '1111110000',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-16T19:51:00.000Z',
  requestedCustodyEndDate: null,
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [CaseCustodyRestrictions.MEDIA],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: null,
  courtCaseNumber: null,
  courtDate: '2020-09-16T19:51:00.000Z',
  courtStartTime: null,
  courtEndTime: null,
  courtAttendees: null,
  policeDemands: null,
  accusedPlea: null,
  litigationPresentations: null,
  ruling: null,
  rejecting: null,
  custodyEndDate: '2020-10-24',
  custodyRestrictions: null,
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  defenderName: '',
  defenderEmail: '',
  requestedDefenderName: 'Saul Goodman',
  requestedDefenderEmail: 'saul@goodman.com',
}

export const mockJudgeQuery = [
  {
    request: {
      query: UserQuery,
    },
    result: {
      data: {
        user: mockJudge,
      },
    },
  },
]

export const mockProsecutorQuery = [
  {
    request: {
      query: UserQuery,
    },
    result: {
      data: {
        user: mockProsecutor,
      },
    },
  },
]

export const mockCaseQueries = [
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id' } },
    },
    result: {
      data: {
        case: testCase1,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_2' } },
    },
    result: {
      data: {
        case: testCase2,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_3' } },
    },
    result: {
      data: {
        case: testCase3,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: undefined } },
    },
    result: {
      error: {},
    },
  },
]

export const mockUpdateCaseMutation = (updateCases: UpdateCase[]) =>
  updateCases.map((updateCase) => {
    return {
      request: {
        query: UpdateCaseMutation,
        variables: { input: { id: 'test_id_2', ...updateCase } },
      },
      result: {
        data: {
          case: testCase2,
        },
      },
    }
  })
