import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const pensionSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'tr.ps.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'tr.ps.application:applicationTitle',
      defaultMessage: 'Umsókn um uppbót á lífeyri',
      description: 'Application for pension supplement',
    },
    formTitle: {
      id: 'tr.ps.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'tr.ps.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'tr.ps.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    // prerequisitesSection: {
    //   id: 'trps.application:prerequisites.section',
    //   defaultMessage: 'Forsendur',
    //   description: 'Prerequisites',
    // },
    externalDataSection: {
      id: 'tr.ps.application:external.data.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'tr.ps.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileInformationTitle: {
      id: 'tr.ps.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'Information from your account on Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'tr.ps.application:userprofile.subtitle',
      defaultMessage:
        'Sækir upplýsingar um netfang, símanúmer og bankareikning frá mínum síðum Ísland.is.',
      description:
        'Information about email adress, phone number and bank account will be retrieved from your account at Ísland.is.',
    },
    skraInformationTitle: {
      id: 'tr.ps.application:skra.info.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'tr.ps.application:skra.info.subtitle',
      defaultMessage: 'Sækir upplýsingar um þig, maka og börn frá Þjóðskrá.',
      description:
        'Information about you, spouse and children will be retrieved from Registers Iceland.',
    },
    startApplication: {
      id: 'tr.ps.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'tr.ps.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'tr.ps.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'tr.ps.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt á mínar síður á Ísland.is. Ef upplýsingarnar eru ekki réttar eða vantar setur þú þær inn hér.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'tr.ps.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'tr.ps.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    paymentTitle: {
      id: 'tr.ps.application:info.payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    paymentAlertTitle: {
      id: 'tr.ps.application:info.payment.alert.title',
      defaultMessage: 'Til athugunar!',
      description: 'For consideration',
    },
    paymentAlertMessage: {
      id: 'tr.ps.application:info.payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reiking.',
      description:
        'All your payments from TR are paid into the bank account below. If you change your bank details, all your payments from the TR will be paid into that account.',
    },
    paymentBank: {
      id: 'tr.ps.application:info.payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    applicationReasonTitle: {
      id: 'tr.ps.application:info.application.reason.title',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason for application',
    },
    applicationReasonDescription: {
      id: 'tr.ps.application:info.application.reason.description',
      defaultMessage:
        'Hægt er að merkja við marga möguleika en skylda að merkja við einhvern.',
      description: 'You can check many options, but you must check someone.',
    },
    applicationReasonMedicineCost: {
      id: 'tr.ps.application:info.application.reason.medicine.cost',
      defaultMessage: 'Lyfja- eða sjúkrahjálp',
      description: 'Medicine cost',
    },
    applicationReasonAssistedCareAtHome: {
      id: 'tr.ps.application:info.application.reason.assisted.care.at.home',
      defaultMessage: 'Umönnun í heimahúsi',
      description: 'Assisted care at home',
    },
    applicationReasonHouseRent: {
      id: 'tr.ps.application:info.application.reason.house.rent',
      defaultMessage:
        'Húsaleiga sem fellur utan húsaleigubóta frá sveitafélagi',
      description:
        'House rent that falls outside the rent allowance from the municipality',
    },
    applicationReasonAssistedLiving: {
      id: 'tr.ps.application:info.application.reason.assisted.living',
      defaultMessage: 'Dvöl á sambýli eða áfangaheimili',
      description: 'Assisted living',
    },
    applicationReasonPurchaseOfHearingAids: {
      id: 'tr.ps.application:info.application.reason.purchase.of.hearing.aids',
      defaultMessage: 'Kaup á heyrnartækjum',
      description: 'Purchase of hearing aids',
    },
    applicationReasonOxygenFilterCost: {
      id: 'tr.ps.application:info.application.reason.oxygen.filter.cost',
      defaultMessage: 'Rafmagn á súrefnissíu',
      description: 'Oxygen filter voltage/cost',
    },
    applicationReasonHalfwayHouse: {
      id: 'tr.ps.application:info.application.reason.halfway.house',
      defaultMessage: 'Dvöl á áfangaheimili',
      description: 'Halfway house',
    },
  }),

  fileUpload: defineMessages({
    attachmentButton: {
      id: 'tr.ps.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'tr.ps.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'tr.ps.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'tr.ps.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'tr.ps.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'tr.ps.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangar upplýsingar. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
    assistedCareAtHomeTitle: {
      id: 'tr.ps.application:fileUppload.assisted.care.at.home.title',
      defaultMessage: 'Fylgiskjöl umönnun í heimahúsi',
      description: 'Pension supplement assisted care at home attachment',
    },
    assistedCareAtHome: {
      id: 'tr.ps.application:fileUppload.assisted.care.at.home',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á kostnaði sem opinberir aðilar greiða ekki. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can upload a confirmation of costs that public entities do not pay. Note that the document must be in .pdf format.',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'tr.ps.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'tr.ps.application:confirm.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirm',
    },
    title: {
      id: 'tr.ps.application:confirm.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    description: {
      id: 'tr.ps.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    overviewTitle: {
      id: 'tr.ps.application:confirm.overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    buttonsEdit: {
      id: 'tr.ps.application:confirm.buttons.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    name: {
      id: 'tr.ps.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'tr.ps.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    email: {
      id: 'tr.ps.application:confirm.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'tr.ps.application:confirm.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
    additionalDocumentsAttachment: {
      id: 'tr.ps.application:confirm.additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description: 'Additional documents to Tryggingastofnunar',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'tr.ps.application:conclusionScreen.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'tr.ps.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
    bank: {
      id: 'tr.ps.application:error.bank',
      defaultMessage:
        'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
      description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
    },
    applicationReason: {
      id: 'tr.ps.application:error.application.reason',
      defaultMessage: 'Skylda að velja einhverja ástæðu',
      description: 'Required to choose some reason',
    },
  }),
}
