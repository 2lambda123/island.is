import React, { ReactElement, useRef } from 'react'
import { Box, Divider, Icon, Stack, Text } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import * as styles from './Sidemenu.css'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import { Link } from 'react-router-dom'
import { UserLanguageSwitcher } from '@island.is/shared/components'
import { useAuth } from '@island.is/auth/react'
import { useNavigation } from '@island.is/portals/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'

interface Props {
  position: number
}
const Sidemenu = ({ position }: Props): ReactElement | null => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const navigation = useNavigation(MAIN_NAVIGATION)
  const { formatMessage } = useLocale()
  const { userInfo: user } = useAuth()

  const handleLinkClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })

  if (mobileMenuState === 'closed') return null

  return (
    <Box
      position="fixed"
      className={styles.wrapper}
      ref={ref}
      style={{ top: position }}
      background="blue200"
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        paddingY={6}
        paddingLeft={10}
        paddingRight={6}
        background="blue100"
      >
        {user && <UserLanguageSwitcher user={user} />}

        <button
          className={styles.closeButton}
          onClick={handleLinkClick}
          aria-label={formatMessage(sharedMessages.close)}
        >
          <Icon icon="close" color="blue400" />
        </button>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box
          className={styles.keyItems}
          justifyContent="flexEnd"
          background="blue100"
        >
          <Box
            paddingLeft={10}
            paddingBottom={6}
            className={styles.navItems}
            height="full"
            display="flex"
            flexDirection="column"
            justifyContent="flexEnd"
          >
            <Stack space={2}>
              {navigation?.children
                ?.filter((item) => item.isKeyitem)
                .map(
                  (navRoot, index) =>
                    navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                    !navRoot.navHide && (
                      <Link
                        to={navRoot.path ?? '/'}
                        onClick={handleLinkClick}
                        key={`sidemenu-item-${index}`}
                      >
                        <Text variant="h3" color="blue600">
                          {formatMessage(navRoot.name)}
                        </Text>
                      </Link>
                    ),
                )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidemenu
