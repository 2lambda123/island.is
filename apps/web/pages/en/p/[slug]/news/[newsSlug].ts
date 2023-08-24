import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ProjectNewsArticle from '@island.is/web/screens/Project/ProjectNewsArticle'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(ProjectNewsArticle))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
