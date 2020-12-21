import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import LoadingModal from '../loadingModal';
import AddViewCaregiverModal from '../myCaregiver/addViewCaregiverModal';
import {validateCode} from '../../netcalls/requestsMyCaregiver';
import {isEmpty} from '../../commonFunctions/common';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

import USER_FEMALE from '../../resources/images/Patient-Icons/SVG/user-female.svg';
import USER_MALE from '../../resources/images/Patient-Icons/SVG/user-male.svg';

const iconStyle = {
  width: adjustSize(40),
  height: adjustSize(40),
  alignSelf: 'center',
};

const AuthorisationCaregiver = (props) => {
  const {toDoAfterOTP, pendingReq} = props;
  const [otp, setOtp] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [modalType, setModalType] = useState('');
  const [patient, setPatient] = useState(pendingReq?.patient);

  useEffect(() => {
    setInterval(() => {
      toDoAfterOTP();
    }, 5000);
  }, []);

  useEffect(() => {
    if (otp.length === 6) {
      setModalType('add');
      validateOtp();
    }
  }, [otp]);

  const validateOtp = () => {
    setLoading(true);
    validateCode(otp).then((obj) => {
      console.log(obj);
      if (obj?.status === 200) {
        setLoading(false);
        setPatient(obj?.response);
        setTimeout(() => {
          setShowForm(true);
        }, 2000);
      } else if (obj?.status === 400) {
        Alert.alert('Patient already has pending assignment', '', [
          {text: 'Got it', onPress: () => setLoading(false)},
        ]);
      } else {
        Alert.alert('Invalid Code', '', [
          {text: 'Got it', onPress: () => setLoading(false)},
        ]);
      }
    });
  };

  return (
    <View style={{backgroundColor: Colors.backgroundColor}}>
      <View style={styles.cardTab}>
        <View style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>
            {isEmpty(pendingReq) ? 'Authorisation' : 'Pending Acceptance'}
          </Text>
        </View>
      </View>
      {/*Content */}
      <View
        style={{
          backgroundColor: '#e1e7ed',
          height: '100%',
        }}>
        <View style={{marginBottom: '2%'}}>
          <Text
            style={[
              globalStyles.field,
              {marginStart: '5%', alignSelf: 'flex-start'},
            ]}>
            {isEmpty(pendingReq)
              ? 'To manage a Patient, an authorization code is required from the Patient:'
              : 'Your Patient is viewing your request and will respond shortly.'}
          </Text>
          {isEmpty(pendingReq) ? (
            <OTPInputView
              pinCount={6}
              style={{
                width: '90%',
                height: adjustSize(100),
                fontWeight: '1000',
                padding: '5%',
                alignSelf: 'center',
              }}
              placeholderTextColor="black"
              autoFocusOnLoad
              codeInputFieldStyle={styles.otpInput}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeChanged={(value) => {
                setOtp(value);
              }}
            />
          ) : (
            <TouchableOpacity
              style={globalStyles.row}
              onPress={() => setShowForm(true)}>
              <View style={{flexDirection: 'row'}}>
                {patient?.gender === 'female' ? (
                  <USER_FEMALE {...iconStyle} />
                ) : (
                  <USER_MALE {...iconStyle} />
                )}
                <Text style={globalStyles.field}>{patient?.first_name}</Text>
                <Entypo
                  name="chevron-small-right"
                  size={40}
                  style={{opacity: 0.5, color: '#21293A'}}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <LoadingModal visible={loading} message={'Validating OTP'} />
        {showForm ? (
          <AddViewCaregiverModal
            visible={showForm}
            closeModal={() => {
              toDoAfterOTP();
              setShowForm(false);
            }}
            type={modalType}
            caregiver={undefined}
            patient={patient}
            modalType={'card'}
            from={'caregiver'}
            permissions={pendingReq?.permissions}
            pendingCaregiver={pendingReq?.caregiver}
          />
        ) : null}
      </View>
    </View>
  );
};

export default AuthorisationCaregiver;

const styles = StyleSheet.create({
  cardTab: {
    backgroundColor: '#e1e7ed',
    borderTopStartRadius: adjustSize(20),
    borderTopEndRadius: adjustSize(20),
  },
  headerTab: {
    padding: '3%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    marginStart: '3%',
    color: '#3c3c43',
    opacity: 0.6,
  },
  //otp
  otpInput: {
    backgroundColor: 'white',
    borderRadius: adjustSize(10),
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(20),
    color: 'black',
  },
});
