/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import './shim.js'
import firebase from 'react-native-firebase'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  Alert,
  TextInput,
  AsyncStorage,
  WebView
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

var net = require('react-native-tcp');
var serverPort = 5555;
var client;
var token;

export default class App extends Component {

  constructor() {
    super();
    this.state = { code: "00000000", ip: "Enter IP Address" }
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  generateCode() {
    var num = Math.random().toString().slice(-8)
    this.setState({ code: num })
  }

  sendCode() {
    client.write(this.state.code);
  }

  unlockBox(){
    client.write("BootyBootyBooty");
    Alert.alert("Your Booty Box™ has been unlocked")
  }

  connect(){
    client = net.connect(serverPort, this.state.ip);
  }

  camera(){

  }

  render() {
    return (
      <View style={styles.body}>
        <View style={{ flex: 0.33, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
          <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 35 }}>
              {this.state.code}
            </Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <Button style={{ flex: 1, alignSelf: 'center' }}
              title='Generate Code'
              onPress={this.generateCode.bind(this)}
            />
          </View>
        </View>
        <View style={{ flex: 0.33 }}>
          <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Button
              title='Send Code'
              onPress={this.sendCode.bind(this)}
            />
          </View>
          <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Button
              title='Unlock'
              onPress={this.unlockBox.bind(this)}
            />
          </View>
        </View>
        <View style={{ flex: 0.33 }}>
          <View style={{ flex: 0.33, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <TextInput
              style={{ height: 40, borderWidth: 1, backgroundColor: Colors.white }}
              onChangeText={(ip) => this.setState({ip})}
              value = {this.state.ip}
            />
          </View>
          <View style={{ flex: 0.33, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Button
              title='Connect'
              onPress={this.connect.bind(this)}
            />
          </View>
          <View style={{ flex: 0.33, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
          <Button
              title='Camera Feed'
              onPress={this.camera.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.white,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
