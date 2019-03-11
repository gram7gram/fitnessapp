import {combineReducers} from 'redux';
import * as Actions from "../actions";
import * as TrainingActions from "../../TrainingPage/actions";

const currentRepeat = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case TrainingActions.REMOVE_REPEAT:

            if (prev === action.payload.id) {
                return null
            }

            return prev
        case Actions.SET_CURRENT_REPEAT:
        case TrainingActions.ADD_REPEAT:

            if (action.payload.id !== undefined) {
                return action.payload.id
            }

            return null
        default:
            return prev
    }
}

export default combineReducers({
    currentRepeat
});
