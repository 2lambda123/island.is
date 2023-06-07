import { Field, ObjectType } from '@nestjs/graphql'
import { IcelandicGovernmentInstitutionVacancy } from '../models/icelandicGovernmentInstitutionVacancy.model'

@ObjectType()
export class IcelandicGovernmentInstitutionVacancyByIdResponse {
  @Field(() => IcelandicGovernmentInstitutionVacancy)
  vacancy!: IcelandicGovernmentInstitutionVacancy
}