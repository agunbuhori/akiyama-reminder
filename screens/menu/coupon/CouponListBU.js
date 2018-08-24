import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, FlatList } from 'react-native';
import { Container, Content, Button } from 'native-base';
import Image from 'react-native-scalable-image';

import HeaderCustom from '../../components/HeaderCustom';
import CouponSegment from './CouponSegment';

import global from '../../../global';
import axios from 'axios';

import Loading from '../../status/Loading';
import Error from '../../status/Error';

export default class CouponList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internetStatus: 0,
            data: [],
            refreshing: false
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
                    url: global.baseUrl + 'api/v1/list-coupons',
                    headers: {
                        'Authorization': 'bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    this.setState({ internetStatus: 1, data: response.data.data, refreshing: false });
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
                    <Content style={styles.content}>
                        <FlatList
                            data={this.state.data}
                            extraData={this.state}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                            renderItem={(coupon) => 
                                <View style={styles.couponItem}>
                                    <View style={styles.touchableCupon}>
                                        <View style={styles.imageWrapper}>
                                            <Image width={(global.windowWidth - 20) - ((global.windowWidth - 20)*80/100)} source={{uri: coupon.item.picture}}/>
                                        </View>

                                        <View style={styles.couponContent}>
                                            <Text style={styles.couponName}>{coupon.item.name}</Text>
                                            <Text style={styles.couponDesc}>{coupon.item.desc}</Text>
                                        </View>

                                        <View style={styles.couponButton}>
                                            <Button block rounded small primary onPress={() => this.takeCoupon(coupon.item.id)}>
                                                <Text style={styles.getButtonText}>{global.translate('take')}</Text>
                                            </Button>
                                            <Text style={styles.couponQuota}>残りの{coupon.item.quota}</Text>
                                        </View>
                                    </View>
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </Content>
                );
                break;
            case 2:
                return <Error />
        }
    }

    takeCoupon = async(couponId) => {
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
                    console.log(error)
                });
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <HeaderCustom title="Coupon List" />
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
        padding: 10
    },
    couponItem: {
        marginBottom: 10,
    },
    touchableCupon: {
        backgroundColor: 'white',
        padding: 10,
        borderWidth: global.borderWidth,
        borderColor: global.borderColor,
        borderRadius: global.borderRadius,
        flexDirection: 'row'
    },
    imageWrapper: {
        width: '25%'
    },
    couponContent: {
        width: '55%',
    },
    couponName: {
        fontSize: 16,
        color: global.primaryColor,
        fontWeight: 'bold'
    },
    couponDesc: {
        color: global.fontColor
    },
    couponButton: {
        width: '20%',
        zIndex: 10,
        alignItems: 'center'
    },
    getButtonText: {
        color: 'white'
    },
    couponQuota: {
        fontSize: 10,
        marginTop: 3
    }
})