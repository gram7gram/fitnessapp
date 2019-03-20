import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../../i18n';
import {Button, Card, Colors, Text, Typography, View} from 'react-native-ui-lib';
import {Column as Col, Row} from "react-native-responsive-grid";
import {AsyncStorage, Linking, StyleSheet} from "react-native";
import FadeInView from "../../../../components/FadeIn";
import Icon from "react-native-vector-icons/FontAwesome";
import {TOGGLE_DONATE_DIALOG} from "../../actions";
import {donationUrl} from "../../../../../../app.json";

class Donate extends PureComponent {

    onOkPress = () => {
        this.props.dispatch({
            type: TOGGLE_DONATE_DIALOG
        })

        AsyncStorage.setItem('Landing.isDonateAlreadyOpened', '1')

        Linking.openURL(donationUrl)
    }

    onCancelPress = () => {
        this.props.dispatch({
            type: TOGGLE_DONATE_DIALOG
        })
    }

    render() {

        const {isVisible} = this.props.Donate
        if (!isVisible) return null;

        return <FadeInView style={styles.container} duration={200}>
            <View style={styles.body}>
                <Row>
                    <Col size={100}>

                        <View style={styles.header} padding-5>
                            <Text text60 dark10 numberOfLines={1}>{i18n.t('donation.title')}</Text>
                            <Text text90 dark30>{i18n.t('donation.content')}</Text>
                        </View>
                        <View style={styles.footer}>

                            <Button
                                style={styles.icon}
                                size="small"
                                round
                                backgroundColor={Colors.dark60}
                                onPress={this.onCancelPress}>
                                <Text>
                                    <Icon
                                        name="times"
                                        color={Colors.dark30}
                                        size={Typography.text40.fontSize}
                                        solid/>
                                </Text>
                            </Button>

                            <Button
                                style={styles.icon}
                                size="small"
                                round
                                backgroundColor={Colors.green40}
                                onPress={this.onOkPress}>
                                <Text>
                                    <Icon
                                        name="dollar"
                                        color={Colors.green10}
                                        size={Typography.text40.fontSize}
                                        solid/>
                                </Text>
                            </Button>
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
    body: {

    },
    header: {
        backgroundColor: Colors.green60,
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

export default connect(selectors)(Donate);
