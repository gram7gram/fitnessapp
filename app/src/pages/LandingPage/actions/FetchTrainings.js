
import {fileGetContents} from '../../../storage/fs'
import {FETCH_TRAININGS_FAILURE, FETCH_TRAININGS_SUCCESS} from "../actions";

export default () => dispatch => {

    fileGetContents('/trainingRegistry.json')
        .then(payload => {
            dispatch({
                type: FETCH_TRAININGS_SUCCESS,
                payload: JSON.parse(payload)
            })
        })
        .catch(({message}) => {
            dispatch({
                type: FETCH_TRAININGS_FAILURE,
                payload: message
            })
        })
}