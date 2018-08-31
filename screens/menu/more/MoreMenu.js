import React, { Component } from 'react';
import {
    StyleSheet,
    AsyncStorage,
    Text,
    StatusBar
} from 'react-native';
import {
    Container,
    Content,
    ListItem,
    Left,
    Right,
    Button,
    Icon,
    Body
} from 'native-base';
import Ripple from 'react-native-material-ripple';

import HeaderCustom from '../../components/HeaderCustom';

import global from '../../../global';
import axios from 'axios';

const ListMenu = ({ iconName, title, navigation, navTarget }) => {
    return (
        <Ripple onPress={() => navigation.navigate(navTarget)}>
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#007AFF" }}>
                        <Icon type="MaterialCommunityIcons" name={iconName} />
                    </Button>
                </Left>
                <Body>
                    <Text>{title}</Text>
                </Body>
                <Right>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
        </Ripple>
    );
}

export default class More extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internetStatus: 0,
            data: [],
            listMenus: [
                { icon: 'account-circle', title: global.translate('profile'), navTarget: 'Profile' },
                { icon: 'car-side', title: global.translate('my_car'), navTarget: 'MyCar' },
                { icon: 'garage', title: global.translate('store'), navTarget: 'Profile' },
                { icon: 'help-circle', title: global.translate('help'), navTarget: 'Profile' },
            ]
        }
    }

    componentWillMount() {
        this._getData();
    }

    _getData = async () => {
        await AsyncStorage.getItem('userToken').then(token => {
            axios({
                method: 'get',
                url: global.baseUrl + 'api/v1/my-events',
                headers: {
                    'Authorization': 'bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                this.setState({ internetStatus: 1, data: response.data.data });
            }).catch(error => {
                this.setState({ internetStatus: 2 });
            });
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <Content>
                    {this.state.listMenus.map((menu, index) => {
                        return <ListMenu navigation={this.props.navigation} key={index} title={menu.title} iconName={menu.icon} navTarget={menu.navTarget}/>
                    })}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    eventItem: {
        marginBottom: 10
    },
    eventWrapper: {
        backgroundColor: 'white',
        borderRadius: global.borderRadius,
        borderColor: global.borderColor,
        borderWidth: global.borderWidth
    },
    eventDate: {
        height: 30,
        backgroundColor: '#fdfdfd',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: global.borderColor,
        borderBottomWidth: global.borderWidth
    },
    eventDateText: {
        color: global.fontColor,
        fontSize: 14,
        fontWeight: 'bold'
    },
    eventContent: {
        padding: 10
    },
    eventTitle: {
        fontSize: 16,
        color: global.primaryColor,
        fontWeight: 'bold'
    },
    eventLocation: {
        color: global.fontColor,
        fontSize: 14
    }
});