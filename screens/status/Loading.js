import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Container } from 'native-base';
import global from '../../global';

export default class Loading extends Component {
    render() {
        return (
            <Container style={styles.container}>
                <ActivityIndicator color={global.secondaryColor} size="large"/>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    } 
});