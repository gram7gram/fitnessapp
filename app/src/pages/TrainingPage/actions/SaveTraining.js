import keyBy from 'lodash/keyBy'
import {filePutContents} from '../../../storage/fs'
import {SAVE_TRAINING_FAILURE, SAVE_TRAINING_SUCCESS} from "../actions";
import {getMetrics, objectValues} from "../../../utils";

const parseBeforeSubmit = model => {
    const data = {...model}

    const muscleGroups = []

    const workouts = objectValues(data.workouts)
        .filter(workout =>
            objectValues(workout.repeats).length > 0
            && workout.exercise
            && workout.exercise.id
            && workout.exercise.translations
        )
        .map(workout => {

            const repeats = objectValues(workout.repeats)
                .filter(repeat =>
                    repeat.weight.value > 0
                    && repeat.repeatCount > 0
                )
                .map(repeat => {

                    if (repeat.isHumanWeight) {
                        repeat.weight = {...data.humanWeight}
                    }

                    return repeat
                })

            workout.repeats = keyBy(repeats, 'id')

            if (workout.exercise.muscleGroup) {
                muscleGroups.push(workout.exercise.muscleGroup)
            }

            return workout
        })

    data.muscleGroups = [...new Set(muscleGroups)]

    data.workouts = keyBy(workouts, 'id')

    const metrics = getMetrics(data, data.startedAt, data.completedAt, data.humanWeight.unit)

    return {
        ...data,
        ...metrics
    }

}

export default model => dispatch => {

    const data = parseBeforeSubmit(model)

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