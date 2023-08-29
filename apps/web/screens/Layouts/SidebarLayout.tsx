import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import cn from 'classnames'

import * as styles from './SidebarLayout.css'

interface SidebarLayoutProps {
  sidebarContent: ReactNode
  isSticky?: boolean
  hiddenOnTablet?: boolean
  fullWidthContent?: boolean
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  contentId?: string
}

export const SidebarLayout: FC<React.PropsWithChildren<SidebarLayoutProps>> = ({
  sidebarContent,
  isSticky = true,
  hiddenOnTablet = false,
  fullWidthContent = false,
  paddingTop = [0, 0, 8],
  paddingBottom = 6,
  contentId,
  children,
}) => {
  return (
    <Box paddingTop={paddingTop}>
      <GridContainer position="none">
        <Box
          {...(contentId && { id: contentId })}
          display="flex"
          flexDirection="row"
          height="full"
          paddingBottom={paddingBottom}
          position={isSticky ? 'relative' : undefined}
        >
          <Box
            printHidden
            className={cn(styles.sidebarWrapper, { [styles.sticky]: isSticky })}
            display={
              hiddenOnTablet
                ? ['none', 'none', 'none', 'block']
                : ['none', 'none', 'block']
            }
          >
            {sidebarContent}
          </Box>
          <GridContainer>
            <GridRow>
              <GridColumn
                offset={fullWidthContent ? '0' : ['0', '0', '0', '0', '1/9']}
                span={[
                  '9/9',
                  '9/9',
                  '9/9',
                  '9/9',
                  fullWidthContent ? '9/9' : '7/9',
                ]}
              >
                <Box paddingLeft={[0, 0, hiddenOnTablet ? 0 : 6, 6, 0]}>
                  {children}
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </GridContainer>
    </Box>
  )
}

export default SidebarLayout
