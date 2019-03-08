import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Card, Colors, ListItem, Text, View, WheelPicker} from 'react-native-ui-lib';
import {ScrollView, StyleSheet} from "react-native";
import {ADD_REPEAT, CHANGED, REMOVE_REPEAT, RESET, SET_CURRENT_REPEAT} from "../actions";
import {findTranslation, objectValues} from "../../../utils";
import uuid from "uuid";
import {ADD_WORKOUT} from "../../TrainingPage/actions";
import FetchExercise from "../actions/FetchExercise";
import {withLocalization} from "../../../context/LocaleProvider";
import {Navigation} from "react-native-navigation";
import * as Pages from "../../../router/Pages";

const weightsArr = []
const repeatsArr = []

for (let i = 0.5; i < 100; i += 0.5) {
    weightsArr.push({
        value: i,
        label: i.toFixed(1) + "",
    })
}

for (let i = 1; i < 100; i++) {
    repeatsArr.push({
        value: i,
        label: i + "",
    })
}

type Props = {
    training: ?string,
    exercise: ?string,
    workout: ?string,
};

class Workout extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: i18n.t('workout.title')
                },
                rightButtons: [
                    {
                        id: 'workout-save',
                        systemItem: 'done',
                        text: i18n.t('workout.save')
                    }
                ]
            }
        });

        const {exercise, workout, training} = this.props

        const {model} = this.props.Training

        const currentWorkout = model.workouts[workout]

        if (currentWorkout) {
            this.props.dispatch({
                type: CHANGED,
                payload: currentWorkout
            })
        } else {
            this.props.dispatch({
                type: CHANGED,
                payload: {
                    id: uuid(),
                    createdAt: new Date().getTime(),
                    training,
                    exercise: {
                        id: exercise
                    }
                }
            })

            this.props.dispatch(FetchExercise(exercise))
        }
    }

    componentDidDisappear() {
        this.props.dispatch({
            type: RESET,
        })
    }

    navigationButtonPressed({buttonId}) {
        switch (buttonId) {
            case 'workout-save':
                this.save()
        }
    }

    save = () => {

        const {model} = this.props.Workout

        this.props.dispatch({
            type: ADD_WORKOUT,
            payload: model
        })

        Navigation.push(this.props.componentId, {
            component: {
                name: Pages.TRAINING,
                passProps: {
                    training: model.training
                }
            }
        })
    }

    addRepeat = () => {
        this.props.dispatch({
            type: ADD_REPEAT,
            payload: {
                id: uuid(),
                createdAt: new Date().getTime()
            }
        })
    }

    removeRepeat = (id) => () => {
        this.props.dispatch({
            type: REMOVE_REPEAT,
            payload: {
                id
            }
        })
    }

    setRepeatActive = payload => () => {
        this.props.dispatch({
            type: SET_CURRENT_REPEAT,
            payload
        })
    }

    change = (key, value) => {

        const {currentRepeat} = this.props.Workout

        if (!currentRepeat) return

        this.props.dispatch({
            type: CHANGED,
            payload: {
                id: currentRepeat,
                [key]: value
            }
        })
    }

    changeFloat = key => e => {
        let value = parseFloat(e)
        if (isNaN(value) || value < 0) value = 0
        this.change(key, Number(value))
    }

    changeInt = key => e => {
        let value = parseInt(e)
        if (isNaN(value) || value < 0) value = 0
        this.change(key, Number(value))
    }

    getCurrentRepeatModel = () => {
        const {model, currentRepeat} = this.props.Workout

        const repeats = objectValues(model.repeats)

        return repeats.find(item => item.id === currentRepeat)
    }

    renderRepeat = (item, key) => {

        const {currentRepeat} = this.props.Workout

        const isCurrent = currentRepeat === item.id

        return <Card
            key={key}
            onPress={this.setRepeatActive(item)}
            style={isCurrent ? styles.currentRepeatCard : null}
            marginB-10>

            <View padding-10>

                <Text text50 dark20 center>
                    <Text red10> {item.weight || 0}</Text>
                    {i18n.t('workout.weight_short')}
                    <Text red10>{item.repeatCount || 0}</Text>
                    {i18n.t('workout.repeats_short')}
                </Text>

                <View right>
                    <Button link onPress={this.removeRepeat(item.id)}>
                        <Text red10>{i18n.t('workout.remove_repeat')}</Text>
                    </Button>
                </View>
            </View>
        </Card>
    }

    render() {

        const {locale} = this.props
        const {model} = this.props.Workout

        const repeats = objectValues(model.repeats).sort((a, b) => {
            if (a.createdAt < b.createdAt) return -1
            if (a.createdAt > b.createdAt) return 1
            return 0
        })

        const repeatModel = this.getCurrentRepeatModel()

        const exerciseTranslation = model.exercise ? findTranslation(model.exercise.translations, locale) : null

        if (exerciseTranslation) {
            Navigation.mergeOptions(this.props.componentId, {
                topBar: {
                    title: {
                        text: exerciseTranslation.name
                    }
                }
            });
        }

        return <View flex>
            <View flex row padding-10 style={styles.scrollContainer}>

                <ScrollView vertical>
                    <Button
                        marginB-10
                        onPress={this.addRepeat}>
                        <Text>{i18n.t('workout.add_repeat')}</Text>
                    </Button>

                    <View marginB-10>
                        {repeats.map(this.renderRepeat)}
                    </View>

                </ScrollView>
            </View>

            <View row style={styles.pickerContainer} marginB-20>

                <View flex-1 column>

                    <Text text70 dark80 numberOfLines={1} center>{i18n.t('workout.set_weight')}</Text>

                    <WheelPicker
                        style={styles.picker}
                        selectedValue={repeatModel ? repeatModel.weight : weightsArr[0].value}
                        onValueChange={this.changeFloat('weight')}>
                        {weightsArr.map((item, key) =>
                            <WheelPicker.Item key={key} value={item.value} label={item.label}/>
                        )}
                    </WheelPicker>
                </View>

                <View flex-1 column>

                    <Text text70 dark80 numberOfLines={1} center>{i18n.t('workout.set_repeats')}</Text>

                    <WheelPicker
                        style={styles.picker}
                        selectedValue={repeatModel ? repeatModel.repeatCount : repeatsArr[0].value}
                        onValueChange={this.changeInt('repeatCount')}>
                        {repeatsArr.map((item, key) =>
                            <WheelPicker.Item key={key} value={item.value} label={item.label}/>
                        )}
                    </WheelPicker>

                </View>
            </View>
        </View>
    }

}

const styles = StyleSheet.create({
    currentRepeatCard: {
        color: Colors.dark80,
        backgroundColor: Colors.green40
    },
    scrollContainer: {
        height: '70%'
    },
    pickerContainer: {
        height: '30%',
        alignItems: 'stretch'
    },
    picker: {
        backgroundColor: Colors.dark20,
        height: '100%'
    }
})

export default withLocalization(
    connect(selectors)(Workout)
)

