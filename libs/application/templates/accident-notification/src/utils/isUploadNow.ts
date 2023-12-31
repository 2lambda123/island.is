import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from '../types'

export const isUploadNow = (formValue: FormValue) => {
  const whoIsTheNotificationFor = getValueViaPath(
    formValue,
    'whoIsTheNotificationFor.answer',
  ) as WhoIsTheNotificationForEnum
  const powerOfAttorneyType = getValueViaPath(
    formValue,
    'powerOfAttorney.type',
  ) as PowerOfAttorneyUploadEnum
  return (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    powerOfAttorneyType === PowerOfAttorneyUploadEnum.UPLOADNOW
  )
}
