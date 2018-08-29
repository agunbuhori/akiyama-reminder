import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import { 
    Container, 
    Content, 
    Button, 
    Icon,
    Tab, 
    Tabs, 
    ScrollableTab 
} from 'native-base';
import Image from 'react-native-scalable-image';
import Modal from 'react-native-modal';
import Ripple from 'react-native-material-ripple';

import HeaderCustom from '../../components/HeaderCustom';
import CouponSegment from './ScheduleSegment';

import global from '../../../global';
import axios from 'axios';

import Loading from '../../status/Loading';
import Error from '../../status/Error';

export default class MyBooking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internetStatus: 0,
            data: [],
            refreshing: false,
            isModalVisible: false,
            selectedData: {}
        }
    }

    componentWillMount() {
        this._getData();
    }

    _getData = async () => {
        await AsyncStorage.getItem('userToken').then(token => {
            if (token !== null)
                axios({
                    method: 'get',
                    url: global.baseUrl + 'api/v1/my-schedules',
                    headers: {
                        'Authorization': 'bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    this.setState({ internetStatus: 1, data: response.data, refreshing: false });
                    // alert(JSON.stringify(response.data));
                }).catch(error => {
                    this.setState({ internetStatus: 2, refreshing: false });
                });
        });
    }

    _renderView() {
        switch (this.state.internetStatus) {
            case 0:
                return <Loading />
                break;
            case 1:

                return (
                    <View></View>
                );
                break;
            case 2:
                return <Error />
        }
    }



    render() {
        return (
            <Container style={styles.container}>
                <HeaderCustom title={global.translate('schedule')} />
                <CouponSegment navigation={this.props.navigation} active="2" />


            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    content: {

    },
    periodeItem: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: global.borderRadius,
        backgroundColor: 'white',
        borderWidth: global.borderWidth,
        borderColor: global.borderColor,
        flexDirection: 'row'
    },
    periodeNumberDate: {
        width: '20%',
        paddingRight: 10,
        borderRightWidth: 1,
        borderRightColor: global.borderColor
    },
    periodeNumber: {
        height: 25,
        backgroundColor: global.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: global.borderRadius,
        borderTopRightRadius: global.borderRadius
    },
    periodeNumberText: {
        color: 'white',
        fontWeight: 'bold'
    },
    periodeDate: {
        height: 25,
        backgroundColor: global.primaryColorLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: global.borderRadius,
        borderBottomRightRadius: global.borderRadius,
    },
    periodeDateText: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    periodeServices: {
        width: '80%',
        paddingLeft: 10,
    }
});