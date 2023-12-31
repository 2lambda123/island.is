import {
  AllOrAny,
  FormItem,
  Answer,
  ExternalData,
  FormValue,
  Comparators,
  SingleConditionCheck,
  StaticCheck,
} from '@island.is/application/types'
import { getValueViaPath } from './formUtils'

function applyStaticConditionalCheck(
  formValue: FormValue,
  check: StaticCheck,
): boolean {
  const { value, questionId, comparator } = check
  let isValid = false
  const answer = getValueViaPath(formValue, questionId) as Answer | undefined

  switch (comparator) {
    case Comparators.EQUALS:
      isValid = answer === value
      break
    case Comparators.NOT_EQUAL:
      isValid = answer !== value
      break
    case Comparators.GT:
      if (answer) {
        isValid = answer > value
      }
      break
    case Comparators.GTE:
      if (answer) {
        isValid = answer >= value
      }
      break
    case Comparators.LT:
      if (answer) {
        isValid = answer < value
      }
      break
    case Comparators.LTE:
      if (answer) {
        isValid = answer <= value
      }
      break
  }
  return isValid
}

export function shouldShowFormItem(
  formItem: FormItem,
  formValue: FormValue,
  externalData: ExternalData = {},
): boolean {
  const { condition } = formItem
  if (!condition) {
    return true
  }

  if (typeof condition === 'function') {
    return condition(formValue, externalData)
  }

  if (condition.isMultiCheck) {
    const { show, check, on } = condition

    for (let i = 0; i < check.length; i++) {
      const conditionalCheck: SingleConditionCheck = check[i]
      let isValid: boolean
      if (typeof conditionalCheck === 'function') {
        isValid = conditionalCheck(formValue, externalData)
      } else {
        isValid = applyStaticConditionalCheck(formValue, conditionalCheck)
      }

      if (on === AllOrAny.ALL) {
        if (!isValid) {
          return !show
        }
      } else if (isValid) {
        return show
      }
    }
    return on === AllOrAny.ALL ? show : !show
  }

  return applyStaticConditionalCheck(formValue, condition as StaticCheck)
}
