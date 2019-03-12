import {combineReducers} from 'redux';
import moment from 'moment';
import {ADD_DISPLAYED_MONTH, FETCH_TRAININGS_FAILURE, FETCH_TRAININGS_SUCCESS} from "../actions";

const currentMonth = moment().format('YYYY-MM')

const trainings = (prev = {}, action) => {
    switch (action.type) {
        case FETCH_TRAININGS_FAILURE:
            return {}
        case FETCH_TRAININGS_SUCCESS:
            return action.payload
        default:
            return prev
    }
}

const months = (prev = [currentMonth], action) => {
    switch (action.type) {
        case FETCH_TRAININGS_FAILURE:
            return [currentMonth]
        case ADD_DISPLAYED_MONTH:

            const items = [...prev,]

            items.push(action.payload)

            return items
        default:
            return prev
    }
}

export default combineReducers({
    trainings,
    months,
});
