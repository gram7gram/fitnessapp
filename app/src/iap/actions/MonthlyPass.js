import * as RNIap from 'react-native-iap';
import * as Actions from "../actions";

const tag = 'MonthlyPass'

export const PASS_ID = '01_monthly_pass'

export const purchase = () => dispatch => {

  dispatch({
    type: Actions.PURCHASE_PASS_BEFORE
  })

  RNIap.buyProduct(PASS_ID)
    .then(payload => {

      dispatch({
        type: Actions.PURCHASE_PASS_SUCCESS,
        payload
      })

    })
    .catch(e => {

      console.log(e);

      dispatch({
        type: Actions.PURCHASE_PASS_FAILURE,
        payload: e
      })
    })
}

export const fetch = (componentId) => dispatch => {

  dispatch({
    type: Actions.FETCH_PASS_BEFORE,
    componentId,
  })

  RNIap.getProducts([PASS_ID])
    .then(items => {

      let monthlyPass = null
      if (items.length > 0) {
        monthlyPass = items[0]
      }

      dispatch({
        type: Actions.FETCH_PASS_SUCCESS,
        componentId,
        payload: {
          isGooglePlayAvailable: true,
          isPassEnabled: monthlyPass !== null,
          monthlyPass
        }
      })
    })
    .catch(e => {

      console.log(e);

      dispatch({
        type: Actions.FETCH_PASS_FAILURE,
        componentId,
        payload: e
      })
    })

}

export const disconnect = () => {
  RNIap.endConnection().catch(e => {
    console.log(tag, 'disconnect', e)
  })
}
