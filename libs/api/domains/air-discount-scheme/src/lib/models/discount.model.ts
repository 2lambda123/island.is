import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from './user.model'
import { ConnectionDiscountCode as GQLConnectionDiscountCode } from './connectionDiscountCode.model'
import { ConnectionDiscountCode } from '@island.is/air-discount-scheme/types'
import { FlightLeg } from './flightLeg.model'

@ObjectType('AirDiscountSchemeDiscount')
export class Discount {
  @Field(() => ID)
  nationalId!: string

  @Field()
  discountCode!: string

  @Field(() => [GQLConnectionDiscountCode])
  connectionDiscountCodes!: ConnectionDiscountCode[]

  @Field()
  expiresIn!: number

  @Field(() => User)
  user!: User

  @Field(() => [FlightLeg])
  flightLegs?: FlightLeg[]
}
