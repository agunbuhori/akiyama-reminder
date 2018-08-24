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
                var years = [0, 1, 2, 3, 4, 5, 6, 7];
                var startYear = 2016;
                return (
                    <Tabs renderTabBar={() => <ScrollableTab />}>
                        {
                            this.state.data.map((year, index) => {
                                return (
                                    <Tab heading={global.formatYear(year.year)} key={index} style={{backgroundColor: 'transparent'}}>
                                        <FlatList
                                            data={year.periodes}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={() => 
                                                <View style={styles.periodeItem}></View>
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
        backgroundColor: 'white'
    }
})