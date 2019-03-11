
import {rm} from '../../../storage/fs'
import {DELETE_TRAINING_BEFORE, DELETE_TRAINING_FAILURE, DELETE_TRAINING_SUCCESS} from "../actions";

export default (id, componentId) => dispatch => {

    dispatch({
        type: DELETE_TRAINING_BEFORE,
        componentId,
        payload: {
            id
        }
    })

    rm('/trainings/' + id + '.json')
        .then(() => {
            dispatch({
                type: DELETE_TRAINING_SUCCESS,
                componentId,
                payload: {
                    id
                }
            })
        })
        .catch(({message}) => {
            dispatch({
                type: DELETE_TRAINING_FAILURE,
                componentId,
                payload: message
            })
        })
}