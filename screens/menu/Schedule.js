import React from 'react';
import { StyleSheet } from 'react-native';
import { createSwitchNavigator } from 'react-navigation'

import Maintenance from './schedule/Maintenance';
import MyBooking from './schedule/MyBooking';

const Schedule = createSwitchNavigator({
    Maintenance: { screen: Maintenance },
    MyBooking: { screen: MyBooking },
}, {
    tabBarOptions: {
        lazy: false
    }
});

export default Schedule;