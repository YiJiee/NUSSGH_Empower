import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountdownTimer from '../../components/countdownTimer';
import {sendOTPRequest, verifyOTPRequest} from '../../netcalls/requestsPasswordReset';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//third party lib
import Modal from 'react-native-modal';
//styles
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
import EditPhoneModal_2 from '../../components/account/editPhoneModal_2';

const InputOTPScreen = (props) => {
  const {phoneNumber, visible, parent, selection} = props;
  const {close} = props;
  const [otp, setOtp] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [countdownTime, setCountdownTime] = useState(120);

  const [editMobileModal, setEditMobileModal] = useState(false);
  const [token, setToken] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    if (!countdownVisible) {
      setCountdownTime(120);
    }
  }, [countdownVisible]);

  const handleTimout = () => {
    setCountdownVisible(true);
    setCountdownTime(0);
    if (countdownTime === 0 && editMobileModal === false) {
      Alert.alert('OTP Expired', '', [
        {text: 'Resend OTP', onPress: () => resendOTP()},
      ]);
    }
  };

  const showSubmit = () => {
    if (otp.length != 6 || checkInput() != '') {
      return false;
    }
    return true;
  };

  const checkInput = () => {
    if (otp.includes(',') || otp.includes('-') || otp.includes('.')) {
      return 'Please make sure you type a valid OTP';
    }
    return '';
  };

  const handleSubmit = () => {
    if (
      otp.length == 6 &&
      !otp.includes(',') &&
      !otp.includes('-') &&
      !otp.includes('.')
    ) {
      if (parent === 'forgetPassword') {
        verifyOTPRequest(phoneNumber, otp, selection).then((response) => {
          if (response.message != null) {
            Alert.alert('Error', response.message, [{text: 'Got It'}]);
          } else {
            close();
            navigation.navigate('ResetPasswordScreen', {
              token: response.token,
              selection: selection,
            });
          }
        });
      } else {
        //verify otp when come from edit phone modal
        verifyOTPRequest(phoneNumber, otp).then((response) => {
          if (response.message != null) {
            Alert.alert('Error', response.message, [{text: 'Got It'}]);
          } else {
            setTimeout(() => setEditMobileModal(true), 500);
            setToken(response.token);
          }
        });
      }
    }
  };

  const resendOTP = () => {
    setCountdownVisible(true);
    sendOTPRequest(phoneNumber).then(() => {
      setCountdownTime(120);
      setCountdownVisible(false);
      Alert.alert('Success', 'Please check your SMS for new OTP', [
        {text: 'Got It'},
      ]);
    });
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      onBackdropPress={() => close()}
      onBackButtonPress={() => close()}
      style={{margin: 0}}>
      <View style={globalStyles.editPageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => close()} />
        </View>
        {parent === 'forgetPassword' ? (
          <Text style={globalStyles.pageHeader}>Forget Password</Text>
        ) : (
          <Text style={globalStyles.pageHeader}>Edit Mobile No.</Text>
        )}

        <Text style={globalStyles.pageDetails}>Verficiation Required</Text>
        <Text style={[globalStyles.pageSubDetails, {fontSize: 18}]}>
          Please enter the 6-digis OTP sent to
        </Text>
        <Text style={[globalStyles.pageDetails, {marginTop: '3%'}]}>
          {phoneNumber}
        </Text>
        <OTPInputView
          pinCount={6}
          style={{
            width: '100%',
            height: adjustSize(100),
            fontWeight: '1000',
            padding: '5%',
          }}
          placeholderTextColor="#000000"
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeChanged={(value) => {
            setOtp(value);
          }}
        />
        <Text
          style={[
            globalStyles.alertText,
            {marginStart: '3%', marginBottom: '3%'},
          ]}>
          {checkInput()}
        </Text>
        {!countdownVisible ? (
          <CountdownTimer
            handleTimout={handleTimout}
            countdownTime={countdownTime}
            key={countdownTime}
          />
        ) : null}

        <TouchableOpacity onPress={() => resendOTP()}>
          <Text
            style={[
              globalStyles.pageSubDetails,
              {fontSize: adjustSize(16), marginStart: '4%'},
            ]}>
            Didn't receive it?{' '}
            <Text
              style={[
                globalStyles.pageDetails,
                {fontSize: adjustSize(16), color: '#aad326'},
              ]}>
              Resend Again
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.buttonContainer}>
        {showSubmit() ? (
          <TouchableOpacity
            style={globalStyles.submitButtonStyle}
            onPress={handleSubmit}>
            <Text style={globalStyles.actionButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={globalStyles.skipButtonStyle}>
            <Text style={globalStyles.actionButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        )}
      </View>
      <EditPhoneModal_2
        visible={editMobileModal}
        close={() => setEditMobileModal(false)}
        closeParent={() => close()}
        closeLast={() => props.closeParent()}
        token={token}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  otpScreen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    padding: adjustSize(20),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontWeight: '500',
    marginTop: '2%',
    fontSize: adjustSize(20),
    textAlign: 'center',
    marginStart: '2%',
    marginEnd: '2%',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#AAD326',
    borderRadius: adjustSize(20),
    alignSelf: 'center',
    padding: '2%',
    marginEnd: '2%',
  },
  buttonText: {
    fontSize: adjustSize(20),
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    margin: '7%',
    padding: '4%',
    backgroundColor: 'white',
    borderRadius: adjustSize(25),
  },
  inputBox: {
    width: Dimensions.get('window').width - adjustSize(70),
    borderRadius: adjustSize(20),
    backgroundColor: '#EEF3BD',
    paddingStart: adjustSize(30), //position placeholder text
    marginVertical: adjustSize(10),
    alignSelf: 'center',
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
  underlineStyleBase: {
    width: adjustSize(40),
    height: adjustSize(45),
    borderWidth: 0,
    borderBottomWidth: 3,
    color: 'black',
    fontSize: adjustSize(23),
  },
  underlineStyleHighLighted: {
    borderColor: '#aad326',
  },
});

export default InputOTPScreen;
