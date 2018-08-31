import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'native-base';
import global from '../../global';

import Home from './Home';
import Event from './Event';
import Coupon from './Coupon';
import Schedule from './Schedule';
import More from './More';

const MenuIcon = (props) => ({
    render() {
        return <Icon type="Feather" name={this.props.icon} style={[{ color: this.props.tintColor }, styles.bottomTabIcon]} />
    }
});

const MenuNavigator = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: global.translate('home'),
            tabBarIcon: ({ tintColor }) => (
                <MenuIcon tintColor={tintColor} icon="home"/>
            )
        }
    },
    Event: {
        screen: Event,
        navigationOptions: {
            tabBarLabel: global.translate('event'),
            tabBarIcon: ({ tintColor }) => (
                <MenuIcon tintColor={tintColor} icon="credit-card" />
            )
        }
    },
    Coupon: {
        screen: Coupon,
        navigationOptions: {
            tabBarLabel: global.translate('coupon'),
            tabBarIcon: ({ tintColor }) => (
                <MenuIcon tintColor={tintColor} icon="star" />
            )
        }
    },
    Schedule: {
        screen: Schedule,
        navigationOptions: {
            tabBarLabel: global.translate('schedule'),
            tabBarIcon: ({ tintColor }) => (
                <MenuIcon tintColor={tintColor} icon="calendar" />
            )
        }
    },
    More: {
        screen: More,
        navigationOptions: {
            tabBarLabel: global.translate('more'),
            tabBarIcon: ({ tintColor }) => (
                <MenuIcon tintColor={tintColor} icon="menu" />
            )
        }
    },
}, {
    tabBarOptions: {
        activeTintColor: global.secondaryColor,
        
    }
});


const styles = StyleSheet.create({
    bottomTabIcon: {
        fontSize: 24
    }
});

export default MenuNavigator;