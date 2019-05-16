import {createStructuredSelector} from 'reselect'

export default createStructuredSelector({
  Rate: store => store.Landing.Rate,
})
