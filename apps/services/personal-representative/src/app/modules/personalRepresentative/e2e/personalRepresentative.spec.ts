import { setupWithAuth, setupWithoutAuth } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeDTO,
  PersonalRepresentativeRightType,
  PersonalRepresentativeType,
  PersonalRepresentativeCreateDTO,
} from '@island.is/auth-api-lib/personal-representative'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.writePersonalRepresentative],
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
  contractId: '12345',
  externalUserId: 'adUserFromContractSystem',
  nationalIdPersonalRepresentative: '1234567890',
  nationalIdRepresentedPerson: '1234567891',
  rightCodes: [],
}

describe('PersonalRepresentativeController - Without Auth', () => {
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

  it('POST /v1/personal-representative should fail and return 403 error if bearer is missing', async () => {
    const response = await server
      .post('/v1/personal-representative')
      .send(simpleRequestData)
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
})

describe('PersonalRepresentativeController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let prRightTypeModel: typeof PersonalRepresentativeRightType
  let prTypeModel: typeof PersonalRepresentativeType
  let prModel: typeof PersonalRepresentative
  let prPermissionsModel: typeof PersonalRepresentativeRight

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
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

  afterAll(async () => {
    await app.cleanUp()
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
    await prRightTypeModel.destroy({
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
  })

  describe('Create', () => {
    it('POST /v1/personal-representative should return error when data is invalid', async () => {
      const requestData = {
        code: 'Code',
        description: 'Description',
        validFrom: '10-11-2021',
      }
      const response = await server
        .post('/v1/personal-representative')
        .send(requestData)
        .expect(400)
      expect(response.body).toMatchObject({
        ...errorExpectedStructure,
        statusCode: 400,
      })
    })

    it('POST /v1/personal-representative should create a new entry', async () => {
      // Create personal representastive type
      await prTypeModel.create(personalRepresentativeType)
      // Create right types
      await prRightTypeModel.bulkCreate(rightTypeList)

      // Test creating personal rep
      const requestData = {
        ...simpleRequestData,
        rightCodes: rightTypeList.map((rt) => rt.code),
        personalRepresentativeTypeCode: personalRepresentativeType.code,
      }

      const response = await server
        .post('/v1/personal-representative')
        .send(requestData)
        .expect(201)

      console.log(requestData)
      console.log(response.body)

      expect(convertDtoToCreateDto(response.body)).toMatchObject(requestData)
    })
  })

  describe('Delete', () => {
    it('DELETE /v1/personal-representative should delete personal rep', async () => {
      // Create personal representastive type
      await prTypeModel.create(personalRepresentativeType)
      // Create right types
      await prRightTypeModel.bulkCreate(rightTypeList)

      // Creating personal rep
      const personalRep = await setupBasePersonalRep({
        ...simpleRequestData,
        rightCodes: rightTypeList.map((rt) => rt.code),
        personalRepresentativeTypeCode: personalRepresentativeType.code,
      })
      // Test delete personal rep
      await server
        .delete(`/v1/personal-representative/${personalRep.id}`)
        .expect(200)
    })
  })

  describe('Get', () => {
    it('Get v1/personal-representative/all should get personal rep', async () => {
      // Create personal representastive type
      await prTypeModel.create(personalRepresentativeType)
      // Create right types
      await prRightTypeModel.bulkCreate(rightTypeList)

      // Creating personal rep
      const personalRep = await setupBasePersonalRep({
        ...simpleRequestData,
        rightCodes: rightTypeList.map((rt) => rt.code),
        personalRepresentativeTypeCode: personalRepresentativeType.code,
      })

      // Test get personal rep
      const response = await server
        .get(`/v1/personal-representative/all/`)
        .expect(200)

      const responseData: PersonalRepresentativeDTO[] = response.body
      expect(responseData[0]).toMatchObject(personalRep)
    })
  })

  async function setupBasePersonalRep(
    data: PersonalRepresentativeCreateDTO,
  ): Promise<PersonalRepresentativeCreateDTO> {
    const responseCreate = await server
      .post('/v1/personal-representative')
      .send(data)
    return responseCreate.body
  }

  function convertDtoToCreateDto(
    data: PersonalRepresentativeDTO,
  ): PersonalRepresentativeCreateDTO {
    return {
      id: data.id,
      externalUserId: data.externalUserId,
      contractId: data.contractId,
      personalRepresentativeTypeCode: data.personalRepresentativeTypeCode,
      nationalIdPersonalRepresentative: data.nationalIdPersonalRepresentative,
      nationalIdRepresentedPerson: data.nationalIdRepresentedPerson,
      validTo: data.validTo,
      rightCodes: data.rights.map((r) => r.code),
    }
  }
})
