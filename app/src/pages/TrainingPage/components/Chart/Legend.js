import React, {Component} from "react";
import {Text, View} from "react-native-ui-lib";
import {connect} from "react-redux";
import selectors from "./selectors";
import i18n from "../../../../i18n";
import intersectionBy from "lodash/intersectionBy";
import {Column as Col, Row} from "react-native-responsive-grid";
import {convertWeight} from "../../../../Units";

class Legend extends Component {


    extractChartData = (chartData, muscleGroups) => {

        const itemsWithGroups = chartData.filter(data =>
            data.muscleGroups !== undefined && data.muscleGroups.length > 0
        )

        if (itemsWithGroups.length === 0) return null

        //Find exact match of muscle groups for trainings
        let items = itemsWithGroups.filter(data =>
            intersectionBy(data.muscleGroups, muscleGroups).length === muscleGroups.length
        )

        if (items.length < 2) {

            //Find partial match of muscle groups for trainings
            items = itemsWithGroups.filter(data =>
                intersectionBy(data.muscleGroups, muscleGroups).length > 0
            )

            if (items.length < 2) return null
        }

        return items.reverse().slice(0, 100).reverse() //last 100 records
    }

    getConvertedToSingleUnitWeightPerHour = chart => {
        const {unit} = this.props.settings

        return convertWeight({value: chart.totalWeightPerHour, unit: chart.unit}, unit)
    }

    render() {
        const {chartData, muscleGroups, training} = this.props

        const items = this.extractChartData(chartData, muscleGroups)

        const duration = training && training.duration > 0 ? training.duration : 0
        let currentChartData = null
        let prevChartData = null
        let diff = 0, displaySpeed = 0

        for (let i = 0; i < items.length; i++) {
            const data = items[i]

            if (data.id === training.id) {

                currentChartData = data
                prevChartData = items[i - 1] || null

                break;
            }
        }

        if (currentChartData && prevChartData) {

            const before = prevChartData.totalWeightPerHour
            const current = currentChartData.totalWeightPerHour

            diff = before > 0 ? 100 * (current - before) / before : 100

            displaySpeed = this.getConvertedToSingleUnitWeightPerHour(currentChartData)
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

export default connect(selectors)(Legend)