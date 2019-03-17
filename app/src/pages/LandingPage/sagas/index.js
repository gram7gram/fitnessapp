import {all, fork} from 'redux-saga/effects'
import Training from './Training'
import Donate from './Donate'

export default function* sagas() {
    yield all([
        fork(Training),
        fork(Donate),
    ])
}
