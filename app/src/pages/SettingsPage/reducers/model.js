import {combineReducers} from 'redux';
import * as Actions from "../actions";
import * as Units from "../../../Units";

const unit = (prev = Units.KILOGRAM, action) => {
  switch (action.type) {
    case Actions.RESET:
      return Units.KILOGRAM
    case Actions.CHANGED:

      if (action.payload.unit !== undefined) {
        return action.payload.unit
      }

      return prev
    default:
      return prev
  }
}

const defaultRepeatCount = (prev = 15, action) => {
  switch (action.type) {
    case Actions.RESET:
      return 15
    case Actions.CHANGED:

      if (action.payload.defaultRepeatCount !== undefined) {
        return action.payload.defaultRepeatCount
      }

      return prev
    default:
      return prev
  }
}

export default combineReducers({
  unit,
  defaultRepeatCount,
});
