import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import selectors from './selectors';
import moment from 'moment';
import i18n from '../../../i18n';
import DatePicker from '../../../components/Datepicker';
import {FlatList, ScrollView, StyleSheet} from 'react-native';
import {Button, Card, Colors, Text, TextField, Typography, View} from 'react-native-ui-lib';
import {findTranslation, objectValues, sortByTimestamp} from "../../../utils";
import {withLocalization} from "../../../context/LocaleProvider";
import FetchTraining from "../actions/FetchTraining";
import uuid from "uuid";
import DeleteTraining from "../actions/DeleteTraining";
import {Navigation} from "react-native-navigation";
import Chart from './Chart';
import Legend from './Chart/Legend';
import ErrorBoundary from "../../../components/ErrorBoundary";
import {navigateToExercise, navigateToLanding, navigateToWorkout} from "../../../router";
import SaveTraining from "../actions/SaveTraining";
import {Column as Col, Row} from "react-native-responsive-grid";
import {convertWeight} from "../../../Units";
import Alert from "../../../components/Alert";
import WorkoutItem from "./WorkoutItem";

type Props = {
    componentId: string,
    training: ?string
};

class Training extends Component<Props> {

    state = {
        isRemoving: false
    }

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidMount() {
        const {training, componentId, settings} = this.props

        if (training) {

            this.props.dispatch(FetchTraining(training, componentId))

        } else {
            this.props.dispatch({
                type: Actions.FETCH_TRAINING_SUCCESS,
                payload: {
                    id: uuid(),
                    createdAt: new Date().getTime(),
                    startedAt: moment().format('YYYY-MM-DD HH:mm'),
                    completedAt: null,
                    humanWeight: {value: 0, unit: settings.unit},
                    duration: 0,
                    totalWeight: {value: 0, unit: settings.unit},
                    totalWeightPerHour: 0,
                    muscleGroups: [],
                    workouts: {},
                    comment: null
                }
            })
        }
    }

    componentDidAppear() {
        const {training} = this.props
        const {model, isLoaded} = this.props.Training

        if (isLoaded && model.id === training) {
            this.props.dispatch({
                type: Actions.UPDATE_WORKOUT_METRICS_REQUEST
            })
        }
    }

    navigationButtonPressed({buttonId}) {
        switch (buttonId) {
            case 'training-save':
                this.save()
        }
    }

    save = () => {

        const {model} = this.props.Training

        this.props.dispatch(SaveTraining(model))

        navigateToLanding(this.props.componentId)
    }

    remove = () => {

        this.toggleRemoveAlert()

        const {componentId} = this.props
        const {model} = this.props.Training

        this.props.dispatch(DeleteTraining(model, componentId))
    }

    change = (key, value) => {
        this.props.dispatch({
            type: Actions.CHANGED,
            payload: {
                [key]: value
            }
        })
    }

    changeString = key => e => {
        this.change(key, e)
    }

    changeDate = key => e => {
        const date = moment().format('YYYY') + '.' + e

        this.change(key, moment(date, 'YYYY.DD.MM HH:mm').format('YYYY-MM-DD HH:mm'))
    }

    changeHumanWeight = e => {

        const {settings} = this.props

        let value = parseFloat(e)
        if (isNaN(value) || value < 0) value = 0

        this.change('humanWeight', {
            value: Number(value),
            unit: settings.unit
        })
    }

    toggleRemoveAlert = () => {
        this.setState({
            isRemoving: !this.state.isRemoving
        })
    }

    addWorkout = () => {

        const {model} = this.props.Training

        const newWorkout = {
            id: uuid(),
            createdAt: new Date().getTime(),
            training: model.id,
            repeats: {}
        }

        this.props.dispatch({
            type: Actions.ADD_WORKOUT,
            payload: newWorkout
        })

        navigateToExercise(model.id, newWorkout.id)
    }

    renderWorkout = ({item}) => {
        return <WorkoutItem workout={item}/>
    }

    render() {

        const {settings} = this.props
        const {model} = this.props.Training

        const workouts = objectValues(model.workouts)

        sortByTimestamp(workouts, 'createdAt', 'DESC')

        return <ScrollView keyboardShouldPersistTaps="always">
            <View flex padding-10>

                <View flex marginB-10>
                    <Legend/>

                    <ErrorBoundary>
                        <Chart/>
                    </ErrorBoundary>
                </View>

                <Row>
                    <Col size={33}>

                        <View marginR-5 marginB-10>

                            <Text paragraph>{i18n.t('training.human_weight')}, {i18n.t('unit.' + settings.unit)}</Text>

                            <TextField
                                style={styles.weightInput}
                                keyboardType="numeric"
                                enableErrors={false}
                                floatingPlaceholder={false}
                                placeholder={i18n.t('placeholders.number')}
                                onChangeText={this.changeHumanWeight}
                                value={(model.humanWeight.value > 0 ? model.humanWeight.value : '') + ''}/>
                        </View>

                    </Col>

                    <Col size={33}>

                        <View marginR-5 marginB-10>

                            <Text paragraph>{i18n.t('training.started_at')}</Text>

                            <DatePicker
                                format={'DD.MM HH:mm'}
                                date={model.startedAt
                                    ? moment(model.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM HH:mm')
                                    : ''}
                                maxDate={model.completedAt
                                    ? moment(model.completedAt, 'YYYY-MM-DD HH:mm').format('DD.MM HH:mm')
                                    : undefined}
                                onDateChange={this.changeDate('startedAt')}/>
                        </View>

                    </Col>
                    <Col size={33}>

                        <View marginR-5 marginB-10>

                            <Text paragraph>{i18n.t('training.completed_at')}</Text>

                            <DatePicker
                                format={'DD.MM HH:mm'}
                                disabled={!model.startedAt}
                                date={model.completedAt
                                    ? moment(model.completedAt, 'YYYY-MM-DD HH:mm').format('DD.MM HH:mm')
                                    : ''}
                                minDate={model.startedAt
                                    ? moment(model.startedAt, 'YYYY-MM-DD HH:mm').format('DD.MM HH:mm')
                                    : undefined}
                                onDateChange={this.changeDate('completedAt')}/>
                        </View>
                    </Col>
                </Row>

                <Row>

                    <Col size={100}>

                        <View marginB-10>

                            <Text paragraph>{i18n.t('training.comment_placeholder')}</Text>

                            <TextField
                                style={styles.noteInput}
                                enableErrors={false}
                                floatingPlaceholder={false}
                                placeholder={i18n.t('placeholders.text')}
                                onChangeText={this.changeString('comment')}
                                value={model.comment || ''}/>
                        </View>

                    </Col>

                </Row>

                <Row>
                    <Col size={100} mdSize={90} lgSize={80} mdOffset={5} lgOffset={10}>

                        <Button
                            marginB-10
                            label={i18n.t('training.add_workout')}
                            disabled={!(model.id && model.startedAt && model.humanWeight.value > 0)}
                            onPress={this.addWorkout}/>

                        <FlatList
                            data={workouts}
                            renderItem={this.renderWorkout}
                            keyExtractor={item => item.id}/>

                        <Button
                            link
                            marginB-10
                            marginT-25
                            label={i18n.t('training.remove')}
                            color={Colors.red10}
                            onPress={this.toggleRemoveAlert}/>
                    </Col>
                </Row>

            </View>

          {this.state.isRemoving
              ? <Alert
                  title={i18n.t('training.remove_alert_title')}
                  body={i18n.t('training.remove_alert_body')}
                  onConfirm={this.remove}
                  onDismiss={this.toggleRemoveAlert}/>
              : null}

        </ScrollView>
    }

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.themeheader
    },
    weightInput: {
        marginTop: 6.5
    },
    noteInput: {
        margin: 0
    }
})

export default withLocalization(
    connect(selectors)(Training)
)
