import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import InAppBrowser from 'react-native-inappbrowser-reborn';
//style
import {Colors} from '../styles/colors';
import globalStyles from '../styles/globalStyles';
import TICK from '../resources/images/Patient-Icons/SVG/icon-green-accept.svg';
import CROSS from '../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-red-denied.svg';
import MY_CAREGIVER from '../resources/images/Caregiver-Additional-Icons/SVG/icon-green-mycaregiver.svg';
import {
  unassignCaregiver,
  rejectPendingCaregiver,
  acceptPendingCaregiver,
} from '../netcalls/requestsMyCaregiver';

const iconStyle = {
  width: 30,
  height: 30,
  marginTop: '5%',
  marginStart: '3%',
};

const icon = {
  width: 80,
  height: 80,
};

function AuthoriseReqModal(props) {
  const {visible, pendingCaregiver, permissions} = props;
  const {closeSuccess} = props;
  const [acceptedPermission, setAcceptedPermission] = useState('');
  const [unacceptedPermission, setUnacceptedPermission] = useState('');

  const springAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let acceptedS = 'Your';
    let unaccepted = '';
    if (permissions.includes('diary')) {
      acceptedS += ' Report & Diary';
    } else {
      unaccepted += 'Report & Diary';
    }
    if (permissions.includes('lab_results')) {
      if (acceptedS.length === 4) {
        acceptedS += ' Lab Results ';
      } else {
        acceptedS += ', Lab Results';
      }
    } else {
      if (unaccepted.length === 0) {
        unaccepted += 'Lab Results';
      } else {
        unaccepted += ', Lab Results';
      }
    }
    if (permissions.includes('appointment')) {
      if (acceptedS.length === 4) {
        acceptedS += ' Appointment ';
      } else {
        acceptedS += ', Appointment';
      }
    } else {
      if (unaccepted.length === 0) {
        unaccepted += 'Appointment';
      } else {
        unaccepted += ', Appointment';
      }
    }

    setAcceptedPermission(acceptedS);
    setUnacceptedPermission(unaccepted);
    if (unaccepted.length === 0) {
      setUnacceptedPermission('-');
    }
  }, [visible, permissions]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setTimeout(() => {
        Animated.spring(springAnim, {
          toValue: 1,
          friction: 2,
          useNativeDriver: true,
        }).start();
      }, 500);
    }
    return () => {
      isMounted = false;
    };
  }, [visible]);

  const accept = () => {
    console.log('accepting---');
    acceptPendingCaregiver().then((rsp) => {
      if (rsp === 200) {
        Alert.alert('Request Accepted', '', [
          {
            text: 'Got It',
            onPress: () => {
              closeSuccess();
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'No Pending Caregiver Request', [
          {
            text: 'Got It',
            onPress: () => {
              closeSuccess();
            },
          },
        ]);
      }
    });
  };

  const decline = () => {
    console.log('rejecting---');
    rejectPendingCaregiver().then((rsp) => {
      if (rsp === 200) {
        Alert.alert('Request Rejected', '', [
          {
            text: 'Got It',
            onPress: () => {
              closeSuccess();
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'No Pending Caregiver Request', [
          {
            text: 'Got It',
            onPress: () => {
              closeSuccess();
            },
          },
        ]);
      }
    });
  };

  const openURL = async () => {
    let link =
      'https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act';
    if (await InAppBrowser.isAvailable) {
      InAppBrowser.open(link).then((resp) => {
        if (resp.type === 'success') {
          // Opened link successfully
        }
      });
    }
  };

  return (
    <Modal isVisible={visible} animationIn="slideInUp">
      <View style={styles.modalContainer}>
        <Text
          style={{
            fontSize: 20,
            margin: '3%',
            paddingTop: '3%',
            fontFamily: 'SFProDisplay-Regular',
            textAlign: 'center',
          }}>
          {pendingCaregiver?.first_name} has requested to become your Caregiver
        </Text>
        <Animated.View
          style={{
            height: 80,
            width: 80,
            transform: [{scale: springAnim}],
          }}>
          <MY_CAREGIVER {...icon} />
        </Animated.View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#e1e7ed'}]}
            onPress={() => decline()}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#aad326'}]}
            onPress={() => accept()}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.border, {marginTop: '3%'}]} />
        {/*Granted/ Denied */}
        <View style={styles.accessContainer}>
          <TICK {...iconStyle} />
          <View style={{marginTop: '5%', flex: 2}}>
            <Text style={[globalStyles.pageDetails, styles.accessText]}>
              Requested Access
            </Text>
            <Text style={globalStyles.pageDetails}>{acceptedPermission}</Text>
          </View>
        </View>
        <View style={[styles.border, {marginTop: '2%'}]} />

        <View style={styles.accessContainer}>
          <CROSS {...iconStyle} />
          <View style={{marginTop: '4%', flex: 2}}>
            <Text style={[globalStyles.pageDetails, styles.accessText]}>
              Access Rejected
            </Text>
            <Text style={globalStyles.pageDetails}>{unacceptedPermission}</Text>
          </View>
        </View>
        <View style={[styles.border, {marginTop: '2%'}]} />
        <Text style={styles.pdpaText}>
          Learn more about{' '}
          <Text
            style={{color: '#aad326', fontFamily: 'SFProDisplay-Bold'}}
            onPress={() => openURL()}>
            PDPA
          </Text>
          .
        </Text>
      </View>
    </Modal>
  );
}

export default AuthoriseReqModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 20,
    width: '100%',
    paddingBottom: '4%',
  },
  button: {
    backgroundColor: '#EEF3BD',
    borderRadius: 9.5,
    marginVertical: 10,
    paddingVertical: 10,
    width: Dimensions.get('window').width - 90,
    flex: 1,
    margin: '2%',
  },
  buttonText: {
    fontSize: 23,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Bold',
  },
  border: {
    borderWidth: 0.5,
    borderColor: '#e2e8ee',
    width: '100%',
  },
  accessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginStart: '3%',
    marginEnd: '3%',
  },
  accessText: {
    color: Colors.lastLogValueColor,
    marginBottom: 0,
  },
  pdpaText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
    marginTop: '4%',
  },
});
