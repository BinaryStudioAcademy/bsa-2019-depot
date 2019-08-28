/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import { store } from './app/store';
import Root from './app/containers/Root';
import { name as appName } from './app.json';

const App = () => <Root store={store} />;

AppRegistry.registerComponent(appName, () => App);
