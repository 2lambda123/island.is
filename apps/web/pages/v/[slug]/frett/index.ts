import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ProjectNewsList from '@island.is/web/screens/Project/ProjectNewsList'

export default withApollo(withLocale('is')(ProjectNewsList))
