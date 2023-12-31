import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const DraftRequiresAction: Form = buildForm({
  id: 'ParentalLeaveSubmissionNeedsAction',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REJECTED,
  children: [
    buildSection({
      id: 'draftRequiresAction.section',
      title: parentalLeaveFormMessages.draftFlow.draftNotApprovedTitle,
      children: [
        buildCustomField({
          id: 'draftRequiresAction.field',
          title: parentalLeaveFormMessages.draftFlow.draftNotApprovedTitle,
          component: 'DraftRequiresAction',
        }),
      ],
    }),
  ],
})
