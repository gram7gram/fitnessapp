import {AppRegistry} from 'react-native';
import App from './app/src/App';

import {name} from './app.json';

console.log('boot', name);

AppRegistry.registerComponent(name, () => App);