import { User } from '@island.is/auth-nest-tools'

export interface CreateAdrOptions {
  user: User
  expired?: boolean
}

export const createAdrLicense = ({
  user,
  expired = false,
}: CreateAdrOptions) => {
  return {
    kennitala: user.nationalId,
    fulltNafn: 'Test maður',
    skirteinisNumer: '00001',
    faedingardagur: '1930-01-01T00:00:00',
    rikisfang: 'IS',
    gildirTil: expired ? '2010-01-01T00:00:00' : '2050-01-01T00:00:00',
    adrRettindi: [
      {
        flokkur: '1',
        grunn: false,
        tankar: false,
        heiti: [
          {
            flokkur: '1.',
            heiti: 'Sprengifim efni og hlutir.',
          },
        ],
      },
      {
        flokkur: '4.1, 4.2',
        grunn: true,
        tankar: true,
        heiti: [
          {
            flokkur: '4.1',
            heiti:
              'Eldfim föst efni, sjálfhvarfandi efni og sprengifim efni í föstu formi sem gerð hafa verið hlutlaus.',
          },
          {
            flokkur: '4.2',
            heiti: 'Sjálftendrandi efni.',
          },
        ],
      },
    ],
  }
}
