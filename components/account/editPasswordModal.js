import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
//third party library
import Modal from 'react-native-modal';
//function
import {getPassword, getToken, storePassword} from '../../storage/asyncStorageFunctions';
import {resetPassword} from '../../netcalls/requestsPasswordReset';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//style
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import PasswordStrengthMeter from '../passwordStrengthMeter';

const EditPasswordModal = (props) => {
  const {parent} = props;
  const [currentPassword, setCurrentPassword] = useState('');
  const [inputCurrent, setInputCurrent] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strong, setStrong] = useState(false);

  useEffect(() => {
    if (parent === 'edit') {
      getToken().then((value) => {
        setToken(value);
      });
    }
    getPassword().then((data) => {
      setCurrentPassword(data);
    });
  }, []);

  const setPassword = (password, score) => {
    setNewPassword(password);
    if (Number(score) >= 2) {
      setStrong(true);
    } else {
      setStrong(false);
    }
  };

  const showSubmit = () => {
    if (
      checkInput() === '' &&
      currentPassword &&
      strong &&
      newPassword &&
      confirmPassword
    ) {
      return true;
    }
    return false;
  };

  const checkInput = () => {
    if (inputCurrent) {
      if (inputCurrent !== currentPassword) {
        return 'Please make sure you enter your current password correctly.';
      }
    }
    if (newPassword) {
      if (!strong) {
        return 'Please make sure new password is of at least strength fair';
      }
    }
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return 'New passwords does not match';
      }
    }
    return '';
  };

  const handleSubmit = () => {
    resetPassword(newPassword, token).then((result) => {
      Alert.alert(
        'Password Changed Successfully',
        '',
        [
          {
            text: 'Got It',
            onPress: () => {
              setConfirmPassword('');
              props.close();
            },
          },
        ],
        {cancelable: false},
      );
      storePassword(newPassword);
    });
  };

  return (
    <Modal
      isVisible={props.visible}
      animationIn="slideInRight"
      onBackdropPress={props.close}
      onBackButtonPress={props.close}
      style={{margin: 0}}>
      <View style={globalStyles.editPageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={props.close} />
        </View>
        {parent === 'edit' ? (
          <Text style={globalStyles.pageHeader}>Edit Password</Text>
        ) : (
          <Text style={globalStyles.pageHeader}>Change Password</Text>
        )}
        <Text style={[globalStyles.pageSubDetails, {fontSize: adjustSize(18)}]}>
          Please enter the password that you wish to change to:
        </Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <TextInput
            style={globalStyles.editInputBox}
            placeholder="Current Password"
            placeholderTextColor="#a1a3a0"
            secureTextEntry={true}
            onChangeText={setInputCurrent}
          />
          <PasswordStrengthMeter setPassword={setPassword} />
          <TextInput
            style={globalStyles.editInputBox}
            placeholder="Confirm New Password"
            placeholderTextColor="#a1a3a0"
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
          />
          <Text style={[globalStyles.alertText, {marginStart: '4%'}]}>
            {checkInput()}
          </Text>
        </KeyboardAvoidingView>
      </View>
      <View style={globalStyles.buttonContainer}>
        {showSubmit() ? (
          <TouchableOpacity
            style={globalStyles.submitButtonStyle}
            onPress={() => handleSubmit()}>
            <Text style={globalStyles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={globalStyles.skipButtonStyle}>
            <Text style={globalStyles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default EditPasswordModal;
