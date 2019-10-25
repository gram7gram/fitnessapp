import {combineReducers} from 'redux';

import Landing from '../pages/LandingPage/reducers'
import Workout from '../pages/WorkoutPage/reducers'
import Training from '../pages/TrainingPage/reducers'
import Exercise from '../pages/ExercisePage/reducers'
import ExerciseEdit from '../pages/ExerciseEditPage/reducers'
import Settings from '../pages/SettingsPage/reducers'
import MonthlyPass from '../pages/MonthlyPassPage/reducers'
import IAP from '../iap/reducers'

export default combineReducers({
  Landing,
  Workout,
  Training,
  Exercise,
  ExerciseEdit,
  Settings,
  MonthlyPass,
  IAP,
});
