import React from 'react';
import {StatusBar} from 'react-native';
import {View} from 'react-native-ui-lib';
import {Provider} from 'react-redux';
import {defaultLocale, defaultTheme} from '../../app.json';
import store from './store';
import Router from './router';
import LocaleProvider from './context/LocaleProvider';
import ThemeProvider from './context/ThemeProvider';

import './theme'

export default () => <Provider store={store}>
    <LocaleProvider locale={defaultLocale}>
        <ThemeProvider theme={defaultTheme}>
            <View flex>
                <StatusBar barStyle='default'/>
                <Router/>
            </View>
        </ThemeProvider>
    </LocaleProvider>
</Provider>