import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import genericOverviewScreen from '@island.is/web/screens/GenericOverview/GenericOverview'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(genericOverviewScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
