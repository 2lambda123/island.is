import { Box, Inline, Link, Stack, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ApplicantsController from './ApplicantsController'
import { FieldBaseProps } from '@island.is/application/types'
import { institutionApplicationMessages as m } from '../../../../institution-collaboration/src/lib/messages'
import { useLocale } from '@island.is/localization'

const Applicants: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const { answers } = application
  const { id } = field
  console.log(field)
  console.log(application)

  const getConstraintVal = (constraintId: string) =>
    getValueViaPath(
      answers,
      `${id}.${constraintId}` as string,
      false,
    ) as boolean

  const applicants = [
    { id: 1, name: "Jón" },
    {  id: 2, name: "Pétur" }
  ]


  return (
    <Box>
      <Stack space={2}>
        {applicants?.map((item) => (
          <ApplicantsController
            id={`${item.id}`}
            checkboxId={`${item.id}`}
            label={formatText(
              item.name,
              application,
              formatMessage,
            )}
            placeholder={formatText(
              m.constraints.constraintsMailPlaceholder,
              application,
              formatMessage
            )}
            defaultValue={getConstraintVal(`${item.name}`)}
            extraText={false}
          />
        ))}

      </Stack>
    </Box>
  )
}

export default Applicants
