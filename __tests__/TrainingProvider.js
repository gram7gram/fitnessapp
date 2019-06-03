import moment from "moment";
import uuid from "uuid";
import random from "random";
import {fromArray} from "./random";
import keyBy from "lodash/keyBy";
import * as Units from "../app/src/Units";
import createWorkout from "./WorkoutProvider";
import createExercise from "./ExerciseProvider";
import {getMetrics} from "../app/src/utils/metrics";

export default () => {
  const unit = fromArray([Units.KILOGRAM, Units.POUNDS])

  const workouts =[
    createWorkout(unit, createExercise()),
    createWorkout(unit, createExercise()),
    createWorkout(unit, createExercise()),
    createWorkout(unit, createExercise()),
    createWorkout(unit, createExercise()),
  ]

  const muscleGroups = [
    ...new Set(workouts.map(workout => workout.exercise.muscleGroup))
  ]

  const training =  {
    id: uuid(),
    startedAt: moment().format('YYYY-MM-01 10:45:00'),
    completedAt: moment().format('YYYY-MM-01 13:00:00'),
    muscleGroups,
    humanWeight: {
      value: random.int(50, 120),
      unit
    },
    workouts: keyBy(workouts, 'id')
  }

  return {
    ...training,
    ...getMetrics(training, training.startedAt, training.completedAt, training.humanWeight.unit)
  }
}
