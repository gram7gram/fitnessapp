import {Navigation} from 'react-native-navigation';
import {createRouter} from './router';

Navigation.events()
    .registerAppLaunchedListener(createRouter);