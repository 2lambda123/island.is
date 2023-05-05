import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryV3Address } from './nationalRegistryAddress.model'
import { NationalRegistryV3Birthplace } from './nationalRegistryBirthplace.model'
import { NationalRegistryV3Residence } from './nationalRegistryResidence.model'
import { NationalRegistryV3Spouse } from './nationalRegistrySpouse.model'
import { NationalRegistryV3Citizenship } from './nationalRegistryCitizenship.model'
import { NationalRegistryV3Name } from './nationalRegistryName.model'
import { NationalRegistryV3Religion } from './nationalRegistryReligion.model'

@ObjectType()
export class NationalRegistryV3Person {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName?: string | null

  @Field(() => NationalRegistryV3Name, { nullable: true })
  name?: NationalRegistryV3Name | null

  @Field(() => String, { nullable: true })
  gender?: string | null

  @Field(() => Boolean, { nullable: true })
  banMarking?: boolean | null

  @Field(() => String)
  familyRegistrationCode?: string | null

  @Field(() => NationalRegistryV3Address, { nullable: true })
  address?: NationalRegistryV3Address | null

  @Field(() => Boolean, { nullable: true })
  livesWithApplicant?: boolean

  @Field(() => Boolean, { nullable: true })
  livesWithBothParents?: boolean

  @Field(() => [NationalRegistryV3Person], { nullable: true })
  children?: NationalRegistryV3Person[]

  @Field(() => NationalRegistryV3Person, { nullable: true })
  otherParent?: NationalRegistryV3Person | null

  @Field(() => [NationalRegistryV3Residence], { nullable: true })
  residenceHistory?: NationalRegistryV3Residence[]

  @Field(() => NationalRegistryV3Spouse, { nullable: true })
  spouse?: NationalRegistryV3Spouse | null

  @Field(() => NationalRegistryV3Birthplace, { nullable: true })
  birthplace?: NationalRegistryV3Birthplace | null

  @Field(() => NationalRegistryV3Citizenship, { nullable: true })
  citizenship?: NationalRegistryV3Citizenship | null

  @Field(() => NationalRegistryV3Religion, { nullable: true })
  religion?: NationalRegistryV3Religion | null
}
