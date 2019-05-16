import {combineReducers} from 'redux';
import * as Actions from '../../LandingPage/actions'
import * as TrainingActions from '../../TrainingPage/actions'
import {createChartData} from "../utils/chart";

const chartData = (prev = [], action) => {
  switch (action.type) {
    case Actions.SAVE_TRAININGS_SUCCESS:
    case Actions.FETCH_TRAININGS_SUCCESS:

      return createChartData(action.payload)

    default:
      return prev
  }
}

const currentChartConfig = (prev = null, action) => {
  switch (action.type) {
    case TrainingActions.RESET:
      return null

    case TrainingActions.SET_CURRENT_CHART:

      return action.payload.config

    default:
      return prev
  }
}

const currentChartData = (prev = null, action) => {
  switch (action.type) {
    case TrainingActions.RESET:
      return null

    case TrainingActions.SET_CURRENT_CHART:

      return action.payload.data

    default:
      return prev
  }
}

export default combineReducers({
  chartData,
  currentChartData,
  currentChartConfig
});
