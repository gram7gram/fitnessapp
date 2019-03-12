// @flow

import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {Colors} from 'react-native-ui-lib';

import store from '../store';

import LocaleProvider from '../context/LocaleProvider';
import ThemeProvider from '../context/ThemeProvider';

import Landing from '../pages/LandingPage/components';
import Training from '../pages/TrainingPage/components';
import Exercise from '../pages/ExercisePage/components';
import Workout from '../pages/WorkoutPage/components';

import * as Pages from './Pages';
import {defaultLocale, defaultTheme} from "../../../app.json";
import i18n from "../i18n";

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
                children: [{
                    component: {
                        name: Pages.LANDING,
                        options: {
                            topBar: {
                                drawBehind: true,
                                visible: false,
                            }
                        }
                    }
                }]
            }
        }
    }).catch((e) => {
        console.error(e);
    });
}

export const navigateToTraining = (referer, training) => {

    console.log('navigateToTraining');

    closeModals()

    Navigation.push(referer, {
        component: {
            name: Pages.TRAINING,
            passProps: {
                training
            },
            options: {
                topBar: {
                    visible: true,
                    drawBehind: false,
                    title: {
                        text: i18n.t('training.title')
                    },
                    rightButtons: [{
                        id: 'training-save',
                        systemItem: 'save',
                        text: i18n.t('training.save'),
                        color: Colors.dark80
                    }]
                }
            }
        }
    }).catch((e) => {
        console.error(e);
    });
}

export const navigateToExercise = (referer, training, workout) => {

    console.log('navigateToExercise');

    closeModals()

    Navigation.showModal({
        stack: {
            children: [{
                component: {
                    name: Pages.EXERCISE,
                    passProps: {
                        training,
                        workout
                    },
                    options: {
                        topBar: {
                            visible: true,
                            drawBehind: false,
                            title: {
                                text: i18n.t('exercise.title')
                            },
                            rightButtons: [{
                                id: 'exercise-search',
                                systemItem: 'search',
                                text: i18n.t('exercise.search'),
                                color: Colors.dark80
                            }]
                        }
                    }
                }
            }]
        }
    }).catch((e) => {
        console.error(e);
    });
}

export const navigateToWorkout = (referer, training, workout) => {

    console.log('navigateToWorkout');

    closeModals()

    Navigation.showModal({
        stack: {
            children: [{
                component: {
                    name: Pages.WORKOUT,
                    passProps: {
                        training,
                        workout
                    },
                    options: {
                        topBar: {
                            visible: true,
                            drawBehind: false,
                            title: {
                                text: i18n.t('workout.title')
                            },
                            rightButtons: [{
                                id: 'workout-save',
                                systemItem: 'search',
                                text: i18n.t('workout.save'),
                                color: Colors.dark80
                            }]
                        }
                    }
                }
            }]
        }
    }).catch((e) => {
        console.error(e);
    });
}

export const navigateToLanding = (referer) => {

    console.log('navigateToLanding');

    closeModals()

    Navigation.popToRoot(referer).catch((e) => {
        console.error(e);
    });
}

export const closeModals = () => {
    Navigation.dismissAllModals().catch(() => {
    })
}