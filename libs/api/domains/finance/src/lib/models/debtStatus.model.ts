import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DebtStatusModel {
  @Field(() => [DebtStatus])
  debtStatus!: DebtStatus[]
}

@ObjectType()
export class DebtStatus {
  @Field()
  totalAmount!: number

  @Field()
  approvedSchedule!: number

  @Field()
  possibleToSchedule!: number

  @Field()
  notPossibleToSchedule?: number
}
