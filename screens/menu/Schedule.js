import React from 'react';
import { StyleSheet } from 'react-native';
import { createSwitchNavigator } from 'react-navigation'

import Maintenance from './schedule/Maintenance';

const Schedule = createSwitchNavigator({
    Maintenance: { screen: Maintenance },
}, {
    tabBarOptions: {
        lazy: false
    }
});

export default Schedule;