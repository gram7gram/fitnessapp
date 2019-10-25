import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Text, View} from 'react-native-ui-lib';
import {Column as Col, Row} from "react-native-responsive-grid";
import {ScrollView, StyleSheet} from "react-native";
import {Navigation} from "react-native-navigation";
import FadeInView from "../../../components/FadeIn";
import * as IAPActions from "../../../iap/actions";

class MonthlyPass extends Component {

  constructor(props) {
    super(props)

    Navigation.events().bindComponent(this);
  }

  componentDidAppear() {

  }

  purchase = () => {
    this.props.dispatch({
      type: IAPActions.PURCHASE_PASS_REQUEST
    })
  }

  render() {

    const {} = this.props

    return <View flex>

      <FadeInView style={styles.container}>
        <View padding-10>

          <ScrollView style={styles.scroll}>

            <Row>
              <Col size={100} mdSize={90} lgSize={80} mdOffset={5} lgOffset={10}>

                <View marginB-10>

                  <Text paragraph>{i18n.t('monthly_pass.purchase_title')}</Text>
                </View>

                <View marginB-10>

                  <Button
                    cprimary
                    label={i18n.t('monthly_pass.purchase_action')}
                    onPress={this.purchase}/>

                </View>

              </Col>
            </Row>

          </ScrollView>
        </View>


      </FadeInView>
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    height: '100%'
  },

})

export default connect(selectors)(MonthlyPass);
