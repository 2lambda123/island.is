import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { information, review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { getValueViaPath } from '@island.is/application/core'
import { Country } from '@island.is/clients/directorate-of-immigration/citizenship'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const StaysAbroadReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()

  const countryOptions = getValueViaPath(
    application.externalData,
    'countries.data',
    [],
  ) as Country[]

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <DescriptionText
          text={review.labels.abroadStays}
          textProps={{
            as: 'h4',
            fontWeight: 'semiBold',
            marginBottom: 0,
          }}
        />
        <GridRow>
          {answers?.staysAbroad?.hasStayedAbroad &&
          answers?.staysAbroad?.selectedAbroadCountries &&
          answers?.staysAbroad?.selectedAbroadCountries?.length > 0 ? (
            answers?.staysAbroad?.selectedAbroadCountries?.map((country) => {
              return (
                <GridColumn span="1/2">
                  {
                    countryOptions.filter(
                      (z) => z.id === parseInt(country.countryId),
                    )[0]
                  }
                </GridColumn>
              )
            })
          ) : (
            <GridColumn>
              <Text>
                {formatMessage(information.labels.radioButtons.radioOptionNo)}
              </Text>
            </GridColumn>
          )}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
