import React from 'react';
import { StyleSheet } from 'react-native';
import { createSwitchNavigator } from 'react-navigation'

import Maintenance from './schedule/Maintenance';
import MyBooking from './schedule/MyBooking';
import History from './schedule/History';

const Schedule = createSwitchNavigator({
    Maintenance: { screen: Maintenance },
    MyBooking: { screen: MyBooking },
    History: { screen: History },
}, {
    tabBarOptions: {
        lazy: false
    }
});

export default Schedule;