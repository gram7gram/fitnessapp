import {combineReducers} from 'redux';
import keyBy from 'lodash/keyBy'
import * as Actions from '../actions'
import {objectValues} from "../../../utils";

const id = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.CHANGED:
            if (action.payload.id !== undefined) {
                return action.payload.id
            }

            return prev
        default:
            return prev
    }
}

const createdAt = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.CHANGED:
            if (action.payload.createdAt !== undefined) {
                return action.payload.createdAt
            }

            return prev
        default:
            return prev
    }
}

const training = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.CHANGED:
            if (action.payload.training !== undefined) {
                return action.payload.training
            }

            return prev
        default:
            return prev
    }
}

const exercise = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.FETCH_EXERCISE_SUCCESS:
            return action.payload
        case Actions.CHANGED:
            if (action.payload.exercise !== undefined) {
                return action.payload.exercise
            }

            return prev
        default:
            return prev
    }
}

const totalWeight = (prev = 0, action) => {
    switch (action.type) {
        case Actions.RESET:
            return 0
        case Actions.CHANGED:
            if (action.payload.totalWeight !== undefined) {
                return action.payload.totalWeight
            }

            return prev
        default:
            return prev
    }
}

const repeats = (prev = {}, action) => {
    let items
    switch (action.type) {
        case Actions.RESET:
            return {}
        case Actions.CHANGED:

            let id = action.payload.id

            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    ...action.payload
                }
            }
        case Actions.ADD_REPEAT:

            items = {...prev}

            items[action.payload.id] = action.payload

            return keyBy(objectValues(items).filter(item => item.id), 'id')

        case Actions.REMOVE_REPEAT:

            items = {...prev}

            delete items[action.payload.id]

            return keyBy(objectValues(items).filter(item => item.id), 'id')

        default:
            return prev
    }
}

export default combineReducers({
    id,
    createdAt,
    totalWeight,
    training,
    exercise,
    repeats
});
