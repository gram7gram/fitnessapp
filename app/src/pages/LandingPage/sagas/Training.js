import {all, delay, put, select, takeEvery, takeLatest, throttle} from 'redux-saga/effects'

import moment from 'moment'
import SaveTrainings from '../actions/SaveTrainings'
import SaveTraining from '../../TrainingPage/actions/SaveTraining'
import * as TrainingActions from '../../TrainingPage/actions'
import {Navigation} from "react-native-navigation";
import * as Pages from "../../../router/Pages";
import {objectValues} from "../../../utils";

function* saveAfterChange() {

    yield delay(200)

    const model = yield select(store => store.Training.model)

    yield put(SaveTraining(model))
}

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
        Navigation.push(componentId, {
            component: {
                name: Pages.LANDING,
                options: {
                    drawBehind: true,
                    visible: false,
                }
            }
        })
    }
}

export default function* sagas() {
    yield all([
        takeLatest([
            TrainingActions.CHANGED,
            TrainingActions.ADD_WORKOUT,
            TrainingActions.REMOVE_WORKOUT,
            TrainingActions.WORKOUT_CHANGED,
            TrainingActions.REPEAT_CHANGED,
            TrainingActions.ADD_REPEAT,
            TrainingActions.REMOVE_REPEAT,
        ], saveAfterChange),

        takeEvery(TrainingActions.SAVE_TRAINING_SUCCESS, updateRegistry),

        takeEvery([
            TrainingActions.FETCH_TRAINING_FAILURE,
            TrainingActions.DELETE_TRAINING_SUCCESS,
            TrainingActions.DELETE_TRAINING_FAILURE
        ], redirect)
    ])
}
