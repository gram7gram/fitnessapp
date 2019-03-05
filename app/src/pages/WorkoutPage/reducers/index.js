import {combineReducers} from 'redux';
import model from './model'
import * as Actions from "../actions";

const currentRepeat = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.REMOVE_REPEAT:

            if (prev === action.payload.id) {
                return null
            }

            return prev
        case Actions.SET_CURRENT_REPEAT:
        case Actions.ADD_REPEAT:

            if (action.payload.id !== undefined) {
                return action.payload.id
            }

            return null
        default:
            return prev
    }
}

export default combineReducers({
    model,
    currentRepeat
});
