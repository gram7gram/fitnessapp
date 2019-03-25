import {combineReducers} from 'redux';
import * as Actions from "../actions";

const name = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.CHANGED:

            if (action.payload.name !== undefined) {
                return action.payload.name
            }

            return prev
        default:
            return prev
    }
}

const muscleGroup = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.CHANGED:

            if (action.payload.muscleGroup !== undefined) {
                return action.payload.muscleGroup
            }

            return prev
        default:
            return prev
    }
}

const isHumanWeight = (prev = false, action) => {
    switch (action.type) {
        case Actions.RESET:
            return false
        case Actions.CHANGED:

            if (action.payload.isHumanWeight !== undefined) {
                return action.payload.isHumanWeight
            }

            return prev
        default:
            return prev
    }
}

const scale = (prev = 1, action) => {
    switch (action.type) {
        case Actions.RESET:
            return 1
        case Actions.CHANGED:

            if (action.payload.scale !== undefined) {
                return action.payload.scale
            }

            return prev
        default:
            return prev
    }
}

export default combineReducers({
    name,
    muscleGroup,
    isHumanWeight,
    scale,
});
