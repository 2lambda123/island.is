import {
  Box,
  Text,
  Hyphen,
  HyphenProps,
  BoxProps,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import * as styles from './InstitutionPanel.css'
import React from 'react'

interface InstitutionPanelProps {
  img?: string
  institutionTitle: string
  institution: string
  locale: HyphenProps['locale']
  linkHref: string
  imgContainerDisplay?: BoxProps['display']
  loading?: boolean
  size?: 'default' | 'small'
  backgroundColor?: 'purple100' | 'blue100' | 'white'
}

export const InstitutionPanel = ({
  img,
  institutionTitle,
  institution,
  locale,
  linkHref,
  imgContainerDisplay,
  loading = false,
  size = 'default',
  backgroundColor = 'purple100',
}: InstitutionPanelProps) => {
  return (
    <a
      href={linkHref}
      target="_blank"
      rel="noreferrer noopener"
      className={styles.link}
    >
      <Box
        background={backgroundColor}
        borderRadius="large"
        padding={2}
        paddingLeft={1}
        display="flex"
        alignItems="center"
      >
        <Box
          display={imgContainerDisplay}
          style={{ flex: '0 0 64px' }}
          marginRight={3}
        >
          {loading ? (
            <SkeletonLoader
              display="block"
              height={64}
              width={64}
              background="purple200"
            />
          ) : (
            <Box
              component="img"
              alt=""
              src={img ? img : './assets/images/skjaldarmerki.svg'}
              width="full"
              height="full"
            />
          )}
        </Box>
        <Box>
          {loading ? (
            <SkeletonLoader
              display="block"
              height={32}
              width={185}
              background="purple200"
            />
          ) : (
            size === 'default' && (
              <>
                <Text variant="eyebrow" color="purple600">
                  {institutionTitle}
                </Text>
                <Text
                  variant={institution.length > 24 ? 'h5' : 'h3'}
                  as="h3"
                  color="purple600"
                  lineHeight="sm"
                >
                  <Hyphen locale={locale}>{institution}</Hyphen>
                </Text>
              </>
            )
          )}
        </Box>
      </Box>
    </a>
  )
}

export default InstitutionPanel