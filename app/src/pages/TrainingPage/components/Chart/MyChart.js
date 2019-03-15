import React from 'react'
import {View} from 'react-native'
import {Circle, G, Rect, Svg} from 'react-native-svg'
import LineChart from 'react-native-chart-kit/src/line-chart'

class MyChart extends LineChart {

    renderDots = config => {

        const {
            data,
            width,
            height,
            paddingTop,
            paddingRight,
            onDataPointClick
        } = config

        const output = []
        const datas = this.getDatas(data)
        data.forEach((dataset) => {
            dataset.originalData.forEach((training, i) => {

                const x = training.totalWeightPerHour
                const isCurrent = training.id === dataset.currentTraining

                const cx =
                    paddingRight + (i * (width - paddingRight)) / dataset.data.length
                const cy =
                    (height / 4) *
                    3 *
                    (1 - (x - Math.min(...datas)) / this.calcScaler(datas)) +
                    paddingTop
                const onPress = () => {
                    if (!onDataPointClick) {
                        return
                    }

                    onDataPointClick({
                        value: x,
                        dataset,
                        getColor: opacity => this.getColor(dataset, opacity)
                    })
                }

                output.push(
                    <View key={Math.random()}>
                        <Circle
                            cx={cx}
                            cy={cy}
                            r="4"
                            fill={isCurrent
                                ? this.props.chartConfig.selectedColor(0.9)
                                : this.getColor(dataset, 0.9)}
                            onPress={onPress}
                        />
                        <Circle
                            cx={cx}
                            cy={cy}
                            r="12"
                            fill={isCurrent
                                ? this.props.chartConfig.selectedColor(0.1)
                                : this.getColor(dataset, 0)}
                            onPress={onPress}
                        />
                    </View>
                )
            })
        })
        return output
    }

    render() {
        const paddingTop = 16
        const paddingRight = 45
        const {
            width,
            height,
            data,
            withShadow = true,
            withDots = true,
            withInnerLines = true,
            withOuterLines = true,
            style = {},
            decorator,
            onDataPointClick
        } = this.props
        const {labels = []} = data
        const {borderRadius = 0} = style
        const config = {
            width,
            height
        }
        const datas = this.getDatas(data.datasets)
        return (
            <View style={style}>
                <Svg height={height} width={width}>
                    <G>
                        {this.renderDefs({
                            ...config,
                            ...this.props.chartConfig
                        })}
                        <Rect
                            width="100%"
                            height={height}
                            rx={borderRadius}
                            ry={borderRadius}
                            fill="url(#backgroundGradient)"
                        />
                        <G>
                            {withInnerLines
                                ? this.renderHorizontalLines({
                                    ...config,
                                    count: 4,
                                    paddingTop,
                                    paddingRight
                                })
                                : withOuterLines
                                    ? this.renderHorizontalLine({
                                        ...config,
                                        paddingTop,
                                        paddingRight
                                    })
                                    : null
                            }
                        </G>
                        <G>
                            {this.renderHorizontalLabels({
                                ...config,
                                count: Math.min(...datas) === Math.max(...datas) ? 1 : 4,
                                data: datas,
                                paddingTop,
                                paddingRight
                            })}
                        </G>
                        <G>
                            {withInnerLines
                                ? this.renderVerticalLines({
                                    ...config,
                                    data: data.datasets[0].data,
                                    paddingTop,
                                    paddingRight
                                })
                                : withOuterLines
                                    ? this.renderVerticalLine({
                                        ...config,
                                        paddingTop,
                                        paddingRight
                                    })
                                    : null
                            }
                        </G>
                        <G>
                            {this.renderVerticalLabels({
                                ...config,
                                labels,
                                paddingRight,
                                paddingTop
                            })}
                        </G>
                        <G>
                            {this.renderLine({
                                ...config,
                                paddingRight,
                                paddingTop,
                                data: data.datasets
                            })}
                        </G>
                        <G>
                            {withShadow &&
                            this.renderShadow({
                                ...config,
                                data: data.datasets,
                                paddingRight,
                                paddingTop
                            })}
                        </G>
                        <G>
                            {withDots &&
                            this.renderDots({
                                ...config,
                                data: data.datasets,
                                paddingTop,
                                paddingRight,
                                onDataPointClick
                            })}
                        </G>
                        <G>
                            {decorator &&
                            decorator({
                                ...config,
                                data: data.datasets,
                                paddingTop,
                                paddingRight
                            })}
                        </G>
                    </G>
                </Svg>
            </View>
        )
    }

}

export default MyChart
