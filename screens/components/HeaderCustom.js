import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { Header, Body, Title, Left, Button } from 'native-base';
import global from '../../global';

export default class HeaderCustom extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Header hasSegment style={styles.header}>
                <StatusBar barStyle="light-content" backgroundColor={global.primaryColor}/>
                <Body>
                    <Title style={{color: 'white'}}>{this.props.title}</Title>
                </Body>
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: global.primaryColor
    }
})