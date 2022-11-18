import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { theme } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'
interface Props {
  top?: number
  constantSticky?: boolean
}

export const Sticky: FC<Props> = ({
  children,
  constantSticky = false,
  top = SERVICE_PORTAL_HEADER_HEIGHT_LG + theme.spacing[7],
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [usesSticky, setUsesSticky] = useState<boolean>(constantSticky)

  const onResize = useCallback(() => {
    if (ref?.current && !constantSticky) {
      setUsesSticky(
        Boolean(
          ref.current.offsetHeight <
            window.innerHeight - SERVICE_PORTAL_HEADER_HEIGHT_LG,
        ),
      )
    }
  }, [ref])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  return (
    <aside
      ref={ref}
      style={{
        top,
        zIndex: 1,
        ...(usesSticky && { position: 'sticky' }),
      }}
    >
      {children}
    </aside>
  )
}

export default Sticky
