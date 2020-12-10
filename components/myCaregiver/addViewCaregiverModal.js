import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
//third party lib
import InAppBrowser from 'react-native-inappbrowser-reborn';

//styles
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import AccessOption from './accessOption';

import USER_FEMALE from '../../resources/images/Patient-Icons/SVG/user-female.svg';
import USER_MALE from '../../resources/images/Patient-Icons/SVG/user-male.svg';
import {isEmpty} from '../../commonFunctions/common';
import {
  unassignCaregiver,
  sendReqPermission,
  patientSetPermission,
} from '../../netcalls/requestsMyCaregiver';
import DeleteBin from '../deleteBin';
import diaryStyles from '../../styles/diaryStyles';
import logStyles from '../../styles/logStyles';
import DeleteModal from '../deleteModal';

import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const iconStyle = {
  width: adjustSize(40),
  height: adjustSize(40),
  alignSelf: 'center',
};

const AddViewCaregiverModal = (props) => {
  const {
    visible,
    type,
    caregiver,
    modalType,
    from,
    patient,
    permissions,
    pendingCaregiver,
  } = props;
  const {closeModal} = props;

  const [showDelete, setShowDelete] = useState(false);

  const [chosenUser, setChosenUser] = useState(
    patient != null ? patient : caregiver,
  );
  const [accessAppt, setAccessAppt] = useState(false);
  const [accessRD, setAccessRd] = useState(false);
  const [accessLr, setAccessLr] = useState(false);

  useEffect(() => {
    console.log([permissions]);
    if (permissions !== undefined) {
      if (permissions.includes('diary')) {
        setAccessRd(true);
      }
      if (permissions.includes('lab_results')) {
        setAccessLr(true);
      }
      if (permissions.includes('appointment')) {
        setAccessAppt(true);
      }
    }
  }, [visible]);

  const authorise = () => {
    if (!isEmpty(patient) && getPermissionsArr().length > 0) {
      let obj = {
        patient: patient?.username,
        permissions: getPermissionsArr(),
      };
      sendReqPermission(obj).then((rsp) => {
        if (rsp === 200) {
          Alert.alert('Request Sent Successfully', '', [
            {text: 'Got It', onPress: () => closeModal()},
          ]);
        } else if (rsp === 400) {
          Alert.alert('Conflicting Request', '', [{text: 'Got It'}]);
        } else {
          Alert.alert('Error', 'Try again later', [{text: 'Got It'}]);
        }
      });
    }
  };

  const getPermissionsArr = () => {
    let arr = [];
    if (accessAppt) {
      arr.push('appointment');
    }
    if (accessRD) {
      arr.push('diary');
    }
    if (accessLr) {
      arr.push('lab_results');
    }
    return arr;
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

  const deleteCaregiver = () => {
    unassignCaregiver().then((rsp) => {
      if (rsp === 200) {
        Alert.alert('Unassigned Successfully!', '', [
          {
            text: 'Got It',
            onPress: () => {
              setShowDelete(false);
              closeModal();
            },
          },
        ]);
      } else {
        Alert.alert('Unexpected Error ', '', [{text: 'Try Again'}]);
      }
    });
  };

  const editPermissionByPatient = () => {
    patientSetPermission(getPermissionsArr()).then((rsp) => {
      if (rsp === 200) {
        Alert.alert('Permissions updated successfully!', '', [
          {text: 'Got It', onPress: () => closeModal()},
        ]);
      } else {
        Alert.alert('Unexpected Error!', 'Please try again later!', [
          {text: 'Got It'},
        ]);
      }
    });
  };

  return (
    <Modal
      visible={visible}
      onBackButtonPress={() => closeModal()}
      presentationStyle={modalType === 'card' ? 'formSheet' : 'fullScreen'}
      animationType="slide">
      <View style={globalStyles.pageContainer}>
        <View
          style={
            from != 'caregiver'
              ? globalStyles.menuBarContainer
              : {marginTop: '3%'}
          }>
          <LeftArrowBtn close={() => closeModal()} />
        </View>
        <Text style={globalStyles.pageHeader}>
          {from === 'caregiver'
            ? type === 'add'
              ? 'Request Access'
              : 'Requested Access'
            : 'View Caregiver'}
        </Text>
        {from === 'caregiver' && (
          <Text style={styles.fieldText}>Patient Info</Text>
        )}

        <View style={[globalStyles.row, styles.container]}>
          {chosenUser?.gender === 'female' ? (
            <USER_FEMALE {...iconStyle} />
          ) : (
            <USER_MALE {...iconStyle} />
          )}
          <View style={{flex: 1, marginStart: '3%'}}>
            <Text style={styles.mainField}>{chosenUser?.first_name}</Text>
          </View>
        </View>

        <Text style={styles.fieldText}>
          {type === 'add' && from === 'caregiver' && !isEmpty(patient)
            ? 'Requested Access Privileges'
            : 'Select Access Privileges'}
        </Text>
        <ScrollView style={{flexGrow: 1}}>
          <AccessOption
            mainheader={"Patient's Appointment"}
            subheader={'Personal Information'}
            onSelect={() => {
              if (
                (from === 'caregiver' && isEmpty(pendingCaregiver)) ||
                caregiver != null
              ) {
                setAccessAppt(!accessAppt);
              }
            }}
            selected={accessAppt}
          />
          <AccessOption
            mainheader={"Patient's Report & Diary"}
            subheader={'Health Information'}
            onSelect={() => {
              if (
                (from === 'caregiver' && isEmpty(pendingCaregiver)) ||
                caregiver != null
              ) {
                setAccessRd(!accessRD);
              }
            }}
            selected={accessRD}
          />
          <AccessOption
            mainheader={"Patient's Lab Results"}
            subheader={'Health Information'}
            onSelect={() => {
              if (
                (from === 'caregiver' && isEmpty(pendingCaregiver)) ||
                caregiver != null
              ) {
                setAccessLr(!accessLr);
              }
            }}
            selected={accessLr}
          />
          <TouchableOpacity onPress={() => openURL()}>
            <Text style={styles.pdpaText}>
              Learn more about{' '}
              <Text style={{fontWeight: 'bold', color: '#aad326'}}>
                Personal Data Protection Act
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/*Entering into page after accepting request - from patient*/}
      {caregiver != null && (
        <View style={globalStyles.buttonContainer}>
          <View style={{flexDirection: 'row'}}>
            <DeleteBin
              style={diaryStyles.binIcon}
              method={() => setShowDelete(true)}
            />
            <TouchableOpacity
              style={logStyles.enableEditButton}
              onPress={() => editPermissionByPatient()}>
              <Text style={globalStyles.actionButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isEmpty(patient) && isEmpty(pendingCaregiver) && (
        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity
            onPress={() => authorise()}
            style={
              getPermissionsArr().length > 0
                ? globalStyles.submitButtonStyle
                : globalStyles.skipButtonStyle
            }>
            <Text style={globalStyles.actionButtonText}>Request</Text>
          </TouchableOpacity>
        </View>
      )}

      <DeleteModal
        visible={showDelete}
        item={chosenUser?.first_name}
        confirmMethod={deleteCaregiver}
        close={() => setShowDelete(false)}
      />
    </Modal>
  );
};

export default AddViewCaregiverModal;

const styles = StyleSheet.create({
  fieldText: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#3c3c43',
    opacity: 0.6,
    fontSize: adjustSize(20),
    marginStart: '3%',
  },
  rowMargin: {
    marginStart: '2%',
    marginEnd: '2%',
    flex: 1,
  },
  subField: {
    fontFamily: 'SFProDisplay-Regular',
    opacity: 0.6,
    fontSize: adjustSize(16),
  },
  mainField: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(20),
  },
  downIcon: {
    position: 'absolute',
    right: '2%',
    zIndex: 2,
  },
  pdpaText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(16),
    alignSelf: 'center',
    marginTop: '5%',
  },
  container: {
    marginBottom: '1%',
    marginTop: '1%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointedText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(20),
    marginStart: '3%',
    color: Colors.grey,
    opacity: 0.6,
  },
});
