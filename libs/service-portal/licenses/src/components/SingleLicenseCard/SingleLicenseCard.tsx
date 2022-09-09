import { ReactNode } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Button, Hidden, Tag, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './SingleLicenseCard.css'
import { m } from '../../lib/messages'

export const SingleLicenseCard = ({
  title,
  subtitle,
  link,
  img,
  tag = {
    text: undefined,
    color: 'blue',
  },
  conditionalTag,
  additionalLink,
  additionalLinkText,
}: {
  title: string
  subtitle: string
  link: string
  img: string
  tag: {
    text?: string
    color: 'red' | 'blue'
  }
  conditionalTag?: ReactNode
  additionalLink?: ReactNode | string
  additionalLinkText?: string
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()

  return (
    <Box
      border="standard"
      borderRadius="large"
      padding={4}
      display="flex"
      flexDirection="row"
    >
      <Hidden below="sm">
        <img className={styles.image} src={img} alt={title} />
      </Hidden>
      <Box
        display="flex"
        flexDirection="column"
        width="full"
        paddingLeft={[0, 2]}
      >
        <Box
          display="flex"
          flexDirection={['column', 'column', 'column', 'row']}
          justifyContent="spaceBetween"
          alignItems="flexStart"
        >
          <Text variant="h4" as="h2">
            {title}
          </Text>
          <Box
            display="flex"
            flexDirection={['column', 'column', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexEnd']}
            justifyContent="flexEnd"
            textAlign="right"
            marginBottom={1}
          >
            {conditionalTag && (
              <Box paddingRight={1} paddingTop={[1, 0]}>
                {conditionalTag}
              </Box>
            )}
            {tag.text ? (
              <Box paddingTop={conditionalTag ? [1, 1, 0] : undefined}>
                <Tag disabled variant={tag.color}>
                  {tag.text}
                </Tag>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={['column', 'row']}
          justifyContent={'spaceBetween'}
          paddingTop={[1, 0]}
        >
          <Box className={styles.flexShrink}>
            <Text>{subtitle}</Text>
          </Box>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            justifyContent={'flexEnd'}
            alignItems={['flexStart', 'center']}
            className={styles.flexGrow}
            paddingTop={[1, 0]}
          >
            {additionalLink &&
              (typeof additionalLink === 'string' ? (
                <Link
                  to={{
                    pathname: additionalLink,
                  }}
                >
                  <Box paddingTop={[1, 0]}>
                    <Button variant="text" size="small" icon="arrowForward">
                      {additionalLinkText
                        ? additionalLinkText
                        : formatMessage(m.seeDetails)}
                    </Button>
                  </Box>
                </Link>
              ) : (
                additionalLink
              ))}
            {additionalLink && (
              <Hidden below="sm">
                <Box className={styles.line} marginLeft={2} marginRight={2} />
              </Hidden>
            )}
            <Link
              to={{
                pathname: link,
              }}
            >
              <Box paddingTop={[1, 0]}>
                <Button variant="text" size="small" icon="arrowForward">
                  {formatMessage(m.seeDetails)}
                </Button>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SingleLicenseCard
