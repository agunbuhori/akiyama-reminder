import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, FlatList } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';
import Image from 'react-native-scalable-image';
import Ripple from 'react-native-material-ripple';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

import global from '../../../global';
import axios from 'axios';

import Loading from '../../status/Loading';
import Error from '../../status/Error';

const progressCustomStyles = {
    backgroundColor: global.primaryColor,
    borderRadius: 10,
    borderColor: global.primaryColor,
    height: 10,
    borderWidth: 2,
    width: global.windowWidth - 165
};


export default class MyCar extends Component {
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
                    url: global.baseUrl + 'api/v1/my-car',
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
        switch (this.state.internetStatus) {
            case 0:
                return <Loading />
                break;
            case 1:
                return (
                    <Container style={styles.container}>
                        <Image width={global.windowWidth} source={require('../../../assets/images/background.png')}/>
                        <Image style={styles.carImage} width={global.windowWidth-200} source={{uri: this.state.data.images}}/>

                        <Button style={styles.backButton} rounded onPress={() => this.props.navigation.goBack()}>
                            <Icon type="Entypo" name="chevron-with-circle-left"/>
                        </Button>
                    
                            <FlatList
                                data={this.state.data.services}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(service, index) =>
                                    <Ripple style={[styles.serviceItem, { marginTop: parseInt(service.index) == 0 ? 10 : 0 }]}>
                                        <View style={styles.icon}>
                                            <Icon type="Entypo" name={service.item.icon} style={{color: 'white'}}/>
                                        </View>
                                        <View style={styles.serviceName}>
                                            <Text style={styles.serviceNameText}>{service.item.name}</Text>
                                            <ProgressBarAnimated
                                                {...progressCustomStyles}
                                                barAnimationDuration={1000}
                                                value={parseInt(service.item.percent)}
                                            />
                                        </View>
                                    </Ripple>
                                }
                            />
                    </Container>
                );
                break;
            case 2:
                return <Error />
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
    carImage: {
        alignSelf: 'center',
        position: 'absolute',
        top: 95
    },
    myCar: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.primaryColor,

    },
    myCarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    serviceItem: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: global.borderColor,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 10,
        flexDirection: 'row'
    },
    icon: {
        width: '20%',
        backgroundColor: global.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    serviceName: {
        width: '80%',
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    serviceNameText: {
        fontSize: 14,
        marginBottom: 5,
        color: global.fontColor,
        fontWeight: 'bold'
    },
    backButton: {
        top: global.statusBarHeight + 10,
        left: 10,
        position: 'absolute'
    }
})