import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, Card, Colors, ListItem, Text, View, WheelPicker, Typography} from 'react-native-ui-lib';
import {FlatList, ScrollView, StyleSheet} from "react-native";
import {ADD_REPEAT, REMOVE_REPEAT, REPEAT_CHANGED, UPDATE_WORKOUT_METRICS_REQUEST} from "../../TrainingPage/actions";
import {RESET, SET_CURRENT_REPEAT} from "../actions";
import {findTranslation, objectValues} from "../../../utils";
import uuid from "uuid";
import debounce from "lodash/debounce";
import {withLocalization} from "../../../context/LocaleProvider";
import {Navigation} from "react-native-navigation";
import {closeModals} from "../../../router";
import {TextField} from "../../TrainingPage/components";
import {Column as Col, Row} from "react-native-responsive-grid";

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

        let weight = 0
        const isHumanWeight = this.isHumanWeight()

        if (isHumanWeight) {
            const humanWeight = this.getHumanWeight()
            const scale = this.getExerciseScale()

            weight = humanWeight * scale
        }

        this.props.dispatch({
            type: ADD_REPEAT,
            payload: {
                id: uuid(),
                createdAt: new Date().getTime(),
                workout,
                isHumanWeight,
                weight,
                repeatCount: 15,
            }
        })
    }

    copyRepeat = (id) => () => {
        const repeat = this.getRepeats()[id]
        if (!repeat) return

        this.props.dispatch({
            type: ADD_REPEAT,
            payload: {
                ...repeat,
                id: uuid(),
                createdAt: new Date().getTime(),
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

    getExerciseScale = () => {
        const workout = this.getWorkout()

        return workout && workout.exercise ? workout.exercise.scale : 0
    }

    getHumanWeight = () => {
        const {model} = this.props.Training

        return model.humanWeight || 0
    }

    renderRepeat = ({item}) => {

        const {currentRepeat} = this.props.Workout

        const isHumanWeight = this.isHumanWeight()
        const isCurrent = currentRepeat === item.id

        return <Card
            onPress={this.setRepeatActive(item)}
            style={isCurrent ? styles.activeCard : styles.card}
            marginB-10>

            <View padding-10>

                {isHumanWeight

                    ? <Text
                        text50 center numberOfLines={1}
                        cdark={isCurrent}
                        cmuted={!isCurrent}>

                        <Text red10>{(item.repeatCount || 0).toFixed(0)}</Text>
                        {i18n.t('workout.repeats_short')}
                    </Text>

                    : <Text
                        text50 center numberOfLines={1}
                        cdark={isCurrent}
                        cmuted={!isCurrent}>

                        <Text red10> {(item.weight || 0).toFixed(1)}</Text>
                        {i18n.t('workout.weight_short')}
                        &nbsp;
                        <Text red10>{(item.repeatCount || 0).toFixed(0)}</Text>
                        {i18n.t('workout.repeats_short')}
                    </Text>}

                <View row>
                    <View left flex>
                        <Button
                            link
                            label={i18n.t('workout.duplicate')}
                            color={Colors.blue10}
                            onPress={this.copyRepeat(item.id)}/>
                    </View>

                    <View right flex>
                        <Button
                            link
                            label={i18n.t('placeholders.remove')}
                            color={Colors.red10}
                            onPress={this.removeRepeat(item.id)}/>
                    </View>
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

        const isHumanWeight = this.isHumanWeight()
        const repeatModel = this.getCurrentRepeatModel()

        return <View flex>
            <View flex row padding-10 style={styles.scrollContainer}>

                <ScrollView vertical>

                    <Row>
                        <Col size={100} mdSize={90} lgSize={80} mdOffset={5} lgOffset={10}>

                            <Button
                                marginB-10
                                label={i18n.t('workout.add_repeat')}
                                onPress={this.addRepeat}/>

                            <FlatList
                                data={repeats}
                                renderItem={this.renderRepeat}
                                keyExtractor={item => item.id}/>

                        </Col>
                    </Row>

                </ScrollView>
            </View>

            <View row style={styles.pickerContainer} marginB-20>

                {!isHumanWeight

                    ? <View flex-1 column>

                        <Text textPrimary numberOfLines={1} center>{i18n.t('workout.set_weight')}</Text>

                        <WheelPicker
                            style={styles.picker}
                            labelStyle={Typography.textPrimary}
                            selectedValue={repeatModel ? repeatModel.weight : weightsArr[0].value}
                            onValueChange={debounce(this.changeFloat('weight'), 200)}>
                            {weightsArr.map((item, key) =>
                                <WheelPicker.Item key={key} value={item.value} label={item.label}/>
                            )}
                        </WheelPicker>

                    </View> : null}

                <View flex-1 column>

                    <Text textPrimary numberOfLines={1} center>{i18n.t('workout.set_repeats')}</Text>

                    <WheelPicker
                        style={styles.picker}
                        labelStyle={Typography.textPrimary}
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
    activeCard: {
        backgroundColor: Colors.clight
    },
    card: {
        backgroundColor: Colors.themeheader
    },
    scrollContainer: {
        height: '70%'
    },
    pickerContainer: {
        height: '30%',
        alignItems: 'stretch'
    },
    picker: {
        backgroundColor: Colors.themeheader,
        height: '100%',
        width: '100%'
    }
})

export default withLocalization(
    connect(selectors)(Workout)
)

