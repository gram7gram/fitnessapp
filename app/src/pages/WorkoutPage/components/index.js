import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import i18n from '../../../i18n';
import {Button, ListItem, Text, View} from 'react-native-ui-lib';
import {Actions} from "react-native-router-flux";
import {Picker} from 'react-native-wheel-pick';
import {FlatList, ScrollView, StyleSheet} from "react-native";
import {ADD_REPEAT, CHANGED, REMOVE_REPEAT, RESET, SET_CURRENT_REPEAT} from "../actions";
import {findTranslation, objectValues} from "../../../utils";
import uuid from "uuid";
import Icon from "react-native-vector-icons/FontAwesome5";
import {ADD_WORKOUT} from "../../TrainingPage/actions";
import FetchExercise from "../actions/FetchExercise";
import {withLocalization} from "../../../context/LocaleProvider";

const weightsArr = []
const repeatsArr = []

for (let i = 0.5; i < 100; i += 0.5) {
    weightsArr.push(i)
}

for (let i = 1; i < 100; i++) {
    repeatsArr.push(i)
}

type Props = {
    training: ?string,
    exercise: ?string,
    workout: ?string,
};

class Workout extends Component<Props> {

    componentDidMount() {
        const {exercise, workout} = this.props

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
                    exercise: {
                        id: exercise
                    }
                }
            })
        }

        if (exercise) {
            this.props.dispatch(FetchExercise(exercise))
        }
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: RESET,
        })
    }

    save = () => {

        const {model} = this.props.Workout

        this.props.dispatch({
            type: ADD_WORKOUT,
            payload: model
        })

        Actions.training({
            training: model.training
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

    renderRepeat = ({item}) => {

        const {currentRepeat} = this.props.Workout

        return <ListItem
            onPress={this.setRepeatActive(item)}
            paddingL-10
            paddingR-10
            marginB-10>

            <ListItem.Part left column padding-15>

                <Icon name="times"
                      onPress={this.removeRepeat(item.id)}/>

            </ListItem.Part>

            <ListItem.Part column center>

                <Text h2 numberOfLines={1} center>

                    {currentRepeat === item.id && <Icon name="check"/>}

                    {item.weight} / {item.repeatCount}
                </Text>

            </ListItem.Part>
        </ListItem>
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

        return <View flex padding-10>

            <Text h2 numberOfLines={1}>{model.id}</Text>
            <Text h4 numberOfLines={1}>{model.createdAt}</Text>
            <Text h4 numberOfLines={1}>{exerciseTranslation ? exerciseTranslation.name : '...'}</Text>

            <Button marginB-10 onPress={this.save}>
                <Text>{i18n.t('workout.save')}</Text>
            </Button>

            <ScrollView keyboardShouldPersistTaps="always">

                <View marginB-10>

                    <FlatList
                        marginB-10
                        data={repeats}
                        renderItem={this.renderRepeat}
                        keyExtractor={item => item.id}/>

                    <Button onPress={this.addRepeat}>
                        <Text>{i18n.t('workout.add_repeat')}</Text>
                    </Button>

                </View>
            </ScrollView>

            <View flex row>

                <View flex-1 column center style={styles.pickerContainer}>

                    <Picker
                        style={styles.picker}
                        selectedValue={repeatModel ? repeatModel.weight : null}
                        pickerData={weightsArr}
                        onValueChange={this.changeFloat('weight')}
                        itemSpace={30}/>
                </View>

                <View flex-1 column center style={styles.pickerContainer}>

                    <Picker
                        style={styles.picker}
                        selectedValue={repeatModel ? repeatModel.repeatCount : null}
                        pickerData={repeatsArr}
                        onValueChange={this.changeInt('repeatCount')}
                        itemSpace={30}/>

                </View>
            </View>
        </View>
    }

}

const styles = StyleSheet.create({
    pickerContainer: {
        alignItems: 'stretch'
    },
    picker: {
        backgroundColor: 'white',
        height: 215
    }
})

export default withLocalization(
    connect(selectors)(Workout)
)
