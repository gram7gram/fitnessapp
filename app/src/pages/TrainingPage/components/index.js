import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ADD_WORKOUT, CHANGED, REMOVE_WORKOUT, RESET} from '../actions';
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
import * as Pages from "../../../router/Pages";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Chart from './Chart';
import Legend from './Chart/Legend';
import ErrorBoundary from "../../../components/ErrorBoundary";

type Props = {
    componentId: string,
    training: ?string
};

class Training extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                visible: true,
                drawBehind: false,
                title: {
                    text: i18n.t('training.title')
                },
                rightButtons: [
                    {
                        id: 'training-save',
                        systemItem: 'done',
                        text: i18n.t('training.save'),
                        color: Colors.dark80
                    }
                ]
            }
        });

        const {training, componentId} = this.props

        if (training) {

            this.props.dispatch(FetchTraining(training, componentId))

        } else {
            this.props.dispatch({
                type: CHANGED,
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

    navigationButtonPressed({buttonId}) {
        switch (buttonId) {
            case 'training-save':
                this.openLanding()
        }
    }

    openLanding = () => {

        this.props.dispatch({
            type: RESET
        })

        Navigation.push(this.props.componentId, {
            component: {
                name: Pages.LANDING,
                options: {
                    drawBehind: true,
                    visible: false,
                }
            }
        })
    }

    remove = () => {

        const {componentId} = this.props
        const {model} = this.props.Training

        this.props.dispatch(DeleteTraining(model.id, componentId))
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

        Navigation.push(this.props.componentId, {
            component: {
                name: Pages.WORKOUT,
                passProps: {
                    training: model.training,
                    workout
                }
            }
        })
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

        Navigation.push(this.props.componentId, {
            component: {
                name: Pages.EXERCISE,
                passProps: {
                    training: newWorkout.training,
                    workout: newWorkout.id
                }
            }
        })
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

                <View row>

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
                                <Text text80 dark30 numberOfLines={1}>{workout.weight.toFixed(1)}</Text>
                            </View>
                            <View row right>
                                <Text text80 dark30 numberOfLines={1}>x{workout.repeatCount}</Text>
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
            if (a.createdAt < b.createdAt) return -1
            if (a.createdAt > b.createdAt) return 1
            return 0
        })

        return <ScrollView keyboardShouldPersistTaps="always">
            <View flex padding-10>

                <Legend/>

                <ErrorBoundary>
                    <Chart/>
                </ErrorBoundary>

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
                    onPress={this.addWorkout}>
                    <Text>
                        <Icon name="plus"/>
                        &nbsp;{i18n.t('training.add_workout')}
                    </Text>
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
