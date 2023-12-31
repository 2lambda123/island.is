import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ExistsEndorsementResponse {
  @Field()
  hasEndorsed!: boolean
}
