import dayjs from 'dayjs'

export const calculateAgeFromBirthday = (birthday, referenceDate = dayjs()) => {
  if (!birthday) return 0

  const birthDate = dayjs(birthday).startOf('day')
  const asOfDate = dayjs(referenceDate).startOf('day')

  if (!birthDate.isValid() || !asOfDate.isValid() || birthDate.isAfter(asOfDate)) return 0

  return asOfDate.diff(birthDate, 'year')
}
