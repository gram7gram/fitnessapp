import {combineReducers} from 'redux';
import * as Actions from "../actions";

const items = (prev = [], action) => {
    switch (action.type) {
        case Actions.RESET:
            return []
        case Actions.FETCH_EXERCISES_SUCCESS:
            return action.payload
        default:
            return prev
    }
}

export default combineReducers({
    items,
});
