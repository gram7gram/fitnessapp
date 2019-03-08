import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Text, View} from 'react-native-ui-lib';
import {Image, StyleSheet} from "react-native";
import FetchTrainings from "../actions/FetchTrainings";
import * as Pages from "../../../router/Pages";
import Logo from "../../../../assets/images/landing-logo-inverted.png";
import {Navigation} from "react-native-navigation";
import Icon from 'react-native-vector-icons/FontAwesome5';

type Props = {};

class Landing extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
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

    getPreviousTraining = () => {
        const {trainings, currentTraining} = this.props.Landing

        const keys = Object.keys(trainings)

        const index = keys.indexOf(currentTraining)

        let next
        if (index !== -1) {
            next = keys[index - 1]
        }

        return next || null
    }

    getNextTraining = () => {
        const {trainings, currentTraining} = this.props.Landing

        const keys = Object.keys(trainings)

        const index = keys.indexOf(currentTraining)

        let next
        if (index !== -1) {
            next = keys[index + 1]
        }

        return next || null
    }

    render() {

        const {currentTraining} = this.props.Landing

        const nextId = this.getNextTraining()
        const prevId = this.getPreviousTraining()

        return <View flex padding-10>

            <View centerH>
                <Image source={Logo}
                       resizeMethod="scale"
                       style={styles.image}/>
            </View>

            <View style={styles.container}>

                <Button marginB-10
                        onPress={this.addTraining}>
                    <Text>{i18n.t('landing.start_session')}</Text>
                </Button>

                <Button marginB-10
                        onPress={this.openTraining(currentTraining)}
                        disabled={!currentTraining}>
                    <Text>{i18n.t('landing.show_session')}</Text>
                </Button>

                <View row>

                    <View flex-1 marginR-5>

                        <Button marginB-10
                                onPress={this.openTraining(prevId)}
                                disabled={!prevId}>
                            <Text>
                                <Icon name="arrow-left"/>
                                &nbsp;
                                {i18n.t('landing.prev_session')}
                            </Text>
                        </Button>
                    </View>

                    <View flex-1 marginL-5>

                        <Button marginB-10
                                onPress={this.openTraining(nextId)}
                                disabled={!nextId}>
                            <Text>
                                {i18n.t('landing.next_session')}
                                &nbsp;
                                <Icon name="arrow-right"/>
                            </Text>
                        </Button>
                    </View>
                </View>
            </View>

        </View>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    image: {
        position: 'absolute',
        width: 775 / 3.5,
        height: 1000 / 3.5
    }
})

export default connect(selectors)(Landing);
