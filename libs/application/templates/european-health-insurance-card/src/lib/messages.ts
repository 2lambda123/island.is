import { defineMessages } from 'react-intl'

export const europeanHealthInsuranceCardApplicationMessages = {
  application: defineMessages({
    applicationName: {
      id: 'ehic.application:application.name',
      defaultMessage: 'Umsókn um Evrópska sjúkratryggingakortið',
      description: 'Application for European Health Insurance Card',
    },
    institutionName: {
      id: 'ehic.application:application.institutionName',
      defaultMessage: 'Sjúkratryggingar Íslands',
      description: 'Application for collaboration institution name',
    },
  }),

  introScreen: defineMessages({
    formName: {
      id: 'ehic.application:form.name',
      defaultMessage: 'Evrópska sjúkratryggingakortið',
      description: 'Display name for application',
    },
    sectionLabel: {
      id: 'ehic.application:applicant.section.label',
      defaultMessage: 'Upplýsingar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:applicant.section.title',
      defaultMessage: 'Upplýsingar um Evrópska sjúkratryggingakortið',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ehic.application:applicant.section.description',
      defaultMessage:
        'Evrópska sjúkratryggingakortið veitir korthafa rétt til heilbrigðisþjónustu í öðrum EES löndum, og Sviss. Korthafi greiðir þá sama gjald fyrir heilbrigðisþjónustuna og þeir sem eru tryggðir í almannatryggingakerfi viðkomandi lands. Kortið gildir aðeins hjá opinberum heilbrigðisþjónustuveitendum, ekki á einkastofum. Kortið gildir almennt í þrjú ár í senn en fimm ár fyrir elli- og örorkulífeyrisþega. Sækja má um nýtt kort þegar 6 mánuðir eru eftir af gildistíma núgildandi korts.',
      description: 'Section description',
    },
  }),

  // Data collection
  data: defineMessages({
    sectionLabel: {
      id: 'ehic.application:data.section.label',
      defaultMessage: 'Gagnaöflun',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:data.name',
      defaultMessage: 'Gagnaöflun',
      description: 'Applicants for European Health Insurance Card',
    },
    dataCollectionNationalRegistryTitle: {
      id: 'ehic.application:data.national.registry.name',
      defaultMessage: 'Þjóðskrá Íslands',
      description: 'Title for NationalRegistry',
    },
    dataCollectionNationalRegistryDescription: {
      id: 'ehic.application:data.national.registry.description',
      defaultMessage:
        'Við þurfum að sækja þessi gögn úr þjóðskrá. Lögheimili, hjúskaparstaða, maki og afkvæmi.',
      description: 'Description for NationalRegistry',
    },
    dataCollectionHealthInsuranceTitle: {
      id: 'ehic.application:data.health.insurance.name',
      defaultMessage: 'Sjúkratryggingar',
      description: 'Title for Health Insurance (Sjúkratryggingar Íslands)',
    },
    dataCollectionHealthInsuranceDescription: {
      id: 'ehic.application:data.health.insurance.description',
      defaultMessage:
        'Upplýsingar um stöðu heimildar á evrópska sjúktryggingakortinu',
      description:
        'Description for Health Insurance (Sjúkratryggingar Íslands)',
    },
    dataCollectionCheckboxLabel: {
      id: 'ehic.application:data.dataCollectionCheckboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað.',
      description: 'Section description',
    },
  }),

  // Plastic
  applicants: defineMessages({
    sectionLabel: {
      id: 'ehic.application:applicant.section.label',
      defaultMessage: 'Umsækjendur',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:applicant.name',
      defaultMessage: 'Umsækjendur',
      description: 'Applicants for European Health Insurance Card',
    },
    sectionDescription: {
      id: 'ehic.application:applicant.description',
      defaultMessage:
        'Haka þarf við hvern einstakling til þess að umsókn hans verði virk.',
      description: 'Section description',
    },
    submitButtonLabel: {
      id: 'ehic.application:applicant.submitButtonLabel',
      defaultMessage: 'Halda áfram',
      description: 'Button label for Plastic card step',
    },
  }),

  // PDF
  temp: defineMessages({
    sectionLabel: {
      id: 'ehic.application:temp.section.label',
      defaultMessage: 'Bráðabirgðakort',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:temp.name',
      defaultMessage: 'Viltu sækja um tímabundið bráðabirgðakort',
      description: 'Applicants for European Health Insurance Card',
    },
    sectionDescription: {
      id: 'ehic.application:temp.description',
      defaultMessage:
        'þá kemur stuttur texti um notkun á bráðabirgðakorti vs plastkorti og svo getur þú niðurhalað PDF skjali með bráðabirgðakorti og það sendist í stafrænt pósthólf. Plast er betra og þetta dugar ekki jafn vel. Vinsamlegast hakaðu við þá aðila sem vilja fá bráða',
      description: 'Section description',
    },
    submitButtonLabel: {
      id: 'ehic.application:temp.submitButtonLabel',
      defaultMessage: 'Halda áfram',
      description: 'Button label for PDF step',
    },
  }),

  // Review Screen
  review: defineMessages({
    sectionLabel: {
      id: 'ehic.application:review.section.label',
      defaultMessage: 'Yfirlit umsóknar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:review.section.title',
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Section title',
    },
    sectionReviewTitle: {
      id: 'ehic.application:review.sectionReview.title',
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Section title',
    },
    sectionReviewDescription: {
      id: 'ehic.application:review.sectionReview.description',
      defaultMessage:
        'Vinsamlegast yfirfarið neðangreindar upplýsingar fyrir umsókn um Evrópskt sjúkratryggingakot',
      description: 'Section description',
    },
    sectionPersonsLabel: {
      id: 'ehic.application:review.name.label',
      defaultMessage: 'Einstaklingar',
      description: 'Form label for persons name formfield',
    },
    sectionDeliveryLabel: {
      id: 'ehic.application:review.phone.label',
      defaultMessage: 'Afhending',
      description: 'Form label for delivery formfield',
    },
    sectionDeliveryDescription: {
      id: 'ehic.application:review.phone.label',
      defaultMessage:
        'Kortið verður sent á lögheimili umsækjanda og tekur 10-14 virka daga fyrir kortið að berast.',
      description: 'Form description for delivery formfield',
    },
    sectionAddressLabel: {
      id: 'ehic.application:review.email.label',
      defaultMessage: 'Skráð lögheimili',
      description: 'Form label for address formfield',
    },
    submitButtonLabel: {
      id: 'ehic.application:review.submitButtonLabel',
      defaultMessage: 'Staðfesta Umsókn',
      description: 'Button label for submitting application',
    },
  }),

  // Completed
  confirmation: defineMessages({
    sectionLabel: {
      id: 'ehic.application:confirmation.section.label',
      defaultMessage: 'Umsókn staðfest',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ehic.application:confirmation.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionInfoBulletFirst: {
      id: 'ehic.application:confirmation.section.infoBullet.first',
      defaultMessage: 'Umsóknin er formlega móttekin.',
      description: 'First information sentence, in bullet list',
    },
    sectionInfoBulletSecond: {
      id: 'ehic.application:confirmation.section.infoBullet.second',
      defaultMessage:
        'Kortið verður sent á Grundarstíg 12 umsækjanda og tekur 10-14 virka daga fyrir kortið að berast.',
      description: 'Second information sentence, in bullet list',
    },
    sectionInfoBulletThird: {
      id: 'ia.application:confirmation.section.infoBullet.third',
      defaultMessage:
        'Ef ES kort berst ekki fyrir upphaf ferðar, þá er hægt að niðurhala bráðabirgðaskírteinið hér',
      description: 'Third information sentence, in bullet list',
    },
  }),

  approved: defineMessages({
    sectionTitle: {
      id: 'ia.application:approved.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionDescription: {
      id: 'ia.application:approved.section.description',
      defaultMessage:
        'Við munum fara yfir umsóknina og sendum á þig svör innan tíðar. Við verðum í sambandi ef okkur vantar frekari upplýsingar. ',
      description: 'Section title',
    },
  }),

  urls: defineMessages({
    allServices: {
      id: 'ia.application:url.all',
      defaultMessage: 'https://island.is/s/stafraent-island/thjonustur',
      description: 'Url',
    },
    mailService: {
      id: 'ia.application:url.mail',
      defaultMessage: '/s/stafraent-island/thjonustur/postholf',
      description: 'Url',
    },
    loginService: {
      id: 'ia.application:url.login',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/innskraning-fyrir-alla',
      description: 'Url',
    },
    myPageService: {
      id: 'ia.application:url.mypage',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/minar-sidur',
      description: 'Url',
    },
    certificateService: {
      id: 'ia.application:url.certificate',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/skirteini',
      description: 'Url',
    },
    straumurService: {
      id: 'ia.application:url.straumur',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/straumurinn',
      description: 'Url',
    },
    applyService: {
      id: 'ia.application:url.apply',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/umsoknarkerfi',
      description: 'Url',
    },
    authorityService: {
      id: 'ia.application:url.authority',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/umbodskerfi',
      description: 'Url',
    },
    webService: {
      id: 'ia.application:url.web',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/vefur-stofnana',
      description: 'Url',
    },
    appService: {
      id: 'ia.application:url.app',
      defaultMessage: '/https://island.iss/stafraent-island/thjonustur/app',
      description: 'Url',
    },
    islandService: {
      id: 'ia.application:url.island',
      defaultMessage:
        'https://island.is/s/stafraent-island/thjonustur/island-is',
      description: 'Url',
    },
  }),
}