import * as RNIap from 'react-native-iap';

const tag = 'MonthlyPass'

export const PASS_ID = '01_monthly_pass'

export const purchase = async () => {

  try {
    return await RNIap.buyProduct(PASS_ID);
  } catch (e) {
    console.log(tag, 'purchase', e)
  }

  return null
}

export const fetch = async () => {

  try {
    const items = await RNIap.getProducts([PASS_ID]);
    if (items.length > 0) {
      return items[0]
    }
  } catch (e) {
    console.log(tag, 'fetch', e)
  }

  return null
}

export const disconnect = () => {
  RNIap.endConnection().catch(e => {
    console.log(tag, 'disconnect', e)
  })
}
