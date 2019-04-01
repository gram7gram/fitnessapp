import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import {FlatList, StyleSheet} from 'react-native';
import {Button, Card, Colors, ListItem, Text, TextField, View} from 'react-native-ui-lib';
import {Navigation} from 'react-native-navigation'
import {withLocalization} from "../../../context/LocaleProvider";
import {RESET, SEARCH_CHANGED, TOGGLE_SEARCH} from "../actions";
import {WORKOUT_CHANGED} from "../../TrainingPage/actions";
import FetchExercises from "../actions/FetchExercises";
import DeleteMyExercise from "../actions/DeleteMyExercise";
import {findTranslation} from "../../../utils";
import i18n from "../../../i18n";
import {navigateToExerciseEdit, navigateToWorkout} from "../../../router";

type Props = {
    training: ?string,
    locale: string,
};

class Exercise extends Component<Props> {

    constructor(props) {
        super(props)

        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
        this.props.dispatch(FetchExercises())
    }

    componentDidDisappear() {
        this.props.dispatch({
            type: RESET
        })
    }

    navigationButtonPressed({buttonId}) {

        switch (buttonId) {
            case 'exercise-search':
                this.toggleSearch()
        }
    }

    changeString = key => e => {
        this.props.dispatch({
            type: SEARCH_CHANGED,
            payload: {
                [key]: e
            }
        })
    }

    toggleSearch = () => {

        const {items, isSearchEnabled} = this.props.Exercise

        const value = !isSearchEnabled

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                visible: !value,
                drawBehind: value,
            }
        })

        this.props.dispatch({
            type: TOGGLE_SEARCH,
            payload: {
                isSearchEnabled: value,
                items
            }
        })
    }

    openWorkout = exerciseId => () => {

        const {items} = this.props.Exercise

        const exercise = items.find(item => item.id === exerciseId)
        if (!exercise) return;

        const {training, workout} = this.props

        this.props.dispatch({
            type: WORKOUT_CHANGED,
            payload: {
                id: workout,
                exercise
            }
        })

        navigateToWorkout(training, workout)
    }

    openEdit = () => {
        const {training, workout} = this.props

        navigateToExerciseEdit(training, workout)
    }

    removeExercise = item => () => {
        this.props.dispatch(DeleteMyExercise(item))
    }

    renderItem = ({item}) => {

        const {locale} = this.props

        const translation = findTranslation(item.translations, locale)

        if (item.isRoot) {
            return <View
                key={item.id}
                flex
                padding-10
                marginB-10>
                <Text header3 numberOfLines={2} center>
                    {translation ? translation.name : "..."}
                </Text>
            </View>
        }

        return <Card
            key={item.id}
            style={styles.card}
            onPress={this.openWorkout(item.id)}
            marginB-5>

            <View padding-10 flex>
                <Text paragraph numberOfLines={2}>
                    {translation ? translation.name : "..."}
                </Text>

                <Text textSmallPrimary>{i18n.t('muscle_groups.' + item.muscleGroup)}</Text>

                {item.personal ?
                    <View right flex>
                        <Button
                            link
                            label={i18n.t('placeholders.remove')}
                            color={Colors.red10}
                            onPress={this.removeExercise(item)}/>
                    </View>
                    : null}
            </View>

        </Card>
    }

    render() {

        const {items, filtered, isSearchEnabled, search} = this.props.Exercise

        const list = isSearchEnabled ? filtered : items

        return <View flex margin-10>

            {isSearchEnabled
                ? <View marginB-10>
                    <TextField
                        autoFocus={true}
                        enableErrors={false}
                        floatingPlaceholder={false}
                        placeholder={i18n.t('placeholders.search')}
                        onChangeText={this.changeString('search')}
                        value={search || ''}/>
                </View>
                : null}

            <Button
                marginB-10
                label={i18n.t('exercise.add_exercise')}
                onPress={this.openEdit}/>

            {isSearchEnabled && filtered.length === 0
                ? <Text marginT-25 header4 center>{i18n.t('exercise.no_items_title')}</Text>
                : null}

            <FlatList
                data={list}
                renderItem={this.renderItem}
                keyExtractor={(item, key) => key + ''}/>

        </View>
    }

}


const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.themeheader
    }
})

export default withLocalization(
    connect(selectors)(Exercise)
)
