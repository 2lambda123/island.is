import React from 'react'
import { AnimatePresence,motion } from 'framer-motion'

import { Icon, Text, Tooltip } from '@island.is/island-ui/core'

import * as styles from './HideableText.css'

interface Props {
  text: string
  onToggleVisibility: (isVisible: boolean) => void
  isHidden?: boolean
  tooltip?: string
}

const HideableText: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { text, onToggleVisibility, tooltip, isHidden } = props

  const renderVisibilityButton = () => (
    <button
      className={styles.eyeButton}
      onClick={() => {
        onToggleVisibility(!isHidden)
      }}
    >
      <AnimatePresence>
        {isHidden && (
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 30 }}
            exit={{ width: 0 }}
            className={styles.eyeStrikethrough}
          />
        )}
      </AnimatePresence>
      <Icon
        icon="eye"
        type="outline"
        color={isHidden ? 'dark300' : 'blue400'}
      />
    </button>
  )

  return (
    <div className={styles.hideableTextContainer}>
      <Text strikethrough={isHidden} color={isHidden ? 'dark300' : 'dark400'}>
        {text}
      </Text>
      {tooltip ? (
        <Tooltip text={tooltip} placement="right">
          {renderVisibilityButton()}
        </Tooltip>
      ) : (
        renderVisibilityButton()
      )}
    </div>
  )
}

export default HideableText
