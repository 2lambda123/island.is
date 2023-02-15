import {
  Application,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import {
  EhicApplyForPhysicalCardApi,
  EhicCardResponseApi,
} from '../dataProviders'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps {}

export const EuropeanHealthInsuranceCardReview: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'applicants',
      title: e.applicants.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicationReviewSection.applicationReview',
          title: e.review.sectionReviewTitle,
          description: e.review.sectionReviewDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'TODO: Sækja um pdf',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'completed',
      title: 'TODO: label',
      children: [
        buildMultiField({
          id: 'TODO.ID',
          title: 'TODO: title',
          description: e.review.sectionReviewDescription,
          children: [
            buildCustomField({
              id: 'completedScreen',
              title: '',
              component: 'CompletedScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})

export default EuropeanHealthInsuranceCardReview
