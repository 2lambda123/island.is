import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
//import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  //CurrentUser,
} from '@island.is/auth-nest-tools'
import { CriminalRecordService } from '../criminalRecord.service'
import {
  CriminalRecord,
} from './models'
//export * from '@island.is/nest/audit'
//import { AuditService } from '@island.is/nest/audit'

//const namespace = '@island.is/api/criminal-record'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly criminalRecordService: CriminalRecordService,
  ) {}
  
  //Note: not being used
  @Query(() => CriminalRecord)
  async getCriminalRecord(@Args('ssn') ssn: string) {
    return await this.criminalRecordService.getCriminalRecord(ssn)
  }

  @Query(() => Boolean)
  async checkCriminalRecord(@Args('ssn') ssn: string) {
    return await this.criminalRecordService.checkCriminalRecord(ssn)
  }
}
