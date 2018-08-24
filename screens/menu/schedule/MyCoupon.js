import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';
import Image from 'react-native-scalable-image';
import Modal from 'react-native-modal';
import Ripple from 'react-native-material-ripple';

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
                    url: global.baseUrl + 'api/v1/my-coupons',
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
                                    <Ripple style={styles.touchableCupon} onPress={() => this.setState({isModalVisible: true, selectedData: coupon.item})}>
                                        <View style={styles.imageWrapper}>
                                            <Image width={(global.windowWidth - 20) - ((global.windowWidth - 20) * 75 / 100)} source={{ uri: coupon.item.picture }} />
                                        </View>

                                        <View style={styles.couponContent}>
                                            <Text style={styles.couponName}>{coupon.item.name}</Text>
                                            <Text style={styles.couponDesc}>{coupon.item.desc}</Text>
                                            <Text style={styles.couponExpired}>{global.formatDate(coupon.item.date_expired)+global.translate('expired')}</Text>
                                        </View>
                                    </Ripple>
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
                <HeaderCustom title={global.translate('my_coupon')} />
                <CouponSegment navigation={this.props.navigation} active="2" />

                <Modal 
                isVisible={this.state.isModalVisible} 
                onBackdropPress={() => this.setState({isModalVisible: false})}>
                    <View style={styles.lightBox}>
                        <Image style={styles.couponImage} width={global.windowWidth-38} source={{uri: this.state.selectedData.picture}}/>
                        <View style={styles.lightBoxContent}>
                            <Text style={styles.lightBoxTitle}>{this.state.selectedData.name}</Text>
                            <Text>{this.state.selectedData.desc}</Text>
                        </View>

                        <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })} style={styles.closeButton}>
                            <Icon type="Feather" name="x-circle" style={{color: 'white'}}/>
                        </TouchableOpacity>
                    </View>
                </Modal>

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
        width: '30%'
    },
    couponContent: {
        width: '70%',
    },
    couponName: {
        fontSize: 16,
        color: global.primaryColor,
        fontWeight: 'bold'
    },
    couponDesc: {
        color: global.fontColor
    },
    couponExpired: {
        fontSize: 12,
        color: 'green'
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
    },
    couponImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: global.borderRadius,
        borderTopRightRadius: global.borderRadius,
    },
    lightBox: {
        backgroundColor: 'white',
        borderRadius: global.borderRadius
    },
    lightBoxContent: {
        padding: 15
    },
    lightBoxTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: global.primaryColor
    },
    closeButton: {
        position: 'absolute',
        right: 5,
        top: 5,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.primaryColor,
        borderRadius: 20
    }
})