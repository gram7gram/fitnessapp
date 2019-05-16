import {all, fork} from 'redux-saga/effects'
import Search from './Search'

export default function* sagas() {
  yield all([
    fork(Search),
  ])
}
