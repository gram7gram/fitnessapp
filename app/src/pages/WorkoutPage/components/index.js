import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Card, Colors, ListItem, Text, View, WheelPicker} from 'react-native-ui-lib';
import {ScrollView, StyleSheet} from "react-native";
import {ADD_REPEAT, REMOVE_REPEAT, REPEAT_CHANGED, UPDATE_WORKOUT_METRICS_REQUEST} from "../../TrainingPage/actions";
import {RESET, SET_CURRENT_REPEAT} from "../actions";
import {findTranslation, objectValues} from "../../../utils";
import uuid from "uuid";
import debounce from "lodash/debounce";
import {withLocalization} from "../../../context/LocaleProvider";
import {Navigation} from "react-native-navigation";
import {closeModals} from "../../../router";

const weightsArr = []
const repeatsArr = []

for (let i = 0.5; i < 1500; i += 0.5) {
    weightsArr.push({
        value: i,
        label: i.toFixed(1),
    })
}

for (let i = 1; i < 250; i++) {
    repeatsArr.push({
        value: i,
        label: i.toFixed(0),
    })
}

type Props = {
    locale: string,
    training: string,
    workout: string,
};

class Workout extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {

        const {locale} = this.props
        const {currentRepeat} = this.props.Workout

        const workout = this.getWorkout()

        let title = i18n.t('workout.title')
        if (workout && workout.exercise) {
            const translation = findTranslation(workout.exercise.translations, locale)
            if (translation) {
                title = translation.name
            }
        }

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: title
                }
            }
        });

        const repeats = objectValues(this.getRepeats())

        if (repeats.length === 0) {

            this.addRepeat()

        } else if (!currentRepeat) {

            const last = repeats[repeats.length - 1]

            this.props.dispatch({
                type: SET_CURRENT_REPEAT,
                payload: last
            })
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

        this.props.dispatch({
            type: UPDATE_WORKOUT_METRICS_REQUEST
        })

        closeModals()
    }

    addRepeat = () => {
        const {workout} = this.props

        const humanWeight = this.getHumanWeight()
        const isHumanWeight = this.isHumanWeight()

        this.props.dispatch({
            type: ADD_REPEAT,
            payload: {
                id: uuid(),
                createdAt: new Date().getTime(),
                workout,
                isHumanWeight,
                weight: isHumanWeight ? humanWeight : 0,
                repeatCount: 15,
            }
        })
    }

    removeRepeat = (id) => () => {
        const {workout} = this.props

        this.props.dispatch({
            type: REMOVE_REPEAT,
            payload: {
                workout,
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

        const {workout} = this.props
        const {currentRepeat} = this.props.Workout

        if (!currentRepeat) return

        this.props.dispatch({
            type: REPEAT_CHANGED,
            payload: {
                workout,
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
        const {currentRepeat} = this.props.Workout

        return this.getRepeats()[currentRepeat] || null
    }

    getRepeats = () => {
        return this.getWorkout().repeats || {}
    }

    getWorkout = () => {
        const {workout} = this.props
        const {model} = this.props.Training

        return model.workouts[workout] || {}
    }

    isHumanWeight = () => {
        const workout = this.getWorkout()

        return workout && workout.exercise && workout.exercise.isHumanWeight === true
    }

    getHumanWeight = () => {
        const {model} = this.props.Training

        return model.humanWeight || 0
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

                <Text text50 dark20 center numberOfLines={1}>
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

        const repeats = objectValues(this.getRepeats()).sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1
            if (a.createdAt > b.createdAt) return -1
            return 0
        })

        const humanWeight = this.getHumanWeight()
        const isHumanWeight = this.isHumanWeight()
        const repeatModel = this.getCurrentRepeatModel()

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

                    {isHumanWeight

                        ? <WheelPicker
                            style={styles.picker}
                            selectedValue={humanWeight}>
                            <WheelPicker.Item value={humanWeight} label={humanWeight.toFixed(1)}/>
                        </WheelPicker>

                        : <WheelPicker
                            style={styles.picker}
                            selectedValue={repeatModel ? repeatModel.weight : weightsArr[0].value}
                            onValueChange={debounce(this.changeFloat('weight'), 200)}>
                            {weightsArr.map((item, key) =>
                                <WheelPicker.Item key={key} value={item.value} label={item.label}/>
                            )}
                        </WheelPicker>}

                </View>

                <View flex-1 column>

                    <Text text70 dark80 numberOfLines={1} center>{i18n.t('workout.set_repeats')}</Text>

                    <WheelPicker
                        style={styles.picker}
                        selectedValue={repeatModel ? repeatModel.repeatCount : repeatsArr[0].value}
                        onValueChange={debounce(this.changeInt('repeatCount'), 200)}>
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

