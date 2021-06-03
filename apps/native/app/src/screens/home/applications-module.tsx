import {
  Badge,
  EmptyCard,
  Heading,
  StatusCard,
  StatusCardSkeleton,
  ViewPager,
} from '@island.is/island-ui-native'
import React from 'react'
import { Image, SafeAreaView } from 'react-native'
import { useTheme } from 'styled-components/native'
import leJobss4 from '../../assets/illustrations/le-jobs-s4.png'
import { IApplication } from '../../graphql/fragments/application.fragment'
import { config } from '../../utils/config'
import { useIntl } from '../../utils/intl'
import { openBrowser } from '../../utils/rn-island'

interface ApplicationsModuleProps {
  applications: IApplication[]
  loading: boolean
  componentId: string
}

export const ApplicationsModule = React.memo(
  ({ applications, loading, componentId }: ApplicationsModuleProps) => {
    const intl = useIntl()
    const theme = useTheme()
    const count = applications.length

    const children = applications.slice(0, 5).map((application) => (
      <StatusCard
        key={application.id}
        title={application.name!}
        date={new Date(application.created)}
        badge={
          <Badge
            title={intl.formatMessage(
              { id: 'applicationStatusCard.state' },
              { state: application.state || 'unknown' },
            )}
          />
        }
        progress={application.progress * 100}
        actions={[
          {
            text: intl.formatMessage({
              id: 'applicationStatusCard.openButtonLabel',
            }),
            onPress() {
              openBrowser(
                `${config.apiEndpoint.replace(
                  /api$/,
                  'umsoknir',
                )}/sjukratryggingar/${application.id}`,
                componentId,
              )
            },
          },
        ]}
        style={
          count > 1
            ? {
                width: 283,
                marginLeft: 16,
              }
            : {}
        }
      />
    ))

    return (
      <SafeAreaView style={{ marginHorizontal: 16 }}>
        <Heading>
          {intl.formatMessage({ id: 'home.applicationsStatus' })}
        </Heading>
        {loading ? (
          <StatusCardSkeleton />
        ) : (
          <>
            {count === 0 && (
              <EmptyCard
                text={intl.formatMessage({
                  id: 'applicationStatusCard.noActiveApplications',
                })}
                image={<Image source={leJobss4} height={90} width={42} />}
              />
            )}
            {count === 1 && children.slice(0, 1)}
            {count >= 2 && <ViewPager>{children}</ViewPager>}
          </>
        )}
      </SafeAreaView>
    )
  },
)
