import { TranslatedMessages } from './index';

export const en: TranslatedMessages = {
  "login.welcomeMessage": "Log in to the app with electronic ID",
  "login.loginButtonText": "Login",
  "login.languageButtonText": "Íslenska",
  "login.needHelpButtonText": "Need help",
  "onboarding.notifications.title": "Receive notifications of new documents as soon as they are received.",
  "onboarding.notifications.allowNotificationsButtonText": "Allow notifications",
  "onboarding.notifications.decideLaterButtonText": "Decide later",
  "onboarding.appLock.title": "Screen lock ensures that no one can open the app except you.",
  "onboarding.appLock.choosePinButtonText": "Choose PIN",
  "onboarding.pinCode.enterPin": "Choose 4-digit PIN",
  "onboarding.pinCode.confirmPin": "Confirm the 4-digit PIN",
  "onboarding.pinCode.goBackButtonText": "Go back",
  "onboarding.pinCode.cancelButtonText": "Cancel",
  "onboarding.pinCode.nonMatchingPinCodes": "The numbers did not match",
  "onboarding.biometrics.title": "You can also use {biometricType} to access the app without entering a PIN.",
  "onboarding.biometrics.notEnrolled": "Your device supports {biometricType} but you haven't enrolled into it yet.",
  "onboarding.biometrics.useBiometricsButtonText": "Use {biometricType}",
  "onboarding.biometrics.skipButtonText": "Skip for now",
  "onboarding.biometrics.type.faceId": "Face ID",
  "onboarding.biometrics.type.facialRecognition": 'facial recognition',
  "onboarding.biometrics.type.fingerprint": "fingerprint",
  "onboarding.biometrics.type.iris": "iris scanner",

  // user
  "user.screenTitle": "User",
  "user.tabs.preferences": "Settings",
  "user.tabs.personalInfo": "Personal info",

  // user: settings
  "settings.infoBoxText": "Configure your app preferences",
  "settings.accessibilityLayout.groupTitle": "Layout and accessibility",
  "settings.accessibilityLayout.language": "Language",
  "settings.accessibilityLayout.sytemDarkMode": "Use system appearance",
  "settings.accessibilityLayout.darkMode": "Dark mode",
  "settings.communication.groupTitle": "Notifications and communication",
  "settings.communication.newDocumentsNotifications": "Get notifications of new documents",
  "settings.communication.appUpdatesNotifications": "Get notifications about app updates",
  "settings.communication.applicationsNotifications": "Get notifications about application status updates",
  "settings.security.groupTitle": "Security and privacy",
  "settings.security.changePinLabel": "Change PIN",
  "settings.security.changePinDescription": "Choose a new 4-digit PIN number",
  "settings.security.useBiometricsLabel": "Use {biometricType}",
  "settings.security.useBiometricsDescription": "That way you can skip entering your PIN number",
  "settings.security.appLockTimeoutLabel": "App lock timeout",
  "settings.security.appLockTimeoutDescription": "Time until app lock will appear",
  "settings.about.groupTitle": "About",
  "settings.about.versionLabel": "Version",
  "settings.about.logoutLabel": "Logout",
  "settings.about.logoutDescription": "You will have to login again",

  // user: personal info
  "user.natreg.infoBox": "Your registration in Þjóðskrá Íslands",
  "user.natreg.displayName": "Display name",
  "user.natreg.nationalId": "Social ID",
  "user.natreg.birthPlace": "Birthplace",
  "user.natreg.legalResidence": "Legal domicile",
  "user.natreg.gender": "Gender",
  "user.natreg.genderValue": `{
    gender,
    select,
    FEMALE {Female}
    MALE {Male}
    TRANSGENDER {Transgender}
    MALE_MINOR {Boy}
    FEMALE_MINOR {Girl}
    TRANSGENDER_MINOR {Transgender}
    UNKNOWN {Unknown}
  }`,
  "user.natreg.maritalStatus": "Marital status",
  "user.natreg.maritalStatusValue": `{
    maritalStatus,
    select,
    MARRIED {Married}
    UNMARRIED {Unmarried}
    WIDOWED {Widowed}
    SEPARATED {Separated}
    DIVORCED {Divorced}
    MARRIED_LIVING_SEPARATELY {Married}
    MARRIED_TO_FOREIGN_LAW_PERSON {Married}
    UNKNOWN {Unknown}
    FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {Married}
    ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {Married}
  }`,
  "user.natreg.citizenship": "Citizenship",
  "user.natreg.religion": "Religion",

  // Home
  "home.screenTitle": "Overview",
  "home.applicationsStatus": "Applications",
  "home.notifications": "Notifications",
  "home.welcomeText": "Hi",

  // inbox
  "inbox.screenTitle": "Inbox",
  "inbox.bottomTabText": "Inbox",

  // wallet
  "wallet.screenTitle": "Wallet",
  "wallet.bottomTabText": "Wallet",

  // notifications
  "notifications.screenTitle": "Notifications",

  // notification detail
  "notificationDetail.screenTitle": "Notification",

  // document detail
  "documentDetail.screenTitle": "Document",

  // cards
  "applicationStatusCard.openButtonLabel": "Open application",
  "applicationStatusCard.state": `{
    state,
    select,
    draft {Draft}
    missingInfo {Missing info}
    inReview {In review}
    approved {Approved}
    rejected {Rejected}
  }`,
  "applicationStatusCard.noActiveApplications": "No active applications"
}
