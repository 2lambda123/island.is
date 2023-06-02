import React from 'react'
import { defineMessage } from 'react-intl'
import { checkDelegation } from '@island.is/shared/utils'
import { info } from 'kennitala'

import { Box, Divider, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  IntroHeader,
  m,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'
import { spmm, urls } from '../../lib/messages'
import {
  formatNameBreaks,
  formatResidenceString,
} from '../../helpers/formatting'
import { useNationalRegistryUserV3Query } from './UserInfo.generated'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const SubjectInfo = () => {
  useNamespaces('sp.family')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const isDelegation = userInfo && checkDelegation(userInfo)

  const { data, loading, error } = useNationalRegistryUserV3Query()
  const { nationalRegistryUserV3: nationalRegistryUser } = data || {}

  const isUserAdult = info(userInfo.profile.nationalId).age >= 18

  return (
    <>
      <IntroHeader title={userInfo.profile.name} intro={spmm.userInfoDesc} />
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={m.fullName}
          loading={loading}
          content={nationalRegistryUser?.fullName}
          tooltip={formatNameBreaks(nationalRegistryUser ?? undefined, {
            givenName: formatMessage(spmm.givenName),
            middleName: formatMessage(spmm.middleName),
            lastName: formatMessage(spmm.lastName),
          })}
          editLink={{
            external: true,
            title: spmm.changeInNationalReg,
            url: formatMessage(urls.editAdult),
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.natreg}
          loading={loading}
          content={formatNationalId(userInfo.profile.nationalId)}
        />
        <Divider />

        <UserInfoLine
          label={m.legalResidence}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : formatResidenceString(
                  nationalRegistryUser?.address ?? undefined,
                )
          }
          loading={loading}
          editLink={{
            external: true,
            title: spmm.changeInNationalReg,
            url: formatMessage(urls.editResidence),
          }}
        />
        <Divider />
        <Box marginY={3} />
        <UserInfoLine
          title={formatMessage(m.baseInfo)}
          label={m.birthPlace}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.birthplace?.location || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={m.familyNumber}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.familyRegistrationCode || ''
          }
          loading={loading}
          tooltip={formatMessage({
            id: 'sp.family:family-number-tooltip',
            defaultMessage:
              'Lögheimilistengsl er samtenging á milli einstaklinga á lögheimili, en veitir ekki upplýsingar um hverjir eru foreldrar barns eða forsjáraðilar.',
          })}
        />
        {isUserAdult ? (
          <>
            <Divider />
            <UserInfoLine
              label={m.maritalStatus}
              content={
                error
                  ? formatMessage(dataNotFoundMessage)
                  : nationalRegistryUser?.spouse?.maritalStatus
                  ? formatMessage(nationalRegistryUser?.spouse?.maritalStatus)
                  : ''
              }
              loading={loading}
            />
          </>
        ) : null}

        <Divider />
        <UserInfoLine
          label={defineMessage(m.religion)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.religion?.name || ''
          }
          loading={loading}
          editLink={{
            external: true,
            title: spmm.changeInNationalReg,
            url: formatMessage(urls.editReligion),
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.banMarking}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.banMarking
              ? formatMessage({
                  id: 'sp.family:yes',
                  defaultMessage: 'Já',
                })
              : formatMessage({
                  id: 'sp.family:no',
                  defaultMessage: 'Nei',
                })
          }
          tooltip={formatMessage({
            id: 'sp.family:ban-marking-tooltip',
            defaultMessage:
              'Bannmerktir einstaklingar koma t.d. ekki fram á úrtakslistum úr þjóðskrá og öðrum úrtökum í markaðssetningarskyni.',
          })}
          loading={loading}
          editLink={{
            external: true,
            title: spmm.changeInNationalReg,
            url: formatMessage(urls.editBanmarking),
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.gender}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.gender
              ? formatMessage(nationalRegistryUser.gender)
              : ''
          }
          loading={loading}
        />
        {nationalRegistryUser?.citizenship?.name ? (
          <>
            <Divider />
            <UserInfoLine
              label={m.citizenship}
              content={
                error
                  ? formatMessage(dataNotFoundMessage)
                  : nationalRegistryUser.citizenship.name
              }
              loading={loading}
            />
          </>
        ) : null}
        {/*!isDelegation && (
          <>
            <Divider />
            <Box marginY={3} />
            <UserInfoLine
              title={formatMessage(spmm.userFamilyMembersOnNumber)}
              label={userInfo.profile.name}
              content={formatNationalId(userInfo.profile.nationalId)}
              loading={loading || familyLoading}
            />
            <Divider />
            {nationalRegistryFamily && nationalRegistryFamily.length > 0
              ? nationalRegistryFamily?.map((item) => (
                  <React.Fragment key={item.nationalId}>
                    <UserInfoLine
                      label={item.fullName}
                      content={formatNationalId(item.nationalId)}
                      loading={loading}
                    />
                    <Divider />
                  </React.Fragment>
                ))
              : null}
          </>
              )*/}
      </Stack>
    </>
  )
}

export default SubjectInfo
