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
                    <Tabs renderTabBar={() => <ScrollableTab />}>
                        {
                            this.state.data.map((year, index) => {
                                return (
                                    <Tab heading={global.formatYear(year.year)} key={index} style={{backgroundColor: 'transparent'}}>
                                        <FlatList
                                            data={year.periodes}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={(periode, index) => 
                                                <Ripple style={[styles.periodeItem, {marginTop: parseInt(periode.index) == 0 ? 10 : 0}]}>
                                                    <View style={styles.periodeNumberDate}>
                                                        <View style={styles.periodeNumber}>
                                                            <Text style={styles.periodeNumberText}>{periode.item.periode+global.translate("periode_text")}</Text>
                                                        </View>
                                                        <View style={styles.periodeDate}>
                                                            <Text style={styles.periodeDateText}>{global.formatDateMonth(periode.item.date)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.periodeServices}></View>
                                                </Ripple>
                                            }
                                        />
                                    </Tab>
                                );
                            })
                        }
                    </Tabs>
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
                <HeaderCustom title={global.translate('my_coupon')} />
                <CouponSegment navigation={this.props.navigation} active="1" />

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
        borderColor: global.borderColor
    },
    periodeNumberDate: {
        width: '20%',
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
        fontSize: 12,
        fontWeight: 'bold'
    },
    periodeServices: {
        
    }
});