import { Inject, Injectable } from '@nestjs/common'
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
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import ParseDate from 'date-fns/parse'

@Injectable()
export class IntellectualPropertyService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
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
        ? this.parseDate(trademark.applicationDate)
        : undefined,
      dateRegistration: trademark.dateRegistration
        ? this.parseDate(trademark.dateRegistration)
        : undefined,
      dateUnRegistered: trademark.dateUnRegistered
        ? this.parseDate(trademark.dateUnRegistered)
        : undefined,
      dateExpires: trademark.dateExpires
        ? this.parseDate(trademark.dateExpires)
        : undefined,
      dateRenewed: trademark.dateRenewed
        ? this.parseDate(trademark.dateRenewed)
        : undefined,
      dateInternationalRegistration: trademark.dateInternationalRegistration
        ? this.parseDate(trademark.dateInternationalRegistration)
        : undefined,
      dateModified: trademark.dateModified
        ? this.parseDate(trademark.dateModified)
        : undefined,
      datePublished: trademark.datePublished
        ? this.parseDate(trademark.datePublished)
        : undefined,
      maxValidObjectionDate: trademark.datePublished
        ? addMonths(this.parseDate(trademark.datePublished), 2)
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

  private parseDate = (date: string) =>
    ParseDate(date, 'dd.MM.yyyy HH:mm:ss', new Date())
}
