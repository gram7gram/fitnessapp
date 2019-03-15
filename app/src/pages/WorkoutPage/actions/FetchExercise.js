import {FETCH_EXERCISE_FAILURE, FETCH_EXERCISE_SUCCESS, FETCH_EXERCISE_BEFORE} from "../actions";


export default id => dispatch => {

    try {
        dispatch({
            type: FETCH_EXERCISE_BEFORE,
            payload: {
                id
            }
        })

        const content = require('../../../../data/exercises.json')

        const items = [];

        const flatten = item => {

            items.push(item)

            if (item.variants) {
                item.variants.forEach(flatten)
            }
        }

        content.forEach(flatten)

        const payload = items.find(item => item.id === id)
        if (!payload) {
            throw 'Not found'
        }

        dispatch({
            type: FETCH_EXERCISE_SUCCESS,
            payload
        })
    } catch (e) {
        dispatch({
            type: FETCH_EXERCISE_FAILURE,
            payload: e
        })
    }

}