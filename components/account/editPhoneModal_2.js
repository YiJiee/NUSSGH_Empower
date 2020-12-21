import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
//styles
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import {editPhonNum} from '../../netcalls/requestsAccount';
//functions
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const EditPhoneModal_2 = (props) => {
  const {token} = props;
  const [number, setNumber] = useState('');

  const checkPhoneNo = () => {
    if (number) {
      if (number !== '') {
        let first = number.substring(0, 1);
        if (first === '8' || first === '9') {
          if (number.length === 8) {
            return '';
          }
        } else {
          return 'Please input a valid mobile number';
        }
      }
    }
  };

  const handleSubmit = () => {
    editPhonNum(number, token).then((response) => {
      if (response) {
        Alert.alert(
          'Mobile No. Changed Successfully',
          '',
          [
            {
              text: 'Got It',
              onPress: () => {
                props.close();
                props.closeParent();
                props.closeLast();
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          'Unexpected Error',
          'Please try again alter',
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
        <Text style={globalStyles.pageDetails}>Verficiation Success</Text>
        <Text style={[globalStyles.pageSubDetails, {fontSize: adjustSize(18)}]}>
          Please enter the new mobile no. that you wish to change to:
        </Text>
        <TextInput
          style={globalStyles.editInputBox}
          placeholder="+65"
          onChangeText={(value) => {
            var cleanNumber = value.replace(/[^0-9]/g, '');
            setNumber(cleanNumber);
          }}
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={8}
        />
        <Text style={[globalStyles.alertText, {marginStart: '4%'}]}>
          {checkPhoneNo()}
        </Text>
      </View>
      <View style={globalStyles.buttonContainer}>
        {checkPhoneNo() === '' ? (
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

export default EditPhoneModal_2;
