import {createStructuredSelector} from 'reselect'

export default createStructuredSelector({
    Workout: store => store.Workout,
    Training: store => store.Training,
})
