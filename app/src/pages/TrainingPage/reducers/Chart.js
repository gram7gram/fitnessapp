import {combineReducers} from 'redux';
import * as Actions from '../../LandingPage/actions'
import {objectValues, sortByDate} from "../../../utils";

const chartData = (prev = [], action) => {
    switch (action.type) {
        case Actions.FETCH_TRAININGS_SUCCESS:

            let flatten = []

            objectValues(action.payload).map(trainingPerMonth => {
                flatten = flatten.concat(objectValues(trainingPerMonth))
            })

            const items = flatten.map(training => ({
                id: training.id,
                startedAt: training.startedAt,
                muscleGroups: training.muscleGroups,
                totalWeightPerHour: training.totalWeightPerHour || 0,
            }))

            sortByDate(items, 'startedAt', 'ASC')

            return items

        default:
            return prev
    }
}

export default combineReducers({
    chartData
});
