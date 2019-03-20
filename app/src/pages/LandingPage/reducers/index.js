import {combineReducers} from 'redux';
import moment from 'moment';
import Rate from "./Rate";
import Donate from "./Donate";
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
    Donate,
    trainings,
    months,
});
