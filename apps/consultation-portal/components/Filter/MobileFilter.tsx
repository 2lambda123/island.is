import { CaseFilter } from '../../types/interfaces'
import {
  Box,
  FilterInput,
  FilterMultiChoice,
  Filter,
  GridContainer,
  DatePicker,
  Stack,
  Button,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { getItem, setItem } from '../../utils/helpers/localStorage'
import { FILTERS_FRONT_PAGE_KEY } from '../../utils/consts/consts'
import {
  getDateForComparison,
  getFilterItemWithCount,
} from '../../utils/helpers'

interface Props {
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
  total: number
  initialValues: CaseFilter
}

type FilterMultiChoiceChangeEvent = {
  /** Id of the category the selected values belongs to. */
  categoryId: string
  /** Array of selected items in the corresponding category. */
  selected: Array<string>
}

export const MobileFilter = ({
  filters,
  setFilters,
  total,
  initialValues,
}: Props) => {
  const [searchValue, setSearchValue] = useState(filters?.searchQuery)

  useEffect(() => {
    const identifier = setTimeout(() => {
      const filtersCopy = { ...filters }
      filtersCopy.searchQuery = searchValue
      setFilters(filtersCopy)
    }, 500)

    return () => {
      clearTimeout(identifier)
    }
  }, [searchValue, setSearchValue])

  const onChangeSearch = (value: string) => {
    setSearchValue(value)
  }

  const { caseStatuses, caseTypes, period, sorting } = filters

  const sortingList = sorting?.items
    .filter((item) => item.checked)
    .map((i) => i.value)

  const caseStatusesList = caseStatuses?.items
    .filter((item) => item.checked)
    .map((i) => i.value)

  const caseTypesList = caseTypes?.items
    .filter((item) => item.checked)
    .map((i) => i.value)

  const caseStatusesWithCount = getFilterItemWithCount(caseStatuses?.items)
  const caseTypesWithCount = getFilterItemWithCount(caseTypes?.items)

  const categories = [
    {
      id: 'sorting',
      label: 'Röðun',
      selected: sortingList.map((item) => item.toString()),
      filters: sorting.items,
    },
    {
      id: 'caseStatuses',
      label: 'Staða máls',
      selected: caseStatusesList.map((item) => item.toString()),
      filters: caseStatusesWithCount,
    },
    {
      id: 'caseTypes',
      label: 'Tegund máls',
      selected: caseTypesList.map((item) => item.toString()),
      filters: caseTypesWithCount,
    },
  ]

  const handleOnClear = () => {
    getItem({ key: FILTERS_FRONT_PAGE_KEY, clear: true })
    setFilters(initialValues)
    setSearchValue('')
  }

  const handleOnCategoryClear = (categoryId: string) => {
    const filtersCopy = { ...filters }
    const thisData = filtersCopy[categoryId]

    const changedItems = thisData?.items.map((item) => {
      if (categoryId === 'sorting') {
        if (item.value === '0') {
          return {
            ...item,
            checked: true,
          }
        }
      }
      return {
        ...item,
        checked: false,
      }
    })
    thisData.items = changedItems
    filtersCopy.pageNumber = 0
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const handleOnChange = (event: FilterMultiChoiceChangeEvent) => {
    const { categoryId, selected } = event
    const filtersCopy = { ...filters }
    const thisData = filtersCopy[categoryId]

    if (categoryId === 'sorting') {
      const lastChecked = sorting?.items
        .filter((item) => item.checked)
        .map((i) => i.value)

      const newValue = selected.filter((item) => item !== lastChecked[0])
      const changedItems = thisData?.items?.map((item) => {
        if (item.value === newValue[0]) {
          return {
            ...item,
            checked: true,
          }
        }
        return {
          ...item,
          checked: false,
        }
      })
      thisData.items = changedItems
    } else {
      const changedItems = thisData?.items.map((item) => {
        if (selected.find((i) => i === item?.value)) {
          return (item = { ...item, checked: true })
        }
        return {
          ...item,
          checked: false,
        }
      })
      thisData.items = changedItems
    }
    filtersCopy.pageNumber = 0
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const onChangeDate = (e, type: string) => {
    const filtersCopy = { ...filters }
    filtersCopy.period[type] = e
    filtersCopy.pageNumber = 0
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const onClearDate = () => {
    const filtersCopy = { ...filters }
    filtersCopy.period.from = initialValues.period.from
    filtersCopy.period.to = initialValues.period.to
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const filtersPeriodFromAsDate = getDateForComparison(filters?.period?.from)
  const filtersPeriodToAsDate = getDateForComparison(filters?.period?.to)
  const initialPeriodFromAsDate = getDateForComparison(
    initialValues?.period.from,
  )
  const initialPeriodToAsDate = getDateForComparison(initialValues?.period?.to)

  return (
    <GridContainer>
      <Box paddingY="gutter">
        <Filter
          labelClearAll="Hreinsa allar síur"
          labelClear="Hreinsa síu"
          labelOpen="Opna síu"
          labelClose="Loka síu"
          labelTitle="Sía"
          labelResult="Sýna niðurstöður"
          onFilterClear={handleOnClear}
          variant="dialog"
          resultCount={total}
          filterInput={
            <FilterInput
              name="filter-input"
              placeholder="Sía eftir leitarorði"
              value={searchValue}
              onChange={(value) => onChangeSearch(value)}
            />
          }
        >
          <>
            <FilterMultiChoice
              labelClear="Hreinsa val"
              categories={categories}
              onChange={(event) => handleOnChange(event)}
              onClear={(categoryId) => handleOnCategoryClear(categoryId)}
            />
            <Stack space={2}>
              <DatePicker
                size="sm"
                locale="is"
                label="Frá"
                placeholderText="Veldu dagsetningu"
                selected={new Date(filters.period.from)}
                handleChange={(e) => onChangeDate(e, 'from')}
                appearInline
              />
              <DatePicker
                size="sm"
                locale="is"
                label="Til"
                placeholderText="Veldu dagsetningu"
                selected={new Date(filters.period.to)}
                handleChange={(e) => onChangeDate(e, 'to')}
                appearInline
              />
              {(filtersPeriodFromAsDate !== initialPeriodFromAsDate ||
                filtersPeriodToAsDate !== initialPeriodToAsDate) && (
                <Box textAlign="right">
                  <Button
                    size="small"
                    icon="reload"
                    variant="text"
                    onClick={onClearDate}
                  >
                    Hreinsa val
                  </Button>
                </Box>
              )}
            </Stack>
          </>
        </Filter>
      </Box>
    </GridContainer>
  )
}

export default MobileFilter
