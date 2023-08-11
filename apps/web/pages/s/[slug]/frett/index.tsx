import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import OrganizationNewsList from '@island.is/web/screens/Organization/OrganizationNewsList'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(OrganizationNewsList))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
