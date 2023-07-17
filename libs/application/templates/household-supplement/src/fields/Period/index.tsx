import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import * as styles from './period.css'
import { Box } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  SelectOption,
} from '@island.is/application/types'
import { SelectFormField } from '@island.is/application/ui-fields'

import { householdSupplementFormMessage } from '../../lib/messages'
import {
  getApplicationAnswers,
  getAvailableMonths,
  getAvailableYears,
} from '../../lib/householdSupplementUtils'

export const Period: FC<FieldBaseProps> = ({ application }) => {
  const {
    formState: { errors },
  } = useFormContext()

  const { selectedYear: year, selectedMonth: month } = getApplicationAnswers(
    application.answers,
  )

  const [selectedYear, setSeletedYear] = useState(year)
  // const [selectedMonth, setSeletedMonth] = useState(month)

  const optionsYears = getAvailableYears(application)
  const [optionsMonths, setOptionsMonths] = useState(() => {
    const rightYear = year ?? new Date().getFullYear().toString()
    return getAvailableMonths(application, rightYear)
  })

  const getError = (path: string) => {
    const periodError = getErrorViaPath(errors, 'period')
    return (
      getErrorViaPath(errors, path) ??
      (periodError && typeof periodError != 'string' ? undefined : periodError)
    )
  }

  const onSelectYear = (option: SelectOption) => {
    const value = option.value as string
    setSeletedYear(value)

    const months = getAvailableMonths(application, value)
    setOptionsMonths(months)
  }

  // const onSelectMonth = (option: SelectOption) => {
  //   const value = option.value as string
  //   setSeletedMonth(value)
  // }

  return (
    <Box paddingTop={6} paddingBottom={6}>
      <Box display={'flex'} className={styles.flexBox}>
        <Box width="half" marginRight={3} className={styles.yearBox}>
          <SelectFormField
            application={application}
            error={getError('period.year')}
            field={{
              id: 'period.year',
              type: FieldTypes.SELECT,
              component: FieldComponents.SELECT,
              title: householdSupplementFormMessage.info.periodYear,
              placeholder:
                householdSupplementFormMessage.info.periodYearDefaultText,
              children: undefined,
              options: optionsYears,
              backgroundColor: 'blue',
              onSelect: onSelectYear,
            }}
          />
        </Box>
        <Box width="half" marginLeft={3} className={styles.monthBox}>
          <SelectFormField
            application={application}
            error={getError('period.month')}
            field={{
              id: 'period.month',
              type: FieldTypes.SELECT,
              component: FieldComponents.SELECT,
              title: householdSupplementFormMessage.info.periodMonth,
              placeholder:
                householdSupplementFormMessage.info.periodMonthDefaultText,
              children: undefined,
              options: selectedYear ? optionsMonths : [],
              backgroundColor: 'blue',
              //onSelect: onSelectMonth,
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
