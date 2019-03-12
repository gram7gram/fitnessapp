
import {fileGetContents} from '../../../storage/fs'
import {FETCH_TRAININGS_FAILURE, FETCH_TRAININGS_SUCCESS} from "../actions";

export default () => dispatch => {

    fileGetContents('/trainingRegistry.json')
        .then(content => {

            let payload = []
            try {
                payload = JSON.parse(content)

                dispatch({
                    type: FETCH_TRAININGS_SUCCESS,
                    payload
                })

            } catch (e) {
                dispatch({
                    type: FETCH_TRAININGS_FAILURE,
                    payload: e.message
                })
            }
        })
        .catch(({message}) => {
            dispatch({
                type: FETCH_TRAININGS_FAILURE,
                payload: message
            })
        })
}