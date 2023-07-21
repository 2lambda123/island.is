import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryXRoadReligion')
export class NationalRegistryReligion {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}
