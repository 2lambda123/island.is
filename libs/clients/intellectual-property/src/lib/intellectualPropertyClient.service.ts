import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  DesignSearchApi,
  PatentSearchApi,
  TrademarksApi,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class IntellectualPropertyClientService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private trademarksApi: TrademarksApi,
    private patentSearchApi: PatentSearchApi,
    private designSearchApi: DesignSearchApi,
  ) {}

  private trademarksApiWithAuth = (user: User) =>
    this.trademarksApi.withMiddleware(new AuthMiddleware(user as Auth))
  private patentSearchApiWithAuth = (user: User) =>
    this.patentSearchApi.withMiddleware(new AuthMiddleware(user as Auth))
  private designSearchApiWithAuth = (user: User) =>
    this.designSearchApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getIntellectualProperties(user: User) {
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

  getTrademarks(user: User) {
    return this.trademarksApiWithAuth(user).trademarksGetTrademarksBySSNGet({
      ssn: '6102050890',
    })
  }

  getTrademarkByVmId(user: User, vmId: string) {
    return this.trademarksApiWithAuth(user).trademarksGetByIdGet({
      key: vmId,
    })
  }

  getPatents(user: User) {
    return this.patentSearchApiWithAuth(user).apiPatentSearchPatentsBySSNGet({
      ssn: '6102050890',
    })
  }
  getPatentByApplicationNumber(user: User, appId: string) {
    return this.patentSearchApiWithAuth(user).apiPatentSearchSearchGet({
      applicationNr: appId,
    })
  }

  getDesigns(user: User) {
    return this.designSearchApiWithAuth(user).designSearchGetDesignBySSNGet({
      ssn: '5411911789',
    })
  }

  getDesignByHID(user: User, hId: string) {
    return this.designSearchApiWithAuth(user).designSearchGetByHIDGet({
      hid: hId,
    })
  }

  getDesignImages(user: User, hId: string) {
    return this.designSearchApiWithAuth(user).designSearchGetDesignsGet({
      hid: hId,
    })
  }

  getDesignImage(
    user: User,
    hId: string,
    designNumber: string,
    imageNumber: string,
    size?: string,
  ) {
    return this.designSearchApiWithAuth(user).designSearchGetDesignImageGet({
      hid: hId,
      designNumber,
      imageNumber,
      size,
    })
  }
}
