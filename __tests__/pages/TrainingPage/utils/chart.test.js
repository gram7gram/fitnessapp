import keyBy from 'lodash/keyBy';
import {createChartData, extractChartData} from '../../../../app/src/pages/TrainingPage/utils/chart'
import createTraining from "../../../TrainingProvider";

xit('createChartData should return valid array', () => {

  const trainings = {
    "01-2019": keyBy([
      createTraining(),
      createTraining(),
    ], 'id'),
    "02-2019": keyBy([
      createTraining(),
      createTraining(),
    ], 'id'),
  }

  const data = createChartData(trainings)

  expect(data.length).toEqual(4)

  data.forEach(item => {
    expect(item.id).not.toEqual(undefined)
    expect(item.startedAt).not.toEqual(undefined)
    expect(item.muscleGroups).not.toEqual(undefined)
    expect(item.unit).not.toEqual(undefined)
    expect(item.totalWeightPerHour).not.toEqual(undefined)
    expect(item.totalWeightPerHourPerGroup).not.toEqual(undefined)
  })
})

xit('extractChartData should return `null` if there is no chart data', () => {

  const data = extractChartData([], ['abs'])

  expect(data).toEqual(null)
})

xit('extractChartData should return `null` if there is no chart data with provided muscle groups', () => {

  const data = extractChartData([
    createTraining(),
    createTraining()
  ], ['test'])

  expect(data).toEqual(null)
})

it('extractChartData should return valid array which length is limited by provided length', () => {

  const t1 = createTraining();
  const t2 = createTraining();
  const t3 = createTraining();
  const groups = t1.muscleGroups.concat(t2.muscleGroups).concat(t3.muscleGroups)

  const data = extractChartData([
    t1, t2, t3, createTraining(), createTraining()
  ], groups, 3)

  expect(data).not.toEqual(null)
  expect(data.length).toEqual(3)
})