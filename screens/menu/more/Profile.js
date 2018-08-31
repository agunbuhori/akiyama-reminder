import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, FlatList, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';

import global from '../../../global';
import axios from 'axios';

import Loading from '../../status/Loading';
import Error from '../../status/Error';

const ProfileItem = ({label, value}) => {
    return (
        <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>{label}</Text>
            <Text style={styles.profileValue}>{value}</Text>
        </View>
    );
}

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internetStatus: 0,
            data: {},
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
                    url: global.baseUrl + 'api/v1/get-profile',
                    headers: {
                        'Authorization': 'bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    this.setState({ internetStatus: 1, data: response.data, refreshing: false });
                }).catch(error => {
                    this.setState({ internetStatus: 2, refreshing: false });
                });
        });
    }

    handleRefresh = () => {
        this._getData();
    }

    getGender(gender) {
        return gender === 'man' ? global.translate('male') : global.translate('female');
    }

    _renderView() {
        switch(this.state.internetStatus) {
            case 0:
                return <Loading/>
                break;
            case 1:
                return (
                    <Content>
                        <View style={styles.profile}>
                            <Image style={styles.profileImg} source={require('../../../assets/images/user.png')} />
                        
                            <ProfileItem label={global.translate('username')} value={this.state.data.username}/>
                            <ProfileItem label={global.translate('fullname')} value={this.state.data.fullname}/>
                            <ProfileItem label={global.translate('gender')} value={this.getGender(this.state.data.gender)}/>
                            <ProfileItem label={global.translate('birthday')} value={global.formatDate(this.state.data.birthday)}/>
                            <ProfileItem label={global.translate('address')} value={this.state.data.address}/>
                            <ProfileItem label={global.translate('car_type')} value={this.state.data.car_type}/>
                            <ProfileItem label={global.translate('buy_date')} value={global.formatDate(this.state.data.date_buy)}/>
                        </View>
                    </Content>
                );
                break;
            case 2:
                return <Error/>
                break;
        }
    }

    render() {
        return (
            <Container style={styles.container}>
            
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
    profile: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
    profileImg: {
        width: 100,
        height: 100,
        marginBottom: 15
    },
    profileItem: {
        width: '100%',
        padding: 10,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: global.borderColor
    },
    profileLabel: {
        color: '#666'
    },
    profileValue: {
        color: global.fontColor,
        fontWeight: 'bold',
        fontSize: 16
    }
})