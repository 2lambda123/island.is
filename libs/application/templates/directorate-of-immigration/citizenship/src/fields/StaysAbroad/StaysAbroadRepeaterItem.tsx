import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  Box,
  Columns,
  Column,
  Button,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { SelectFormField } from '@island.is/application/ui-fields'
import DescriptionText from '../../components/DescriptionText'
import { getValueViaPath } from '@island.is/application/core'
import { Country } from '@island.is/clients/directorate-of-immigration/citizenship'
import { getErrorViaPath } from '@island.is/application/core'

interface Props {
  id: string
  index: number
  repeaterField: any
  handleRemove: (index: number) => void
  itemNumber: number
  addDataToCountryList: (field: string, value: string, index: number) => void
  showItemTitle: boolean
}

export const StaysAbroadRepeaterItem: FC<Props & FieldBaseProps> = ({
  id,
  index,
  handleRemove,
  repeaterField,
  itemNumber,
  showItemTitle,
  addDataToCountryList,
  ...props
}) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const countryField = `${fieldIndex}.country`
  const dateToField = `${fieldIndex}.dateTo`
  const dateFromField = `${fieldIndex}.dateFrom`
  const purposeField = `${fieldIndex}.purpose`
  const wasRemovedField = `${fieldIndex}.wasRemoved`
  const dateRangeField = `${fieldIndex}.dateRange`

  const dateRangeError =
    errors &&
    getErrorViaPath(errors, dateRangeField) &&
    getErrorViaPath(errors, dateRangeField).length > 0
      ? true
      : false

  const countryOptions = (getValueViaPath(
    application.externalData,
    'countries.data',
    [],
  ) as Country[]).map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }))

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue])

  return (
    <Box
      position="relative"
      marginBottom={1}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginTop={showItemTitle || itemNumber > 0 ? 2 : 0}
      >
        {showItemTitle && (
          <DescriptionText
            text={information.labels.staysAbroad.itemTitle}
            format={{ index: itemNumber + 1 }}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              marginBottom: 0,
            }}
          />
        )}

        {itemNumber > 0 && (
          <Button
            variant="text"
            textSize="sm"
            size="small"
            onClick={() => handleRemove(index)}
          >
            {formatMessage(information.labels.staysAbroad.deleteButtonTitle)}
          </Button>
        )}
      </Box>

      <SelectFormField
        application={application}
        error={errors && getErrorViaPath(errors, countryField)}
        field={{
          id: countryField,
          title: `Dvalarland`,
          options: countryOptions,
          component: FieldComponents.SELECT,
          children: undefined,
          type: FieldTypes.SELECT,
          required: true,
          onSelect: (value) =>
            addDataToCountryList('country', value.value as string, index),
        }}
      ></SelectFormField>
      <Box paddingBottom={2} paddingTop={2}>
        {dateRangeError && (
          <InputError
            errorMessage={formatMessage(
              information.labels.staysAbroad.dateRangeError,
            )}
          />
        )}
        <Columns space={3}>
          <Column>
            <DatePickerController
              id={dateFromField}
              label={
                information.labels.staysAbroad.dateFromLabel.defaultMessage
              }
              error={errors && getErrorViaPath(errors, dateFromField)}
              onChange={(value) =>
                addDataToCountryList('dateFrom', value as string, index)
              }
              required
            />
          </Column>
          <Column>
            <DatePickerController
              id={dateToField}
              label={information.labels.staysAbroad.dateToLabel.defaultMessage}
              error={errors && getErrorViaPath(errors, dateToField)}
              onChange={(value) =>
                addDataToCountryList('dateTo', value as string, index)
              }
              required
            />
          </Column>
        </Columns>
      </Box>
      <InputController
        id={purposeField}
        label={information.labels.staysAbroad.purposeLabel.defaultMessage}
        rows={4}
        textarea
        error={errors && getErrorViaPath(errors, purposeField)}
        onChange={(value) =>
          addDataToCountryList('purpose', value.target.value as string, index)
        }
        required
      />
    </Box>
  )
}
