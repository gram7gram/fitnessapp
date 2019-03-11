import {all, delay, put, select, takeEvery, takeLatest, throttle} from 'redux-saga/effects'

import moment from 'moment'
import * as TrainingActions from '../../TrainingPage/actions'
import {objectValues} from "../../../utils";

function* debounceUpdateIfDateChanged({payload}) {
    if (payload.startedAt !== undefined || payload.completedAt !== undefined) {
        yield debounceUpdate({payload})
    }
}

function* debounceUpdate(action) {

    yield delay(200)

    yield updateMetrics(action)
}

function* updateMetrics({payload = {}}) {

    const training = yield select(store => store.Training.model)

    const startedAt = payload.startedAt || training.startedAt
    const completedAt = payload.completedAt || training.completedAt

    let totalWeight = 0, duration = 0, totalWeightPerHour = 0;

    objectValues(training.workouts).forEach(workout => {
        objectValues(workout.repeats).forEach(repeat => {
            totalWeight += repeat.weight * repeat.repeatCount
        })
    })

    if (completedAt && startedAt) {

        const date1 = moment(startedAt, 'YYYY-MM-DD HH:mm')
        const date2 = moment(completedAt, 'YYYY-MM-DD HH:mm')

        duration = date2.diff(date1, 'minutes') / 60
    }

    if (duration > 0) {
        totalWeightPerHour = totalWeight / duration / 1000
    }

    yield put({
        type: TrainingActions.CHANGED,
        payload: {
            duration: Number(duration.toFixed(2)),
            totalWeight: Number(totalWeight.toFixed(2)),
            totalWeightPerHour: Number(totalWeightPerHour.toFixed(2)),
        }
    })
}


export default function* sagas() {
    yield all([
        takeLatest([
            TrainingActions.CHANGED,
        ], debounceUpdateIfDateChanged),

        takeLatest([
            TrainingActions.REMOVE_REPEAT,
            TrainingActions.REMOVE_WORKOUT,
        ], debounceUpdate),

        takeLatest(TrainingActions.UPDATE_WORKOUT_METRICS_REQUEST, updateMetrics),
    ])
}
