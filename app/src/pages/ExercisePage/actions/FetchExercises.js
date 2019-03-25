import {FETCH_EXERCISES_FAILURE, FETCH_EXERCISES_SUCCESS} from "../actions";
import {fileGetContents} from "../../../storage/fs";
import {objectValues} from "../../../utils";
import uuid from "uuid";
import i18n from "../../../i18n";

export default () => async (dispatch) => {

    try {
        let myItems = await fileGetContents('/my-exercises.json')
        if (!myItems) myItems = '{}'

        const items = require('../../../../data/exercises.json')

        try {
            myItems = JSON.parse(myItems)
        } catch (e) {
            myItems = {}
        }

        const myExercises = objectValues(myItems)

        let payload = []

        if (myExercises.length > 0) {

            payload.push({
                id: uuid(),
                isRoot: true,
                translations: {
                    en: {name: i18n.t('exercise.personal_title', 'en')},
                    ru: {name: i18n.t('exercise.personal_title', 'ru')},
                },
                variants: myExercises
            })

        }

        payload = payload.concat(items)

        dispatch({
            type: FETCH_EXERCISES_SUCCESS,
            payload
        })
    } catch (e) {
        dispatch({
            type: FETCH_EXERCISES_FAILURE,
            payload: e
        })
    }

}