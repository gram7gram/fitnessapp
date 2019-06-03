import {fileGetContents, filePutContents} from '../../../storage/fs'
import {SAVE_EXERCISE_FAILURE, SAVE_EXERCISE_SUCCESS} from "../actions";
import keyBy from "lodash/keyBy";
import {objectValues} from "../../../utils";

export default model => async (dispatch) => {

  let content = await fileGetContents('/my-exercises.json')
  if (!content) content = '{}'

  try {
    content = JSON.parse(content)
  } catch (e) {
    content = {}
  }

  content[model.id] = model

  const items = keyBy(Object.values(content).filter(item => item.id && item.personal), 'id')

  filePutContents('/my-exercises.json', JSON.stringify(items))
    .then(() => {
      dispatch({
        type: SAVE_EXERCISE_SUCCESS,
        payload: model
      })
    })
    .catch(({message}) => {
      dispatch({
        type: SAVE_EXERCISE_FAILURE,
        payload: message
      })
    })
}