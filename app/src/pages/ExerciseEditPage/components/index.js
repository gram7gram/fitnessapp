import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import {StyleSheet, ScrollView} from 'react-native';
import {
    Button,
    Card,
    Colors,
    ListItem,
    Text,
    TextField,
    View,
    Switch,
} from 'react-native-ui-lib';
import {Navigation} from 'react-native-navigation'
import {withLocalization} from "../../../context/LocaleProvider";
import {RESET, CHANGED} from "../actions";
import {navigateToExercise, navigateToWorkout} from "../../../router";
import {WORKOUT_CHANGED} from "../../TrainingPage/actions";
import {Column as Col, Row} from "react-native-responsive-grid";
import i18n from "../../../i18n";
import SaveExercise from "../actions/SaveExercise";
import uuid from "uuid";

const muscles = [
    {value: 'chest', label: i18n.t('muscle_groups.chest')},
    {value: 'back', label: i18n.t('muscle_groups.back')},
    {value: 'abs', label: i18n.t('muscle_groups.abs')},
    {value: 'biceps', label: i18n.t('muscle_groups.biceps')},
    {value: 'triceps', label: i18n.t('muscle_groups.triceps')},
    {value: 'deltas', label: i18n.t('muscle_groups.deltas')},
    {value: 'forearm', label: i18n.t('muscle_groups.forearm')},
    {value: 'legs', label: i18n.t('muscle_groups.legs')},
]

type Props = {
    training: ?string,
    locale: string,
};

class ExerciseEdit extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {

    }

    componentDidDisappear() {
        this.props.dispatch({
            type: RESET
        })
    }

    navigationButtonPressed({buttonId}) {

        switch (buttonId) {
            case 'exercise-edit-save':
                this.save()
                break
            case 'exercise-edit-cancel':
                this.cancel()
                break
        }
    }

    changeString = key => e => {
        this.props.dispatch({
            type: CHANGED,
            payload: {
                [key]: e
            }
        })
    }

    changeMuscleGroup = muscleGroup => () => {
        this.props.dispatch({
            type: CHANGED,
            payload: {
                muscleGroup
            }
        })
    }

    changeScale = e => {

        let value = parseFloat(e)
        if (isNaN(value) || value < 0) value = 0
        if (value > 100) value = 100

        value = value / 100

        this.props.dispatch({
            type: CHANGED,
            payload: {
                scale: value
            }
        })
    }

    save = () => {

        const {training, workout, locale} = this.props
        const {model} = this.props.ExerciseEdit

        const exercise = {
            id: uuid(),
            createdAt: new Date().getTime(),
            personal: true,
            muscleGroup: model.muscleGroup,
            isHumanWeight: model.isHumanWeight,
            scale: model.scale,
            translations: {
                [locale]: {
                    name: model.name
                }
            }
        }

        this.props.dispatch(SaveExercise(exercise))

        this.props.dispatch({
            type: WORKOUT_CHANGED,
            payload: {
                id: workout,
                exercise
            }
        })

        navigateToWorkout(training, workout)
    }

    cancel = () => {
        const {training, workout} = this.props

        navigateToExercise(training, workout)
    }

    render() {

        const {model} = this.props.ExerciseEdit

        return <ScrollView>
            <View flex margin-10>

                <Row>

                    <Col size={100}>

                        <View marginB-10>

                            <TextField
                                floatingPlaceholder={false}
                                title={i18n.t('exercise_edit.name')}
                                placeholder={i18n.t('placeholders.text')}
                                onChangeText={this.changeString('name')}
                                value={model.name || ''}/>
                        </View>

                    </Col>
                </Row>

                <Row>
                    <Col size={100}>
                        <View marginB-10>

                            <Text dark40 text80
                                  marginB-5>{i18n.t('exercise_edit.muscle_group')}</Text>

                            {muscles.map((muscle, key) =>
                                <View key={key} marginB-5>
                                    <Row>
                                        <Col size={50}>
                                            <Text dark60 text80>{muscle.label}</Text>
                                        </Col>
                                        <Col size={50}>
                                            <View right>
                                                <Switch
                                                    onColor={Colors.blue30}
                                                    offColor={Colors.dark30}
                                                    value={muscle.value === model.muscleGroup}
                                                    onValueChange={this.changeMuscleGroup(muscle.value)}/>
                                            </View>
                                        </Col>
                                    </Row>
                                </View>
                            )}
                        </View>
                    </Col>
                </Row>

                <Row>
                    <Col size={100}>
                        <View marginB-10>

                            <Row>
                                <Col size={50}>
                                    <Text dark40 text80>{i18n.t('exercise_edit.is_human_weight')}</Text>
                                </Col>
                                <Col size={50}>
                                    <View right>
                                        <Switch
                                            marginB-10
                                            onColor={Colors.blue30}
                                            offColor={Colors.dark30}
                                            value={model.isHumanWeight}
                                            onValueChange={this.changeString('isHumanWeight')}/>
                                    </View>
                                </Col>
                                <Col size={100}>
                                    <Text blue10 text90 centerV>{i18n.t('exercise_edit.is_human_weight_notice')}</Text>
                                </Col>
                            </Row>

                        </View>

                    </Col>
                    <Col size={100}>

                        <TextField
                            marginB-10
                            editable={model.isHumanWeight}
                            keyboardType="numeric"
                            floatingPlaceholder={false}
                            title={i18n.t('exercise_edit.scale')}
                            placeholder={i18n.t('placeholders.number')}
                            onChangeText={this.changeScale}
                            value={(model.scale * 100).toFixed(0)}
                            disabledColor={Colors.dark20}/>

                        <Text blue10 text90 centerV>{i18n.t('exercise_edit.scale_notice')}</Text>
                    </Col>

                </Row>


            </View>
        </ScrollView>
    }

}

const styles = StyleSheet.create({
    radio: {
        color: Colors.dark40
    }
})

export default withLocalization(
    connect(selectors)(ExerciseEdit)
)
