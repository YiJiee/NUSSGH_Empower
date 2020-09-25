import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import globalStyles from '../../styles/globalStyles';

const AboutDateSelection = (props) => {
  const {visible, closeModal} = props;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => closeModal()}
      onBackButtonPress={() => closeModal()}>
      <View style={styles.container}>
        <Text style={styles.text}>Date Time Selection</Text>
        <Text style={styles.textDetail}>
          You can select a date 1 day before or 10 minutes after the current
          time.
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

export default AboutDateSelection;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 9.5,
    alignSelf: 'center',
    padding: '3%',
  },
  text: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  textDetail: {
    marginTop: '2%',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
});
