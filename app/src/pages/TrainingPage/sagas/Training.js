import {all, delay, put, select, takeEvery, takeLatest, throttle} from 'redux-saga/effects'
import * as Actions from '../../TrainingPage/actions'
import {getMetrics} from "../../../utils/metrics";
import SaveTraining from "../actions/SaveTraining";
import {Navigation} from "react-native-navigation";
import moment from "moment";
import i18n from "../../../i18n";
import {convertToChartConfig, extractChartData} from "../utils/chart";
import {convertWeight} from "../../../Units";

function* debounceUpdateIfDateChanged({payload}) {
  if (payload.startedAt !== undefined || payload.completedAt !== undefined) {
    yield debounceUpdate({payload})
  }
}

function* debounceUpdate(action) {

  yield delay(200)

  yield updateMetrics(action)
}

function* updateMetrics({payload = {}}) {

  const training = yield select(store => store.Training.model)

  const startedAt = payload.startedAt || training.startedAt
  const completedAt = payload.completedAt || training.completedAt

  const metrics = getMetrics(training, startedAt, completedAt, training.humanWeight.unit)

  if (training.totalWeightPerHour !== metrics.totalWeightPerHour
    || training.totalWeight.value !== metrics.totalWeight.value
    || training.totalWeight.unit !== metrics.totalWeight.unit
    || training.duration !== metrics.duration) {

    yield put({
      type: Actions.CHANGED,
      payload: metrics
    })

    if (metrics.totalWeightPerHour > 0) {
      yield put(SaveTraining({
        ...training,
        ...metrics
      }))
    }
  }
}

function* updateNavigation({componentId, payload}) {

  if (componentId && payload.startedAt && payload.muscleGroups) {

    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: moment(payload.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM')
            + ' - ' + payload.muscleGroups.map(group => i18n.t('muscle_groups.' + group)).join(', ')
        }
      }
    })
  }
}

function* updateChartData({payload}) {
  const chartData = yield select(store => store.Training.Chart.chartData)
  const unit = yield select(store => store.Settings.model.unit)

  if (chartData.length > 0 && unit) {

    const data = extractChartData(chartData, payload.muscleGroups)

    data.forEach(chart => {
      chart.totalWeightPerHour = convertWeight({
        value: chart.totalWeightPerHour,
        unit: chart.unit
      }, unit)
      chart.unit = unit
    })

    let config = null;
    if (data !== null && data.length > 0) {
      config = convertToChartConfig(data, payload)
    }

    yield put({
      type: Actions.SET_CURRENT_CHART,
      payload: {
        config,
        data
      }
    })
  }
}


export default function* sagas() {
  yield all([
    takeLatest([
      Actions.CHANGED,
    ], debounceUpdateIfDateChanged),

    takeLatest([
      Actions.REMOVE_REPEAT,
      Actions.REMOVE_WORKOUT,
    ], debounceUpdate),

    takeLatest(Actions.UPDATE_WORKOUT_METRICS_REQUEST, updateMetrics),

    takeLatest(Actions.FETCH_TRAINING_SUCCESS, updateNavigation),

    takeLatest([
      Actions.FETCH_TRAINING_SUCCESS,
      Actions.SAVE_TRAINING_SUCCESS,
    ], updateChartData),
  ])
}
