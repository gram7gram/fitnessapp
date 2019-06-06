import "./theme";

import AsyncStorage from '@react-native-community/async-storage';
import {Navigation} from 'react-native-navigation';
import {createRouter} from './router';
import moment from "moment";
import {filePutContents} from "./storage/fs";

Navigation.events()
  .registerAppLaunchedListener(createRouter);

const prepareDemo = () => {

  console.log('prepareDemo');

  const demo = require('../data/demo.json')

  const registry = {}

  Object.values(demo).forEach(training => {

    filePutContents('/trainings/' + training.id + '.json', JSON.stringify(training))
      .catch(e => {
        console.log(e);
      })

    const month = moment(training.startedAt, 'YYYY-MM-DD HH:mm').format('YYYY-MM')

    if (registry[month] === undefined) {
      registry[month] = {}
    }

    registry[month][training.id] = {
      id: training.id,
      startedAt: training.startedAt,
      totalWeightPerHour: training.totalWeightPerHour,
      totalWeightPerHourPerGroup: training.totalWeightPerHourPerGroup || {},
      unit: training.totalWeight.unit,
      muscleGroups: training.muscleGroups,
    }

  })

  filePutContents('/trainingRegistry.json', JSON.stringify(registry))
    .catch(e => {
      console.log(e);
    })
}

AsyncStorage.getItem('hasDemo').then(value => {

  const hasDemo = false;//parseInt(value) === 1

  if (!hasDemo) {

    prepareDemo()

    AsyncStorage.removeItem('Landing.openedCount')
    AsyncStorage.removeItem('Landing.isRateAlreadyOpened')
    AsyncStorage.setItem('hasDemo', '1')
  }
})
