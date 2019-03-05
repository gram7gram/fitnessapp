import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Text, View} from 'react-native-ui-lib';
import {Actions} from "react-native-router-flux";
import {ScrollView} from "react-native";
import FetchTrainings from "../actions/FetchTrainings";

type Props = {};

class Landing extends Component<Props> {

    componentDidMount() {
        this.props.dispatch(FetchTrainings())
    }

    openTraining = training => () => {
        Actions.training({training})
    }

    addTraining = () => {
        Actions.training({training: null})
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


        return <ScrollView keyboardShouldPersistTaps="always">
            <View flex padding-10>

                <Button marginB-10
                        onPress={this.addTraining}>
                    <Text>{i18n.t('landing.start_session')}</Text>
                </Button>

                <Button marginB-10
                        onPress={this.openTraining(currentTraining)}
                        disabled={!currentTraining}>
                    <Text>{i18n.t('landing.show_session')}</Text>
                </Button>

                <Button marginB-10
                        onPress={this.openTraining(prevId)}
                        disabled={!prevId}>
                    <Text>{i18n.t('landing.prev_session')}</Text>
                </Button>

                <Button marginB-10
                        onPress={this.openTraining(nextId)}
                        disabled={!nextId}>
                    <Text>{i18n.t('landing.next_session')}</Text>
                </Button>

            </View>
        </ScrollView>
    }

}

export default connect(selectors)(Landing);
