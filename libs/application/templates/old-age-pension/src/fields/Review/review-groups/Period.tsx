import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { errorMessages, oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { MONTHS } from '../../../lib/constants'
import { isMoreThan2Year } from '../../../lib/oldAgePensionUtils'

export const Period = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ selectedYear, selectedMonth }] = useStatefulAnswers(application)
  const month = MONTHS.find((x) => x.value === selectedMonth)
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('periodField')}
    >
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.period)}
            value={`${month && formatMessage(month.label)} ${selectedYear}`}
          />
        </GridColumn>
      </GridRow>
      {isMoreThan2Year(application.answers) && (
        <p style={{ color: '#B30038', fontSize: '14px', fontWeight: '500' }}>
          {formatMessage(errorMessages.period)}
        </p>
      )}
    </ReviewGroup>
  )
}
