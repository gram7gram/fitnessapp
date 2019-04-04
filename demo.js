const fs = require('fs-extra')
const path = require('path')
const uuid = require('uuid')
const moment = require('moment')
const keyBy = require('lodash/keyBy')

const file = process.argv.slice(2)[0]

const objectValues = (obj) => obj ? Object.keys(obj).map(i => obj[i]) : []

const getMetrics = (training, unit) => {

    let totalWeight = 0, totalWeightPerHour = 0;

    objectValues(training.workouts).forEach(workout => {
        objectValues(workout.repeats).forEach(repeat => {

            if (!repeat.isHumanWeight) {
                totalWeight += repeat.weight.value * repeat.repeatCount
            } else {
                totalWeight += training.humanWeight.value * repeat.repeatCount
            }

        })
    })

    if (training.duration > 0) {
        totalWeightPerHour = totalWeight / training.duration / 1000
    }

    return {
        totalWeight: {
            value: Number(totalWeight.toFixed(2)),
            unit
        },
        totalWeightPerHour: Number(totalWeightPerHour.toFixed(2)),
    }
}

const csvToArray = file => {

    console.log('csvToArray', file);

    const content = fs.readFileSync(path.resolve(file), 'utf8')

    return content.split("\n").map(line => line.split(','))
}

const parseLines = lines => {

    console.log('parseLines', lines.length);

    const trainings = {}
    let currentTraining = {}
    let currentWorkout = {}

    const unit = 'kg'


    lines.forEach((row, rowIndex) => {

        if (row[0] === 't') {
            if (currentTraining.id) {
                trainings[currentTraining.id] = {...currentTraining}
            }

            currentTraining = {
                id: uuid(),
                muscleGroups: {},
                workouts: {}
            }
        }

        if (row[0] === 'm') {
            const date = row[1]
            const startedAt = row[2] ? moment(date + ' .2019 ' + row[2], 'DD.MM.YYYY HH:mm') : null
            const completedAt = row[3] ? moment(date + ' .2019 ' + row[3], 'DD.MM.YYYY HH:mm') : null
            const duration = row[4] ? parseFloat(row[4]) : 0
            const humanWeight = row[5] ? parseFloat(row[5]) : 0
            const totalWeight = row[6] ? parseFloat(row[6]) : 0
            const totalWeightPerHour = row[7] ? parseFloat(row[7]) : 0

            currentTraining.startedAt = startedAt.format('YYYY-MM-DD HH:mm')

            if (completedAt) {
                currentTraining.completedAt = completedAt.format('YYYY-MM-DD HH:mm')
                currentTraining.duration = completedAt.diff(startedAt, 'hours')
            } else if (duration) {
                currentTraining.duration = duration
                currentTraining.completedAt = moment(startedAt).subtract(duration, 'hours').format('YYYY-MM-DD HH:mm')
            }

            currentTraining.humanWeight = {
                value: humanWeight,
                unit
            }

            if (totalWeight) {
                currentTraining.totalWeight = {
                    value: totalWeight,
                    unit
                }
            }

            if (totalWeightPerHour) {
                currentTraining.totalWeightPerHour = totalWeightPerHour
            }
        }

        if (row[0] === 'w') {

            const name = row[1]

            if (!currentWorkout.id) {
                currentWorkout = {
                    id: uuid(),
                    createdAt: new Date().getTime() + rowIndex,
                    exercise: {
                        id: uuid(),
                        muscleGroup: null,
                        translations: {
                            en: {name},
                            ru: {name},
                        }
                    },
                    repeats: {}
                }

                for (let i = 4; ; i++) {
                    if (i > 30) break;


                    if (row[i] != '' && row[i] !== undefined) {

                        currentWorkout.repeats[i] = {
                            id: uuid(),
                            createdAt: new Date().getTime() + rowIndex + i,
                            weight: {
                                value: parseFloat(row[i]),
                                unit
                            }
                        }
                    }
                }
            } else {

                if (name && name !== '+') {
                    currentWorkout.exercise.muscleGroup = name
                    currentTraining.muscleGroups[name] = true
                }

                for (let i = 4; ; i++) {

                    if (i > 30) break;

                    if (row[i] != '' && row[i] !== undefined) {
                        currentWorkout.repeats[i].repeatCount = parseFloat(row[i])
                    }
                }

                currentWorkout.repeats = keyBy(objectValues(currentWorkout.repeats), 'id')

                currentTraining.workouts[currentWorkout.id] = {...currentWorkout}

                currentWorkout = {}
            }
        }
    })

    const trainingsExtended = objectValues(trainings).map(training => {
        return {
            ...training,
            muscleGroups: Object.keys(training.muscleGroups),
            ...getMetrics(training, unit)
        }
    })

    return keyBy(trainingsExtended, 'id')
}

const exportToDemo = items => {

    console.log('exportToDemo');

    fs.writeFileSync(path.resolve('./app/data/demo.json'), JSON.stringify(items))
}


exportToDemo(
    parseLines(
        csvToArray(file)
    )
)