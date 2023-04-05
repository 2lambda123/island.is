import { SubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalUserSubscriptionResult')
export class UserSubscriptionResult {
  @Field({ nullable: true })
  id?: number

  @Field({ nullable: true })
  subscriptionType?: SubscriptionType
}
