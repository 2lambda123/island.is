import React from 'react'
import { Box, LinkContext, Tag, Text } from '@island.is/island-ui/core'
import * as styles from './AccessDenied.css'
import { useLocale, useNamespaces } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'

import { ServicePortalModuleComponent } from '../../lib/service-portal-core'

export const AccessDeniedLegal: ServicePortalModuleComponent = () => {
  useNamespaces('service.portal')
  const { formatMessage } = useLocale()
  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <a
            style={{
              color: theme.color.blue400,
              textDecoration: 'underline',
              textUnderlineOffset: theme.spacing[1] / 2,
            }}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        ),
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box
          marginY={6}
          textAlign="center"
          justifyContent="center"
          className={styles.errorScreenTextContainer}
        >
          <Box marginBottom={4}>
            <Tag variant={'red'}>
              {formatMessage({
                id: 'service.portal:error-tag-legal',
                defaultMessage: 'Pósthólf',
              })}
            </Tag>
          </Box>
          <Text variant="h1" as="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:error-title-legal-no-access',
              defaultMessage: 'Aðgangur læstur',
            })}
          </Text>
          <Text variant="default" as="p">
            {formatMessage({
              id: 'service.portal:error-text-legal-no-access',
              defaultMessage:
                'Því miður hefur þú ekki aðgang að þessari síðu. ',
            })}

            <a
              href="https://www.barnasattmali.is/is/um-barnasattmalann/heildartexti-barnasattmalans"
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatMessage({
                id: 'service.portal:error-link-legal-no-access',
                defaultMessage: 'Samkvæmt 16. grein Barnasáttmálans',
              })}
            </a>
            {formatMessage({
              id: 'service.portal:error-text-legal-no-access-2',
              defaultMessage:
                ' þá eiga öll börn eiga rétt á einkalífi. Lögin eiga að vernda einkalíf barna, fjölskyldur og heimili. Börn eiga líka rétt á því að samskipti þeirra við aðra, orðspor þeirra og fjölskyldna þeirra sé verndað með lögum.',
            })}
          </Text>
        </Box>
        <Box display="flex" justifyContent="center">
          <img
            src="./assets/images/jobsGrid.svg"
            alt=""
            className={styles.img}
          />
        </Box>
      </Box>
    </LinkContext.Provider>
  )
}

export default AccessDeniedLegal
