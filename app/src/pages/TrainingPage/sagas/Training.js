import {all, delay, put, select, takeEvery, takeLatest, throttle} from 'redux-saga/effects'
import * as TrainingActions from '../../TrainingPage/actions'
import {getMetrics} from "../../../utils";
import SaveTraining from "../actions/SaveTraining";

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

    const metrics = getMetrics(training, startedAt, completedAt)

    yield put({
        type: TrainingActions.CHANGED,
        payload: metrics
    })

    console.log('updateMetrics', metrics.totalWeightPerHour > 0);

    if (metrics.totalWeightPerHour > 0) {
        yield put(SaveTraining({
            ...training,
            ...metrics
        }))
    }
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
