import moment from "moment";
import {convertWeight} from "./Units";

export const objectValues = (obj) => obj ? Object.keys(obj).map(i => obj[i]) : []

export const findTranslation = (translations, locale) => {
  if (!translations) return null

  if (translations[locale] !== undefined) return translations[locale]

  const defaultLocale = Object.keys(translations)[0]

  return translations[defaultLocale]
}

export const sortByDate = (items, key, direction) => {

  items.sort((a, b) => {
    const date1 = moment(a[key], 'YYYY-MM-DD HH:mm')
    const date2 = moment(b[key], 'YYYY-MM-DD HH:mm')

    switch (direction) {
      case 'ASC':

        if (date1.isBefore(date2)) return -1
        if (date2.isBefore(date1)) return 1

        break
      case 'DESC':

        if (date1.isBefore(date2)) return 1
        if (date2.isBefore(date1)) return -1

        break
    }


    return 0
  })
}

export const sortByTimestamp = (items, key, direction) => {

  items.sort((a, b) => {
    const date1 = moment(a[key], 'X')
    const date2 = moment(b[key], 'X')

    switch (direction) {
      case 'ASC':

        if (date1.isBefore(date2)) return -1
        if (date2.isBefore(date1)) return 1

        break
      case 'DESC':

        if (date1.isBefore(date2)) return 1
        if (date2.isBefore(date1)) return -1

        break
    }


    return 0
  })
}