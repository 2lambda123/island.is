import { Text } from '@island.is/island-ui/core'
import localization from './EmptyState.json'

const EmptyState = () => {
  const loc = localization.emptyState
  return (
    <Text dataTestId="emptyState" variant="h4">
      {loc.text}
    </Text>
  )
}

export default EmptyState
