import React from 'react';
import { createStackNavigator } from 'react-navigation';
import global from '../../global';
import transition from 'agunbuhori-rn-transition';

import MoreMenu from './more/MoreMenu';
import Profile from './more/Profile';

getNavigationOptions = (translate) => {
    return {
        title: global.translate(translate),
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: global.primaryColor,
            borderBottomColor: global.primaryColorDark
        }
    }
}

const More = createStackNavigator({
    MoreMenu: { screen: MoreMenu, navigationOptions: getNavigationOptions('more') },
    Profile: { screen: Profile, navigationOptions: getNavigationOptions('profile') }
        
}, {
    transitionConfig: transition
});

export default More;