import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import intersectionBy from 'lodash/intersectionBy';
import selectors from './selectors';
import {Dimensions, ScrollView} from 'react-native'
import {Colors, Text, Typography, View} from 'react-native-ui-lib'
import MyChart from "./MyChart";

const chartConfig = {
    backgroundGradientFrom: Colors.rgba(Colors.dark10, 1),
    backgroundGradientTo: Colors.rgba(Colors.dark10, 1),
    color: (opacity = 1) => Colors.rgba(Colors.blue10, opacity),
    selectedColor: (opacity = 1) => Colors.rgba(Colors.red10, opacity),
    decimalPlaces: 2,
    strokeWidth: 1,
}

type Props = {}

class Chart extends PureComponent<Props> {

    componentDidMount() {
        setTimeout(() => {
            if (this.scroll)
                this.scroll.scrollToEnd({animated: true})
        }, 500)
    }

    render() {
        const {chartData, muscleGroups, training} = this.props

        if (muscleGroups.length === 0) return null

        let items = chartData.filter(data =>
            data.muscleGroups !== undefined
            && data.muscleGroups.length > 0
            && intersectionBy(data.muscleGroups, muscleGroups).length > 0
        ).reverse().slice(0, 100).reverse() //last 100 records

        if (items.length < 2) return null

        const data = {
            labels: items.map(item => moment(item.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM')),
            datasets: [{
                data: items.map(item => item.totalWeightPerHour),
                originalData: items,
                currentTraining: training.id
            }]
        }

        const screenWidth = Dimensions.get('window').width - 20

        return <ScrollView
            ref={ref => this.scroll = ref}
            horizontal>

            <MyChart
                bezier
                withDots
                data={data}
                width={Math.max(50 * items.length, screenWidth)}
                height={200}
                chartConfig={chartConfig}/>

        </ScrollView>
    }
}

export default connect(selectors)(Chart)