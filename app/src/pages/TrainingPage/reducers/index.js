import {combineReducers} from 'redux';
import model from './model'
import Chart from './Chart'
import * as Actions from '../actions'

const isLoading = (prev = false, action) => {
  switch (action.type) {
    case Actions.RESET:
    case Actions.FETCH_TRAINING_SUCCESS:
    case Actions.FETCH_TRAINING_FAILURE:
      return false
    case Actions.FETCH_TRAINING_BEFORE:
      return true
    default:
      return prev

  }
}

const isLoaded = (prev = false, action) => {
  switch (action.type) {
    case Actions.RESET:
    case Actions.FETCH_TRAINING_BEFORE:
    case Actions.FETCH_TRAINING_FAILURE:
      return false
    case Actions.FETCH_TRAINING_SUCCESS:
      return true
    default:
      return prev

  }
}

export default combineReducers({
  Chart,
  model,
  isLoading,
  isLoaded,
});
