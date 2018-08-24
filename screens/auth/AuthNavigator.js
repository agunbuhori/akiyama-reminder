import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Login from './Login';

const AuthNavigator = createStackNavigator({
    Login: {screen: Login}
})

AuthNavigator.navigationOptions = ({ navigation }) => ({
    header: null
});

export default AuthNavigator;