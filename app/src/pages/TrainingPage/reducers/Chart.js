import {combineReducers} from 'redux';
import * as Actions from '../../LandingPage/actions'
import {objectValues} from "../../../utils";
import moment from "moment";

const chartData = (prev = [], action) => {
    switch (action.type) {
        case Actions.FETCH_TRAININGS_SUCCESS:

            return objectValues(action.payload).map(training => ({
                id: training.id,
                startedAt: training.startedAt,
                muscleGroups: training.muscleGroups,
                totalWeightPerHour: training.totalWeightPerHour || 0,
            })).sort((a, b) => {
                const date1 = moment(a.startedAt)
                const date2 = moment(b.startedAt)

                if (date1.isBefore(date2)) return 1
                if (date2.isBefore(date1)) return -1
                return 0
            })

        default:
            return prev
    }
}

export default combineReducers({
    chartData
});
