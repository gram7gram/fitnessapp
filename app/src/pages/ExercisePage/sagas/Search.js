import {all, delay, put, select, takeLatest} from 'redux-saga/effects'

import {SEARCH_CHANGED, SEARCH_SUCCESS} from '../actions'
import {objectValues} from "../../../utils";

function* search({payload}) {

  yield delay(400)

  const items = yield select(store => store.Exercise.items)

  const search = payload.search ? payload.search.toLowerCase() : ''

  const filtered = items.filter((item) =>
    !!Object.values(item.translations).find(({name}) => name.toLowerCase().indexOf(search) !== -1)
  )

  yield put({
    type: SEARCH_SUCCESS,
    payload: filtered
  })
}

export default function* sagas() {
  yield all([
    takeLatest(SEARCH_CHANGED, search),
  ])
}
