
import {filePutContents} from '../../../storage/fs'
import {SAVE_TRAININGS_FAILURE, SAVE_TRAININGS_SUCCESS} from "../actions";

export default (items) => dispatch => {

    filePutContents('/trainingRegistry.json', JSON.stringify(items))
        .then(() => {
            dispatch({
                type: SAVE_TRAININGS_SUCCESS,
                payload: items
            })
        })
        .catch(({message}) => {
            dispatch({
                type: SAVE_TRAININGS_FAILURE,
                payload: message
            })
        })
}