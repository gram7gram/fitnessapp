import {combineReducers} from 'redux';
import {FETCH_TRAININGS_FAILURE, FETCH_TRAININGS_SUCCESS} from "../actions";

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

export default combineReducers({
    trainings
});
