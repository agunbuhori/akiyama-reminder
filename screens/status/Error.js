import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator, Image, Text } from 'react-native';
import { Container } from 'native-base';
import global from '../../global';

export default class Error extends Component {
    render() {
        return (
            <Container style={styles.container}>
                <Image style={styles.sadCar} source={require('../../assets/images/sad_car.png')}/>
                <Text style={styles.errorText}>インターネットエラー</Text>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sadCar: {
        width: 300,
        height: 200,
        resizeMode: 'contain'
    },
    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#888'
    }
});