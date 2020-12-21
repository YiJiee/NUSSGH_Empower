/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {handler, configure} from "./components/notification/PushNotifHandler";

configure(handler);

AppRegistry.registerComponent(appName, () => App);
