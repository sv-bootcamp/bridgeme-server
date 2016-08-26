/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        titleText: 'Yoda',
        os: '',
      };

    // Populate the OS state by looking at Platform params.
    if (Platform.OS === 'ios') {
      this.state.os = 'IOS';
    } else if (Platform.OS === 'android') {
      this.state.os = 'Android API :' + Platform.Version;
    }

    console.log(('Starting the app for platform: ' + this.state.os));

  }

  render() {
    return (

          //  Render the screen on View.
           <View style={styles.container}>

              {/* Render facebook login button */}
             <LoginButton
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      alert('login has error: ' + result.error);
                    } else if (result.isCancelled) {
                      alert('login is cancelled.');
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          alert(data.accessToken.toString());
                        }
                    );
                    }
                  }
              }
              onLogoutFinished={() => alert('logout.')}/>
          </View>
     );
  }
}

// Set style components.
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
