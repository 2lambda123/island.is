import React from 'react'

import { logoKeyFromMunicipalityCode } from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../lib/types'
import * as styles from './Logo.css'

const withLogo = (Component: React.ComponentType<FAFieldBaseProps>) => (
  props: FAFieldBaseProps,
) => {
  const { municipality } = props.application.externalData.nationalRegistry?.data
  const svg = require(`../../svg/${
    logoKeyFromMunicipalityCode[municipality ? municipality.municipalityId : '']
  }`).default

  return (
    <>
      <Component {...props} />
      <Box marginTop={[10, 10, 12]} display="flex" justifyContent="flexEnd">
        <a
          href={municipality?.homepage}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.logo}
        >
          <img src={svg} alt="" />
        </a>
      </Box>
    </>
  )
}

export default withLogo
