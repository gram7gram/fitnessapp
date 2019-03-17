import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../../i18n';
import {Button, Card, Colors, Text, View} from 'react-native-ui-lib';
import {Column as Col, Row} from "react-native-responsive-grid";
import {StyleSheet} from "react-native";
import FadeInView from "../../../../components/FadeIn";
import {dismissDonateOverlay} from "../../../../router";

type Props = {
    componentId: string
};

class Donate extends PureComponent<Props> {

    // constructor(props) {
    //     super(props)
    //
    //     Navigation.events().bindComponent(this);
    // }
    //
    // componentDidAppear() {
    //
    // }

    onDonatePress = () => {
        dismissDonateOverlay(this.props.componentId)
    }

    render() {

        return <FadeInView style={styles.container}>

            <Row>
                <Col size={100}>

                    <Button marginB-10
                            label={i18n.t('donate.action')}
                            onPress={this.onDonatePress}/>
                </Col>
            </Row>

        </FadeInView>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    scroll: {
        height: '100%'
    },
    image: {
        position: 'absolute',
        top: 100,
    }
})

export default connect(selectors)(Donate);
