import {combineReducers} from 'redux';
import * as Actions from '../actions'
import keyBy from "lodash/keyBy";
import {objectValues} from "../../../utils";

const id = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.id
        case Actions.CHANGED:
            if (action.payload.id !== undefined) {
                return action.payload.id
            }

            return prev
        default:
            return prev
    }
}

const createdAt = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.createdAt
        case Actions.CHANGED:
            if (action.payload.createdAt !== undefined) {
                return action.payload.createdAt
            }

            return prev
        default:
            return prev
    }
}

const humanWeight = (prev = 0, action) => {
    switch (action.type) {
        case Actions.RESET:
            return 0
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.humanWeight
        case Actions.CHANGED:
            if (action.payload.humanWeight !== undefined) {
                return action.payload.humanWeight
            }

            return prev
        default:
            return prev
    }
}

const startedAt = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.startedAt
        case Actions.CHANGED:
            if (action.payload.startedAt !== undefined) {
                return action.payload.startedAt
            }

            return prev
        default:
            return prev
    }
}

const completedAt = (prev = null, action) => {
    switch (action.type) {
        case Actions.RESET:
            return null
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.completedAt
        case Actions.CHANGED:
            if (action.payload.completedAt !== undefined) {
                return action.payload.completedAt
            }

            return prev
        default:
            return prev
    }
}

const duration = (prev = 0, action) => {
    switch (action.type) {
        case Actions.RESET:
            return 0
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.duration
        case Actions.CHANGED:
            if (action.payload.duration !== undefined) {
                return action.payload.duration
            }

            return prev
        default:
            return prev
    }
}

const totalWeight = (prev = 0, action) => {
    switch (action.type) {
        case Actions.RESET:
            return 0
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.totalWeight
        case Actions.CHANGED:
            if (action.payload.totalWeight !== undefined) {
                return action.payload.totalWeight
            }

            return prev
        default:
            return prev
    }
}

const totalWeightPerHour = (prev = 0, action) => {
    switch (action.type) {
        case Actions.RESET:
            return 0
        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.totalWeightPerHour
        case Actions.CHANGED:
            if (action.payload.totalWeightPerHour !== undefined) {
                return action.payload.totalWeightPerHour
            }

            return prev
        default:
            return prev
    }
}

const muscleGroups = (prev = [], action) => {

    let items, muscleGroup

    switch (action.type) {
        case Actions.RESET:
            return []

        case Actions.CHANGED:
            if (action.payload.muscleGroups !== undefined) {
                return action.payload.muscleGroups
            }

            return prev

        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.muscleGroups

        case Actions.REMOVE_WORKOUT:

            if (action.payload.exercise !== undefined) {

                muscleGroup = action.payload.exercise.muscleGroup

                if (muscleGroup) {

                    items = {}

                    prev.forEach(item => {
                        items[item] = true
                    })

                    delete items[muscleGroup]

                    return Object.keys(items)
                }
            }

            return prev

        case Actions.WORKOUT_CHANGED:

            if (action.payload.exercise !== undefined) {

                muscleGroup = action.payload.exercise.muscleGroup

                if (muscleGroup) {

                    items = {
                        [muscleGroup]: true
                    }

                    prev.forEach(item => {
                        items[item] = true
                    })

                    return Object.keys(items)
                }
            }

            return prev

        default:
            return prev
    }
}

const workouts = (prev = {}, action) => {

    let items, id, workoutId

    switch (action.type) {
        case Actions.RESET:
            return {}

        case Actions.CHANGED:
            if (action.payload.workouts !== undefined) {
                return action.payload.workouts
            }

            return prev

        case Actions.FETCH_TRAINING_SUCCESS:
            return action.payload.workouts

        case Actions.REPEAT_CHANGED:

            id = action.payload.id
            workoutId = action.payload.workout

            items = objectValues(prev).map(workout => {

                if (workout.id === workoutId) {
                    if (!workout.repeats) workout.repeats = {}

                    workout.repeats[id] = {
                        ...workout.repeats[id],
                        ...action.payload
                    }
                }

                return workout
            })

            return keyBy(items, 'id')

        case Actions.ADD_REPEAT:

            id = action.payload.id
            workoutId = action.payload.workout

            items = objectValues(prev).map(workout => {

                if (workout.id === workoutId) {
                    if (!workout.repeats) workout.repeats = {}

                    workout.repeats[id] = action.payload
                }

                return workout
            })

            return keyBy(items, 'id')

        case Actions.REMOVE_REPEAT:

            id = action.payload.id

            items = objectValues(prev).map(workout => {

                if (workout.id === workoutId) {
                    if (!workout.repeats) workout.repeats = {}

                    delete workout.repeats[id]
                }

                return workout
            })

            return keyBy(items, 'id')

        case Actions.WORKOUT_CHANGED:

            items = {...prev}

            id = action.payload.id

            items[id] = {
                ...items[id],
                ...action.payload
            }

            return keyBy(items, 'id')

        case Actions.ADD_WORKOUT:

            items = {...prev}

            items[action.payload.id] = action.payload

            return keyBy(items, 'id')

        case Actions.REMOVE_WORKOUT:

            items = {...prev}

            delete items[action.payload.id]

            return keyBy(items, 'id')

        default:
            return prev
    }
}

export default combineReducers({
    id,
    createdAt,
    startedAt,
    completedAt,
    humanWeight,
    workouts,
    duration,
    totalWeight,
    totalWeightPerHour,
    muscleGroups,
});
