import {all, delay, put, select, takeEvery, takeLatest, throttle} from 'redux-saga/effects'

import moment from 'moment'
import SaveTrainings from '../actions/SaveTrainings'
import * as TrainingActions from '../../TrainingPage/actions'
import {navigateToLanding} from "../../../router";
import {fileGetContents} from "../../../storage/fs";

const getTrainings = async () => {
    let content = await fileGetContents('/trainingRegistry.json')
    if (!content) content = '{}'

    let trainings
    try {
        trainings = JSON.parse(content)
    } catch (e) {
        trainings = {}
    }

    return trainings
}

function* updateRegistry({payload}) {

    const trainings = yield getTrainings()

    const month = moment(payload.startedAt, 'YYYY-MM-DD HH:mm').format('YYYY-MM')

    if (trainings[month] === undefined) {
        trainings[month] = {}
    }

    trainings[month][payload.id] = {
        id: payload.id,
        startedAt: payload.startedAt,
        totalWeightPerHour: payload.totalWeightPerHour,
        muscleGroups: payload.muscleGroups,
        unit: payload.totalWeight.unit,
    }

    yield put(SaveTrainings(trainings))
}

function* redirect({payload, componentId}) {

    if (payload && payload.id && payload.startedAt) {

        const trainings = yield getTrainings()

        const month = moment(payload.startedAt, 'YYYY-MM-DD HH:mm').format('YYYY-MM')

        if (trainings[month] !== undefined) {
            if (trainings[month][payload.id] !== undefined) {
                delete trainings[month][payload.id]
            }
        }

        yield put(SaveTrainings(trainings))
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
