import {createStructuredSelector} from 'reselect'

export default createStructuredSelector({
    muscleGroups: store => store.Training.model.muscleGroups,
    chartData: store => store.Training.Chart.chartData,
})
