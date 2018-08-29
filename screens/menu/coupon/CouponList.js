import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, FlatList, Image } from 'react-native';
import { Container, Content, Button } from 'native-base';

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
                            numColumns={2}
                            extraData={this.state}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                            renderItem={(coupon, index) =>
                                <View style={[styles.couponItem]}>
                                    <View style={styles.touchableCupon}>
                                        <View style={styles.imageWrapper}>
                                            <Image style={styles.couponImage} source={{ uri: coupon.item.picture }} />
                                        </View>

                                        <View style={styles.couponContent}>
                                            <Text style={styles.couponName}>{coupon.item.name}</Text>
                                            <Text style={styles.couponDesc}>{coupon.item.desc}</Text>
                                        </View>

                                        <View style={styles.couponButton}>
                                            <Button block small primary onPress={() => this.takeCoupon(coupon.item.id)}>
                                                <Text style={styles.getButtonText}>{global.translate('take')}</Text>
                                            </Button>
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
                <HeaderCustom title={global.translate('coupon')} />
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
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5
    },
    couponItem: {
        marginBottom: 10,
        width: global.windowWidth / 2 - 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    couponImage: {
        width: '100%',
        height: 80
    },
    touchableCupon: {
        backgroundColor: 'white',
        padding: 10,
        borderWidth: global.borderWidth,
        borderColor: global.borderColor,
        borderRadius: 10,
    },
    imageWrapper: {
        width: '100%' - 20
    },
    couponContent: {
        marginTop: 10,
        height: 60
    },
    couponName: {
        fontSize: 14,
        color: global.primaryColor,
        fontWeight: 'bold'
    },
    couponDesc: {
        color: global.fontColor
    },
    couponButton: {
        zIndex: 10
    },
    getButtonText: {
        color: 'white'
    },
    expired: {
        fontSize: 12
    }
})