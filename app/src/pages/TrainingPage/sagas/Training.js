import {all, delay, put, select, takeEvery, takeLatest, throttle} from 'redux-saga/effects'
import * as TrainingActions from '../../TrainingPage/actions'
import {getMetrics} from "../../../utils";
import SaveTraining from "../actions/SaveTraining";
import {Navigation} from "react-native-navigation";
import moment from "moment";
import i18n from "../../../i18n";

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

    const metrics = getMetrics(training, startedAt, completedAt, training.humanWeight.unit)

    if (training.totalWeightPerHour !== metrics.totalWeightPerHour
        || training.totalWeight.value !== metrics.totalWeight.value
        || training.totalWeight.unit !== metrics.totalWeight.unit
        || training.duration !== metrics.duration) {

        yield put({
            type: TrainingActions.CHANGED,
            payload: metrics
        })

        if (metrics.totalWeightPerHour > 0) {
            yield put(SaveTraining({
                ...training,
                ...metrics
            }))
        }
    }
}

function* updateNavigation({componentId, payload}) {

    if (componentId && payload.startedAt && payload.muscleGroups) {

        Navigation.mergeOptions(componentId, {
            topBar: {
                title: {
                    text: moment(payload.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM')
                        + ' - ' + payload.muscleGroups.map(group => i18n.t('muscle_groups.' + group)).join(', ')
                }
            }
        })
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

        takeLatest(TrainingActions.FETCH_TRAINING_SUCCESS, updateNavigation),
    ])
}
