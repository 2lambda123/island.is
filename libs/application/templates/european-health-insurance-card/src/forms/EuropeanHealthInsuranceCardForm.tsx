import {
  Application,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import {
  EhicApplyForPhysicalCardApi,
  EhicCardResponseApi,
} from '../dataProviders'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'

import { NationalRegistry } from '../lib/types'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps {}

export const EuropeanHealthInsuranceCardForm: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardForm',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,

      children: [
        buildCustomField(
          {
            id: 'introScreen',
            title: e.introScreen.sectionTitle,
            component: 'IntroScreen',
          },
          {
            subTitle: e.introScreen.sectionDescription,
          },
        ),
      ],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [
        buildExternalDataProvider({
          title: e.data.sectionTitle,
          checkboxLabel: e.data.dataCollectionCheckboxLabel,
          id: 'approveExternalData',
          description: '',
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: 'Þjóðskrá Íslands',
              subTitle:
                'Við þurfum að sækja þessi gögn úr þjóðskrá. Lögheimili, hjúskaparstaða, maki og afkvæmi.',
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: EhicCardResponseApi,
              title: 'Sjúkratryggingar',
              subTitle:
                'Upplýsingar um stöðu heimildar á evrópska sjúktryggingakortinu',
            }),
          ],
        }),
        buildMultiField({
          id: 'plastic',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          children: [
            buildCheckboxField({
              id: 'applyForPlastic',
              backgroundColor: 'white',
              title: '',
              options: (application: Application) => {
                console.log(application, ' here')
                const nationalRegistry = application.externalData
                  .nationalRegistry.data as NationalRegistry
                const nationalRegistrySpouse = application.externalData
                  .nationalRegistrySpouse.data as NationalRegistry
                const nationalRegistryDataChildren = (application?.externalData
                  ?.childrenCustodyInformation as unknown) as NationalRegistry
                const applying = []

                applying.push({
                  value: [
                    nationalRegistry.nationalId,
                    nationalRegistry.fullName,
                  ],
                  label: nationalRegistry.fullName,
                })
                if (nationalRegistrySpouse?.nationalId) {
                  applying.push({
                    value: [
                      nationalRegistrySpouse.nationalId,
                      nationalRegistrySpouse.name,
                    ],
                    label: nationalRegistrySpouse.name,
                  })
                }

                for (const i in nationalRegistryDataChildren?.data) {
                  applying.push({
                    value: [
                      nationalRegistryDataChildren.data[i].nationalId,
                      nationalRegistryDataChildren.data[i].fullName,
                    ],
                    label: nationalRegistryDataChildren.data[i].fullName,
                  })
                }
                return applying as Array<{ value: any; label: string }>
              },
            }),
          ],
        }),

        // Has to be here so that the submit button appears (does not appear if no screen is left).
        // Tackle that as AS task.
        // buildDescriptionField({
        //   id: 'unused',
        //   title: '',
        //   description: '',
        // }),
      ],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [
        buildMultiField({
          id: 'tempApplicants',
          title: e.temp.sectionTitle,
          description: e.temp.sectionDescription,
          children: [
            buildCheckboxField({
              id: 'applyForPDF',
              backgroundColor: 'white',
              title: '',
              options: (application: Application) => {
                const applying = []
                console.log(application)
                const ans = application.answers.applyForPlastic as Array<any>
                console.log('answers')
                console.log(ans)
                for (const i in ans) {
                  console.log([ans[i][0], ans[i][1]])
                  applying.push({
                    value: [ans[i][0], ans[i][1]],
                    label: ans[i][1],
                  })
                }
                return applying as Array<{ value: any; label: string }>
              },
            }),
            buildSubmitField({
              id: 'submit-pdf',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: e.temp.submitButtonLabel,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // Has to be here so that the submit button appears (does not appear if no screen is left).
        // Tackle that as AS task.
        buildDescriptionField({
          id: 'pdf-Unused',
          title: '',
          description: '',
        }),
      ],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'completed',
      title: e.confirmation.sectionLabel,
      children: [],
    }),
  ],
})

export default EuropeanHealthInsuranceCardForm