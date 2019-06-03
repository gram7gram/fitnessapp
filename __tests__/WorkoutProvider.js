import uuid from "uuid";
import keyBy from "lodash/keyBy";
import createRepeat from "./RepeatProvider";

export default (unit, exercise) => {

  return {
    id: uuid(),
    exercise,
    repeats: keyBy([
      createRepeat(unit, exercise.isHumanWeight),
      createRepeat(unit, exercise.isHumanWeight),
      createRepeat(unit, exercise.isHumanWeight),
      createRepeat(unit, exercise.isHumanWeight),
    ], 'id')
  }
}