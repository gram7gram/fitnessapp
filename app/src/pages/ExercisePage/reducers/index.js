import {combineReducers} from 'redux';
import * as Actions from "../actions";

const items = (prev = [], action) => {
    switch (action.type) {
        case Actions.RESET:
            return []
        case Actions.FETCH_EXERCISES_SUCCESS:

            const flattenList = []

            const flatten = item => {

                flattenList.push(item)

                if (item.children) {
                    item.children.forEach(flatten)
                }

                if (item.variants) {
                    item.variants.forEach(flatten)
                }
            }

            action.payload.forEach(flatten)

            return flattenList
        default:
            return prev
    }
}

const filtered = (prev = [], action) => {
    switch (action.type) {
        case Actions.RESET:
            return []
        case Actions.TOGGLE_SEARCH:
            return action.payload.items
        case Actions.SEARCH_SUCCESS:
            return action.payload
        default:
            return prev
    }
}

const search = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.SEARCH_CHANGED:
            return action.payload.search
        default:
            return prev
    }
}

const isSearchEnabled = (prev = false, action) => {
    switch (action.type) {
        case Actions.RESET:
            return false
        case Actions.TOGGLE_SEARCH:
            return action.payload.isSearchEnabled
        default:
            return prev
    }
}

export default combineReducers({
    isSearchEnabled,
    filtered,
    items,
    search,
});
