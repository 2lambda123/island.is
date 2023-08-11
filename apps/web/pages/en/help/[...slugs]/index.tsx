import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebSubPage from '@island.is/web/screens/ServiceWeb/SubPage/SubPage'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(serviceWebSubPage))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
