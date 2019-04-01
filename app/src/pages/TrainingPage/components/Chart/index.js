import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import intersectionBy from 'lodash/intersectionBy';
import selectors from './selectors';
import {Dimensions, ScrollView} from 'react-native'
import {Colors, Text, Typography, View} from 'react-native-ui-lib'
import MyChart from "./MyChart";
import FadeInView from "../../../../components/FadeIn";

const chartConfig = {
    backgroundGradientFrom: Colors.rgba(Colors.themebackground, 1),
    backgroundGradientTo: Colors.rgba(Colors.themebackground, 1),
    color: (opacity = 1) => Colors.rgba(Colors.cprimary, opacity),
    selectedColor: (opacity = 1) => Colors.rgba(Colors.cdanger, opacity),
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

    render() {
        const {chartData, muscleGroups, training} = this.props

        if (muscleGroups.length === 0) return null

        const items = this.extractChartData(chartData, muscleGroups)

        if (!items) return null

        const data = {
            labels: items.map(item => moment(item.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM')),
            datasets: [{
                data: items.map(item => item.totalWeightPerHour),
                originalData: items,
                currentTraining: training.id
            }]
        }

        const screenWidth = Dimensions.get('window').width - 20

        return <FadeInView duration={300}>
            <ScrollView
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
        </FadeInView>
    }
}

export default connect(selectors)(Chart)