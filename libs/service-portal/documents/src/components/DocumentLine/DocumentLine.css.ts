import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const unopenedWrapper = style({
  backgroundColor: 'unset',
  ...themeUtils.responsiveStyle({
    sm: {
      backgroundColor: '#FBFBFC',
    },
  }),
})

export const line = style({
  fontSize: theme.typography.baseFontSize,
  borderBottom: `1px solid ${theme.color.blue100}`,
})

export const button = style({})

export const unopened = style({
  fontWeight: theme.typography.semiBold,
})

export const sender = style({
  fontWeight: theme.typography.light,
  fontSize: 14,
  ...themeUtils.responsiveStyle({
    md: {
      fontWeight: theme.typography.regular,
      fontSize: theme.typography.baseFontSize,
    },
  }),
})

export const image = style({
  width: 34,
  height: 34,
  // margin: theme.spacing[2],
})

export const icon = style({
  marginLeft: 6,
})

export const imageContainer = style({
  minWidth: 66,
  minHeight: 66,
  maxHeight: 66,
  maxWidth: 66,
})

export const linkWrapper = style({
  backgroundColor: 'unset',
  ...themeUtils.responsiveStyle({
    sm: {
      backgroundColor: theme.color.blueberry100,
    },
  }),
})
