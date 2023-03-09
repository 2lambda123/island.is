import {
  Box,
  Hidden,
  ResponsiveProp,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { ReactNode, Children } from 'react'
import flattenChildren from 'react-keyed-flatten-children'
import * as styleRefs from './HeroTiles.css'
import {
  normaliseResponsiveProp,
  resolveResponsiveProp,
} from '../../utils/helpers/responsiveProp'

export type ReactNodeNoStrings = ReactNode | boolean | null | undefined
export interface HeroTiles {
  children: ReactNodeNoStrings
  space: ResponsiveSpace
  columns: ResponsiveProp<1 | 2 | 3 | 4 | 5 | 6>
}

export const HeroTiles = ({
  children,
  space = 'none',
  columns = 1,
}: HeroTiles) => {
  const styles = { ...styleRefs }
  const responsiveSpace = normaliseResponsiveProp(space)

  return (
    <Box>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="flexEnd"
        style={{ flexFlow: 'wrap-reverse', alignItems: 'end' }}
      >
        {Children.map(flattenChildren(children), (child, i) => (
          <Box
            key={i}
            minWidth={0}
            className={resolveResponsiveProp(
              columns,
              styles.columnsXs,
              styles.columnsSm,
              styles.columnsMd,
              styles.columnsLg,
              styles.columnsXl,
            )}
          >
            <Hidden below="lg">
              <Box
                height="full"
                paddingBottom={i === 2 ? responsiveSpace : 0}
                paddingRight={i === 0 ? responsiveSpace : 0}
              >
                {child}
              </Box>
            </Hidden>
            <Hidden above="md">
              <Box height="full" paddingTop={responsiveSpace}>
                {child}
              </Box>
            </Hidden>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default HeroTiles
