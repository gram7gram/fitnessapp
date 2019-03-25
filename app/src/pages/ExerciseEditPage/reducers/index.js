import {combineReducers} from 'redux';
import * as Actions from "../actions";
import model from "./model";

const isValid = (prev = false, action) => {
    switch (action.type) {
        case Actions.RESET:
            return false
        default:
            return prev
    }
}

export default combineReducers({
    model,
    isValid,
});
