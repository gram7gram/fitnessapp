import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import intersectionBy from 'lodash/intersectionBy';
import selectors from './selectors';
import {StyleSheet} from 'react-native'
import {View, Colors, Typography, Text} from 'react-native-ui-lib'
import {Circle, Path} from 'react-native-svg'
import {Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts'

const axesSvg = {
    ...Typography.text100,
    fill: Colors.dark70
}

const gridSvg = {
    stroke: Colors.dark20
}

const axisWidth = 20

type Props = {}

class Chart extends PureComponent<Props> {

    getY = ({item}) => item.value

    getX = ({item}) => item.date

    getXLabel = (date) => moment(date, 'YYYY-MM-DD HH:mm').format('MM.DD')

    render() {
        const {chartData, muscleGroups} = this.props

        if (muscleGroups.length === 0) return null

        const data = chartData.filter(data =>
            data.muscleGroups !== undefined
            && data.muscleGroups.length > 0
            && intersectionBy(data.muscleGroups, muscleGroups).length > 0
        ).map(item => ({
            date: item.startedAt,
            value: item.totalWeightPerHour,
        }))

        if (data.length < 2) return null

        const Point = ({x, y, data}) => {

            return data.map((item, index) =>

                <Circle
                    key={index}
                    cx={x(item.date)}
                    cy={y(item.value)}
                    r={3}
                    stroke={'red'}
                    fill={'white'}/>
            )
        }

        const Line = ({line}) => (
            <Path
                d={line}
                stroke={'red'}
                fill={'none'}/>
        )

        return <View row marginB-10 style={styles.container}>

            <YAxis
                data={data}
                style={styles.yaxis}
                svg={axesSvg}
                yAccessor={this.getY}/>

            <View flex>

                <LineChart
                    data={data}
                    style={styles.chart}
                    yAccessor={this.getY}
                    xAccessor={this.getX}>

                    <Grid svg={gridSvg}/>

                    <Line/>

                    <Point/>

                </LineChart>

                <XAxis
                    data={data}
                    svg={axesSvg}
                    xAccessor={this.getX}
                    formatLabel={this.getXLabel}
                    style={styles.xaxis}/>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {height: 150},
    chart: {flex: 1},
    yaxis: {marginBottom: axisWidth, width: axisWidth},
    xaxis: {height: axisWidth, alignItems: 'center', flexDirection: 'row'},
})

export default connect(selectors)(Chart)