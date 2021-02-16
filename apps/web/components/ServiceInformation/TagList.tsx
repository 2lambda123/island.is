import React, { FC } from 'react'
import { useNamespace } from '@island.is/web/hooks'
import {
  Box,
  Inline,
  Text,
  GridColumn,
  GridContainer,
  GridRow,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  DataCategory,
  TypeCategory,
  AccessCategory,
} from '@island.is/web/graphql/schema'
import ServiceTag from './ServiceTag'

interface TagListProps {
  data: Array<DataCategory>
  type: TypeCategory
  access: Array<AccessCategory>
  namespace?: object
}

export const TagList: FC<TagListProps> = ({
  data,
  type,
  access,
  namespace,
}) => {
  const n = useNamespace(namespace)

  return (
    <Box paddingX={3}>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingBottom={[3, 3, 0]}
            span={['12/12', '12/12', '6/12']}
          >
            <Inline space={1}>
              <Text variant="eyebrow" color="blue600" marginBottom={1}>
                {n('data')}
              </Text>
              <Tooltip placement="right" text={n('dataTooltipText')} />
            </Inline>
            <Inline space={1}>
              {data?.map((item) => (
                <ServiceTag category="data" item={item} namespace={namespace} />
              ))}
            </Inline>
          </GridColumn>
          <GridColumn
            paddingBottom={[3, 3, 0]}
            span={['12/12', '12/12', '3/12']}
          >
            <Inline space={1}>
              <Text variant="eyebrow" color="blue600" marginBottom={1}>
                {n('type')}
              </Text>
              <Tooltip placement="right" text={n('typeTooltipText')} />
            </Inline>
            <Inline space={1}>
              <ServiceTag category="type" item={type} namespace={namespace} />
            </Inline>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '3/12']}>
            <Inline space={1}>
              <Text variant="eyebrow" color="blue600" marginBottom={1}>
                {n('access')}
              </Text>
              <Tooltip placement="right" text={n('accessTooltipText')} />
            </Inline>
            <Inline space={1}>
              {access?.map((item) => (
                <ServiceTag
                  category="access"
                  item={item}
                  namespace={namespace}
                />
              ))}
            </Inline>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
export default TagList
