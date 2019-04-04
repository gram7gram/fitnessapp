import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import {ScrollView} from 'react-native';
import {version} from '../../../../../app.json';
import {Colors, Button, Text, View, TextField} from 'react-native-ui-lib';
import {Navigation} from 'react-native-navigation'
import {CHANGED, RESET} from "../actions";
import {Column as Col, Row} from "react-native-responsive-grid";
import i18n from "../../../i18n";
import * as Units from "../../../Units";
import {poundsToKilogram} from "../../../Units";
import {kilogramToPounds} from "../../../Units";

type Props = {
    componentId: string
};

class Settings extends Component<Props> {

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

    changeUnit = (value) => () => {
        this.props.dispatch({
            type: CHANGED,
            payload: {
                unit: value
            }
        })
    }

    changeInt = key => e => {
        let value = parseInt(e)
        if (isNaN(value) || value < 0) value = 0

        this.props.dispatch({
            type: CHANGED,
            payload: {
                [key]: Number(value)
            }
        })
    }

    render() {

        const {model} = this.props.Settings

        return <ScrollView>
            <View flex margin-10>
                <View marginB-10>

                    <Text paragraph marginB-10>{i18n.t('settings.unit')}</Text>

                    <View marginB-10>
                        <Row>
                            <Col size={100} lgSize={60} lgOffset={20}>
                                <View row>
                                    <View flex>
                                        <Button
                                            fullWidth
                                            outline={model.unit !== Units.POUNDS}
                                            outlineColor={model.unit !== Units.POUNDS ? Colors.cmuted : undefined}
                                            label={i18n.t('unit.pounds')}
                                            onPress={this.changeUnit(Units.POUNDS)}/>
                                    </View>
                                    <View flex>
                                        <Button
                                            fullWidth
                                            outline={model.unit !== Units.KILOGRAM}
                                            outlineColor={model.unit !== Units.KILOGRAM ? Colors.cmuted : undefined}
                                            label={i18n.t('unit.kilograms')}
                                            onPress={this.changeUnit(Units.KILOGRAM)}/>
                                    </View>
                                </View>
                            </Col>
                        </Row>

                    </View>

                    {model.unit === Units.POUNDS &&
                    <Text textSmallPrimary>
                        1{i18n.t('unit.pounds_short')}
                        &nbsp;=&nbsp;{poundsToKilogram(1).toFixed(2)}{i18n.t('unit.kilograms_short')}
                    </Text>}

                    {model.unit === Units.KILOGRAM &&
                    <Text textSmallPrimary>
                        1{i18n.t('unit.kilograms_short')}
                        &nbsp;=&nbsp;{kilogramToPounds(1).toFixed(2)}{i18n.t('unit.pounds_short')}
                    </Text>}
                </View>

                <View marginB-10>

                    <Text paragraph>{i18n.t('settings.default_repeat_count')}</Text>

                    <TextField
                        keyboardType="numeric"
                        enableErrors={false}
                        floatingPlaceholder={false}
                        placeholder={i18n.t('placeholders.number')}
                        onChangeText={this.changeInt('defaultRepeatCount')}
                        value={model.defaultRepeatCount + ''}/>
                </View>

                <View marginB-10>
                    <Text paragraph>{i18n.t('settings.version')}</Text>
                    <Text textSmallSecondary>{version}</Text>
                </View>
            </View>

        </ScrollView>
    }

}

export default connect(selectors)(Settings)
