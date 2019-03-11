import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Text, View, Card} from 'react-native-ui-lib';
import {Image, ScrollView, StyleSheet} from "react-native";
import FetchTrainings from "../actions/FetchTrainings";
import * as Pages from "../../../router/Pages";
import Logo from "../../../../assets/images/landing-logo-inverted.png";
import {Navigation} from "react-native-navigation";
import {objectValues} from "../../../utils";
import {rm} from "../../../storage/fs";

type Props = {};

class Landing extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                drawBehind: true,
                visible: false,
                title: {
                    text: i18n.t('landing.title')
                }
            }
        })

        this.props.dispatch(FetchTrainings())
    }

    openTraining = training => () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: Pages.TRAINING,
                passProps: {
                    training
                }
            }
        })
    }

    addTraining = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: Pages.TRAINING,
                passProps: {
                    training: null
                }
            }
        })
    }

    renderTraining = (item, key) => {

        return <Card
            key={key}
            marginB-10
            onPress={this.openTraining(item.id)}>

            <View padding-10>

                <Text text70 dark10 marginB-10>
                    {item.startedAt}
                </Text>

                <Text text80 dark50 marginB-10>
                    {item.totalWeightPerHour}
                </Text>
                {item.muscleGroups
                    ? <Text text80 grey50 numberOfLines={1}>{item.muscleGroups.join('; ')}</Text>
                    : null}

            </View>
        </Card>
    }

    render() {

        const {trainings} = this.props.Landing

        const items = objectValues(trainings).sort((a, b) => {
            const date1 = moment(a.startedAt)
            const date2 = moment(b.startedAt)

            if (date1.isBefore(date2)) return 1
            if (date2.isBefore(date1)) return -1
            return 0
        })

        return <View flex padding-10>

            <View centerH>
                <Image source={Logo}
                       resizeMethod="scale"
                       style={styles.image}/>
            </View>

            <View style={styles.container}>
                <ScrollView style={styles.scroll}>

                    <Button marginB-10
                            onPress={this.addTraining}>
                        <Text>{i18n.t('landing.start_session')}</Text>
                    </Button>

                    <View marginB-10>
                        {items.map(this.renderTraining)}
                    </View>

                    <Button marginB-10>
                        <Text>Show more</Text>
                    </Button>

                    <Button link marginB-10
                            onPress={() => {
                                rm('/trainingRegistry.json').catch(() => {
                                })

                                items.forEach(item => {
                                    rm('/trainings/' + item.id + ".json").catch(() => {
                                    })
                                })
                            }}>
                        <Text red10>remove all</Text>
                    </Button>

                </ScrollView>

            </View>
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
        width: 775 / 3.5,
        height: 1000 / 3.5
    }
})

export default connect(selectors)(Landing);
