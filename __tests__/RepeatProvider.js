import uuid from "uuid";
import random from "random";

export default (unit, isHumanWeight) => {

  return {
    id: uuid(),
    isHumanWeight,
    weight: {
      value: random.float(0.5, 60),
      unit
    },
    repeatCount: random.int(1, 20),
  }
}