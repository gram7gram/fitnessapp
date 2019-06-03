import keyBy from 'lodash/keyBy'
import {filePutContents} from '../../../storage/fs'
import {SAVE_TRAINING_FAILURE, SAVE_TRAINING_SUCCESS} from "../actions";
import {getMetrics} from "../../../utils/metrics";

const parseBeforeSubmit = model => {
  const data = {...model}

  const workouts = Object.values(data.workouts)
    .filter(workout =>
      Object.values(workout.repeats).length > 0
      && workout.exercise
      && workout.exercise.id
      && workout.exercise.muscleGroup
      && workout.exercise.translations
    )
    .map(workout => {

      const repeats = Object.values(workout.repeats)
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

      return workout
    })

  data.muscleGroups = [
    ...new Set(workouts.map(workout => workout.exercise.muscleGroup))
  ]

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