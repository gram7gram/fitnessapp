import {all, put, takeLatest} from 'redux-saga/effects'
import * as Actions from '../actions'
import * as MonthlyPass from '../actions/MonthlyPass'
import {navigateToMonthlyPass} from "../../router";

function* redirectIfNotPurchased({payload, componentId}) {
  if (componentId && !payload.isPassEnabled) {
    navigateToMonthlyPass(componentId)
  }
}

function* fetch({componentId}) {
  yield put(MonthlyPass.fetch(componentId))
}

function* purchase() {
  yield put(MonthlyPass.purchase())
}

function* reset() {
  MonthlyPass.disconnect()
}

export default function* sagas() {
  yield all([
    takeLatest(Actions.FETCH_PASS_SUCCESS, redirectIfNotPurchased),

    takeLatest(Actions.FETCH_PASS_REQUEST, fetch),

    takeLatest(Actions.PURCHASE_PASS_REQUEST, purchase),

    takeLatest(Actions.RESET, reset),
  ])
}
