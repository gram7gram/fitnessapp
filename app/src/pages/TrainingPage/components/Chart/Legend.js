import React, {Component} from "react";
import {Text, View} from "react-native-ui-lib";
import {connect} from "react-redux";
import selectors from "./selectors";
import i18n from "../../../../i18n";
import intersectionBy from "lodash/intersectionBy";
import {Column as Col, Row} from "react-native-responsive-grid";

class Legend extends Component {

    render() {

        const {chartData, muscleGroups, training} = this.props

        let currentChartData = null
        let prevChartData = null
        let diff = 0

        let items = chartData.filter(data =>
            data.muscleGroups !== undefined
            && data.muscleGroups.length > 0
            && intersectionBy(data.muscleGroups, muscleGroups).length > 0
        )

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
        }

        const speed = (training && training.totalWeightPerHour > 0 ? training.totalWeightPerHour : 0).toFixed(2)
        const duration = (training && training.duration > 0 ? training.duration : 0).toFixed(1)
        const displayDiff = Math.abs(diff).toFixed(2)

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
                            {duration}{i18n.t('training.legend_duration_suffix')}
                        </Text>

                        <Text
                            textSmallSecondary
                            numberOfLines={1}
                            center>{i18n.t('training.legend_duration')}</Text>
                    </Col>

                    <Col size={33}>

                        {diff > 0
                            ? <Text header4Success center numberOfLines={1}>{speed}</Text>
                            : null}

                        {diff === 0
                            ? <Text header4Warning center numberOfLines={1}>{speed}</Text>
                            : null}

                        {diff < 0
                            ? <Text header4Danger center numberOfLines={1}>{speed}</Text>
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