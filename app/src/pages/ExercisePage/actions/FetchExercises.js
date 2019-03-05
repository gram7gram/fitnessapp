import {FETCH_EXERCISES_FAILURE, FETCH_EXERCISES_SUCCESS} from "../actions";

export default () => dispatch => {

    try {
        const payload = require('../../../../data/exercises.json')

        dispatch({
            type: FETCH_EXERCISES_SUCCESS,
            payload
        })
    } catch (e) {
        dispatch({
            type: FETCH_EXERCISES_FAILURE,
            payload: e
        })
    }

}