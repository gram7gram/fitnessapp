import React, {Component} from 'react';
import {connect} from 'react-redux';
import {CHANGED, REMOVE_WORKOUT, RESET} from '../actions';
import selectors from './selectors';
import i18n from '../../../i18n';
import {FlatList, ScrollView} from 'react-native';
import {Button, Text, TextField, View, ListItem} from 'react-native-ui-lib';
import {Actions} from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome5";
import {findTranslation, objectValues} from "../../../utils";
import {withLocalization} from "../../../context/LocaleProvider";
import FetchTraining from "../actions/FetchTraining";
import SaveTraining from "../actions/SaveTraining";
import uuid from "uuid";
import DeleteTraining from "../actions/DeleteTraining";

type Props = {
    training: ?string
};

class Training extends Component<Props> {

    componentDidMount() {

        const {training} = this.props

        if (training) {
            this.props.dispatch(FetchTraining(training))
        } else {
            this.props.dispatch({
                type: CHANGED,
                payload: {
                    id: uuid(),
                    createdAt: new Date().getTime(),
                }
            })
        }
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: RESET
        })
    }

    remove = () => {
        const {model} = this.props.Training

        this.props.dispatch(DeleteTraining(model.id))
    }

    save = () => {
        const {model} = this.props.Training

        this.props.dispatch(SaveTraining(model))
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

    removeWorkout = (id) => () => {
        this.props.dispatch({
            type: REMOVE_WORKOUT,
            payload: {
                id
            }
        })
    }

    addWorkout = () => {
        const {model} = this.props.Training

        Actions.exercise({
            training: model.training,
        })
    }

    renderWorkout = ({item}) => {

        const {locale} = this.props

        const exerciseTranslation = findTranslation(item.exercise.translations, locale)

        return <ListItem
            paddingL-10
            paddingR-10
            marginB-10>

            <ListItem.Part left column padding-15>

                <Icon name="times"
                      onPress={this.removeWorkout(item.id)}/>

            </ListItem.Part>

            <ListItem.Part column center>

                <Text h2 numberOfLines={1}>{exerciseTranslation ? exerciseTranslation.name : "..."}</Text>
                <Text h4 grey-50 numberOfLines={1}>{item.totalWeight}</Text>

            </ListItem.Part>
        </ListItem>
    }

    render() {

        const {model} = this.props.Training

        const workouts = objectValues(model.workouts)

        return <ScrollView keyboardShouldPersistTaps="always">
            <View flex padding-10>

                <Text h2 numberOfLines={1}>{model.id}</Text>
                <Text h4 numberOfLines={1}>{model.createdAt}</Text>

                <Button marginB-10 onPress={this.save}>
                    <Text>{i18n.t('training.save')}</Text>
                </Button>

                <Button marginB-10 onPress={this.remove}>
                    <Text>{i18n.t('training.remove')}</Text>
                </Button>

                <TextField
                    marginB-10
                    floatingPlaceholder
                    placeholder={i18n.t('training.started_at')}
                    onChangeText={this.changeString('startedAt')}
                    value={model.startedAt || ''}/>

                <TextField
                    marginB-10
                    floatingPlaceholder
                    placeholder={i18n.t('training.completed_at')}
                    onChangeText={this.changeString('completedAt')}
                    value={model.completedAt || ''}/>

                <TextField
                    marginB-10
                    floatingPlaceholder
                    placeholder={i18n.t('training.human_weight')}
                    onChangeText={this.changeFloat('humanWeight')}
                    value={(model.humanWeight > 0 ? model.humanWeight : '') + ''}/>

                <View marginB-10>

                    <FlatList
                        marginB-10
                        data={workouts}
                        renderItem={this.renderWorkout}
                        keyExtractor={item => item.id}/>

                    <Button onPress={this.addWorkout}>
                        <Text>{i18n.t('training.add_workout')}</Text>
                    </Button>

                </View>

            </View>
        </ScrollView>
    }

}

export default withLocalization(
    connect(selectors)(Training)
)
