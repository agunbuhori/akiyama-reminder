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
                    url: global.baseUrl + 'api/v1/my-book',
                    headers: {
                        'Authorization': 'bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    console.log(response.data);
                    this.setState({ internetStatus: 1, data: response.data, refreshing: false });
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
                    <View>
                        <View style={styles.booking}>
                            <View style={styles.bookingPeriod}>
                                <Text style={styles.bookingPeriodText}>{this.state.data.periode+global.translate('periode_text')}</Text>
                            </View>

                            <View style={styles.bookingDesc}>
                                <View style={styles.bookingDate}>
                                    <Text style={styles.bookingDateText}>{global.formatDate(this.state.data.date)+" "+global.formatTime(this.state.data.time)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.booking2}>
                            <View style={styles.bookingStore}>
                                <Text style={styles.bookingStoreText}>{this.state.data.store}</Text>
                            </View>
                            <View style={styles.bookingService}>
                                {this.state.data.services.map((service, index) => {
                                    return <Text key={index} style={styles.serviceText}>{'\u2022'} {service}</Text>
                                })}
                            </View>
                        </View>
                    </View>
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

                {this._renderView()}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    booking: {
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        marginBottom: 0,
        flexDirection: 'row',
        borderColor: global.borderColor,
        borderWidth: global.borderWidth
    },
    booking2: {
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        marginBottom: 0,
        borderColor: global.borderColor,
        borderWidth: global.borderWidth
    },
    bookingPeriod: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.secondaryColor,
        width: '25%'
    },
    bookingPeriodText: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'white'
    },
    bookingDesc: {
        width: '75%',
        padding: 15,
        backgroundColor: 'white'
    },
    bookingDateText: {
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: global.primaryColor
    },
    bookingStore: {
        height: 40,
        width: '100%',
        backgroundColor: '#fdfdfd',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: global.borderWidth,
        borderBottomColor: global.borderColor
    },
    bookingStoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: global.fontColor
    },
    bookingService: {
        padding: 10,
        backgroundColor: '#fff',
        width: '100%'
    },
    serviceText: {
        fontSize: 14,
        fontWeight: 'bold'
    }

});