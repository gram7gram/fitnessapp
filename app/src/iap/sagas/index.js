import {all, fork} from 'redux-saga/effects'

import IAP from './IAP'

export default function* sagas() {
  yield all([
    fork(IAP)
  ])
}
