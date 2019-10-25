import {combineReducers} from 'redux';
import * as Actions from "../actions";

const isVisible = (prev = false, action) => {
  switch (action.type) {
    case Actions.TOGGLE_DONATE_DIALOG:
      return !prev
    default:
      return prev
  }
}

export default combineReducers({
  isVisible,
});
