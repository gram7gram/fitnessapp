import React, {Component} from 'react';
import {Text, View} from 'react-native-ui-lib'

class ErrorBoundary extends Component {

    state = {hasError: false};

    componentDidCatch() {
        this.setState({hasError: true});
    }

    render() {
        if (this.state.hasError) {
            return <View marginB-10>
                <Text red10 center>[Unable to display component]</Text>
            </View>
        }

        return this.props.children;
    }
}

export default ErrorBoundary