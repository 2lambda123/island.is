import { Comparators, Form, FormModes } from '@island.is/application/types'
import { FILE_SIZE_LIMIT, YES } from '../constants'
import {
  buildCheckboxField,
  buildCompanySearchField,
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'

import { institutionApplicationMessages as m } from '../lib/messages'

export const application: Form = buildForm({
  id: 'InstitutionCollaborationApplicationForm',
  title: m.applicant.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'applicantSection',
      title: m.applicant.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicantInformation',
          title: m.applicant.sectionTitle,
          description: m.applicant.sectionDescription,
          children: [
            buildCustomField(
              {
                id: 'applicant.institutionSubtitle',
                component: 'FieldDescription',
                title: '',
              },
              {
                subTitle: m.applicant.institutionSubtitle,
              },
            ),
            buildCompanySearchField({
              id: 'applicant.institution',
              title: m.applicant.institutionLabel,
              setLabelToDataSchema: true,
            }),

            buildTextField({
              id: 'contact.institutionEmail',
              title: m.applicant.contactInstitutionEmailLabel,
              variant: 'email',
              backgroundColor: 'blue',
              required: true,
              defaultValue: '',
            }),

            buildCustomField(
              {
                id: 'applicant.contactSubtitle',
                component: 'FieldDescription',
                title: '',
              },
              {
                subTitle: m.applicant.contactSubtitle,
              },
            ),
            buildTextField({
              id: 'contact.name',
              title: m.applicant.contactNameLabel,
              backgroundColor: 'blue',
              required: true,
              defaultValue: '',
            }),

            buildTextField({
              id: 'contact.phoneNumber',
              title: m.applicant.contactPhoneLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'blue',
              required: true,
              defaultValue: '',
            }),
            buildTextField({
              id: 'contact.email',
              title: m.applicant.contactEmailLabel,
              variant: 'email',
              backgroundColor: 'blue',
              required: true,
              defaultValue: '',
            }),
            buildCustomField({
              id: 'secondaryContact',
              title: m.applicant.secondaryContactSubtitle,
              component: 'SecondaryContact',
              doesNotRequireAnswer: true,
            }),
            buildTextField({
              id: 'secondaryContact.name',
              title: m.applicant.contactNameLabel,
              backgroundColor: 'blue',
              condition: {
                questionId: 'hasSecondaryContact',
                comparator: Comparators.EQUALS,
                value: YES,
              },
              defaultValue: '',
            }),
            buildTextField({
              id: 'secondaryContact.phoneNumber',
              title: m.applicant.contactPhoneLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'blue',
              defaultValue: '',
              condition: {
                questionId: 'hasSecondaryContact',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildTextField({
              id: 'secondaryContact.email',
              title: m.applicant.contactEmailLabel,
              variant: 'email',
              backgroundColor: 'blue',
              defaultValue: '',
              condition: {
                questionId: 'hasSecondaryContact',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'serviceSection',
      title: m.service.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicantInformation',
          title: m.service.sectionTitle,
          description: m.service.sectionDescription,
          children: [
            buildCustomField({
              id: 'constraints',
              title: '',
              component: 'Constraints',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicationReviewSection',
      title: m.review.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicationReviewSection.applicationReview',
          title: m.review.sectionTitle,
          description: m.review.sectionDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.review.submitButtonLabel,
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'successfulSubmissionSection',
      title: m.confirmation.sectionLabel,
      children: [
        buildCustomField({
          id: 'successfulSubmission',
          title: 'Takk fyrir umsóknina!',
          component: 'ConfirmationScreen',
        }),
      ],
    }),
  ],
})
