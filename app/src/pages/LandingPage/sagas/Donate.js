import {all, takeEvery} from 'redux-saga/effects'
import * as Actions from '../actions'
import {navigateToDonate} from "../../../router";

function* overlay() {

    navigateToDonate()
}

export default function* sagas() {
    yield all([

        takeEvery(Actions.TOGGLE_DONATE_DIALOG, overlay),

    ])
}
