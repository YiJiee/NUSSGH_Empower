import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
//third party lib
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
//styles
import globalStyles from '../../styles/globalStyles';
import loginStyles, {loginLogoStyle} from '../../styles/loginStyles';
import {Colors} from '../../styles/colors';

import Logo from '../../resources/images/Patient-Icons/SVG/icon-color-empower.svg';
import {getSecurityQnByUsername} from '../../netcalls/requestsSecurityQn';

function ForgetPasswordScreen({navigation}) {
  Icon.loadFont();
  const [username, setUsername] = useState('');

  const retrieveQns = () => {
    if (username.length != 0) {
      let string =
        String(username).substr(0, 1).toLowerCase() +
        String(username).substr(1, username.length);

      getSecurityQnByUsername(string).then((rsp) => {
        let status = rsp.status;
        if (status === 200) {
          navigation.navigate('QnVerficationScreen', {
            qnList: rsp?.qnList,
            username: string,
          });
        } else {
          Alert.alert(
            'Username does not exist',
            'Please ensure you input your username correctly (Case sensitive)',
            [{text: 'Got It'}],
          );
        }
      });
    } else {
      Alert.alert('Please fill in your username', '', [{text: 'Got It'}]);
    }
  };

  return (
    <LinearGradient
      colors={Colors.loginColorArr}
      useAngle={true}
      angle={240}
      style={loginStyles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={{flex: 1}} />
        <Logo {...loginLogoStyle} />
        <Text style={loginStyles.headerText}>Forget Password</Text>
        <Text style={loginStyles.subText}>
          To change your password, please provide us your Username:
        </Text>

        <View style={{flex: 3, marginTop: '10%'}}>
          <TextInput
            style={loginStyles.inputBox}
            placeholder="Username"
            placeholderTextColor={Colors.loginPlaceholder}
            onChangeText={setUsername}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[
              globalStyles.nextButtonStyle,
              {backgroundColor: 'white', marginBottom: 0},
            ]}
            onPress={retrieveQns}>
            <Text style={globalStyles.actionButtonText}>Next</Text>
          </TouchableOpacity>
          <Text
            style={loginStyles.clickableText}
            onPress={() => navigation.goBack()}>
            Cancel
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

export default ForgetPasswordScreen;
