import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Card, Colors, Text, View, Image} from 'react-native-ui-lib';
import ResponsiveImage from "react-native-scalable-image";
import {Column as Col, Row} from "react-native-responsive-grid";
import AsyncStorage from "@react-native-community/async-storage";
import {FlatList, ScrollView, StyleSheet, Dimensions} from "react-native";
import FetchTrainings from "../actions/FetchTrainings";
import Logo from "../../../../assets/images/logo.png";
import {Navigation} from "react-native-navigation";
import {objectValues, sortByDate} from "../../../utils";
import {rm} from "../../../storage/fs";
import FadeInView from "../../../components/FadeIn";
import {ADD_DISPLAYED_MONTH, TOGGLE_RATE_DIALOG} from "../actions";
import {navigateToTraining, navigateToSettings} from "../../../router";
import Rate from "./Rate";

type Props = {};

class Landing extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
        this.props.dispatch(FetchTrainings())

        this.openRate().catch(e => {
            console.log(e);
        })
    }

    openRate = async () => {
        const isRateVisible = this.props.Landing.Rate.isVisible

        let openedCount = parseInt(await AsyncStorage.getItem('Landing.openedCount') || 1)
        if (isNaN(openedCount)) openedCount = 1

        let isRateAlreadyOpened = parseInt(await AsyncStorage.getItem('Landing.isRateAlreadyOpened') || 0)
        if (isNaN(isRateAlreadyOpened)) isRateAlreadyOpened = 0

        isRateAlreadyOpened = isRateAlreadyOpened === 1

        if (openedCount >= 10) {

            await AsyncStorage.removeItem('Landing.openedCount')

            if (!isRateAlreadyOpened && !isRateVisible) {
                this.props.dispatch({
                    type: TOGGLE_RATE_DIALOG
                })

            }

        } else {
            await AsyncStorage.setItem('Landing.openedCount', (openedCount + 1) + '')
        }
    }

    rm = () => {

        const {trainings} = this.props.Landing

        rm('/trainingRegistry.json').catch(() => {
        })

        objectValues(trainings).forEach(item => {
            if (item && item.id)
                rm('/trainings/' + item.id + ".json").catch(() => {
                })
        })

        AsyncStorage.removeItem('hasDemo').catch(() => {})
    }

    openTraining = training => () => {
        navigateToTraining(this.props.componentId, training)
    }

    addTraining = () => {
        navigateToTraining(this.props.componentId, null)
    }

    getPrevMonth = () => {
        const {months} = this.props.Landing

        const lastMonth = months !== undefined ? months[months.length - 1] : null
        if (!lastMonth) return null

        return moment(lastMonth, 'YYYY-MM-01').subtract(1, 'month').format('YYYY-MM')
    }

    addMonth = () => {
        this.props.dispatch({
            type: ADD_DISPLAYED_MONTH,
            payload: this.getPrevMonth()
        })
    }

    openSettings = () => {
        navigateToSettings(this.props.componentId)
    }

    renderTraining = ({item}) => {

        return <Card
            style={styles.card}
            onPress={this.openTraining(item.id)}
            marginB-10>

            <View padding-10 flex>
                <Text paragraph numberOfLines={1}>
                    {moment(item.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM HH:mm')}
                </Text>

                {item.muscleGroups
                    ? <View left flex>
                        <Text helpText textPrimary numberOfLines={1}>
                            {item.muscleGroups.map(name => i18n.t('muscle_groups.' + name)).join('; ')}
                        </Text>
                    </View>
                    : null}
            </View>
        </Card>
    }

    render() {

        const {trainings = {}, months = []} = this.props.Landing

        const prevMonth = this.getPrevMonth()

        const hasMore = trainings[prevMonth] !== undefined

        let displayedItems = {}

        months.forEach(month => {
            if (trainings[month] !== undefined) {
                displayedItems = {
                    ...displayedItems,
                    ...trainings[month]
                }
            }
        })

        const items = objectValues(displayedItems)

        sortByDate(items, 'startedAt', 'DESC')

        return <View flex>

            <ResponsiveImage
                source={Logo}
                width={Dimensions.get('window').width}
                style={styles.image}/>

            <Rate/>

            <FadeInView style={styles.container}>
                <View padding-10>

                    <ScrollView style={styles.scroll}>

                        <Row>
                            <Col size={100} mdSize={90} lgSize={80} mdOffset={5} lgOffset={10}>

                                <View row marginB-10>

                                    <Button
                                        style={{flexGrow: 1}}
                                        label={i18n.t('landing.start_session')}
                                        onPress={this.addTraining}/>

                                    <Button
                                        outline
                                        marginL-5
                                        style={styles.cogsButton}
                                        iconSource={require('../../../../assets/icons/white/32/gear.png')}
                                        iconStyle={{tintColor: Colors.cmuted}}
                                        outlineColor={Colors.cmuted}
                                        onPress={this.openSettings}/>
                                </View>

                                <FlatList
                                    data={items}
                                    renderItem={this.renderTraining}
                                    keyExtractor={item => item.id}/>

                                {items.length > 0 && hasMore
                                    ? <Button
                                        marginB-10
                                        onPress={this.addMonth}
                                        label={i18n.t('landing.show_more')}/> : null}

                                <Button link marginB-10
                                        color={Colors.red10}
                                        label={i18n.t('landing.remove_all')}
                                        onPress={this.rm}/>
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
        justifyContent: 'flex-end',
    },
    scroll: {
        height: '100%'
    },
    card: {
        backgroundColor: Colors.themeheader
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        top: 100,
    },
    cogsButton: {width: 44, height: 44}
})

export default connect(selectors)(Landing);
