import { spacing, theme, themeUtils } from '@island.is/island-ui/theme'
import {
  globalStyle,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css'
import { StyleWithSelectors } from '@vanilla-extract/css/dist/declarations/src/types'

const wrapperAnimation = keyframes({
  '0%': {
    transform: 'scale(1.05)',
    opacity: 0,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
})

export const link = style({
  display: 'block',
  height: '100%',
  paddingBottom: theme.spacing['1'],
})

export const categories = style({
  flexGrow: 2,
})

const iconBase: StyleWithSelectors = {
  width: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const icon = style({
  ...iconBase,
  marginRight: theme.spacing[1],
})

export const iconSmall = style({
  ...iconBase,
  marginBottom: theme.spacing[1],
})

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 6,
    left: -2,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
    ...themeUtils.responsiveStyle({
      md: {
        left: -2,
      },
    }),
  },
  inactive: {
    display: 'none',
  },
})

export const container = style({
  top: theme.headerHeight.small,
  zIndex: theme.zIndex.belowHeader,
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
  overflowY: 'auto',

  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: 'unset',
      overflowY: 'unset',
      top: 'unset',
    },
  }),
})

const dropdownBase: StyleWithSelectors = {
  position: 'fixed',
  right: spacing[0],
  left: spacing[0],
  borderRadius: 'unset',
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
}

const dropdownBaseMD: StyleWithSelectors = {
  top: spacing[3],
  width: 358,
  borderRadius: theme.border.radius.large,
  filter: 'drop-shadow(0px 4px 70px rgba(0, 97, 255, 0.1))',
}

export const dropdown = style({
  ...dropdownBase,
  ...themeUtils.responsiveStyle({
    md: {
      ...dropdownBaseMD,
      left: 'auto',
      right: 'auto',
    },
  }),
})

export const fullScreen = style({
  ...dropdownBase,
  maxHeight: 'none',
  top: 0,
  ...themeUtils.responsiveStyle({
    md: {
      ...dropdownBaseMD,
      left: 'auto',
      right: spacing[3],
    },
  }),
})

export const wrapper = style({
  maxHeight: `calc(100vh - ${spacing[12]}px)`,
  overflowY: 'auto',
  overflowX: 'hidden',
})

export const closeButton = style({
  justifyContent: 'center',
  alignItems: 'center',

  position: 'absolute',
  top: spacing[1],
  right: spacing[1],
  zIndex: 20,

  width: 44,
  height: 44,

  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: theme.color.white,

  borderRadius: '100%',
  transition: 'background-color 250ms, border-color 250ms',

  ':hover': {
    backgroundColor: theme.color.dark100,
  },

  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})

export const itemLink = style({
  width: '100%',
  ':hover': {
    textDecoration: 'none',
  },
})

export const item = style({
  ':hover': {
    borderColor: theme.color.blue600,
    cursor: 'pointer',
  },
})

export const smallItem = style({
  height: 88,
  maxHeight: 88,
  transition: 'max-height 200ms ease-out',
  width: '31.6%',
  ':hover': {
    height: 'auto',
    maxHeight: 120,
    transition: 'max-height 250ms ease-in',
  },
})

export const itemText = style({
  fontSize: 14,
  textAlign: 'center',
})

export const overviewIcon = style({
  height: 40,
  width: 40,
})

globalStyle(`${item}:hover a div div svg`, {
  color: theme.color.blue600,
})
