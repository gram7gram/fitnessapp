import {combineReducers} from 'redux';

import Landing from '../pages/LandingPage/reducers'
import Workout from '../pages/WorkoutPage/reducers'
import Training from '../pages/TrainingPage/reducers'
import Exercise from '../pages/ExercisePage/reducers'

export default combineReducers({
    Landing,
    Workout,
    Training,
    Exercise,
});
