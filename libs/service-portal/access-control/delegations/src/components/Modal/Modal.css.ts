import { style } from '@vanilla-extract/css'

export const modal = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  background: 'rgba(203, 203, 215, 0.8)',
})
