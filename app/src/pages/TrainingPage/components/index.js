import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ADD_WORKOUT, CHANGED, FETCH_TRAINING_SUCCESS, REMOVE_WORKOUT, UPDATE_WORKOUT_METRICS_REQUEST} from '../actions';
import selectors from './selectors';
import moment from 'moment';
import i18n from '../../../i18n';
import DatePicker from '../../../components/Datepicker';
import {ScrollView, FlatList, StyleSheet} from 'react-native';
import {Button, Card, Colors, Text, TextField, Typography, View} from 'react-native-ui-lib';
import {findTranslation, objectValues} from "../../../utils";
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
import {convertWeight, getUnitTranslation} from "../../../Units";

type Props = {
    componentId: string,
    training: ?string
};

class Training extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidMount() {
        const {training, componentId} = this.props

        if (training) {

            this.props.dispatch(FetchTraining(training, componentId))

        } else {
            this.props.dispatch({
                type: FETCH_TRAINING_SUCCESS,
                payload: {
                    id: uuid(),
                    createdAt: new Date().getTime(),
                    startedAt: moment().format('YYYY-MM-DD HH:mm'),
                    completedAt: null,
                    humanWeight: 0,
                    duration: 0,
                    totalWeight: 0,
                    totalWeightPerHour: 0,
                    muscleGroups: [],
                    workouts: {},
                    comment: null
                }
            })
        }
    }

    componentDidAppear() {
        const {model} = this.props.Training

        if (model.id) {
            this.props.dispatch({
                type: UPDATE_WORKOUT_METRICS_REQUEST
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

        const {componentId} = this.props
        const {model} = this.props.Training

        this.props.dispatch(DeleteTraining(model, componentId))
    }

    change = (key, value) => {
        this.props.dispatch({
            type: CHANGED,
            payload: {
                [key]: value
            }
        })
    }

    changeString = key => e => {
        this.change(key, e)
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

    openWorkout = (workout) => () => {
        const {model} = this.props.Training

        navigateToWorkout(model.id, workout)
    }

    removeWorkout = payload => () => {

        this.props.dispatch({
            type: REMOVE_WORKOUT,
            payload
        })
    }

    addWorkout = () => {

        const {model} = this.props.Training

        const newWorkout = {
            id: uuid(),
            createdAt: new Date().getTime(),
            training: model.id,
            repeats: {},
            totalWeight: 0
        }

        this.props.dispatch({
            type: ADD_WORKOUT,
            payload: newWorkout
        })

        navigateToExercise(model.id, newWorkout.id)
    }

    renderWorkout = ({item}) => {

        const {locale, settings} = this.props

        const exerciseTranslation = item.exercise
            ? findTranslation(item.exercise.translations, locale)
            : null

        const repeats = objectValues(item.repeats).sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1
            if (a.createdAt > b.createdAt) return -1
            return 0
        })

        const isHumanWeight = item.exercise && item.exercise.isHumanWeight

        return <Card
            marginB-10
            onPress={this.openWorkout(item.id)}
            style={styles.card}>

            <View padding-10>

                <Text paragraph marginB-10>
                    {exerciseTranslation ? exerciseTranslation.name : "..."}
                </Text>

                <View row marginB-10>

                    <View column paddingR-5>
                        <View row left>
                            <Text textSmallSecondary numberOfLines={1}>
                                {i18n.t('training.weight')}, {i18n.t('unit.' + settings.unit)}
                            </Text>
                        </View>

                        <View row left>
                            <Text textSmallSecondary numberOfLines={1}>
                                {i18n.t('training.repeatCount')}
                            </Text>
                        </View>
                    </View>

                    {repeats.map((workout, key) =>
                        <View key={key} column paddingH-5>

                            <View row right>
                                <Text textSmallSecondary numberOfLines={1}>
                                    {!isHumanWeight && workout.weight.value > 0
                                        ? convertWeight(workout.weight, settings.unit).toFixed(1)
                                        : '-'}
                                </Text>
                            </View>

                            <View row right>
                                <Text textSmallSecondary numberOfLines={1}>
                                    x{workout.repeatCount > 0 ? workout.repeatCount : '-'}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <View row>
                    {item.exercise && item.exercise.muscleGroup
                        ? <View left flex>
                            <Text helpText>{i18n.t('muscle_groups.' + item.exercise.muscleGroup)}</Text>
                        </View>
                        : null}

                    <View right flex>
                        <Button
                            link
                            label={i18n.t('placeholders.remove')}
                            color={Colors.red10}
                            onPress={this.removeWorkout(item)}/>
                    </View>
                </View>


            </View>
        </Card>
    }

    render() {

        const {settings} = this.props
        const {model} = this.props.Training

        const workouts = objectValues(model.workouts).sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1
            if (a.createdAt > b.createdAt) return -1
            return 0
        })

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
                                maxDate={model.completedAt || undefined}
                                onDateChange={this.changeString('startedAt')}/>
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
                                minDate={model.startedAt || undefined}
                                onDateChange={this.changeString('completedAt')}/>
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
                            onPress={this.remove}/>
                    </Col>
                </Row>

            </View>
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
