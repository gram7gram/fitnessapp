import moment from "moment";
import {convertWeight} from "./Units";

export const objectValues = (obj) => obj ? Object.keys(obj).map(i => obj[i]) : []

export const findTranslation = (translations, locale) => {
    if (!translations) return null

    if (translations[locale] !== undefined) return translations[locale]

    const defaultLocale = Object.keys(translations)[0]

    return translations[defaultLocale]
}

export const getMetrics = (training, startedAt, completedAt, unit) => {

    let totalWeight = 0, duration = 0, totalWeightPerHour = 0;

    objectValues(training.workouts).forEach(workout => {
        objectValues(workout.repeats).forEach(repeat => {

            if (!repeat.isHumanWeight) {
                totalWeight += convertWeight(repeat.weight, unit) * repeat.repeatCount
            } else {
                totalWeight += convertWeight(training.humanWeight, unit) * repeat.repeatCount
            }

        })
    })

    if (completedAt && startedAt) {

        const date1 = moment(startedAt, 'YYYY-MM-DD HH:mm')
        const date2 = moment(completedAt, 'YYYY-MM-DD HH:mm')

        duration = date2.diff(date1, 'minutes') / 60

        if (duration > 0) {
            totalWeightPerHour = totalWeight / duration / 1000
        }
    }

    return {
        duration: Number(Math.max(0, duration).toFixed(2)),
        totalWeight: {
            value: Number(Math.max(0, totalWeight).toFixed(2)),
            unit
        },
        totalWeightPerHour: Number(Math.max(0, totalWeightPerHour).toFixed(2)),
    }
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