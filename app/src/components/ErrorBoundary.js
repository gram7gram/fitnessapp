import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native'
import {Text, View, Colors} from 'react-native-ui-lib'
import i18n from '../i18n'

class ErrorBoundary extends PureComponent {

  state = {hasError: false};

  componentDidCatch() {
    this.setState({hasError: true});
  }

  render() {
    if (this.state.hasError) {
      return <View style={styles.container}>
        <Text paragraph center>{i18n.t('validation.component_error')}</Text>
      </View>
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.red30,
    padding: 20
  }
})

export default ErrorBoundary