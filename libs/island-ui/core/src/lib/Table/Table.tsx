import React, { ReactNode, FC, AllHTMLAttributes } from 'react'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'

import { useBoxStyles, UseBoxStylesProps } from '../Box/useBoxStyles'
import { getTextStyles, TextProps } from '../Text/Text'
import * as styles from './Table.css'
import { TestSupport } from '@island.is/island-ui/utils'

type DataField = {
  children?: ReactNode
  text?: Pick<
    TextProps,
    'variant' | 'color' | 'truncate' | 'fontWeight' | 'lineHeight'
  >
  box?: Omit<UseBoxStylesProps, 'component'>
  borderColor?: keyof typeof theme.color
  align?: 'left' | 'right' | 'center'
}

type Table = {
  children?: ReactNode
  box?: Omit<UseBoxStylesProps, 'component'>
}

export const Table = ({
  children,
  box,
  ...props
}: Table & Omit<AllHTMLAttributes<HTMLTableElement>, 'className'>) => (
  <div className={useBoxStyles({ component: 'div', overflow: 'auto', ...box })}>
    <table
      className={cn(
        useBoxStyles({
          component: 'table',
          width: 'full',
        }),
        styles.table,
      )}
      {...props}
    >
      {children}
    </table>
  </div>
)

interface HeadProps {
  children?: ReactNode
  sticky?: boolean
}

<<<<<<< HEAD
interface TProps {
  children?: ReactNode
}

export const Head: FC<HeadProps> = ({ children, sticky }) => (
=======
export const Head: FC<React.PropsWithChildren<HeadProps>> = ({
  children,
  sticky,
}) => (
>>>>>>> 4be5593cc52459a4a5bd48e19735e254c81b7c0b
  <thead
    {...(sticky && {
      className: styles.stickyHead,
    })}
  >
    {children}
  </thead>
)

export const Body: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <tbody>{children}</tbody>
)

export const Foot: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <tfoot>{children}</tfoot>
)

export const Row: FC<React.PropsWithChildren<TestSupport>> = ({
  children,
  dataTestId,
}) => <tr data-testid={dataTestId}>{children}</tr>

export const Data = ({
  children,
  text = {},
  box = {},
  borderColor = 'blue200',
  align,
  ...props
}: DataField &
  Omit<AllHTMLAttributes<HTMLTableDataCellElement>, 'className'>) => {
  const classNames = cn(
    styles.cell,
    getTextStyles({
      variant: 'small',
      ...text,
    }),
    useBoxStyles({
      component: 'td',
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 'p5',
      paddingBottom: 'p5',
      borderBottomWidth: 'standard',
      borderColor,
      textAlign: align,
      ...box,
    }),
  )
  return (
    <td className={classNames} {...props}>
      {children}
    </td>
  )
}
export const HeadData = ({
  children,
  text = {},
  box = {},
  align = 'left',
  ...props
}: DataField &
  Omit<AllHTMLAttributes<HTMLTableHeaderCellElement>, 'className'>) => {
  const classNames = cn(
    styles.cell,
    getTextStyles({
      variant: 'h5',
      ...text,
    }),
    useBoxStyles({
      component: 'th',
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 'p2',
      paddingBottom: 'p2',
      borderBottomWidth: 'standard',
      borderColor: 'blue200',
      background: 'blue100',
      textAlign: align,
      ...box,
    }),
  )
  return (
    <th className={classNames} {...props}>
      {children}
    </th>
  )
}
