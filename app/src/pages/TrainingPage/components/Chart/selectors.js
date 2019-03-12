import {createStructuredSelector} from 'reselect'

export default createStructuredSelector({
    training: store => store.Training.model,
    muscleGroups: store => store.Training.model.muscleGroups,
    chartData: store => store.Training.Chart.chartData,
})
