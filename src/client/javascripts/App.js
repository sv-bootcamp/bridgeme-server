/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform
} from 'react-native';

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        titleText: 'Yoda',
        os: 'OS',
      };

      if (Platform.OS === 'ios') {
        this.state.os = 'IOS';
      } else if (Platform.OS === 'android') {
        this.state.os = 'Android API :' + Platform.Version;
      }

      console.log(Platform.OS);

    }

    render() {
      return (
            <View style={styles.container}>
                                  <Text style={styles.welcome}>
                      Welcome to React Native, {this.state.os} !
                                  </Text>
                                  <Text style={styles.instructions}>
                      To get started, edit index.ios.js
                                  </Text>
                                  <Text style={styles.instructions}>
                      Press Cmd+R to reload,                    {'\n'}
                      Cmd+D or shake for dev menu
                                  </Text>
                          </View>

      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = App;
