import React from 'react';
import { StyleSheet } from 'react-native';
import { createSwitchNavigator } from 'react-navigation'

import CouponList from './coupon/CouponList';
import MyCoupon from './coupon/MyCoupon';

const Coupon = createSwitchNavigator({
    CouponList: { screen: CouponList, navigationOptions: {
        
    }},
    MyCoupon: {screen: MyCoupon, navigationOptions: {
        
    }},
}, {
    tabBarOptions: {
        lazy: false
    }
});

export default Coupon;