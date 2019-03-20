import React, {PureComponent} from 'react';
import {Animated} from 'react-native';

type Props = {
    duration: ?number
}

class FadeInView extends PureComponent<Props> {

    state = {
        opacity: new Animated.Value(0),
    }

    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: this.props.duration,
            useNativeDriver: true
        }).start();
    }

    render() {
        const {opacity} = this.state;

        return <Animated.View
            style={{
                ...this.props.style,
                opacity: opacity,
            }}>
            {this.props.children}
        </Animated.View>
    }
}

FadeInView.defaultProps = {
    duration: 1500
}

export default FadeInView