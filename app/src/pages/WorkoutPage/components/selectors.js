import {createStructuredSelector} from 'reselect'

export default createStructuredSelector({
  Workout: store => store.Workout,
  Training: store => store.Training,
  settings: store => store.Settings.model,
})
