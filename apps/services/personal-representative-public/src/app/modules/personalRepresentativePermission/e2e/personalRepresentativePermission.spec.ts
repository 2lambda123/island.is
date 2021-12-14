import { setupWithAuth, setupWithoutAuth } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import {
  PersonalRepresentative,
  PersonalRepresentativeDTO,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeType,
  PersonalRepresentativeAccessDTO,
  PersonalRepresentativeCreateDTO,
} from '@island.is/auth-api-lib/personal-representative'
import { PersonalRepresentativeRightTypeService } from '@island.is/auth-api-lib/personal-representative'
import { PersonalRepresentativeService } from '@island.is/auth-api-lib/personal-representative'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { PersonalRepresentativePublicDTO } from '../dto/personalRepresentativePublicDTO.dto'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.readPersonalRepresentative],
})

const rightTypeList = [
  { code: 'code1', description: 'code1 description' },
  { code: 'code2', description: 'code2 description' },
]

const personalRepresentativeType = {
  code: 'prTypeCode',
  name: 'prTypeName',
  description: 'prTypeDescription',
}

const simpleRequestData: PersonalRepresentativeCreateDTO = {
  contractId: '123456',
  nationalIdPersonalRepresentative: '1234567890',
  nationalIdRepresentedPerson: '1234567891',
  externalUserId: 'adUserFromContractSystem',
  rightCodes: [],
}

describe('PersonalRepresentativePermissionController - Without Auth', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithoutAuth()
    server = request(app.getHttpServer())
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('Get v1/personal-representative-permission/{nationalId} should fail and return 403 error if bearer is missing', async () => {
    // Test get personal rep
    const response = await server
      .get(
        `/v1/personal-representative-permission/${simpleRequestData.nationalIdPersonalRepresentative}/`,
      )
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
})

describe('PersonalRepresentativePermissionController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let rightService: PersonalRepresentativeRightTypeService
  let prService: PersonalRepresentativeService
  let prTypeModel: typeof PersonalRepresentativeType
  let prRightTypeModel: typeof PersonalRepresentativeRightType
  let prModel: typeof PersonalRepresentative
  let prPermissionsModel: typeof PersonalRepresentativeRight
  let personalRep: PersonalRepresentativeDTO | null

  beforeAll(async () => {
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
    rightService = app.get<PersonalRepresentativeRightTypeService>(
      PersonalRepresentativeRightTypeService,
    )
    prService = app.get<PersonalRepresentativeService>(
      PersonalRepresentativeService,
    )
    // Get reference on rightType models to seed DB
    prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
      'PersonalRepresentativeRightTypeRepository',
    )
    // Get reference on rightType models to seed DB
    prTypeModel = app.get<typeof PersonalRepresentativeType>(
      'PersonalRepresentativeTypeRepository',
    )
    // Get reference on personal representative models to seed DB
    prModel = app.get<typeof PersonalRepresentative>(
      'PersonalRepresentativeRepository',
    )
    // Get reference on personal representative right models to seed DB
    prPermissionsModel = app.get<typeof PersonalRepresentativeRight>(
      'PersonalRepresentativeRightRepository',
    )
  })

  beforeEach(async () => {
    await prPermissionsModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await prModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await prTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await prRightTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    // Create personal representastive type
    await prTypeModel.create(personalRepresentativeType)
    // Create right types
    for (const rightType of rightTypeList) {
      await rightService.createAsync({
        code: rightType.code,
        description: rightType.description,
      })
    }
    // Creating personal rep
    personalRep = await prService.createAsync({
      ...simpleRequestData,
      rightCodes: rightTypeList.map((rt) => rt.code),
      personalRepresentativeTypeCode: personalRepresentativeType.code,
    })
    console.log(personalRep)
  })

  describe('Get', () => {
    it('Get v1/personal-representative-permission/{nationalId} should get personal rep connections', async () => {
      // Test get personal rep
      const response = await server
        .get(
          `/v1/personal-representative-permission/${simpleRequestData.nationalIdPersonalRepresentative}/`,
        )
        .expect(200)

      const responseData: PersonalRepresentativePublicDTO[] = response.body
      if (personalRep) {
        const personalRepPublic = new PersonalRepresentativePublicDTO().fromDTO(
          personalRep,
        )
        console.log(responseData[0])
        expect(responseData[0]).toMatchObject(personalRepPublic)
      } else {
        expect('Failed to create personal rep').toMatch('0')
      }
    })
  })
  describe('Post', () => {
    it('Post v1/personal-representative-permission/loc-access should create access log', async () => {
      const simpleAccessData: PersonalRepresentativeAccessDTO = {
        nationalIdPersonalRepresentative: '1234567890',
        nationalIdRepresentedPerson: '1234567891',
      }
      // Test get personal rep
      const response = await server
        .post('/v1/personal-representative-permission/log-access')
        .send(simpleAccessData)
        .expect(201)
      expect(response.body).toMatchObject(simpleAccessData)
    })
  })
})
