// @flow

import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {Colors} from 'react-native-ui-lib';

import i18n from '../i18n';
import store from '../store';

import LocaleProvider from '../context/LocaleProvider';
import ThemeProvider from '../context/ThemeProvider';

import Landing from '../pages/LandingPage/components';
import Training from '../pages/TrainingPage/components';
import Exercise from '../pages/ExercisePage/components';
import Workout from '../pages/WorkoutPage/components';

import * as Pages from './Pages';
import {defaultLocale, defaultTheme} from "../../../app.json";

function withStore(Component) {

    return function inject(props) {

        return <Provider store={store}>
            <LocaleProvider locale={defaultLocale}>
                <ThemeProvider theme={defaultTheme}>
                    <Component{...props}/>
                </ThemeProvider>
            </LocaleProvider>
        </Provider>
    };
}

export function createRouter() {

    Navigation.registerComponent(Pages.LANDING, () => withStore(Landing));

    Navigation.registerComponent(Pages.TRAINING, () => withStore(Training));

    Navigation.registerComponent(Pages.EXERCISE, () => withStore(Exercise));

    Navigation.registerComponent(Pages.WORKOUT, () => withStore(Workout));

    Navigation.setDefaultOptions({
        topBar: {
            drawBehind: false,
            visible: true,
            background: {
                color: Colors.dark20
            },
            title: {
                color: Colors.dark80,
            },
            backButton: {
                title: '', // Remove previous screen name from back button
                color: Colors.dark80
            },
            buttonColor: Colors.dark80,
            rightButtons: {
                color: Colors.dark80
            }
        },
        statusBar: {
            style: 'dark'
        },
        layout: {
            orientation: ['portrait'],
            backgroundColor: Colors.dark10,
            color: Colors.dark80,
        }
    });

    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: Pages.LANDING,
                            options: {
                                drawBehind: true,
                                visible: false,
                            }
                        }
                    }
                ]
            }
        }
    });
}