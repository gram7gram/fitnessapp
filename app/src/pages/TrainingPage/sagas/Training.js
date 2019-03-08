import {all, put, select, takeEvery, throttle, takeLatest, delay} from 'redux-saga/effects'
import {filePutContents} from "../../../storage/fs";

import SaveTraining from '../actions/SaveTraining'
import * as TrainingActions from '../actions'
import * as WorkoutActions from '../../WorkoutPage/actions'
import {Navigation} from "react-native-navigation";
import * as Pages from "../../../router/Pages";

function* saveAfterChange() {

    yield delay(500)

    const model = yield select(store => store.Training.model)

    yield put(SaveTraining(model))
}

function* save({payload}) {
    const trainings = yield select(store => store.Landing.trainings)

    const items = {...trainings}

    items[payload.id] = {
        id: payload.id,
        createdAt: payload.createdAt,
    }

    filePutContents('/trainingRegistry.json', JSON.stringify(items))
}

function* redirect({payload}) {

    if (payload && payload.id) {
        const trainings = yield select(store => store.Landing.trainings)

        const items = {...trainings}

        delete items[payload.id]

        filePutContents('/trainingRegistry.json', JSON.stringify(items))
    }

    Navigation.push(null, {
        component: {
            name: Pages.LANDING,
            options: {
                drawBehind: true,
                visible: false,
            }
        }
    })
}

export default function* sagas() {
    yield all([
        takeLatest([
            TrainingActions.CHANGED,
            TrainingActions.ADD_WORKOUT,
            TrainingActions.REMOVE_WORKOUT,
            WorkoutActions.CHANGED,
            WorkoutActions.ADD_REPEAT,
            WorkoutActions.REMOVE_REPEAT,
        ], saveAfterChange),

        takeEvery(TrainingActions.SAVE_TRAINING_SUCCESS, save),

        takeEvery([
            TrainingActions.FETCH_TRAINING_FAILURE,
            TrainingActions.DELETE_TRAINING_SUCCESS,
            TrainingActions.DELETE_TRAINING_FAILURE
        ], redirect)
    ])
}
