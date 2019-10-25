import {createStructuredSelector} from 'reselect'

export default createStructuredSelector({
  IAP: store => store.IAP,
  MonthlyPass: store => store.MonthlyPass,
})
