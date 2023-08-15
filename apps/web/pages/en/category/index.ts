import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import categoriesScreen from '@island.is/web/screens/Category/Categories'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(categoriesScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
