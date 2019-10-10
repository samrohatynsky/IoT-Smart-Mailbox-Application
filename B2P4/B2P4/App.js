/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import './shim.js'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  Alert
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

var net = require('react-native-tcp');
var serverPort = 5555;

export default class App extends Component {

  constructor() {
    super();
    this.state = { code: "00000000" }
    this.generateCode = this.generateCode.bind(this)
  }

  generateCode() {
    var num = Math.random().toString().slice(-8)
    this.setState({ code: num })
  }

  sendCode() {
    var client = net.createConnection({ port: serverPort, path: "localHost" }, () => {
      client.write(this.state.code);
    });
  }

  unlockBox(){
    Alert.alert("Your Booty Box™ has been unlocked")
  }

  render() {
    return (
      <View style={styles.body}>
        <View style={{ flex: 0.33, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
          <Image
            style={{ width: 250, height: 250, resizeMode: 'contain' }}
            source={require('./B2P4Logo.png')}
          />
        </View>
        <View style={{ flex: 0.33, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
          <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 35 }}>
              {this.state.code}
            </Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <Button style={{ flex: 1, alignSelf: 'center' }}
              title='Generate Code'
              onPress={this.generateCode}
            />
          </View>
        </View>
        <View style={{ flex: 0.33 }}>
          <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Button
              title='Send Code'
              onPress={this.sendCode}
            />
          </View>
          <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Button
              title='Unlock'
              onPress={this.unlockBox}
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
