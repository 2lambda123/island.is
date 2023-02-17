export enum ServicePortalPath {
  // Mínar síður
  MinarSidurRoot = '/',
  MinarSidurPath = '/minarsidur',
  MinarSidurSignInOidc = '/signin-oidc',
  MinarSidurSilentSignInOidc = '/silent/signin-oidc',

  // Applications
  ApplicationRoot = '/umsoknir',
  ApplicationIncompleteApplications = '/umsoknir/oklaradar-umsoknir',
  ApplicationCompleteApplications = '/umsoknir/klaradar-umsoknir',
  ApplicationInProgressApplications = '/umsoknir/i-vinnslu',
  ApplicationNewApplication = '/umsoknir/ny-umsokn',
  ApplicationOpenApplications = '/umsoknir/opnar-umsoknir',
  ApplicationPrescription = '/umsoknir/lyfsedlar',
  ApplicationDrivingLicense = '/umsoknir/okuskirteini',

  // Settings
  SettingsRoot = '/stillingar',
  SettingsAccessControl = '/stillingar/adgangsstyring',
  SettingsAccessControlGrant = '/stillingar/adgangsstyring/veita',
  SettingsAccessControlAccess = '/stillingar/adgangsstyring/:delegationId',

  // Access Control
  AccessControlDelegationsGrant = '/adgangsstyring/umbod/veita',
  // Access Control - Outgoing delegations, i.e. from me
  AccessControlDelegations = '/adgangsstyring/umbod',
  AccessControlDelegationAccess = '/adgangsstyring/umbod/:delegationId',
  // Access Control - Incoming delegations, i.e. to me
  AccessControlDelegationsIncoming = '/adgangsstyring/umbod-til-min',

  SettingsPersonalInformation = '/stillingar/minar-stillingar',
  SettingsPersonalInformationEditPhoneNumber = '/stillingar/minar-stillingar/breyta-simanumeri',
  SettingsPersonalInformationEditEmail = '/stillingar/minar-stillingar/breyta-netfangi',
  SettingsPersonalInformationEditLanguage = '/stillingar/minar-stillingar/breyta-tungumali',
  SettingsPersonalInformationEditNudge = '/stillingar/minar-stillingar/breyta-hnippi',
  SettingsPersonalInformationEditBankInfo = '/stillingar/minar-stillingar/reikningsnumer',
  SettingsPersonalInformationEmailConfirmation = '/stillingar/minar-stillingar/stadfesta-netfang/:hash',
  SettingsExternal = 'https://minarsidur.island.is/minar-sidur/minn-adgangur/stillingar/',
  SettingsIslykill = '/stillingar/islykill',

  // Family
  Child = '/min-gogn/barn/:nationalId',
  FamilyMember = '/min-gogn/fjolskylda/:nationalId',
  Spouse = '/min-gogn/maki/:nationalId',
  MyInfoRoot = '/min-gogn',
  UserInfo = '/min-gogn/minar-upplysingar',
  Endorsements = '/min-gogn/medmaeli',
  // Education License
  EducationLicense = '/min-gogn/leyfisbref',
  // Education
  EducationRoot = '/min-gogn/menntun',
  EducationDegree = '/min-gogn/menntun/profgradur',
  EducationCareer = '/min-gogn/menntun/namsferill',
  EducationStudentAssessment = '/min-gogn/menntun/namsferill/:familyIndex/samraemd-prof',
  EducationExternal = 'https://minarsidur.island.is/minar-sidur/menntun/namsferill/',

  Company = '/fyrirtaeki',

  // General Petitions
  Petitions = '/min-gogn/medmaeli',
  PetitionsAdminView = '/min-gogn/medmaeli-admin',
  PetitionList = '/min-gogn/medmaeli/:listId',
  PetitionListAdmin = '/min-gogn/medmaeli-admin/:listId',

  RealEstateExternal = 'https://minarsidur.island.is/minar-sidur/min-gogn/fasteignir',

  // Fjarmal
  FinanceRoot = '/fjarmal',
  FinanceStatus = '/fjarmal/stada',
  FinanceTransactions = '/fjarmal/faerslur',
  FinanceEmployeeClaims = '/fjarmal/laungreidendakrofur',
  FinanceLocalTax = '/fjarmal/utsvar',
  FinanceBills = '/fjarmal/greidslusedlar-og-greidslukvittanir',
  FinanceVehicles = 'https://mitt.samgongustofa.is/',
  FinancePayments = '/greidslur',
  FinanceExternal = 'https://minarsidur.island.is/minar-sidur/fjarmal/fjarmal-stada-vid-rikissjod-og-stofnanir/',
  FinanceSchedule = '/fjarmal/greidsluaetlanir',
  // Electronic Documents
  ElectronicDocumentsRoot = '/postholf',
  ElectronicDocumentsFileDownload = '/postholf/:id',

  // Heilsa
  HealthRoot = '/heilsa',

  // Transports
  TransportRoot = '/samgongur',
  TransportVehicles = '/samgongur/okutaeki',
  TransportMyVehicles = '/samgongur/okutaeki/min-okutaeki',
  TransportVehiclesDetail = '/samgongur/okutaeki/min-okutaeki/:id',
  TransportVehiclesLookup = '/samgongur/okutaeki/leit',
  TransportVehiclesHistory = '/samgongur/okutaeki/okutaekjaferill',
  TransportVehiclesDrivingLessons = '/samgongur/okutaeki/okunam',
  TransportLowerAirfare = '/samgongur/loftbru',

  // Assets
  AssetsRoot = '/fasteignir',
  AssetsRealEstateDetail = '/fasteignir/:id',

  // Messages
  MessagesRoot = '/skilabod',

  // My licenses
  MyLicensesRoot = '/min-rettindi',
  ParentalLeave = '/min-rettindi/faedingarorlof',

  // Icelandic Names Registry
  IcelandicNamesRegistryRoot = '/mannanafnaskra',

  // Licenses service
  LicensesRoot = '/skirteini',
  // Pattern should be : /skirteini/provider/licensetype
  DrivingLicensesDetail = '/skirteini/rikislogreglustjori/okurettindi',
  ADRLicensesDetail = '/skirteini/umhverfisstofnun/adrrettindi',
  FirearmLicensesDetail = '/skirteini/rikislogreglustjori/skotvopnaleyfi',
  MachineLicensesDetail = '/skirteini/vinnueftirlitid/vinnuvelarettindi',
  LicensesPassportDetail = '/skirteini/tjodskra/vegabref/:id',
  LicensesDetail = '/skirteini/:provider/:type',

  // Air Discount
  AirDiscountRoot = '/loftbru',
}
