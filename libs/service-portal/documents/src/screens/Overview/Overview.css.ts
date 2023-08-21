import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const loading = style({
  minHeight: 200,
})

export const loadingContainer = style({
  height: '100vh',
})

export const pdfControls = style({
  padding: theme.spacing[1],
  background: theme.color.white,
  alignItems: 'center',
  justifyContent: 'center',

  borderTop: 1,
  borderLeft: 1,
  borderBottom: 1,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  borderRadius: `${theme.border.radius.standard} ${theme.border.radius.standard} 0 0`,
})

export const pdfPage = style({
  background: theme.color.blue100,
  padding: theme.spacing[2],
  border: `1px solid ${theme.color.blue200}`,
  borderTop: 0,
})

export const btn = style({})

globalStyle(`${btn} > span`, {
  boxShadow: 'none',
})
