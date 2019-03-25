import {DELETE_MY_EXERCISE_BEFORE, DELETE_MY_EXERCISE_FAILURE, DELETE_MY_EXERCISE_SUCCESS} from "../actions";
import {fileGetContents, filePutContents} from "../../../storage/fs";

export default model => async (dispatch) => {

    dispatch({
        type: DELETE_MY_EXERCISE_BEFORE,
        payload: {
            id: model.id
        }
    })

    try {
        let myItems = await fileGetContents('/my-exercises.json')
        if (!myItems) myItems = '{}'

        try {
            myItems = JSON.parse(myItems)
        } catch (e) {
            myItems = {}
        }

        delete myItems[model.id]

        await filePutContents('/my-exercises.json', JSON.stringify(myItems))

        dispatch({
            type: DELETE_MY_EXERCISE_SUCCESS,
            payload: {
                id: model.id
            }
        })
    } catch ({message}) {
        dispatch({
            type: DELETE_MY_EXERCISE_FAILURE,
            payload: {
                id: model.id,
                message
            }
        })
    }

}