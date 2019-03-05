
import {rm} from '../../../storage/fs'
import {DELETE_TRAINING_BEFORE, DELETE_TRAINING_FAILURE, DELETE_TRAINING_SUCCESS} from "../actions";

export default id => dispatch => {

    dispatch({
        type: DELETE_TRAINING_BEFORE,
        payload: {
            id
        }
    })

    rm('/trainings/' + id + '.json')
        .then(() => {
            dispatch({
                type: DELETE_TRAINING_SUCCESS,
                payload: {
                    id
                }
            })
        })
        .catch(({message}) => {
            dispatch({
                type: DELETE_TRAINING_FAILURE,
                payload: message
            })
        })
}