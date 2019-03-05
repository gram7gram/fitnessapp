
import uuid from 'uuid'
import {filePutContents} from '../../../storage/fs'
import {SAVE_TRAINING_BEFORE, SAVE_TRAINING_FAILURE, SAVE_TRAINING_SUCCESS} from "../actions";

const parseBeforeSubmit = model => {
    const data = {...model}

    if (!data.id) {
        data.id = uuid()
    }

    if (!data.createdAt) {
        data.createdAt = new Date().getTime()
    }

    return data
}

export default model => dispatch => {

    const data = parseBeforeSubmit(model)

    dispatch({
        type: SAVE_TRAINING_BEFORE,
    })

    filePutContents('/trainings/' + data.id + '.json', JSON.stringify(data))
        .then(() => {
            dispatch({
                type: SAVE_TRAINING_SUCCESS,
                payload: data
            })
        })
        .catch(({message}) => {
            dispatch({
                type: SAVE_TRAINING_FAILURE,
                payload: message
            })
        })
}