import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
} from 'react-native';
import { Container } from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['jp'] = {
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    dayNames: ['日', '月', '火', '水', '木', '金', '土'],
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土']
};

LocaleConfig.defaultLocale = 'jp';

const vacation = { key: 'vacation', color: 'red', selectedDotColor: global.primaryColor };
const massage = { key: 'massage', color: 'blue', selectedDotColor: global.primaryColor };
const workout = { key: 'workout', color: global.primaryColor };


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

    _getData = async () => {
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
                this.setState({ internetStatus: 1, data: response.data });
            }).catch(error => {
                this.setState({ internetStatus: 2 });
            });
        });
    }

    _renderView() {
        switch (this.state.internetStatus) {
            case 0:
                return <Loading />
                break;
            case 1:
                return (
                    <View style={styles.reservation}>
                        
                        <Calendar
                            theme={{
                                
                                textMonthFontWeight: 'bold',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16,
                                textDayFontWeight: 'bold',
                                todayTextColor: global.secondaryColor,
                            }}
                            monthFormat={global.yearMonthFormat}
                            markingType={'custom'}
                            markedDates={{
                                '2018-08-30': {
                                    customStyles: {
                                        container: {
                                            backgroundColor: global.primaryColor,
                                        },
                                        text: {
                                            color: 'white',
                                            fontWeight: 'bold'
                                        },
                                    },
                                },
                            }
                        }
                            // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                            
                        />
                    </View>
                );
                break;
            case 2:
                return <Error />
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
    reservation: {
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: global.borderColor
    }
});