import { FC, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { Answers, EstateMember } from '../../types'
import { AdditionalEstateMember } from './AdditionalEstateMember'
import { getValueViaPath } from '@island.is/application/core'

export const EstateMembersRepeater: FC<FieldBaseProps<Answers>> = ({
  application,
  field,
  errors,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update } = useFieldArray({
    name: id,
  })

  const externalData = application.externalData.syslumennOnEntry?.data as {
    relationOptions: string[]
    estate: EstateRegistrant
  }
  const relations =
    externalData.relationOptions?.map((relation) => ({
      value: relation,
      label: relation,
    })) || []
  const error = (errors as any)?.estate?.estateMembers

  const handleAddMember = () =>
    append({
      nationalId: '',
      initial: false,
      enabled: true,
      name: '',
    })

  useEffect(() => {
    if (fields.length === 0 && externalData.estate.estateMembers) {
      append(externalData.estate.estateMembers)
    }
  }, [])

  return (
    <Box marginTop={2} marginBottom={5}>
      <GridRow>
        {fields.reduce((acc, member: GenericFormField<EstateMember>, index) => {
          if (member.nationalId === application.applicant) {
            const relation = getValueViaPath<string>(
              application.answers,
              'applicantRelation',
            )
            if (relation && relation !== member.relation) {
              member.relation = relation
            }
          }
          if (!member.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              key={index}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                title={member.name}
                disabled={!member.enabled}
                description={[
                  formatNationalId(member.nationalId || ''),
                  member.relation || '',
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={member.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() => {
                        const updatedMember = {
                          ...member,
                          enabled: !member.enabled,
                        }
                        update(index, updatedMember)
                      }}
                    >
                      {member.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
              />
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((member: GenericFormField<EstateMember>, index) => (
        <Box key={member.id} hidden={member.initial || member?.dummy}>
          <AdditionalEstateMember
            application={application}
            field={member}
            fieldName={id}
            index={index}
            relationOptions={relations}
            remove={remove}
            error={error && error[index] ? error[index] : null}
          />
        </Box>
      ))}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddMember}
          size="small"
        >
          {formatMessage(m.inheritanceAddMember)}
        </Button>
      </Box>
    </Box>
  )
}

export default EstateMembersRepeater
