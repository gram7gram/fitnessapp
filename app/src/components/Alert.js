import React, {Component} from 'react';

import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {Colors, Typography, Button, View, Text, Dialog} from 'react-native-ui-lib';
import i18n from "../i18n";
import {Column as Col, Row} from "react-native-responsive-grid";

class Alert extends Component<Props> {

  render() {

    const {title, body, onDismiss, onConfirm} = this.props

    return <Dialog
      visible={true}
      onDismiss={onDismiss}
      onBackgroundPress={onDismiss}
      containerStyle={styles.container}>

      <View>

        <View style={styles.header}>
          <Text header4Danger center>{title}</Text>
        </View>

        <View style={styles.body}>
          <Text paragraph center>{body}</Text>
        </View>

        <View style={styles.footer}>

          <Row>
            <Col size={50}>
              <Button
                marginR-5
                bg-dark30
                label={i18n.t('placeholders.cancel')}
                onPress={onDismiss}/>
            </Col>

            <Col size={50}>
              <Button
                marginL-5
                bg-red10
                label={i18n.t('placeholders.ok')}
                onPress={onConfirm}/>

            </Col>
          </Row>

        </View>
      </View>
    </Dialog>
  }

}

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cprimary
  },
  header: {
    padding: 5
  },
  body: {
    padding: 5
  },
  footer: {
    padding: 5
  },
})

export default Alert