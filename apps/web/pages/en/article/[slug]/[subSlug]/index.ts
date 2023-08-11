import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import articleScreen from '@island.is/web/screens/Article'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(articleScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
