import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import selectors from './selectors';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import {StyleSheet} from 'react-native';
import {Button, Card, Colors, Text, TextField, Typography, View} from 'react-native-ui-lib';
import {findTranslation, objectValues, sortByTimestamp} from "../../../utils";
import {withLocalization} from "../../../context/LocaleProvider";
import {convertWeight} from "../../../Units";
import Alert from "../../../components/Alert";
import {navigateToWorkout} from "../../../router";

class WorkoutItem extends Component {

  state = {
    isRemoving: false
  }

  openWorkout = () => {

    const {workout} = this.props
    const {model} = this.props.Training

    navigateToWorkout(model.id, workout)
  }

  removeWorkout = () => {

    const {workout} = this.props

    this.props.dispatch({
      type: Actions.REMOVE_WORKOUT,
      payload: workout
    })
  }

  toggleRemoveAlert = () => {
    this.setState({
      isRemoving: !this.state.isRemoving
    })
  }

  render = () => {

    const {workout} = this.props

    const {locale, settings} = this.props

    const exerciseTranslation = workout.exercise
      ? findTranslation(workout.exercise.translations, locale)
      : null

    const repeats = objectValues(workout.repeats)

    sortByTimestamp(repeats, 'createdAt', 'DESC')

    const isHumanWeight = workout.exercise && workout.exercise.isHumanWeight

    return <Card
      marginB-10
      onPress={this.openWorkout}
      style={styles.card}>

      <View padding-10>

        <Text paragraph marginB-10>
          {exerciseTranslation ? exerciseTranslation.name : "..."}
        </Text>

        <View row marginB-10>

          <View column paddingR-5>
            <View row left>
              <Text textSmallSecondary numberOfLines={1}>
                {i18n.t('training.weight')}, {i18n.t('unit.' + settings.unit)}
              </Text>
            </View>

            <View row left>
              <Text textSmallSecondary numberOfLines={1}>
                {i18n.t('training.repeatCount')}
              </Text>
            </View>
          </View>

          {repeats.map((workout, key) =>
            <View key={key} column paddingH-5>

              <View row right>
                <Text textSmallSecondary numberOfLines={1}>
                  {!isHumanWeight && workout.weight.value > 0
                    ? convertWeight(workout.weight, settings.unit).toFixed(1)
                    : '-'}
                </Text>
              </View>

              <View row right>
                <Text textSmallSecondary numberOfLines={1}>
                  x{workout.repeatCount > 0 ? workout.repeatCount : '-'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View row>
          {workout.exercise && workout.exercise.muscleGroup
            ? <View left flex>
              <Text helpText>{i18n.t('muscle_groups.' + workout.exercise.muscleGroup)}</Text>
            </View>
            : null}

          <View right flex>
            <Button
              link
              label={i18n.t('placeholders.remove')}
              color={Colors.red10}
              onPress={this.toggleRemoveAlert}/>
          </View>
        </View>

      </View>

      {this.state.isRemoving
        ? <Alert
          title={i18n.t('training.remove_workout_alert_title')}
          body={i18n.t('training.remove_workout_alert_body')}
          onConfirm={this.removeWorkout}
          onDismiss={this.toggleRemoveAlert}/>
        : null}
    </Card>
  }

}

WorkoutItem.propTypes = {
  workout: PropTypes.any.isRequired
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.themeheader
  }
})

export default withLocalization(
  connect(selectors)(WorkoutItem)
)
