import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../../i18n';
import {Button, Card, Colors, Text, Typography, View} from 'react-native-ui-lib';
import {Column as Col, Row} from "react-native-responsive-grid";
import AsyncStorage from "@react-native-community/async-storage";
import {StyleSheet, Linking} from "react-native";
import FadeInView from "../../../../components/FadeIn";
import {TOGGLE_RATE_DIALOG} from "../../actions";
import {androidMarketId} from "../../../../../../app.json";

class Rate extends PureComponent {

  onOkPress = () => {
    this.props.dispatch({
      type: TOGGLE_RATE_DIALOG
    })

    AsyncStorage.setItem('Landing.isRateAlreadyOpened', '1')

    Linking.openURL(`market://details?id=${androidMarketId}`)
  }

  onCancelPress = () => {
    this.props.dispatch({
      type: TOGGLE_RATE_DIALOG
    })
  }

  render() {

    const {isVisible} = this.props.Rate
    if (!isVisible) return null;

    return <FadeInView style={styles.container} duration={200}>
      <View style={styles.body}>
        <Row>
          <Col size={100}>

            <View style={styles.header} padding-5>
              <Text header3 dark10 numberOfLines={1}>{i18n.t('rate.title')}</Text>
              <Text paragraph dark30>{i18n.t('rate.content')}</Text>
            </View>

            <View style={styles.footer}>

              <Button
                style={styles.icon}
                iconSource={require('../../../../../assets/icons/white/32/times.png')}
                iconStyle={{tintColor: Colors.dark30}}
                bg-dark60
                onPress={this.onCancelPress}/>

              <Button
                style={styles.icon}
                iconSource={require('../../../../../assets/icons/white/32/star.png')}
                iconStyle={{tintColor: Colors.yellow10}}
                bg-yellow40
                onPress={this.onOkPress}/>

            </View>
          </Col>
        </Row>
      </View>

    </FadeInView>
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  body: {},
  header: {
    backgroundColor: Colors.yellow60,
    paddingBottom: 25
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingLeft: 5,
    paddingRight: 5,
    top: -22
  },
  icon: {
    width: 44,
    height: 44,
    marginLeft: 5
  }
})

export default connect(selectors)(Rate);
