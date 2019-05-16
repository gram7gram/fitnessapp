import {all, fork} from 'redux-saga/effects'
import Training from './Training'

export default function* sagas() {
  yield all([
    fork(Training),
  ])
}
