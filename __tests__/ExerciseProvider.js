import uuid from "uuid";
import random from "random";
import {fromArray} from "./random";

export default () => {

  return {
    id: uuid(),
    isHumanWeight: random.boolean(),
    scale: random.float(0.75, 1),
    muscleGroup: fromArray(['legs', 'abs', 'chest', 'back', 'biceps', 'triceps']),
    translations: {
      ru: {
        locale: 'ru',
        name: uuid(),
      },
      en: {
        locale: 'en',
        name: uuid(),
      }
    }
  }
}