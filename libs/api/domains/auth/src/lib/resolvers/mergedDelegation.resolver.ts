import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { DelegationType } from '@island.is/clients/auth/delegation-api'
import { IdentityClientService } from '@island.is/clients/identity'
import { Identity } from '@island.is/api/domains/identity'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { MergedDelegation } from '../models'
import type { MergedDelegationDTO } from '../services/types'

@UseGuards(IdsUserGuard)
@Resolver(() => MergedDelegation)
export class MergedDelegationResolver {
  constructor(private identityService: IdentityClientService) {}

  @ResolveField('to', () => Identity)
  async resolveTo(
    @Parent() delegation: MergedDelegationDTO,
  ): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(
      delegation.toNationalId,
      {
        name: delegation.toName ?? undefined,
      },
    )
  }

  @ResolveField('from', () => Identity)
  async resolveFrom(
    @Parent() delegation: MergedDelegationDTO,
  ): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(
      delegation.fromNationalId,
      {
        name: delegation.fromName ?? undefined,
      },
    )
  }

  @ResolveField('type', () => DelegationType, {
    deprecationReason: 'Use types instead',
  })
  resolveDelegationType(
    @Parent() delegation: MergedDelegationDTO,
  ): DelegationType {
    return delegation.types[0]
  }
}
