import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Header as IslandUIHeader } from '@island.is/island-ui/core'
import { UserContext } from '../../context'
import { useI18n } from '../../i18n'
import { Routes } from '../../types'
import { useLogOut } from '@island.is/air-discount-scheme-web/utils/hooks/useLogout'
import { CurrentUserQuery } from '@island.is/air-discount-scheme-web/graphql/gqlQueries'
import useUser from '@island.is/air-discount-scheme-web/utils/hooks/useUser'

interface PropTypes {
  routeKey: keyof Routes
  localeKey: string
}

function Header({ routeKey, localeKey }: PropTypes) {
  const logOut = useLogOut()

  const { isAuthenticated, user, setUser, loadingUser } = useUser()
  const { toRoute, activeLocale, switchLanguage } = useI18n()

  const nextLanguage = activeLocale === 'is' ? 'en' : 'is'
  const nextPath = activeLocale === 'is' ? '/' : '/en'
  // TODO: get text from cms and pass down to Header
  const logoutText = activeLocale === 'is' ? 'Útskrá' : 'Logout'

  return (
    <IslandUIHeader
      logoRender={(logo) => <a href={nextPath}>{logo}</a>}
      logoutText={logoutText}
      userLogo={user?.role === 'developer' ? '👑' : undefined}
      language={nextLanguage.toUpperCase()}
      switchLanguage={() => {
        const route = localeKey && toRoute(routeKey, nextLanguage)
        switchLanguage(route, nextLanguage)
      }}
      userName={user?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => logOut()}
    />
  )
}

export default Header