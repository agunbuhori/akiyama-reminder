import React, { Component } from 'react';
import { 
    StyleSheet, 
    View,
    AsyncStorage,
    Text,
    Image
} from 'react-native';
import { Container, Content } from 'native-base';
import SImage from 'react-native-scalable-image';

import global from '../../global';
import axios from 'axios';

import Loading from '../status/Loading';
import Error from '../status/Error';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internetStatus: 0,
            data: {}
        }
    }

    componentWillMount() {
        this._getData();
    }

    _getData = async() =>  {
        await AsyncStorage.getItem('userToken').then(token => {
            axios({
                method: 'get',
                url: global.baseUrl + 'api/v1/home',
                headers: {
                    'Authorization': 'bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                this.setState({internetStatus: 1, data: response.data});
            }).catch(error => {
                this.setState({internetStatus: 2});
            });
        });
    }

    _renderView() {
        switch (this.state.internetStatus) {
            case 0:
                return <Loading/>
                break;
            case 1:
                return (
                    <View>
                        <SImage width={global.windowWidth - 120} style={styles.carImage} source={{ uri: this.state.data.car }} />
                        <View style={styles.panel}>
                            <View style={styles.nextMaintenance}>
                                <Text style={styles.nextMaintenanceText}>{global.translate('next_maintenance')}</Text>
                                <Text style={styles.nextMaintenanceDate}>{global.formatDate(this.state.data.next_schedule)}</Text>
                            </View>

                            <View style={styles.contact}>
                            </View>
                        </View>
                    </View>
                );
                break;
            case 2:
                return <Error/>
        }
    }

    _renderBackgroundImage() {
        if (this.state.internetStatus === 1)
            return <Image height={global.windowHeight} style={styles.backgroundImage} source={{ uri: this.state.data.background }} />;
                
    }
    

    render() {
        return (
            <Container>
                {this._renderBackgroundImage()}
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
    backgroundImage: {
        width: global.windowWidth,
        height: '100%'
    },
    carImage: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 5,
    },
    panel: {
        borderRadius: 10,
        width: global.windowWidth-30,
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        top: global.statusBarHeight + 10,
        alignSelf: 'center'
    },
    nextMaintenance: {
        padding: 15
    },
    nextMaintenanceText: {

    },
    nextMaintenanceDate: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});