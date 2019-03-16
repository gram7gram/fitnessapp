import {AsyncStorage} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {createRouter} from './router';
import {objectValues} from "./utils";
import moment from "moment";
import {filePutContents} from "./storage/fs";

Navigation.events()
    .registerAppLaunchedListener(createRouter);

const prepareDemo = () => {

    const demo = require('../data/demo.json')

    const registry = {}

    objectValues(demo).forEach(training => {

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
            muscleGroups: training.muscleGroups,
        }

    })

    filePutContents('/trainingRegistry.json', JSON.stringify(registry))
        .catch(e => {
            console.log(e);
        })
}

const hasDemo = false;//parseInt(AsyncStorage.getItem('hasDemo')) === 1

if (!hasDemo) {

    prepareDemo()

    AsyncStorage.setItem('hasDemo', '1')
}