const fs = require('fs-extra')
const path = require('path')
const uuid = require('uuid')
const moment = require('moment')

const file = process.argv.slice(2)[0]

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
    let currentGroup = 0

    const groups = {
        1: ['chest', 'triceps'],
        2: ['back', 'biceps'],
        3: ['legs', 'shoulders'],
    }

    lines.forEach((row, rowIndex) => {

        if (row[0] === 't') {
            if (currentTraining.id) {
                trainings[currentTraining.id] = {...currentTraining}
            }

            ++currentGroup

            if (currentGroup > 3) currentGroup = 1

            currentTraining = {
                id: uuid(),
                muscleGroups: groups[currentGroup],
                workouts: {}
            }
        }

        if (row[0] === 'm') {
            const date = row[1]
            const startedAt = moment(date + ' .2019 ' + row[2], 'DD.MM.YYYY HH:mm')

            currentTraining.duration = parseFloat(row[3])
            currentTraining.humanWeight = parseFloat(row[4])
            currentTraining.totalWeight = parseFloat(row[5])
            currentTraining.totalWeightPerHour = parseFloat(row[6])

            currentTraining.startedAt = startedAt.format('YYYY-MM-DD HH:mm')
            currentTraining.completedAt = startedAt.add(currentTraining.duration, 'hours').format('YYYY-MM-DD HH:mm')
        }

        if (row[0] === 'w') {
            if (!currentWorkout.id) {
                currentWorkout = {
                    id: uuid(),
                    createdAt: new Date().getTime() + rowIndex,
                    exercise: {
                        id: uuid(),
                        translations: {
                            en: {name: row[1]},
                        }
                    },
                    repeats: {}
                }

                for (let i = 3; ; i++) {
                    if (row[i] == '' || i > 20) break;

                    currentWorkout.repeats[i] = {
                        id: uuid(),
                        createdAt: new Date().getTime() + rowIndex + i,
                        weight: parseFloat(row[i])
                    }
                }
            } else {
                for (let i = 3; ; i++) {
                    if (row[i] == '' || i > 20) break;

                    currentWorkout.repeats[i].repeatCount = parseFloat(row[i])
                }

                currentTraining.workouts[currentWorkout.id] = {...currentWorkout}

                currentWorkout = {}
            }
        }
    })

    return trainings
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