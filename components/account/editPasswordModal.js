import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
} from 'react-native';
//component
import SetPassword from './setPassword';
import Header from '../diary/blocks/header';
//third party library
import Modal from 'react-native-modal';
import {
  getPassword,
  getToken,
  storePassword,
} from '../../storage/asyncStorageFunctions';

const EditPasswordModal = (props) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [token, setToken] = useState('');
  const [correct, setCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strong, setStrong] = useState(false);

  useEffect(() => {
    getToken().then((value) => {
      setToken(value);
    });
  });

  const setPassword = (password, score) => {
    setNewPassword(password);
    if (Number(score) >= 2) {
      setStrong(true);
    } else {
      setStrong(false);
    }
  };

  const handleSubmit = () => {
    getPassword().then((data) => {
      if (data != currentPassword) {
        Alert.alert(
          'Invalid Password',
          'Please make sure you enter your current password correctly.',
          [
            {
              text: 'Got It',
            },
          ],
          {cancelable: false},
        );
      } else if (data === currentPassword) {
        setCorrect(true);
      }
    });
  };

  return (
    <Modal
      isVisible={props.visible}
      animationIn="slideInUp"
      onBackdropPress={props.close}
      onBackButtonPress={props.close}
      style={{justifyContent: 'flex-end'}}>
      <KeyboardAvoidingView behavior="padding">
        <View style={{backgroundColor: 'white'}}>
          <Header title={'Change Password'} closeModal={props.close} />
          <TextInput
            style={styles.inputBox}
            placeholder="Current Password"
            placeholderTextColor="#a1a3a0"
            secureTextEntry={true}
            onChangeText={setCurrentPassword}
          />
          <SetPassword
            setPassword={setPassword}
            setPassword2={setConfirmPassword}
            checkPassword={handleSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditPasswordModal;

const styles = StyleSheet.create({
  inputBox: {
    width: Dimensions.get('window').width - 60,
    borderRadius: 20,
    backgroundColor: '#EEF3BD',
    paddingStart: 30, //position placeholder text
    marginVertical: 10,
    alignSelf: 'center',
    padding: '3%',
    marginTop: '7%',
  },
});