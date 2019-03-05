import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import {FlatList} from 'react-native';
import {Button, View, Text, ListItem} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Actions} from 'react-native-router-flux';
import {withLocalization} from "../../../context/LocaleProvider";
import {RESET} from "../actions";
import FetchExercises from "../actions/FetchExercises";
import {findTranslation} from "../../../utils";

type Props = {
    training: ?string,
    locale: string,
};

class Exercise extends Component<Props> {

    componentDidMount() {
        this.props.dispatch(FetchExercises())
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: RESET
        })
    }

    renderItem = ({item}) => {

        const {locale, training} = this.props

        const translation = findTranslation(item.translations, locale)

        const hasSubitems = (item.children !== undefined && item.children.length > 0)
            || (item.variants !== undefined && item.variants.length > 0)

        return <ListItem
            onPress={!hasSubitems ? () => Actions.workout({
                training,
                exercise: item.id
            }) : null}
            activeOpacity={0.3}
            paddingL-10
            paddingR-10
            marginB-10>

            <ListItem.Part left column padding-15>

                {hasSubitems
                    ? <Icon name="chevron-down"/>
                    : <Icon name="plus"/>}

            </ListItem.Part>

            <ListItem.Part middle column>

                <Text h1 numberOfLines={1}>{translation ? translation.name : "..."}</Text>
                <Text h4 numberOfLines={1}>{item.id}</Text>

            </ListItem.Part>
        </ListItem>
    }

    render() {

        const {items} = this.props.Exercise

        const flattenList = []
        let lvl = 0

        const flatten = item => {

            if (items.indexOf(item) !== -1) {
                lvl = 0
            }

            item.lvl = lvl

            flattenList.push(item)

            const hasSubitems = (item.children !== undefined && item.children.length > 0)
                || (item.variants !== undefined && item.variants.length > 0)

            if (hasSubitems) {
                ++lvl
            }

            if (item.children) {
                item.children.forEach(flatten)
            }

            if (item.variants) {
                item.variants.forEach(flatten)
            }
        }

        items.forEach(flatten)

        return <View flex margin-10>

            <FlatList
                data={flattenList}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}/>

        </View>
    }

}

export default withLocalization(
    connect(selectors)(Exercise)
)
