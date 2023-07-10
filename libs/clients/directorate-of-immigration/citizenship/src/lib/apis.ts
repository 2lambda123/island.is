import {
  ApplicantResidenceConditionApi,
  Configuration,
  CountryOfResidenceApi,
  OptionSetApi,
  ResidenceAbroadApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  OptionSetApi,
  CountryOfResidenceApi,
  ResidenceAbroadApi,
  TravelDocumentApi,
  ApplicantResidenceConditionApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))