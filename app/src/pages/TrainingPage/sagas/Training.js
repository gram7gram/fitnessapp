import {all, put, select, takeEvery, throttle} from 'redux-saga/effects'
import {filePutContents} from "../../../storage/fs";
import {Actions} from "react-native-router-flux";

import {
    DELETE_TRAINING_FAILURE,
    DELETE_TRAINING_SUCCESS,
    FETCH_TRAINING_FAILURE,
    SAVE_TRAINING_SUCCESS
} from '../actions'

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

    Actions.landing()
}

export default function* sagas() {
    yield all([
        takeEvery(SAVE_TRAINING_SUCCESS, save),

        takeEvery([
            FETCH_TRAINING_FAILURE,
            DELETE_TRAINING_SUCCESS,
            DELETE_TRAINING_FAILURE
        ], redirect)
    ])
}
