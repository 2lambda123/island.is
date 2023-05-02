import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryV3Address {
  @Field(() => String, { nullable: true })
  streetName?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  municipalityText?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null
}
