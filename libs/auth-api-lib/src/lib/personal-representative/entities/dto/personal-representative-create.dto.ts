import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PersonalRepresentativeCreateDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'guid',
  })
  readonly id?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'personal_representative_for_disabled_person',
  })
  readonly personalRepresentativeTypeCode?: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'contractId from personal representative contract system from personal representative contract system or other external system used to create personal rep contracts',
  })
  readonly contractId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'userId(AD) from personal representative contract system or other external system used to create personal rep contracts',
  })
  readonly externalUserId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Personal Representative',
  })
  readonly nationalIdPersonalRepresentative!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Represented Person',
  })
  readonly nationalIdRepresentedPerson!: string

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    // add one day as validTo example
    example: new Date(new Date().setTime(new Date().getTime() + 86400000)), //86400000 = nr of ms in one day
  })
  readonly validTo?: Date

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["health", "finance"]',
  })
  readonly rightCodes!: string[]
}
