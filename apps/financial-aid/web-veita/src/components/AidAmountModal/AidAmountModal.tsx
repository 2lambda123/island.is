import React from 'react'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './AidAmountModal.css'

import { Calculations } from '@island.is/financial-aid/shared/lib'

import { Breakdown } from '@island.is/financial-aid/shared/components'

interface Props {
  headline: string
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  calculations: Calculations[]
}

const AidAmountModal = ({
  headline,
  isVisible,
  onVisibilityChange,
  calculations,
}: Props) => {
  const closeModal = (): void => {
    onVisibilityChange(false)
  }

  return (
    <ModalBase
      baseId="changeStatus"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={styles.modalBase}
    >
      <Box onClick={closeModal} className={styles.modalContainer}>
        <Box
          position="relative"
          borderRadius="large"
          overflow="hidden"
          background="white"
          className={styles.modal}
        >
          <Text variant="h3" marginBottom={4}>
            {headline}
          </Text>

          <Breakdown calculations={calculations} />

          <Box
            display="flex"
            justifyContent="flexEnd"
            onClick={closeModal}
            marginTop={4}
          >
            <Button>Loka</Button>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default AidAmountModal
