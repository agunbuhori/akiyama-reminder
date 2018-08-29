import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import { createSwitchNavigator } from 'react-navigation';

import MenuNavigator from './screens/menu/MenuNavigator';
import AuthNavigator from './screens/auth/AuthNavigator';

import global from './global';

const StackNavigator = createSwitchNavigator({
  Menu: {screen: MenuNavigator},
  Auth: {screen: AuthNavigator},
});

StackNavigator.navigationOptions = ({navigation}) => ({
  header: null
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar style={{backgroundColor: global.primaryColor}}/>
        <StackNavigator/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff3f6',
  },
});
