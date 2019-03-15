import {applyMiddleware, createStore} from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import {defaultLocale} from '../../app.json';

import reducers from './reducers';
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

const middleware = [thunk, sagaMiddleware]

if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger)
}

const initial = {}

const store = createStore(reducers, initial, applyMiddleware(...middleware));

sagaMiddleware.run(sagas)

export default store
