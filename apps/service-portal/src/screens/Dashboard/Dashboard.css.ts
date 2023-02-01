import { theme, themeUtils } from '@island.is/island-ui/theme'
import { styleVariants } from '@vanilla-extract/css'

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 34,
    left: 37,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
    ...themeUtils.responsiveStyle({
      md: {
        left: 42,
      },
    }),
  },
  inactive: {
    display: 'none',
  },
})
