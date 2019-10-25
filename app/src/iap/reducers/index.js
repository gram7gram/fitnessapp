import {combineReducers} from 'redux';
import * as Actions from "../actions";

const monthlyPass = (prev = null, action) => {
  switch (action.type) {
    case Actions.FETCH_PASS_SUCCESS:
      return action.payload.monthlyPass || null
    case Actions.FETCH_PASS_FAILURE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const isGooglePlayAvailable = (prev = true, action) => {
  switch (action.type) {
    case Actions.FETCH_PASS_SUCCESS:
      return action.payload.isGooglePlayAvailable || false
    case Actions.FETCH_PASS_FAILURE:
      return false
    case Actions.RESET:
      return true
    default:
      return prev
  }
}

const isPassActive = (prev = false, action) => {
  switch (action.type) {
    case Actions.FETCH_PASS_SUCCESS:
      return action.payload.isPassActive || false
    case Actions.FETCH_PASS_FAILURE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

export default combineReducers({
  monthlyPass,
  isPassActive,
  isGooglePlayAvailable,
});
