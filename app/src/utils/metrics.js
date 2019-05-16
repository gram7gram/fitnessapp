import {convertWeight} from "../Units";
import moment from "moment";
import objectValues from "../utils/objectValues";

export const getMetrics = (training, startedAt, completedAt, unit) => {

  let totalWeight = 0, duration = 0, totalWeightPerHour = 0;

  const groupedWeight = {}

  const workouts = objectValues(training.workouts)

  workouts.forEach(workout => {

    const muscleGroup = workout.exercise.muscleGroup

    if (groupedWeight[muscleGroup] === undefined) {
      groupedWeight[muscleGroup] = {
        muscleGroup,
        exerciseCount: 1,
        totalWeightPerHour: 0,
        totalWeight: {
          value: 0,
          unit
        }
      }
    } else {
      groupedWeight[muscleGroup].exerciseCount += 1
    }

    objectValues(workout.repeats).forEach(repeat => {

      let value
      if (!repeat.isHumanWeight) {
        value = convertWeight(repeat.weight, unit) * repeat.repeatCount
      } else {
        value = convertWeight(training.humanWeight, unit) * repeat.repeatCount
      }

      totalWeight += value

      groupedWeight[muscleGroup].totalWeight.value += value
    })
  })

  if (completedAt && startedAt && workouts.length > 0) {

    const date1 = moment(startedAt, 'YYYY-MM-DD HH:mm')
    const date2 = moment(completedAt, 'YYYY-MM-DD HH:mm')

    duration = parseInt(date2.diff(date1, 'minutes')) / 60

    if (duration > 0) {
      totalWeightPerHour = totalWeight / duration / 1000

      objectValues(groupedWeight).forEach(group => {

        const currentGroupPercent = group.exerciseCount / workouts.length

        group.totalWeightPerHour = group.totalWeight.value / (duration * currentGroupPercent) / 1000
        group.totalWeightPerHour = Number(Math.max(0, group.totalWeightPerHour).toFixed(2))
      })
    }
  }

  return {
    duration: Number(Math.max(0, duration).toFixed(2)),
    totalWeight: {
      value: Number(Math.max(0, totalWeight).toFixed(2)),
      unit
    },
    totalWeightPerHour: Number(Math.max(0, totalWeightPerHour).toFixed(2)),
    groupedWeight
  }
}