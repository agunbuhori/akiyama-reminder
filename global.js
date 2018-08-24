import { Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import moment from 'moment';
import translates from './translates';

const dateFormat = 'YYYY年MM月DD日';
const yearFormat = 'YYYY年';

export default global = {
    baseUrl: "http://192.168.0.107/carnotif/public/",
    primaryColor: '#11115C',
    primaryColorDark: '#00004B',
    secondaryColor: '#282FBA',
    fontColor: '#333',
    borderColor: '#eee',
    borderWidth: 0.5,
    borderRadius: 4,
    windowWidth: Dimensions.get('window').width,
    windowHeight: Dimensions.get('window').height,
    statusBarHeight: getStatusBarHeight(),
    translate: function (key) {
        return translates[key];
    },
    formatDate: function (date) {
        return moment(date).format(dateFormat);
    },
    formatYear: function (year) {
        return moment(year, 'YYYY').format(yearFormat);
    }
}