const fs = require('fs-extra')
const path = require('path')
const uuid = require('uuid')
const http = require('http')
const Stream = require('stream').Transform

const file = process.argv.slice(2)[0]

const csvToArray = file => {

    console.log('csvToArray', file);

    const content = fs.readFileSync(path.resolve(file), 'utf8')

    return content.split("\n").map(line => line.split(',')).slice(1)
}

const parseLines = lines => {

    console.log('parseLines', lines.length);

    const exercises = []
    let currentRoot = null

    lines.forEach((row, rowIndex) => {

        const muscleGroup = row[0]
        const image = row[1] || ''
        const isHumanWeight = row[2] === 'true'
        const scale = parseFloat(row[3] || 0)
        const isRoot = row[4] === 'true'
        const name = row[5].replace("\r", "")

        const exercise = {
            id: uuid(),
            muscleGroup,
            isHumanWeight,
            // image,
            scale,
            isRoot,
            translations: {
                en: {name},
                ru: {name},
            },
            variants: []
        }

        // if (image.indexOf('http') !== -1) {
        //
        //     const parts = image.split('.')
        //     const ext = parts[parts.length - 1]
        //
        //     const name = rowIndex + '.' + ext
        //
        //     exercise.image = name
        //
        //     http.request(image, function (response) {
        //         const data = new Stream();
        //
        //         response.on('data', function (chunk) {
        //             data.push(chunk);
        //         });
        //
        //         response.on('end', function () {
        //             fs.writeFileSync(path.resolve('./app/assets/images/exercises/' + name), data.read());
        //         });
        //     }).end();
        // }

        if (exercise.isRoot) {
            currentRoot = exercise

            exercises.push(exercise)

        } else {
            currentRoot.variants.push(exercise)
        }
    })

    return exercises
}

const exportToExercises = items => {

    console.log('exportToExercises');

    fs.writeFileSync(path.resolve('./app/data/exercises.json'), JSON.stringify(items))
}


exportToExercises(
    parseLines(
        csvToArray(file)
    )
)