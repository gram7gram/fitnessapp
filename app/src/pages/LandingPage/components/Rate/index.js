import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../../i18n';
import {Button, Card, Colors, Text, Typography, View} from 'react-native-ui-lib';
import {Column as Col, Row} from "react-native-responsive-grid";
import {AsyncStorage, StyleSheet, Linking} from "react-native";
import FadeInView from "../../../../components/FadeIn";
import Icon from "react-native-vector-icons/FontAwesome";
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
                            <Text text60 dark10 numberOfLines={1}>{i18n.t('rate.title')}</Text>
                            <Text text90 dark30>{i18n.t('rate.content')}</Text>
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
                                backgroundColor={Colors.yellow40}
                                onPress={this.onOkPress}>
                                <Text>
                                    <Icon
                                        name="star"
                                        color={Colors.yellow10}
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
