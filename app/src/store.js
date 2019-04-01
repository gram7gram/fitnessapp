import {applyMiddleware, createStore} from 'redux';

import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas'
import {filePutContents, fileGetContents} from "./storage/fs";

const sagaMiddleware = createSagaMiddleware()

const middleware = [thunk, sagaMiddleware]

if (process.env.NODE_ENV === 'development') {
    middleware.push(require('redux-logger').default)
}

let store
// try {
//
//     const content = fileGetContents('/state.json')
//
//     if (typeof content !== 'string') {
//         throw new Error('Initial state is not string: ' + (typeof content))
//     }
//
//     const state = JSON.parse(content)
//
//     store = createStore(reducers, state, applyMiddleware(...middleware));
//
// } catch (e) {
//
//     console.log('initial state error', e.message);

    store = createStore(reducers, {}, applyMiddleware(...middleware));
// }

sagaMiddleware.run(sagas)

// store.subscribe(() => {
//     filePutContents('/state.json', JSON.stringify(store.getState()))
// })

export default store
