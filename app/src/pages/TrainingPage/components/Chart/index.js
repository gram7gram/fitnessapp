import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Dimensions, ScrollView} from 'react-native'
import {Colors, Text, Typography, View} from 'react-native-ui-lib'
import MyChart from "./MyChart";
import FadeInView from "../../../../components/FadeIn";
import {createStructuredSelector} from 'reselect'

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

  render() {
    const {currentChartConfig} = this.props

    if (!currentChartConfig) return null

    const screenWidth = Dimensions.get('window').width - 20

    return <FadeInView duration={300}>
      <ScrollView
        ref={ref => this.scroll = ref}
        horizontal>

        <MyChart
          bezier
          withDots
          data={currentChartConfig}
          width={Math.max(50 * currentChartConfig.labels.length, screenWidth)}
          height={200}
          chartConfig={chartConfig}/>

      </ScrollView>
    </FadeInView>
  }
}

const selectors = createStructuredSelector({
  currentChartConfig: store => store.Training.Chart.currentChartConfig,
})

export default connect(selectors)(Chart)