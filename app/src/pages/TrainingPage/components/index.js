import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ADD_WORKOUT, CHANGED, FETCH_TRAINING_SUCCESS, REMOVE_WORKOUT, UPDATE_WORKOUT_METRICS_REQUEST} from '../actions';
import selectors from './selectors';
import moment from 'moment';
import i18n from '../../../i18n';
import DatePicker from '../../../components/Datepicker';
import {ScrollView} from 'react-native';
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
                    workouts: {}
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

    changeFloat = key => e => {
        let value = parseFloat(e)
        if (isNaN(value) || value < 0) value = 0
        this.change(key, Number(value))
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

    renderWorkout = (item, key) => {

        const {locale} = this.props

        const exerciseTranslation = item.exercise
            ? findTranslation(item.exercise.translations, locale)
            : null

        let repeats = objectValues(item.repeats).sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1
            if (a.createdAt > b.createdAt) return -1
            return 0
        })

        const isOverflowing = repeats.length > 4

        let diff = 0
        if (isOverflowing) {
            diff = repeats.length - 4
            repeats = repeats.splice(0, 4)
        }

        return <Card
            key={key}
            marginB-10
            onPress={this.openWorkout(item.id)}>

            <View padding-10>

                <Text text70 dark10 marginB-10>
                    {exerciseTranslation ? exerciseTranslation.name : "..."}
                </Text>

                <View row marginB-10>

                    <View column paddingR-5>
                        <View row left>
                            <Text text80 dark30 numberOfLines={1}>{i18n.t('training.weight')}</Text>
                        </View>
                        <View row left>
                            <Text text80 dark30 numberOfLines={1}>{i18n.t('training.repeatCount')}</Text>
                        </View>
                    </View>

                    {repeats.map((workout, key) =>
                        <View key={key} column paddingH-5>
                            <View row right>
                                <Text text80 dark30
                                      numberOfLines={1}>{workout.weight > 0 ? workout.weight.toFixed(1) : '-'}</Text>
                            </View>
                            <View row right>
                                <Text text80 dark30
                                      numberOfLines={1}>x{workout.repeatCount > 0 ? workout.repeatCount : '-'}</Text>
                            </View>
                        </View>
                    )}

                    {isOverflowing
                        ? <View column padding-5>
                            <View row center>
                                <Text text100 blue20 numberOfLines={1}>+{diff}</Text>
                            </View>
                            <View row center>
                                <Text text100 blue20 numberOfLines={1}>more</Text>
                            </View>
                        </View>
                        : null}
                </View>

                <View row>
                    {item.exercise && item.exercise.muscleGroup
                        ? <View left flex>
                            <Text blue20>{i18n.t('muscle_groups.' + item.exercise.muscleGroup)}</Text>
                        </View>
                        : null}

                    <View right flex>
                        <Button link onPress={this.removeWorkout(item)}>
                            <Text red10>{i18n.t('training.remove_workout')}</Text>
                        </Button>
                    </View>
                </View>


            </View>
        </Card>
    }

    render() {

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

                <View row marginB-10>
                    <View flex-1 marginR-5>

                        <Text text80 dark40>{i18n.t('training.started_at')}</Text>

                        <DatePicker
                            date={model.startedAt || ''}
                            maxDate={model.completedAt || undefined}
                            onDateChange={this.changeString('startedAt')}/>

                    </View>

                    <View flex-1 marginL-5>

                        <Text text80 dark40>{i18n.t('training.completed_at')}</Text>

                        <DatePicker
                            disabled={!model.startedAt}
                            date={model.completedAt || ''}
                            minDate={model.startedAt || undefined}
                            onDateChange={this.changeString('completedAt')}/>
                    </View>
                </View>

                <TextField
                    marginB-10
                    keyboardType="numeric"
                    floatingPlaceholder={false}
                    title={i18n.t('training.human_weight')}
                    placeholder={i18n.t('placeholders.number')}
                    onChangeText={this.changeFloat('humanWeight')}
                    value={(model.humanWeight > 0 ? model.humanWeight : '') + ''}/>

                <Button
                    marginB-10
                    disabled={!(model.id && model.startedAt && model.humanWeight > 0)}
                    onPress={this.addWorkout}>
                    <Text>{i18n.t('training.add_workout')}</Text>
                </Button>

                <View marginB-10>
                    {workouts.map(this.renderWorkout)}
                </View>

                <Button marginB-10 link onPress={this.remove}>
                    <Text red10>{i18n.t('training.remove')}</Text>
                </Button>



            </View>
        </ScrollView>
    }

}

export default withLocalization(
    connect(selectors)(Training)
)
