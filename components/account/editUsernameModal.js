import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import globalStyles from '../../styles/globalStyles';
import LeftArrowBtn from '../logs/leftArrowBtn';
//functions
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const EditUsernameModal = (props) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    Alert.alert(
      'Username Changed Successfully',
      '',
      [
        {
          text: 'Got It',
          onPress: () => {
            props.close();
          },
        },
      ],
      {cancelable: false},
    );
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
        <Text style={globalStyles.pageHeader}>Edit Username</Text>
        <Text style={[globalStyles.pageSubDetails, {fontSize: adjustSize(18)}]}>
          Please enter the username that you wish to change to:
        </Text>
        <TextInput
          style={globalStyles.editInputBox}
          placeholder="Username"
          placeholderTextColor="#a1a3a0"
          onChangeText={setUsername}
        />
      </View>
      <View style={globalStyles.buttonContainer}>
        {username.length > 0 ? (
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

export default EditUsernameModal;
