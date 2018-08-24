import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Segment, Button, Text } from 'native-base';
import global from '../../../global';

export default class CouponSegment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment style={styles.segment}>
                <Button style={styles.segmentButton} first active={this.props.active == "1"} onPress={() => this.props.navigation.navigate('CouponList')}>
                    <Text style={styles.segmentText}>{global.translate('coupon')}</Text>
                </Button>
                <Button style={styles.segmentButton} last active={this.props.active == "2"} onPress={() => this.props.navigation.navigate('MyCoupon')}>
                    <Text style={styles.segmentText}>{global.translate('my_coupon')}</Text>
                </Button>
            </Segment>
        );
    }
}

const styles = StyleSheet.create({
    segment: {
        backgroundColor: global.primaryColor
    },
    segmentButton: {
        borderColor: 'white',
    },
    segmentText: {
        color: 'white'
    }
})