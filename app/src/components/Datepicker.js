import React, {Component} from 'react';

import i18n from '../i18n';
import DatePicker from 'react-native-datepicker';
import {StyleSheet} from 'react-native';
import {Colors, Typography} from 'react-native-ui-lib';

class Picker extends Component<Props> {

    render() {

        const datePickerStyles = {
            disabled: styles.datepickerDisabled,
            dateInput: styles.datepickerInput,
            placeholderText: styles.datepickerPlaceholder,
            dateText: styles.datepickerValue,
        }

        return <DatePicker
            style={styles.picker}
            customStyles={datePickerStyles}
            showIcon={false}
            mode="datetime"
            format="YYYY-MM-DD HH:mm"
            placeholder={i18n.t('placeholders.date')}
            confirmBtnText={i18n.t('placeholders.confirm')}
            cancelBtnText={i18n.t('placeholders.cancel')}
            minuteInterval={10}
            {...this.props}/>
    }

}

const styles = StyleSheet.create({
    picker: {
        width: '100%'
    },
    datepickerInput: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: Colors.white,
        color: Colors.dark10,
        alignItems: 'flex-start',
    },
    datepickerPlaceholder: {
        ...Typography.text70,
        color: Colors.dark40,
        alignItems: 'flex-start',
    },
    datepickerValue: {
        ...Typography.text70,
        color: Colors.dark40,
        alignItems: 'flex-start',
    },
    datepickerDisabled: {
        ...Typography.text70,
        color: Colors.dark30,
        backgroundColor: 'transparent',
        borderColor: Colors.dark30,
    }
})

export default Picker