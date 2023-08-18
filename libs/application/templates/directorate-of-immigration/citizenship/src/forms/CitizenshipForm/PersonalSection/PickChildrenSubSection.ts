import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { selectChildren } from '../../../lib/messages'
import * as kennitala from 'kennitala'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'
import { Routes } from '../../../lib/constants'

export const PickChildrenSubSection = buildSubSection({
  id: Routes.PICKCHILDREN,
  title: selectChildren.general.subSectionTitle,
  condition: (_, externalData) => {
    const childWithInfo = getValueViaPath(
      externalData,
      'childrenCustodyInformation.data',
      [],
    ) as ApplicantChildCustodyInformation[]

    return childWithInfo ? childWithInfo.length > 0 : false
  },
  children: [
    buildMultiField({
      id: Routes.PICKCHILDREN,
      title: selectChildren.general.pageTitle,
      description: selectChildren.general.description,
      children: [
        buildCustomField(
          {
            id: 'attentionAgeChildren',
            title: selectChildren.warningAgeChildren.title,
            component: 'AlertWithLink',
            condition: (_, externalData) => {
              const childWithInfo = getValueViaPath(
                externalData,
                'childrenCustodyInformation.data',
                [],
              ) as ApplicantChildCustodyInformation[]

              const childrenInAgeRange = childWithInfo.filter((child) => {
                const childInfo = kennitala.info(child.nationalId)
                return childInfo.age >= 17
              })

              return childrenInAgeRange ? childrenInAgeRange.length > 0 : false
            },
          },
          {
            title: selectChildren.warningAgeChildren.title,
            message: selectChildren.warningAgeChildren.information,
            linkTitle: selectChildren.warningAgeChildren.linkTitle,
            linkUrl: selectChildren.warningAgeChildren.linkUrl,
          },
        ),
        buildCustomField({
          id: 'selectedChildren',
          title: selectChildren.general.pageTitle,
          component: 'SelectChildren',
        }),
        buildCustomField({
          id: 'generalMessage',
          title: 'Upplýsingar',
          component: 'ChildrenInformationBoxWithLink',
          condition: (_, externalData) => {
            const childWithInfo = getValueViaPath(
              externalData,
              'childrenCustodyInformation.data',
              [],
            ) as ApplicantChildCustodyInformation[]

            const childrenInAgeRange = childWithInfo.filter((child) => {
              const childInfo = kennitala.info(child.nationalId)
              return childInfo.age >= 11 || childInfo.age <= 18
            })

            const showSharedCustodyWarning = childWithInfo.filter((child) => {
              return !!child.otherParent
            })

            return (childrenInAgeRange && childrenInAgeRange.length > 0) ||
              showSharedCustodyWarning
              ? true
              : false
          },
        }),
      ],
    }),
  ],
})
