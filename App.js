import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import transition from 'agunbuhori-rn-transition';

import MenuNavigator from './screens/menu/MenuNavigator';
import AuthNavigator from './screens/auth/AuthNavigator';
import Reservation from './screens/menu/Reservation';

import global from './global';

const StackNavigator = createStackNavigator({
  Auth: {screen: AuthNavigator, navigationOptions: {header: null}},
  Menu: {screen: MenuNavigator, navigationOptions: {header: null}},
  Reservation: {screen: Reservation, navigationOptions: {
    title: global.translate('reservation'),
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: global.primaryColor,
      borderBottomColor: global.primaryColorDark
    }
  }}
}, {
  transitionConfig: transition
});

StackNavigator.navigationOptions = ({navigation}) => ({
  header: null
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={global.primaryColor}/>
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
