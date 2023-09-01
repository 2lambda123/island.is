import {
  TherapyApi,
  Configuration,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  DrugApi,
} from '../../gen/fetch'
import { SharedApiConfig } from './sharedApiConfig'

export const exportedApis = [
  TherapyApi,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  DrugApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
