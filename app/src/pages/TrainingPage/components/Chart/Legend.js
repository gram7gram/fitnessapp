import React, {PureComponent} from "react";
import {Text, View} from "react-native-ui-lib";
import {connect} from "react-redux";
import i18n from "../../../../i18n";
import {Column as Col, Row} from "react-native-responsive-grid";
import {createStructuredSelector} from "reselect";

class Legend extends PureComponent {

  render() {
    const {currentChartData, training} = this.props

    if (!currentChartData) return null

    const duration = training && training.duration > 0 ? training.duration : 0
    let currentTrainingData = null
    let prevChartData = null
    let diff = 0, displaySpeed = 0

    for (let i = 0; i < currentChartData.length; i++) {
      const data = currentChartData[i]

      if (data.id === training.id) {

        currentTrainingData = data
        prevChartData = currentChartData[i - 1] || null

        break;
      }
    }

    if (currentTrainingData && prevChartData) {

      const before = prevChartData.totalWeightPerHour
      const current = currentTrainingData.totalWeightPerHour

      diff = before > 0 ? 100 * (current - before) / before : 100

      displaySpeed = current
    }

    let displayDuration = duration > 100 ? '+100' : duration.toFixed(1)

    let displayDiff = Math.abs(diff)
    displayDiff = displayDiff.toFixed(2)

    displaySpeed = displaySpeed > 1000 ? '+1000' : displaySpeed.toFixed(2)

    return <Row>

      <Col size={100} lgSize={60} lgOffset={20}>
        <Row>

          <Col size={100}>

            <Text
              paragraph
              numberOfLines={1}
              marginB-10
              center>{i18n.t('training.chart_title')}</Text>
          </Col>

          <Col size={33}>

            <Text header4Primary numberOfLines={1} center>
              {displayDuration}{i18n.t('training.legend_duration_suffix')}
            </Text>

            <Text
              textSmallSecondary
              numberOfLines={1}
              center>{i18n.t('training.legend_duration')}</Text>
          </Col>

          <Col size={33}>

            {diff > 0
              ? <Text header4Success center numberOfLines={1}>{displaySpeed}</Text>
              : null}

            {diff === 0
              ? <Text header4Warning center numberOfLines={1}>{displaySpeed}</Text>
              : null}

            {diff < 0
              ? <Text header4Danger center numberOfLines={1}>{displaySpeed}</Text>
              : null}

            <Text
              textSmallSecondary
              numberOfLines={1}
              center>{i18n.t('training.legend_weight')}</Text>

          </Col>

          <Col size={33}>

            {diff > 0
              ? <Text header4Success center numberOfLines={1}>+{displayDiff}%</Text>
              : null}

            {diff === 0
              ? <Text header4Warning center numberOfLines={1}>{i18n.t('training.na')}</Text>
              : null}

            {diff < 0
              ? <Text header4Danger center numberOfLines={1}>-{displayDiff}%</Text>
              : null}

            <Text
              textSmallSecondary
              numberOfLines={1}
              center>{i18n.t('training.legend_progress')}</Text>
          </Col>
        </Row>
      </Col>
    </Row>
  }
}

const selectors = createStructuredSelector({
  training: store => store.Training.model,
  currentChartData: store => store.Training.Chart.currentChartData,
})

export default connect(selectors)(Legend)