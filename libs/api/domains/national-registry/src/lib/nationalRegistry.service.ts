import { Inject, Injectable} from '@nestjs/common'
import { SoffiaService } from './v1/soffia.service'
import { BrokerService } from './v3/broker.service'
import { SharedPerson } from './shared/types'
import { Birthplace, Citizenship, Spouse, Housing } from './shared/models'
import { LOGGER_PROVIDER, type Logger  } from '@island.is/logging'
import { Name } from './shared/models/name.model'

@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly v1: SoffiaService,
    private readonly v3: BrokerService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getPerson(nationalId: string, api: 'v1' | 'v3') {
    return api === 'v3'
      ? await this.v3.getPerson(nationalId)
      : await this.v1.getPerson(nationalId)
  }

  async getChildCustody(nationalId: string, data?: SharedPerson) {
    return data?.api === 'v3' ?
      this.v3.getChildrenCustodyInformation(
        nationalId,
        data?.rawData,
      ) :
      this.v1.getChildCustody(
        nationalId,
        data?.rawData,
      )
  }

  async getCustodians(nationalId: string, data?: SharedPerson, userNationalId?: string) {
    return data?.api === 'v3' ?
      this.v3.getCustodians(
        nationalId,
        data?.rawData,
      ) :
      this.v1.getChildCustody(
        userNationalId,
        data?.rawData,
      )
  }

  async getParents(nationalId: string, data?: SharedPerson, userNationalId?: string) {
    return data?.api === 'v3' ?
      this.v3.getParents(
        nationalId,
        data?.rawData,
      ) :
      this.v1.getParents(
        userNationalId,
        data?.rawData,
      )
  }

  async getBirthplace(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Birthplace | null> {
    return data?.api === 'v3' ?
      this.v3.getBirthplace(
        nationalId,
        data?.rawData,
      ) :
      this.v1.getBirthplace(
        nationalId,
        data?.rawData,
      )
  }

  async getCitizenship(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Citizenship | null> {
    return data?.api === 'v3' ?
      this.v3.getCitizenship(
        nationalId,
        data?.rawData,
      ) :
      this.v1.getCitizenship(
        nationalId,
        data?.rawData,
      )
  }

  async getHousing(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Housing | null> {
    if (data?.api === 'v1') {
      if (!data.rawData || !data.rawData.Fjolsknr) {
        return null
      }
      const family = await this.v1.getFamily(nationalId)
      return {
        domicileId: data.rawData.Fjolsknr,
        address: {
          code: data.rawData.LoghHusk,
          lastUpdated: data.rawData.LoghHuskBreytt,
          streetAddress: data.rawData.Logheimili,
          city: data.rawData.LogheimiliSveitarfelag,
          postalCode: data.rawData.Postnr,
        },
        domicileInhabitants: family
      }
    }
    return await this.v3.getHousing(nationalId, data?.rawData)
  }

  async getName(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Name | null> {
    return data?.api === 'v3' ?
      this.v3.getName(
        nationalId,
        data?.rawData,
      ) :
      this.v1.getName(
        nationalId,
        data?.rawData,
      )
  }

  async getSpouse(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Spouse | null> {
    return data?.api === 'v3' ?
      this.v3.getSpouse(
        nationalId,
        data?.rawData,
      ) :
      this.v1.getSpouse(
        nationalId,
        data?.rawData,
      )
  }
}
