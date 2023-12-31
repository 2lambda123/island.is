import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class ConfirmSmsVerificationInput {
  @Field(() => String)
  @IsString()
  code!: string

  @Field(() => String)
  @IsString()
  mobilePhoneNumber!: string
}
