import {all, delay, put, select, takeEvery, takeLatest, throttle} from 'redux-saga/effects'

import moment from 'moment'
import SaveTrainings from '../actions/SaveTrainings'
import * as TrainingActions from '../../TrainingPage/actions'
import {objectValues} from "../../../utils";
import {navigateToLanding} from "../../../router";

function* updateRegistry({payload}) {
    const trainings = yield select(store => store.Landing.trainings)

    const items = {...trainings}

    let image = null;
    const workout = objectValues(payload.workouts)[0]
    if (workout && workout.exercise) {
        image = workout.exercise.image
    }

    const month = moment(payload.startedAt, 'YYYY-MM-DD HH:mm').format('YYYY-MM')

    if (items[month] === undefined) {
        items[month] = {}
    }

    items[month][payload.id] = {
        id: payload.id,
        startedAt: payload.startedAt,
        totalWeightPerHour: payload.totalWeightPerHour,
        muscleGroups: payload.muscleGroups,
        image
    }

    yield put(SaveTrainings(items))
}

function* redirect({payload, componentId}) {

    if (payload && payload.id && payload.startedAt) {
        const trainings = yield select(store => store.Landing.trainings)

        const items = {...trainings}

        const month = moment(payload.startedAt, 'YYYY-MM-DD HH:mm').format('YYYY-MM')

        if (items[month] !== undefined) {
            if (items[month][payload.id] !== undefined) {
                delete items[month][payload.id]
            }
        }

        yield put(SaveTrainings(items))
    }

    if (componentId) {
        navigateToLanding(componentId)
    }
}

export default function* sagas() {
    yield all([

        takeEvery(TrainingActions.SAVE_TRAINING_SUCCESS, updateRegistry),

        takeEvery([
            TrainingActions.FETCH_TRAINING_FAILURE,
            TrainingActions.DELETE_TRAINING_SUCCESS,
            TrainingActions.DELETE_TRAINING_FAILURE
        ], redirect)
    ])
}
