import { Injectable } from '@nestjs/common'
import {
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
} from '@island.is/clients/intellectual-property'
import { TrademarkCollectionEntry } from './models/getTrademarkCollection.model'
import type { User } from '@island.is/auth-nest-tools'
import { DesignCollectionEntry } from './models/getDesignCollection.model'
import { PatentCollectionEntry } from './models/getPatentCollection.model'
import { Patent } from './models/getPatent.model'
import { Trademark, TrademarkSubType } from './models/getTrademark.model'
import { Design } from './models/getDesign.model'
import { IntellectualProperties } from './models/getIntellectualProperties.model'
import addMonths from 'date-fns/addMonths'

@Injectable()
export class IntellectualPropertyService {
  constructor(
    private readonly trademarksApi: TrademarksApi,
    private readonly patentSearchApi: PatentSearchApi,
    private readonly designSearchApi: DesignSearchApi,
  ) {}

  async getIntellectualProperties(
    user: User,
  ): Promise<IntellectualProperties | null> {
    const data = await Promise.all([
      this.getPatents(user),
      this.getTrademarks(user),
      this.getDesigns(user),
    ])

    if (data.every((d) => !d)) {
      return null
    }

    return {
      patents: data[0],
      trademarks: data[1],
      designs: data[2],
    }
  }

  async getTrademarks(
    user: User,
  ): Promise<Array<TrademarkCollectionEntry> | null> {
    const trademarks = await this.trademarksApi.trademarksGetTrademarksBySSNGet(
      { ssn: '6102050890' },
    )

    return trademarks.map((t) => ({
      ...t,
      vmId: t.vmid,
      applicationDate: t.applicationDate
        ? new Date(t.applicationDate)
        : undefined,
    }))
  }

  async getTrademarkByVmId(vmId: string): Promise<Trademark | null> {
    const trademark = await this.trademarksApi.trademarksGetByIdGet({
      key: vmId,
    })

    const subType = trademark.isFelagamerki
      ? TrademarkSubType.COLLECTIVE_MARK
      : trademark.certificationMark
      ? TrademarkSubType.CERTIFICATION_MARK
      : TrademarkSubType.TRADEMARK

    return {
      ...trademark,
      subType,
      applicationDate: trademark.applicationDate
        ? new Date(trademark.applicationDate)
        : undefined,
      dateRegistration: trademark.dateRegistration
        ? new Date(trademark.dateRegistration)
        : undefined,
      dateUnRegistered: trademark.dateUnRegistered
        ? new Date(trademark.dateUnRegistered)
        : undefined,
      dateExpires: trademark.dateExpires
        ? new Date(trademark.dateExpires)
        : undefined,
      dateRenewed: trademark.dateRenewed
        ? new Date(trademark.dateRenewed)
        : undefined,
      dateInternationalRegistration: trademark.dateInternationalRegistration
        ? new Date(trademark.dateInternationalRegistration)
        : undefined,
      dateModified: trademark.dateModified
        ? new Date(trademark.dateModified)
        : undefined,
      datePublished: trademark.datePublished
        ? new Date(trademark.datePublished)
        : undefined,
      vmId: trademark.vmid,
      acquiredDistinctiveness: trademark.skradVegnaMarkadsfestu,
    }
  }

  async getPatents(user: User): Promise<Array<PatentCollectionEntry> | null> {
    const patents = await this.patentSearchApi.apiPatentSearchPatentsBySSNGet({
      ssn: '6102050890',
    })

    return patents as Array<PatentCollectionEntry>
  }
  async getPatentByApplicationNumber(appId: string): Promise<Patent | null> {
    const response = await this.patentSearchApi.apiPatentSearchSearchGet({
      applicationNr: appId,
    })

    const patent = response[0]

    return {
      ...patent,
      maxValidObjectionDate: patent.registeredDate
        ? addMonths(new Date(patent.registeredDate), 9)
        : undefined,
    }
  }

  getDesigns = (user: User): Promise<Array<DesignCollectionEntry> | null> =>
    this.designSearchApi.designSearchGetDesignBySSNGet({ ssn: '5411911789' })

  async getDesignByHID(hId: string): Promise<Design | null> {
    const response = await this.designSearchApi.designSearchGetByHIDGet({
      hid: hId,
    })

    return {
      ...response,
      classification: response?.classification?.category,
    }
  }
}
