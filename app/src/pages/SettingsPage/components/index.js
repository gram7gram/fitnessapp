import React, {Component} from 'react';
import {connect} from 'react-redux';
import selectors from './selectors';
import {ScrollView} from 'react-native';
import {version} from '../../../../../app.json';
import {Colors, Button, Text, View} from 'react-native-ui-lib';
import {Navigation} from 'react-native-navigation'
import {CHANGED, RESET} from "../actions";
import {Column as Col, Row} from "react-native-responsive-grid";
import i18n from "../../../i18n";
import * as Units from "../../../Units";

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

    render() {

        const {model} = this.props.Settings

        return <ScrollView>
            <View flex margin-10>
                <View marginB-10>

                    <Text paragraph marginB-10>{i18n.t('settings.unit')}</Text>

                    <Row>
                        <Col size={100} lgSize={60} lgOffset={20}>
                            <View row>
                                <View flex>
                                    <Button
                                        fullWidth
                                        outline={model.unit !== Units.POUNDS}
                                        label={i18n.t('unit.pounds')}
                                        onPress={this.changeUnit(Units.POUNDS)}/>
                                </View>
                                <View flex>
                                    <Button
                                        fullWidth
                                        outline={model.unit !== Units.KILOGRAM}
                                        label={i18n.t('unit.kilograms')}
                                        onPress={this.changeUnit(Units.KILOGRAM)}/>
                                </View>
                            </View>
                        </Col>
                    </Row>

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
