
import {fileGetContents} from '../../../storage/fs'
import {FETCH_TRAINING_BEFORE, FETCH_TRAINING_FAILURE, FETCH_TRAINING_SUCCESS} from "../actions";

export default id => dispatch => {

    dispatch({
        type: FETCH_TRAINING_BEFORE,
        payload: {
            id
        }
    })

    fileGetContents('/trainings/' + id + '.json')
        .then(payload => {
            dispatch({
                type: FETCH_TRAINING_SUCCESS,
                payload: JSON.parse(payload)
            })
        })
        .catch(({message}) => {
            dispatch({
                type: FETCH_TRAINING_FAILURE,
                payload: {
                    id,
                    message
                }
            })
        })
}