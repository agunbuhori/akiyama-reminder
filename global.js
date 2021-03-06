import { Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import moment from 'moment';
import translates from './translates';

const dateFormat = 'YYYY年MM月DD日';
const yearMonthFormat = 'YYYY年MM月';
const yearFormat = 'YYYY年';
const dateMonthFormat = 'MM月DD日';

export default global = {
    baseUrl: "http://192.168.0.105/carnotif/public/",
    primaryColor: '#11115C',
    primaryColorDark: '#00004B',
    primaryColorLight: '#CACAE0',
    secondaryColor: '#282FBA',
    fontColor: '#333',
    borderColor: '#e6eaee',
    borderWidth: 1,
    borderRadius: 4,
    windowWidth: Dimensions.get('window').width,
    windowHeight: Dimensions.get('window').height,
    statusBarHeight: getStatusBarHeight(),
    translate: (key) => {
        return translates[key];
    },
    formatDate: (date) => {
        return moment(date).format(dateFormat);
    },
    formatYear: (year) => {
        return moment(year, 'YYYY').format(yearFormat);
    },
    formatYearMonth: (yearMonth) => {
        return moment(year, 'YYYY-MM').format(yearMonthFormat);
    },
    formatDateMonth: (dateMonth) => {
        return moment(dateMonth, 'MM-DD').format(dateMonthFormat);
    },
    formatTime: (time) => {
        return moment(time, 'HH:mm:ss').format('HH:mm')
    },
    yearMonthFormat: 'yyyy年MM月',
}