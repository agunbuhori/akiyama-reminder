import React, { Component } from 'react';
import { 
    StyleSheet, 
    View,
    AsyncStorage,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { Container, Content, Icon } from 'native-base';
import SImage from 'react-native-scalable-image';
import Ripple from 'react-native-material-ripple';

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
                        <Image height={global.windowHeight} style={styles.backgroundImage} source={{ uri: this.state.data.background }} />
                        <SImage width={global.windowWidth - 120} style={styles.carImage} source={{ uri: this.state.data.car }} />
                        <View style={styles.panel}>
                            <View style={styles.nextMaintenance}>
                                <Text style={styles.nextMaintenanceText}>{global.translate('next_maintenance')}</Text>
                                <Text style={styles.nextMaintenanceDate}>{global.formatDate(this.state.data.next_schedule)}</Text>
                            </View>

                            <Ripple style={styles.contact} onPress={() => this.props.navigation.navigate('Reservation')}>
                                <Icon type="Feather" name="phone"/>
                                <Text style={{fontSize: 10, marginTop: 5}}>{global.translate('booking_now')}</Text>
                            </Ripple>
                        </View>
                    </View>
                );
                break;
            case 2:
                return <Error/>
        }
    }
    
    render() {
        return (
            <Container>
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
        alignSelf: 'center',
        zIndex: 99,
        flexDirection: 'row',
        overflow: 'hidden'
    },
    nextMaintenance: {
        padding: 15,
        width: '75%'
    },
    contact: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0.5,
        borderLeftColor: global.borderColor,
    },
    nextMaintenanceText: {

    },
    nextMaintenanceDate: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});