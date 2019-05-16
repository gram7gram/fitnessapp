import {createStructuredSelector} from 'reselect'

export default createStructuredSelector({
  Training: store => store.Training,
  settings: store => store.Settings.model,
})
