import React, {PureComponent} from "react";
import {Text, View} from "react-native-ui-lib";
import {connect} from "react-redux";
import selectors from "./selectors";
import i18n from "../../../../i18n";
import intersectionBy from "lodash/intersectionBy";
import {Column as Col, Row} from "react-native-responsive-grid";

class Legend extends PureComponent {

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

        return <Row>

            <Col size={100} lgSize={60} lgOffset={20}>
                <Row>

                    <Col size={100}>

                        <Text
                            text70
                            dark70
                            numberOfLines={1}
                            marginB-10
                            center>{i18n.t('training.chart_title')}</Text>
                    </Col>

                    <Col size={33}>

                        <Text
                            text70
                            blue40
                            numberOfLines={1}
                            center>
                            {(training && training.duration > 0 ? training.duration : 0).toFixed(1)}
                            <Text dark30>h</Text>
                        </Text>

                        <Text
                            text100
                            dark40
                            numberOfLines={1}
                            center>{i18n.t('training.legend_duration')}</Text>
                    </Col>

                    <Col size={33}>

                        <Text
                            text70
                            blue40
                            numberOfLines={1}
                            center>
                            {(training && training.totalWeightPerHour > 0 ? training.totalWeightPerHour : 0).toFixed(2)}
                        </Text>

                        <Text
                            text100
                            dark40
                            numberOfLines={1}
                            center>{i18n.t('training.legend_weight')}</Text>

                    </Col>

                    <Col size={33}>

                        {diff > 0
                            ? <Text
                                center
                                text70
                                green10
                                numberOfLines={1}>
                                +{Math.abs(diff).toFixed(2)}%
                            </Text>
                            : null}

                        {diff === 0
                            ? <Text
                                center
                                text70
                                yellow10
                                numberOfLines={1}>
                                {i18n.t('training.na')}
                            </Text>
                            : null}

                        {diff < 0
                            ? <Text
                                center
                                text70
                                red10
                                numberOfLines={1}>
                                -{Math.abs(diff).toFixed(2)}%
                            </Text>
                            : null}

                        <Text
                            text100
                            dark40
                            numberOfLines={1}
                            center>{i18n.t('training.legend_progress')}</Text>
                    </Col>
                </Row>
            </Col>
        </Row>
    }
}

export default connect(selectors)(Legend)