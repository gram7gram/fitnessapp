import {combineReducers} from 'redux';
import moment from 'moment';
import intersectionBy from 'lodash/intersectionBy';
import Rate from "./Rate";
import * as Actions from "../actions";

const currentMonth = moment().format('YYYY-MM')

const trainings = (prev = {}, action) => {
    switch (action.type) {
        case Actions.FETCH_TRAININGS_FAILURE:
            return {}
        case Actions.FETCH_TRAININGS_SUCCESS:
            return action.payload
        default:
            return prev
    }
}

const months = (prev = [currentMonth], action) => {
    switch (action.type) {
        case Actions.FETCH_TRAININGS_FAILURE:
            return [currentMonth]

        case Actions.FETCH_TRAININGS_SUCCESS:

            const months = Object.keys(action.payload)

            if (intersectionBy(months, prev).length === 0) {

                const initialMonth = months.sort((a, b) => {

                    const m1 = moment(a, 'YYYY-MM')
                    const m2 = moment(b, 'YYYY-MM')

                    if (m1.isBefore(m2)) return 1
                    if (m1.isAfter(m2)) return -1
                    return 0

                })[0]

                return [
                    initialMonth
                ]
            }

            return prev
        case Actions.ADD_DISPLAYED_MONTH:

            const items = [...prev,]

            items.push(action.payload)

            return items
        default:
            return prev
    }
}

export default combineReducers({
    Rate,
    trainings,
    months,
});
