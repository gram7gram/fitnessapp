
import {rm} from '../../../storage/fs'
import {DELETE_TRAINING_BEFORE, DELETE_TRAINING_FAILURE, DELETE_TRAINING_SUCCESS} from "../actions";

export default (model, componentId) => dispatch => {

    dispatch({
        type: DELETE_TRAINING_BEFORE,
        componentId,
        payload: {
            id: model.id,
            startedAt: model.startedAt
        }
    })

    rm('/trainings/' + model.id + '.json')
        .then(() => {
            dispatch({
                type: DELETE_TRAINING_SUCCESS,
                componentId,
                payload: {
                    id: model.id,
                    startedAt: model.startedAt
                }
            })
        })
        .catch(({message}) => {
            dispatch({
                type: DELETE_TRAINING_FAILURE,
                componentId,
                payload: {
                    id: model.id,
                    startedAt: model.startedAt,
                    message
                }
            })
        })
}