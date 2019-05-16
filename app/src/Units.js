export const KILOGRAM = 'kg'
export const POUNDS = 'lb'

const SCALE = 2.205

export const convertWeight = (weight, unit) => {

  if (weight.unit === POUNDS) {

    if (unit === POUNDS) {

      return weight.value

    } else if (unit === KILOGRAM) {

      return poundsToKilogram(weight.value)

    }

  } else if (weight.unit === KILOGRAM) {

    if (unit === POUNDS) {

      return kilogramToPounds(weight.value)

    } else if (unit === KILOGRAM) {

      return weight.value
    }
  }

  console.log(weight, unit);

  throw new Error('Unable to convert weight')
}

export const poundsToKilogram = value => value / SCALE

export const kilogramToPounds = value => value * SCALE