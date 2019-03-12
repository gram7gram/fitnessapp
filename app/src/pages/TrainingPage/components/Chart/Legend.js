import React, {PureComponent} from "react";
import {Text, View} from "react-native-ui-lib";
import {connect} from "react-redux";
import selectors from "./selectors";
import i18n from "../../../../i18n";
import intersectionBy from "lodash/intersectionBy";
import Icon from 'react-native-vector-icons/FontAwesome5';

class Legend extends PureComponent {

    render() {

        const {chartData, muscleGroups, training} = this.props

        if (muscleGroups.length === 0) return null

        let items = chartData.filter(data =>
            data.muscleGroups !== undefined
            && data.muscleGroups.length > 0
            && intersectionBy(data.muscleGroups, muscleGroups).length > 0
        )

        if (items.length < 2) return null

        let currentChartData = null
        let prevChartData = null
        let diff = 0

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

        return <View row>
            <View flex left>
                <Text text70 dark40 numberOfLines={1}>{i18n.t('training.chart_title')}</Text>
                <Text text100 dark50 numberOfLines={1}>{i18n.t('training.chart_legend')}</Text>
            </View>
            <View flex right>
                <Text text70
                      blue40
                      numberOfLines={1}>
                    {currentChartData ? currentChartData.totalWeightPerHour.toFixed(2) : ''}
                </Text>

                {diff > 0
                    ? <Text text90 green10 numberOfLines={1}>
                        <Icon name="caret-up"/>&nbsp;{diff.toFixed(2)}%
                    </Text>
                    : null}

                {prevChartData && diff === 0
                    ? <Text text90 yellow10 numberOfLines={1}>
                        {diff.toFixed(2)}%
                    </Text>
                    : null}

                {diff < 0
                    ? <Text text90 red10 numberOfLines={1}>
                        <Icon name="caret-down"/>&nbsp;{diff.toFixed(2)}%
                    </Text>
                    : null}
            </View>
        </View>
    }
}

export default connect(selectors)(Legend)