import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PasswordStrengthMeter from '../passwordStrengthMeter';
import globalStyles from '../../styles/globalStyles';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const SetPassword = (props) => {
  return (
    <View>
      <PasswordStrengthMeter setPassword={props.setPassword} />
      <TextInput
        style={globalStyles.editInputBox}
        placeholder="Confirm New Password"
        placeholderTextColor="#a1a3a0"
        secureTextEntry={true}
        onChangeText={props.setPassword2}
      />
      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.submitButtonStyle}
          onPress={() => submit()}>
          <Text style={globalStyles.actionButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetPassword;

const styles = StyleSheet.create({
  inputbox: {
    marginBottom: '2%',
    backgroundColor: '#e2e8ee',
    padding: '3%',
    marginStart: '2%',
    marginEnd: '2%',
    borderRadius: 9.5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonStyle: {
    backgroundColor: '#AAD326',
    borderRadius: adjustSize(20),
    alignSelf: 'center',
    padding: '3%',
    marginTop: ' 2%',
    marginBottom: '2%',
  },
  buttonText: {
    fontSize: adjustSize(20),
    fontWeight: '500',
    textAlign: 'center',
  },
});
