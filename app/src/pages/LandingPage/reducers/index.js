import {combineReducers} from 'redux';
import {FETCH_TRAININGS_SUCCESS} from "../actions";

const currentTraining = (prev = null, action) => {
    switch (action.type) {
        case FETCH_TRAININGS_SUCCESS:
            const keys = Object.keys(action.payload)

            return keys[keys.length - 1]
        default:
            return prev
    }
}

const trainings = (prev = {}, action) => {
    switch (action.type) {
        case FETCH_TRAININGS_SUCCESS:
            return action.payload
        default:
            return prev
    }
}

export default combineReducers({
    currentTraining,
    trainings
});
