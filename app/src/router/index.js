// @flow

import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {Colors, Typography} from 'react-native-ui-lib';

import store from '../store';

import LocaleProvider from '../context/LocaleProvider';
import ThemeProvider from '../context/ThemeProvider';

import * as Pages from './Pages';
import {defaultLocale, defaultTheme} from "../../../app.json";
import i18n from "../i18n";
import {Text} from "../pages/LandingPage/components/Rate";

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

    Navigation.registerComponent(Pages.LANDING, () =>
        withStore(require('../pages/LandingPage/components').default));

    Navigation.registerComponent(Pages.TRAINING, () =>
        withStore(require('../pages/TrainingPage/components').default));

    Navigation.registerComponent(Pages.EXERCISE, () =>
        withStore(require('../pages/ExercisePage/components').default));

    Navigation.registerComponent(Pages.EXERCISE_EDIT, () =>
        withStore(require('../pages/ExerciseEditPage/components').default));

    Navigation.registerComponent(Pages.WORKOUT, () =>
        withStore(require('../pages/WorkoutPage/components').default));

    Navigation.registerComponent(Pages.SETTINGS, () =>
        withStore(require('../pages/SettingsPage/components').default));

    Navigation.setDefaultOptions({
        topBar: {
            drawBehind: false,
            visible: true,
            background: {
                color: Colors.themeheader
            },
            title: {
                color: Colors.white,
            },
            backButton: {
                title: '',
                color: Colors.white
            },
            buttonColor: Colors.white,
            rightButtons: {
                color: Colors.white
            }
        },
        statusBar: {
            style: 'dark'
        },
        layout: {
            orientation: ['portrait'],
            backgroundColor: Colors.themebackground,
            color: Colors.white,
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
        console.log(e);
    });
}

export const navigateToSettings = (referer) => {

    console.log('navigateToSettings');

    closeModals()

    Navigation.push(referer, {
        component: {
            name: Pages.SETTINGS,
            options: {
                topBar: {
                    visible: true,
                    drawBehind: false,
                    title: {
                        text: i18n.t('settings.title')
                    }
                }
            }
        }
    }).catch((e) => {
        console.log(e);
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
                        icon: require('../../assets/icons/white/32/check.png'),
                    }]
                }
            }
        }
    }).catch((e) => {
        console.log(e);
    });
}

export const navigateToExercise = (training, workout) => {

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
                                icon: require('../../assets/icons/white/32/search.png'),
                            }]
                        }
                    }
                }
            }]
        }
    }).catch((e) => {
        console.log(e);
    });
}

export const navigateToExerciseEdit = (training, workout) => {

    console.log('navigateToExerciseEdit');

    closeModals()

    Navigation.showModal({
        stack: {
            children: [{
                component: {
                    name: Pages.EXERCISE_EDIT,
                    passProps: {
                        training,
                        workout
                    },
                    options: {
                        topBar: {
                            visible: true,
                            drawBehind: false,
                            title: {
                                text: i18n.t('exercise_edit.title')
                            },
                            rightButtons: [
                                {
                                    id: 'exercise-edit-save',
                                    systemItem: 'save',
                                    icon: require('../../assets/icons/white/32/check.png'),
                                },
                                {
                                    id: 'exercise-edit-cancel',
                                    systemItem: 'cancel',
                                    icon: require('../../assets/icons/white/32/times.png'),
                                }
                            ]
                        }
                    }
                }
            }]
        }
    }).catch((e) => {
        console.log(e);
    });
}

export const navigateToWorkout = (training, workout) => {

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
                                systemItem: 'save',
                                icon: require('../../assets/icons/white/32/check.png'),
                            }]
                        }
                    }
                }
            }]
        }
    }).catch((e) => {
        console.log(e);
    });
}

export const navigateToLanding = (referer) => {

    console.log('navigateToLanding');

    closeModals()

    Navigation.popToRoot(referer).catch((e) => {
        console.log(e);
    });
}

export const closeModals = () => {
    Navigation.dismissAllModals().catch(() => {
    })
}