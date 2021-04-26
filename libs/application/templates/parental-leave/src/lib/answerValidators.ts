import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'
import differenceInMonths from 'date-fns/differenceInMonths'
import isWithinInterval from 'date-fns/isWithinInterval'
import {
  Application,
  AnswerValidator,
  getValueViaPath,
  Answer,
  buildValidationError,
  coreErrorMessages,
  StaticText,
} from '@island.is/application/core'
import isEmpty from 'lodash/isEmpty'

import { getExpectedDateOfBirth } from '../parentalLeaveUtils'
import { Period } from '../types'
import { minPeriodDays, usageMaxMonths } from '../config'
import { NO } from '../constants'
import { isValidEmail } from './isValidEmail'
import { errorMessages } from './messages'

const EMPLOYER = 'employer'
const FIRST_PERIOD_START = 'firstPeriodStart'
const PERIODS = 'periods'

export const answerValidators: Record<string, AnswerValidator> = {
  [EMPLOYER]: (newAnswer: unknown, application: Application) => {
    const obj = newAnswer as Record<string, Answer>
    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${EMPLOYER}.${path}`)(message)
    const isSelfEmployed = getValueViaPath(
      application.answers,
      'employer.isSelfEmployed',
    )

    if (obj.isSelfEmployed === '') {
      return buildError(coreErrorMessages.defaultError, 'isSelfEmployed')
    }

    // If the new answer is the `isSelfEmployed` step, it means we didn't enter the email address yet
    if (obj.isSelfEmployed) {
      return undefined
    }

    if (isSelfEmployed === NO && isEmpty(obj?.email)) {
      return buildError(errorMessages.employerEmail, 'email')
    }

    if (isSelfEmployed === NO && !isValidEmail(obj.email as string)) {
      return buildError(errorMessages.email, 'email')
    }

    return undefined
  },
  [FIRST_PERIOD_START]: (_, application: Application) => {
    const buildError = buildValidationError(FIRST_PERIOD_START)
    const expectedDateOfBirth = getExpectedDateOfBirth(application)

    if (!expectedDateOfBirth) {
      return buildError(errorMessages.dateOfBirth)
    }

    return undefined
  },
  [PERIODS]: (newAnswer: unknown, application: Application) => {
    const periods = newAnswer as Period[]
    const newPeriodIndex = periods.length - 1
    const buildError = buildValidationError(PERIODS, newPeriodIndex)
    const period = periods[newPeriodIndex]
    const expectedDateOfBirth = getExpectedDateOfBirth(application)
    const dob = expectedDateOfBirth as string

    if (period?.startDate !== undefined) {
      const field = 'startDate'
      const { startDate } = period

      // We need a valid start date
      if (typeof startDate !== 'string' || !isValid(parseISO(startDate))) {
        return buildError(errorMessages.periodsStartDate, field)
      }

      // Start date needs to be after or equal to the expectedDateOfBirth
      if (startDate < dob) {
        return buildError(errorMessages.periodsStartDateBeforeDob, field)
      }

      // We check if the start date is within the allowed period
      if (
        differenceInMonths(parseISO(startDate), parseISO(dob)) > usageMaxMonths
      ) {
        return buildError(errorMessages.periodsPeriodRange, field, {
          usageMaxMonths,
        })
      }

      // We check if the startDate is within previous periods saved
      if (
        periods
          // We filtering out the new period we are adding
          .filter((_, index) => index !== newPeriodIndex)
          .some(
            (otherPeriod) =>
              otherPeriod.startDate &&
              otherPeriod.endDate &&
              isWithinInterval(parseISO(startDate), {
                start: parseISO(otherPeriod.startDate),
                end: parseISO(otherPeriod.endDate),
              }),
          )
      ) {
        return buildError(errorMessages.periodsStartDateOverlaps, field)
      }
    }

    if (period?.endDate !== undefined) {
      const field = 'endDate'
      const { startDate, endDate } = period

      // We need a valid end date
      if (typeof endDate !== 'string' || !isValid(parseISO(endDate))) {
        return buildError('The end date is not valid.', field)
      }

      // If the startDate is using the expected date of birth, we then calculate the minimum period required from the date of birth
      if (
        !startDate &&
        differenceInDays(parseISO(endDate), parseISO(dob)) < minPeriodDays
      ) {
        return buildError(errorMessages.periodsEndDate, field, {
          minPeriodDays,
        })
      }

      // We check if endDate is after startDate
      if (endDate < startDate) {
        return buildError(errorMessages.periodsEndDateBeforeStartDate, field)
      }

      // We check if the user selected at least the minimum period required
      if (
        differenceInDays(parseISO(endDate), parseISO(startDate)) < minPeriodDays
      ) {
        return buildError(errorMessages.periodsEndDateMinimumPeriod, field, {
          minPeriodDays,
        })
      }

      // We check if the start date is within the allowed period
      if (
        differenceInMonths(parseISO(endDate), parseISO(dob)) > usageMaxMonths
      ) {
        return buildError(errorMessages.periodsPeriodRange, field, {
          usageMaxMonths,
        })
      }

      // We check if the endDate is within previous periods saved
      if (
        periods
          // We filtering out the new period we are adding
          .filter((_, index) => index !== newPeriodIndex)
          .some(
            (otherPeriod) =>
              otherPeriod.startDate &&
              otherPeriod.endDate &&
              isWithinInterval(parseISO(endDate), {
                start: parseISO(otherPeriod.startDate),
                end: parseISO(otherPeriod.endDate),
              }),
          )
      ) {
        return buildError(errorMessages.periodsEndDateOverlapsPeriod, field)
      }
    }

    if (period?.ratio !== undefined) {
      const field = 'ratio'
      const { startDate, endDate, ratio } = period
      const diff = differenceInDays(parseISO(endDate), parseISO(startDate))
      const diffWithRatio = (diff * ratio) / 100

      // We want to make sure the ratio doesn't affect the minimum number of days selected
      if (diffWithRatio < minPeriodDays) {
        return buildError(errorMessages.periodsRatio, field, {
          minPeriodDays,
          diff,
          ratio,
          diffWithRatio,
        })
      }
    }

    return undefined
  },
}
