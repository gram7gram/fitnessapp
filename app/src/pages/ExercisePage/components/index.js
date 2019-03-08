import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, ListItem, Text, View, TextField, Card} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Navigation} from 'react-native-navigation'
import {withLocalization} from "../../../context/LocaleProvider";
import {RESET, SEARCH_CHANGED, TOGGLE_SEARCH} from "../actions";
import FetchExercises from "../actions/FetchExercises";
import {findTranslation} from "../../../utils";
import * as Pages from "../../../router/Pages";
import i18n from "../../../i18n";

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

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: i18n.t('exercise.title')
                },
                rightButtons: [
                    {
                        id: 'exercise-search',
                        systemItem: 'search',
                        text: i18n.t('exercise.search')
                    }
                ]
            }
        })

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

    openWorkout = exercise => () => {

        const {training} = this.props

        Navigation.push(this.props.componentId, {
            component: {
                name: Pages.WORKOUT,
                passProps: {
                    training,
                    exercise
                }
            }
        })
    }

    renderItem = (item, key) => {

        const {locale} = this.props

        const translation = findTranslation(item.translations, locale)

        const hasSubitems = (item.children !== undefined && item.children.length > 0)
            || (item.variants !== undefined && item.variants.length > 0)

        return <Card
            style={styles.cardStyle}
            key={key}
            row
            height={50}
            onPress={!hasSubitems ? this.openWorkout(item.id) : null}
            marginB-10>

            <View padding-10 flex>
                <Text text70 numberOfLines={2}>
                    {hasSubitems
                        ? <Text><Icon name="chevron-down"/>&nbsp;</Text>
                        : null}
                    {translation ? translation.name : "..."}
                </Text>
            </View>

            {item.image
                ? <Card.Image
                    position="right"
                    width={50}
                    height={50}
                    imageSource={imageMap[item.image]()}/>
                : null}

        </Card>
    }

    render() {

        const {items, filtered, isSearchEnabled, search} = this.props.Exercise

        const list = isSearchEnabled ? filtered : items

        return <View flex margin-10>

            {isSearchEnabled
                ? <TextField
                    marginB-10
                    autoFocus={true}
                    floatingPlaceholder={false}
                    placeholder={i18n.t('placeholders.search')}
                    onChangeText={this.changeString('search')}
                    value={search || ''}/>
                : null}

            {isSearchEnabled && filtered.length === 0
                ? <Text dark80 text80 center>{i18n.t('exercise.no_items_title')}</Text>
                : null}

            <ScrollView>
                {list.map(this.renderItem)}
            </ScrollView>

        </View>
    }

}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: 'transparent'
    },
    cardStyle: {
        alignItems: 'center'
    }
})

const imageMap = {
    '/images/exercises/chest-1.jpg': () => require('../../../../assets/images/exercises/chest-1.jpg'),
    '/images/exercises/chest-2.jpg': () => require('../../../../assets/images/exercises/chest-2.jpg'),
    '/images/exercises/chest-3.jpg': () => require('../../../../assets/images/exercises/chest-3.jpg'),
    '/images/exercises/chest-4.jpg': () => require('../../../../assets/images/exercises/chest-4.jpg'),
    '/images/exercises/chest-5.jpg': () => require('../../../../assets/images/exercises/chest-5.jpg'),
    '/images/exercises/chest-6.jpg': () => require('../../../../assets/images/exercises/chest-6.jpg'),
    '/images/exercises/chest-7.jpg': () => require('../../../../assets/images/exercises/chest-7.jpg'),
    '/images/exercises/chest-8.jpg': () => require('../../../../assets/images/exercises/chest-8.jpg'),
    '/images/exercises/chest-9.jpg': () => require('../../../../assets/images/exercises/chest-9.jpg'),
    '/images/exercises/chest-10.jpg': () => require('../../../../assets/images/exercises/chest-10.jpg'),
    '/images/exercises/chest-11.jpg': () => require('../../../../assets/images/exercises/chest-11.jpg'),
    '/images/exercises/back-1.jpg': () => require('../../../../assets/images/exercises/back-1.jpg'),
}

export default withLocalization(
    connect(selectors)(Exercise)
)
