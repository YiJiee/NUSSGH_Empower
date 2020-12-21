import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import globalStyles from '../../styles/globalStyles';
import {Colors} from '../../styles/colors';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const AboutGoals = (props) => {
  const {visible, closeModal} = props;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => closeModal()}
      onBackButtonPress={() => closeModal()}>
      <View style={styles.container}>
        <Text style={styles.text}>About Goal Setting</Text>
        <Text style={styles.textDetail}>
          {'\u2713'} Create and make edits to your goals every monday!
        </Text>
        <Text style={[styles.textDetail, {color: Colors.alertColor}]}>
          {'\u2713'} Physician-set goals cannot be overwritten or edited.
        </Text>
        <TouchableOpacity
          onPress={() => closeModal()}
          style={[globalStyles.nextButtonStyle, {marginBottom: '2%'}]}>
          <Text style={globalStyles.actionButtonText}>Got It</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AboutGoals;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: adjustSize(9.5),
    alignSelf: 'center',
    padding: '4%',
  },
  text: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(20),
    textAlign: 'center',
  },
  textDetail: {
    marginTop: '2%',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
  },
});
