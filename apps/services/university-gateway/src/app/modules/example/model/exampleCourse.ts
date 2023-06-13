import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Season } from '../../major/types'

export class ExampleCourse {
  @ApiProperty({
    description: 'External ID for the course (from University)',
    example: 'ABC12345',
  })
  externalId!: string

  @ApiProperty({
    description: 'Course name (Icelandic)',
    example: 'Tölvunarfræði I',
  })
  nameIs!: string

  @ApiProperty({
    description: 'Course name (English)',
    example: 'Computer science I',
  })
  nameEn!: string

  @ApiProperty({
    description: 'Whether the course is required to take within the major',
    example: true,
  })
  required!: boolean

  // @ApiProperty({
  //   description: 'University ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  // universityId!: string

  // @ApiProperty({
  //   description: 'Major ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  // majorId!: string

  @ApiProperty({
    description: 'Number of course credits (in ECTS)',
    example: 8,
  })
  credits!: number

  @ApiProperty({
    description: 'Which year this course is taught on',
    example: 2023,
  })
  semesterYear!: number

  @ApiProperty({
    description: 'Which season this course is taught on',
    example: Season.FALL,
    enum: Season,
  })
  semesterSeason!: Season

  @ApiProperty({
    description: 'Course description (Icelandic)',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @ApiPropertyOptional()
  descriptionIs?: string

  @ApiProperty({
    description: 'Course description (English)',
    example: 'Mauris a justo arcu. Orci varius natoque penatibus.',
  })
  @ApiPropertyOptional()
  descriptionEn?: string

  @ApiProperty({
    description:
      'External url  for the course from the university web page (Icelandic)',
    example: 'https://www.hi.is/grunnnam/tolvunarfraedi/staerdfraedigreining-i',
  })
  @ApiPropertyOptional()
  externalUrlIs?: string

  @ApiProperty({
    description:
      'External url  for the course from the university web page (English)',
    example:
      'https://www.en.hi.is/undergraduate-study/computer-science/mathematical-analysis-i',
  })
  @ApiPropertyOptional()
  externalUrlEn?: string
}
