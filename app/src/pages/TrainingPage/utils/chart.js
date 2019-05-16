import intersectionBy from "lodash/intersectionBy";
import objectValues from "../../../utils/objectValues";
import {sortByDate} from "../../../utils";
import moment from "moment";

export const createChartData = (trainings) => {
  let flatten = []

  objectValues(trainings).map(trainingPerMonth => {
    flatten = flatten.concat(objectValues(trainingPerMonth))
  })

  const items = flatten.map(training => ({
    id: training.id,
    startedAt: training.startedAt,
    muscleGroups: training.muscleGroups,
    unit: training.unit,
    totalWeightPerHour: training.totalWeightPerHour || 0,
  }))

  sortByDate(items, 'startedAt', 'ASC')

  return items
}

export const extractChartData = (chartData, muscleGroups) => {

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

  return items.reverse().slice(0, 100).reverse() //last 100 records
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