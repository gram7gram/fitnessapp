import {all, fork} from 'redux-saga/effects'

import Landing from './pages/LandingPage/sagas'
import Workout from './pages/WorkoutPage/sagas'
import Training from './pages/TrainingPage/sagas'
import Exercise from './pages/ExercisePage/sagas'

export default function* sagas() {
    yield all([
        fork(Landing),
        fork(Workout),
        fork(Training),
        fork(Exercise),
    ])
}
