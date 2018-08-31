import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    Text,
    FlatList
} from 'react-native';
import { Container, Content } from 'native-base';
import Image from 'react-native-scalable-image';

import HeaderCustom from '../components/HeaderCustom';

import global from '../../global';
import axios from 'axios';

import Loading from '../status/Loading';
import Error from '../status/Error';

export default class Event extends Component {
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
            axios({
                method: 'get',
                url: global.baseUrl + 'api/v1/my-events',
                headers: {
                    'Authorization': 'bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                this.setState({ internetStatus: 1, data: response.data.data, refreshing: false });
            }).catch(error => {
                this.setState({ internetStatus: 2 });
            });
        });
    }

    handleRefresh = () => {
        this.setState({ refreshing: true });
        this._getData();
    }

    _renderView() {
        switch (this.state.internetStatus) {
            case 0:
                return <Loading />
                break;
            case 1:
                return (

                        <FlatList
                            data={this.state.data}
                            extraData={this.state}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.handleRefresh()}
                            renderItem={(event) => 
                                <View style={[styles.eventItem, {marginTop: event.index == 0 ? 10 : 0}]}>
                                    <View style={styles.eventWrapper}>
                                        <Image width={global.windowWidth - 20} source={{ uri: event.item.picture }} />
                                        <View style={styles.eventDate}>
                                            <Text style={styles.eventDateText}>{event.item.date}</Text>
                                        </View>
                                        <View style={styles.eventContent}>
                                            <Text style={styles.eventTitle}>{event.item.name}</Text>
                                            <Text style={styles.eventLocation}>{event.item.location}</Text>
                                        </View>
                                    </View>
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                );
                break;
            case 2:
                return <Error />
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <HeaderCustom title={global.translate('event')}/>
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
    eventItem: {
        
    },
    eventWrapper: {
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: global.borderColor,
        borderWidth: global.borderWidth,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    eventDate: {
        height: 30,
        backgroundColor: '#fdfdfd',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: global.borderColor,
        borderBottomWidth: global.borderWidth
    },
    eventDateText: {
        color: global.fontColor,
        fontSize: 14,
        fontWeight: 'bold'
    },
    eventContent: {
        padding: 10
    },
    eventTitle: {
        fontSize: 16,
        color: global.primaryColor,
        fontWeight: 'bold'
    },
    eventLocation: {
        color: global.fontColor,
        fontSize: 14
    }
});