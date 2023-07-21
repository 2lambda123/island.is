import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryFamilyMember {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String, { nullable: true })
  gender?: string | null

  @Field(() => String)
  genderCode!: string

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress | null
}
