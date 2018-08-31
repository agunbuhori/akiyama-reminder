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

export default class Maintenance extends Component {
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
                    url: global.baseUrl + 'api/v1/my-histories',
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

    handleRefresh = () => {
        this._getData();
    }

    _renderView() {
        switch (this.state.internetStatus) {
            case 0:
                return <Loading />
                break;
            case 1:

                return (
                    <Content>
                        {this.state.data.map((year, index) => {
                            return (
                                <View key={index}>
                                    <View style={styles.year}>
                                        <Text style={styles.yearText}>{global.formatYear(year.year)}</Text>
                                    </View>

                                    <FlatList
                                        data={year.periodes}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={(periode, index) =>
                                            <Ripple style={[styles.periodeItem, { marginTop: parseInt(periode.index) == 0 ? 10 : 0 }]}>
                                                <View style={styles.periodeNumberDate}>
                                                    <View style={styles.periodeNumber}>
                                                        <Text style={styles.periodeNumberText}>{periode.item.periode + global.translate("periode_text")}</Text>
                                                    </View>
                                                    <View style={styles.periodeDate}>
                                                        <Text style={styles.periodeDateText}>{global.formatDateMonth(periode.item.date)}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.periodeServices}>
                                                    {periode.item.services.map((service, index) => {
                                                        return <Text style={styles.serviceText} key={index}>{'\u2022'} {service}</Text>
                                                    })}
                                                </View>
                                            </Ripple>
                                        }
                                    />
                                </View>
                            )
                        })}
                        
                    </Content>
                    
                );
                break;
            case 2:
                return <Error />
        }
    }

    takeCoupon = async (couponId) => {
        await AsyncStorage.getItem('userToken').then(token => {
            if (token !== null)
                axios({
                    method: 'post',
                    url: global.baseUrl + 'api/v1/get-coupon',
                    data: JSON.stringify({ id: couponId }),
                    headers: {
                        'Authorization': 'bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }).then(response => {
                    this.handleRefresh();
                }).catch(error => {
                    this.setState({ internetStatus: 2, refreshing: false });
                });
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <HeaderCustom title={global.translate('schedule')} />
                <CouponSegment navigation={this.props.navigation} active="3" />

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
    periodeItem: {
        padding: 10,
        marginLeft: 10,
        overflow: 'hidden',
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
        backgroundColor: global.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: global.borderRadius,
        borderTopRightRadius: global.borderRadius
    },
    periodeNumberText: {
        color: 'white',
        fontWeight: 'bold'
    },
    year: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    yearText: {
        color: '#666',
        fontSize: 20,
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
        fontWeight: 'bold',
        color: global.primaryColorDark
    },
    periodeServices: {
        width: '80%',
        paddingLeft: 10,
    },
    serviceText: {
        color: global.fontColor,
        fontSize: 14,
        fontWeight: 'bold'
    }
});