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
                <Button onPress={() => this.props.navigation.navigate('Maintenance')} first style={[styles.segmentButton, styles.segmentButtonFirst, this.props.active == 1 ? styles.activeSegment : {}]}>
                    <Text style={[styles.segmentText, this.props.active == 1 ? styles.activeSegmentText : {}]}>{global.translate('maintenance')}</Text>
                </Button>
                <Button onPress={() => this.props.navigation.navigate('MyBooking')} style={[styles.segmentButton, styles.segmentButtonSecond, this.props.active == 2 ? styles.activeSegment : {}]}>
                    <Text style={[styles.segmentText, this.props.active == 2 ? styles.activeSegmentText : {}]}>{global.translate('my_booking')}</Text>
                </Button>
                <Button onPress={() => this.props.navigation.navigate('History')} last style={[styles.segmentButton, styles.segmentButtonLast, this.props.active == 3 ? styles.activeSegment : {}]}>
                    <Text style={[styles.segmentText, this.props.active == 3 ? styles.activeSegmentText : {}]}>{global.translate('history')}</Text>
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
        backgroundColor: global.secondaryColor,
        width: (global.windowWidth - 20) / 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: global.primaryColorDark,
    },
    segmentText: {
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    segmentButtonFirst: {
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
    },
    segmentButtonSecond: {

    },
    segmentButtonLast: {
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
    },
    activeSegment: {
        backgroundColor: '#fff'
    },
    activeSegmentText: {
        color: global.primaryColor
    },
})