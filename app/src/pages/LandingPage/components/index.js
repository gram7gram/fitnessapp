import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Card, Text, View, Colors} from 'react-native-ui-lib';
import Image from "react-native-responsive-image";
import {Row, Column as Col} from "react-native-responsive-grid";
import {ScrollView, StyleSheet} from "react-native";
import FetchTrainings from "../actions/FetchTrainings";
import Logo from "../../../../assets/images/logo.png";
import {Navigation} from "react-native-navigation";
import {objectValues, sortByDate} from "../../../utils";
import {rm} from "../../../storage/fs";
import FadeInView from "../../../components/FadeIn";
import {ADD_DISPLAYED_MONTH} from "../actions";
import {imageMap} from "../../../assets";
import {navigateToTraining} from "../../../router";

type Props = {};

class Landing extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
        this.props.dispatch(FetchTrainings())
    }

    openTraining = training => () => {
        navigateToTraining(this.props.componentId, training)
    }

    addTraining = () => {
        navigateToTraining(this.props.componentId, null)
    }

    getPrevMonth = () => {
        const {months} = this.props.Landing

        const lastMonth = months[months.length - 1]

        return moment(lastMonth, 'YYYY-MM-01').subtract(1, 'month').format('YYYY-MM')
    }

    addMonth = () => {
        this.props.dispatch({
            type: ADD_DISPLAYED_MONTH,
            payload: this.getPrevMonth()
        })
    }

    renderTraining = (item, key) => {

        return <Card
            key={key}
            row
            height={50}
            onPress={this.openTraining(item.id)}
            marginB-10>

            <View padding-10 flex>
                <Text text80 dark10 numberOfLines={1}>
                    {moment(item.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM HH:mm')}
                </Text>

                {item.muscleGroups
                    ? <View left flex>
                        <Text text90 blue20 numberOfLines={1}>
                            {item.muscleGroups.map(name => i18n.t('muscle_groups.' + name)).join('; ')}
                        </Text>
                    </View>
                    : null}
            </View>

            {item.image
                ? <Card.Image
                    width={50}
                    height={50}
                    imageSource={imageMap[item.image]()}/>
                : null}
        </Card>
    }

    render() {

        const {trainings, months} = this.props.Landing

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

        return <View flex padding-10>

            <View centerH>
                <Image
                    source={Logo}
                    initHeight={1280 / 1.5}
                    initWidth={985 / 1.5}
                    style={styles.image}/>
            </View>

            <FadeInView style={styles.container}>

                <ScrollView style={styles.scroll}>

                    <Row>
                        <Col size={100} mdSize={90} lgSize={80} mdOffset={5} lgOffset={10}>

                            <Button marginB-10
                                    label={i18n.t('landing.start_session')}
                                    onPress={this.addTraining}/>

                            {items.map(this.renderTraining)}

                            {items.length > 0 && hasMore
                                ? <Button
                                    marginB-10
                                    onPress={this.addMonth}
                                    label={i18n.t('landing.show_more')}/> : null}

                            <Button link marginB-10
                                    color={Colors.red10}
                                    label={i18n.t('landing.remove_all')}
                                    onPress={() => {
                                        rm('/trainingRegistry.json').catch(() => {
                                        })

                                        items.forEach(item => {
                                            rm('/trainings/' + item.id + ".json").catch(() => {
                                            })
                                        })
                                    }}/>
                        </Col>
                    </Row>

                </ScrollView>


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
    image: {
        position: 'absolute',
        top: 100,
    }
})

export default connect(selectors)(Landing);
