import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    AsyncStorage,
    StatusBar,
    Text,
    ActivityIndicator
} from 'react-native';
import { 
    Container, Form, Item, Input, Icon, Button 
} from 'native-base';
import global from '../../global';
import translates from '../../translates';
import axios from 'axios';


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            errorStatus: false,
            loadingIndicator: false
        }
    }

    authenticate = async() => {
        var credentials = {username: this.state.username, password: this.state.password};

        this.setState({loadingIndicator: true});

        axios.post(global.baseUrl+"api/v1/auth/signin", credentials).then(response => {
            this.setState({errorStatus: false, loadingIndicator: false});
            this.setUser({
                token: response.data.token,
                username: credentials.username,
                password: credentials.password
            });

        }).catch(error => {
            this.setState({errorStatus: true, loadingIndicator: false});
        });
    }

    setUser = async(data) => {
        AsyncStorage.setItem('userToken', data.token);
        AsyncStorage.setItem('username', data.username)
        AsyncStorage.setItem('password', data.password);

        this.props.navigation.navigate('Menu');
    }

    _renderLoadingIndicator() {
        if (this.loadingIndicator)
            return <ActivityIndicator color="white"/>
    }

    _renderErrorText() {
        if (this.state.errorStatus)
            return <Text visibility={false} style={styles.errorText}>Login Failed</Text>;
    }

    render() {
        return (
            <Container style={styles.container}>
                <StatusBar barStyle="light-content"/>
            
                <Form>
                    <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>

                    {this._renderErrorText()}
                    {this._renderLoadingIndicator()}

                    <Item rounded style={styles.loginInput}>
                        <Input autoCapitalize="none" placeholder={global.translate("username")} onChangeText={(username) => this.setState({ username: username })}/>
                        <Icon type="Feather" name="user"/>
                    </Item>

                    <Item rounded style={styles.loginInput}>
                        <Input placeholder={global.translate("password")} secureTextEntry={true} onChangeText={(password) => this.setState({ password: password })} />
                        <Icon type="Feather" name="lock" />
                    </Item>

                    <Button rounded block style={styles.loginButton} onPress={() => this.authenticate()}>
                        <Text style={styles.loginButtonText}>{translates.login}</Text>
                    </Button>
                </Form>
            </Container>
        );
    }
}

Login.navigationOptions = ({ navigation }) => ({
    header: null
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.primaryColor,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 20
    },
    errorText: {
        alignSelf: 'center',
        marginBottom: 10,
        color: 'white',
        fontSize: 16
    },
    loginInput: {
        backgroundColor: 'white',
        borderColor: 'transparent',
        paddingLeft: 10,
        paddingRight: 5,
        marginBottom: 15,
        height: 44
    },
    loginButton: {
        height: 50,
        backgroundColor: global.secondaryColor
    },
    loginButtonText: {
        fontWeight: 'bold',
        color: 'white',
    }
})