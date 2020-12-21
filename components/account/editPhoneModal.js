import React, {useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party library
import Modal from 'react-native-modal';
//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import InputOTPScreen from '../../screens/login/inputOTPScreen';
//functions
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//style
import globalStyles from '../../styles/globalStyles';
import {sendOTPRequest} from '../../netcalls/requestsPasswordReset';

const emailRgx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const EditPhoneModal = (props) => {
  const [inputOTPShow, setInputOTPShow] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const {number} = props;

  const getOTP = () => {
    sendOTPRequest(number).then((response) => {
      if (response.message === 'OTP sent.') {
        Alert.alert(
          'Success',
          'OTP has been sent to you via SMS',
          [
            {
              text: 'Got It',
              onPress: () => setInputOTPShow(true),
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          'Unexpected Error',
          'Please try again later',
          [
            {
              text: 'Got It',
            },
          ],
          {cancelable: false},
        );
      }
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
        <Text style={globalStyles.pageHeader}>Edit Mobile No.</Text>
        <Text style={globalStyles.pageDetails}>Verficiation Required</Text>
        <Text style={[globalStyles.pageSubDetails, {fontSize: 18}]}>
          For security purposes, we will send you a One Time Password (OTP) to:
        </Text>
        <Text style={[globalStyles.pageDetails, {marginTop: '2%'}]}>
          {number}
        </Text>
      </View>
      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.nextButtonStyle}
          onPress={() => getOTP()}>
          <Text style={globalStyles.actionButtonText}>Get OTP</Text>
        </TouchableOpacity>
      </View>
      <InputOTPScreen
        visible={inputOTPShow}
        close={() => setInputOTPShow(false)}
        phoneNumber={number}
        closeParent={() => props.close()}
      />
    </Modal>
  );
};

export default EditPhoneModal;

const styles = StyleSheet.create({
  inputBox: {
    width: Dimensions.get('window').width - adjustSize(60),
    borderRadius: adjustSize(20),
    backgroundColor: '#EEF3BD',
    paddingStart: adjustSize(30), //position placeholder text
    marginVertical: adjustSize(10),
    alignSelf: 'center',
    padding: '3%',
  },
  header: {
    fontSize: adjustSize(18),
    margin: '3%',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#AAD326',
    width: adjustSize(300),
    height: adjustSize(40),
    borderRadius: adjustSize(20),
    marginVertical: adjustSize(10),
    paddingVertical: adjustSize(6),
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: adjustSize(23),
    fontWeight: '500',
    textAlign: 'center',
  },
});
