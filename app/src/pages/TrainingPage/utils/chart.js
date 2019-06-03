import intersectionBy from "lodash/intersectionBy";
import {sortByDate} from "../../../utils";
import moment from "moment";

export const createChartData = (trainings) => {
  let flatten = []

  Object.values(trainings).map(trainingPerMonth => {
    flatten = flatten.concat(Object.values(trainingPerMonth))
  })

  const items = flatten.filter(training =>
    training.id !== undefined
    && training.startedAt !== undefined
    && training.muscleGroups !== undefined
    && training.muscleGroups.length > 0
    && training.humanWeight !== undefined
    && training.humanWeight.unit !== undefined
    && training.totalWeightPerHour !== undefined
    && training.totalWeightPerHourPerGroup !== undefined
  ).map(training => ({
    id: training.id,
    startedAt: training.startedAt,
    muscleGroups: training.muscleGroups,
    unit: training.humanWeight.unit,
    totalWeightPerHour: training.totalWeightPerHour || 0,
    totalWeightPerHourPerGroup: training.totalWeightPerHourPerGroup || {},
  }))

  sortByDate(items, 'startedAt', 'ASC')

  return items
}

export const extractChartData = (chartData, muscleGroups, length = 100) => {

  const itemsWithGroups = chartData.filter(data =>
    data.muscleGroups !== undefined && data.muscleGroups.length > 0
  )

  if (itemsWithGroups.length === 0) return null

  //Find exact match of muscle groups for trainings
  let items = itemsWithGroups.filter(data =>
    intersectionBy(data.muscleGroups, muscleGroups).length === muscleGroups.length
  )

  if (items.length < 2) {

    //Find partial match of muscle groups for trainings
    items = itemsWithGroups.filter(data =>
      intersectionBy(data.muscleGroups, muscleGroups).length > 0
    )

    if (items.length < 2) return null
  }

  return items.reverse().slice(0, length).reverse() //last 100 records
}

export const convertToChartConfig = (chartData, currentTraining) => {

  return {
    labels: chartData.map(item =>
      moment(item.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM')
    ),
    datasets: [{
      data: chartData.map(item => item.totalWeightPerHour),
      originalData: chartData,
      currentTraining: currentTraining.id
    }]
  }
}