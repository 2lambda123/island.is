import {
  GridContainer,
  Text,
  Stack,
  Box,
  LoadingDots,
  Tiles,
  DropdownMenu,
  FocusableBox,
} from '@island.is/island-ui/core'
import Layout from '../../components/Layout/Layout'
import BreadcrumbsWithMobileDivider from '../../components/BreadcrumbsWithMobileDivider/BreadcrumbsWithMobileDivider'
import { useLogIn, useUser, useAdviceFilters } from '../../utils/helpers'
import { Card, SubscriptionActionCard } from '../../components/Card'
import { useState } from 'react'
import EmptyState from '../../components/EmptyState/EmptyState'
import { UserAdvice } from '../../types/interfaces'
import Pagination from '../../components/Pagination/Pagination'
import SearchAndSortPartialData from '../../components/SearchAndSort/SearchAndSortPartialData'

const CARDS_PER_PAGE = 12

export const AdvicesLayout = ({ children }) => {
  return (
    <Layout seo={{ title: 'umsagnir', url: 'umsagnir' }}>
      <BreadcrumbsWithMobileDivider
        items={[
          { title: 'Samráðsgátt', href: '/' },
          { title: 'Mínar umsagnir' },
        ]}
      />
      <GridContainer>
        <Stack space={[3, 3, 3, 5, 5]}>
          <Stack space={3}>
            <Text variant="h1">Mínar umsagnir</Text>
            <Text variant="default">
              Hér er hægt að fylgjast með þeim áskriftum sem þú ert skráð(ur) í
              ásamt því að sjá allar umsagnir sem þú ert búin að skrifa í gegnum
              tíðina.
            </Text>
          </Stack>
          {children}
        </Stack>
      </GridContainer>
    </Layout>
  )
}

export const AdvicesScreen = () => {
  const LogIn = useLogIn()
  const { isAuthenticated, userLoading } = useUser()
  const [page, setPage] = useState(0)
  const [dropdownState, setDropdownState] = useState('')

  const handleDropdown = (id: string) => {
    setDropdownState((prev) => {
      return prev === id ? null : id
    })
  }

  const {
    advices,
    total,
    getAdvicesLoading,
    filters,
    setFilters,
  } = useAdviceFilters({ cards_per_page: CARDS_PER_PAGE, page: page })

  if (!userLoading && !isAuthenticated) {
    return (
      <AdvicesLayout>
        <SubscriptionActionCard
          heading="Mínar umsagnir"
          text="Þú verður að vera skráð(ur) inn til þess að geta séð þínar umsagnir."
          button={[{ label: 'Skrá mig inn', onClick: LogIn }]}
        />
      </AdvicesLayout>
    )
  }

  const renderCards = () => {
    if (getAdvicesLoading) {
      return (
        <Box
          display="flex"
          width="full"
          alignItems="center"
          justifyContent="center"
          style={{ height: 200 }}
        >
          <LoadingDots color="blue" large />
        </Box>
      )
    }

    if (!getAdvicesLoading && advices?.length === 0) {
      return <EmptyState />
    }

    return (
      <>
        {advices && (
          <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
            {advices.map((item: UserAdvice, index: number) => {
              const card = {
                id: item.caseId,
                title: item.participantName,
                tag: item._case?.statusName,
                published: item.created,
                processEnds: item._case?.processEnds,
                processBegins: item._case?.processBegins,
                eyebrows: [item._case?.typeName, item._case?.institutionName],
              }
              const dropdown =
                item.adviceDocuments?.length !== 0 ? (
                  <FocusableBox
                    onClick={() => handleDropdown(item.id)}
                    component="div"
                  >
                    <DropdownMenu
                      title="Viðhengi"
                      icon={
                        dropdownState === item.id ? 'chevronUp' : 'chevronDown'
                      }
                      items={item.adviceDocuments?.map((item) => {
                        return {
                          title: item.fileName,
                          href: `https://samradapi-test.devland.is/api/Documents/${item.id}`,
                        }
                      })}
                    />
                  </FocusableBox>
                ) : (
                  <></>
                )
              return (
                <Card
                  key={index}
                  card={card}
                  frontPage={false}
                  showAttachment
                  dropdown={dropdown}
                >
                  <Stack space={2}>
                    <Text variant="eyebrow" color="dark400">
                      Þín umsögn
                    </Text>
                    <Box
                      style={{
                        wordBreak: 'break-word',
                        height: '105px',
                      }}
                      overflow="hidden"
                    >
                      <Text variant="small" color="dark400">
                        {item.content}
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              )
            })}
          </Tiles>
        )}
        <Pagination
          page={page}
          setPage={(page: number) => setPage(page)}
          totalPages={Math.ceil(total / CARDS_PER_PAGE)}
        />
      </>
    )
  }

  return (
    <AdvicesLayout>
      <SearchAndSortPartialData
        filters={filters}
        setFilters={setFilters}
        loading={getAdvicesLoading}
      />
      {renderCards()}
    </AdvicesLayout>
  )
}

export default AdvicesScreen
