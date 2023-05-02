import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { NationalRegistryV3Person } from './graphql/models/nationalRegistryPerson.model'
import { ChildGuardianship } from './graphql/models/nationalRegistryChildGuardianship.model'
import { ChildGuardianshipInput } from './graphql/dto/nationalRegistryChildGuardianshipInput'
import { NationalRegistryV3Spouse } from './graphql/models/nationalRegistrySpouse.model'
import { NationalRegistryV3Service } from './nationalRegistryV3.service'
import { NationalRegistryV3Address } from './graphql/models/nationalRegistryAddress.model'
import { NationalRegistryV3Birthplace } from './graphql/models/nationalRegistryBirthplace.model'
import { NationalRegistryV3Residence } from './graphql/models/nationalRegistryResidence.model'
import { NationalRegistryV3Citizenship } from './graphql/models/nationalRegistryCitizenship.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryV3Person)
@Audit({ namespace: '@island.is/api/national-registry-v3' })
export class NationalRegistryV3Resolver {
  constructor(private nationalRegistryV3Service: NationalRegistryV3Service) {}

  @Query(() => NationalRegistryV3Person, {
    name: 'nationalRegistryUserV3',
    nullable: true,
  })
  @Audit()
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryV3Person | null> {
    return this.nationalRegistryV3Service.getNationalRegistryPerson(
      user.nationalId,
    )
  }

  @Query(() => ChildGuardianship, {
    name: 'nationalRegistryUserV3ChildGuardianship',
    nullable: true,
  })
  @Audit()
  async childGuardianship(
    @Context('req') { user }: { user: User },
    @Args('input') input: ChildGuardianshipInput,
  ): Promise<ChildGuardianship | null> {
    return this.nationalRegistryV3Service.getChildGuardianship(
      user,
      input.childNationalId,
    )
  }

  @ResolveField('children', () => [NationalRegistryV3Person], {
    nullable: true,
  })
  @Audit()
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryV3Person,
  ): Promise<Array<NationalRegistryV3Person> | null> {
    if (person.nationalId !== user.nationalId) {
      return null
    }
    return this.nationalRegistryV3Service.getChildrenCustodyInformation(
      user.nationalId,
    )
  }

  @ResolveField('residenceHistory', () => [NationalRegistryV3Residence], {
    nullable: true,
  })
  @Audit()
  async resolveResidenceHistory(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryV3Person,
  ): Promise<Array<NationalRegistryV3Service> | null> {
    /*return this.nationalRegistryV3Service.getNationalRegistryResidenceHistory(
      person.nationalId,
    )*/
    return null
  }

  @ResolveField('birthplace', () => NationalRegistryV3Birthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Parent() person: NationalRegistryV3Person,
  ): Promise<NationalRegistryV3Birthplace | null> {
    return this.nationalRegistryV3Service.getBirthplace(person.nationalId)
  }

  @ResolveField('citizenship', () => NationalRegistryV3Citizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Parent() person: NationalRegistryV3Person,
  ): Promise<NationalRegistryV3Citizenship | null> {
    return this.nationalRegistryV3Service.getCitizenship(person.nationalId)
  }

  @ResolveField('spouse', () => NationalRegistryV3Spouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Parent() person: NationalRegistryV3Person,
  ): Promise<NationalRegistryV3Spouse | null> {
    return this.nationalRegistryV3Service.getSpouse(person.nationalId)
  }

  @ResolveField('address', () => NationalRegistryV3Address, { nullable: true })
  @Audit()
  async resolveAddress(
    @Parent() person: NationalRegistryV3Person,
  ): Promise<NationalRegistryV3Address | null> {
    return this.nationalRegistryV3Service.getAddress(person.nationalId)
  }
}
