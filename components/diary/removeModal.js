import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import {bg_key, food_key, med_key, weight_key} from '../../commonFunctions/logFunctions';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const RemoveModal = (props) => {
  const {visible, logType, itemToDeleteName} = props;
  const {deleteMethod, closeModal} = props;
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => closeModal()}
      onBackButtonPress={() => closeModal()}>
      <View style={styles.container}>
        {logType === med_key ? (
          <Text style={styles.removeHeader}>Remove This Medication</Text>
        ) : logType === food_key ? (
          <Text style={styles.removeHeader}>Remove This Item</Text>
        ) : logType === bg_key ? (
          <Text style={styles.removeHeader}>Remove This Reading</Text>
        ) : logType === weight_key ? (
          <Text style={styles.removeHeader}>Remove This Weight</Text>
        ) : (
          <Text style={styles.removeHeader}>Remove This Log</Text>
        )}
        {logType === bg_key ? (
          <Text style={styles.removeItem}>{itemToDeleteName} mmol/L</Text>
        ) : logType === weight_key ? (
          <Text style={styles.removeItem}>{itemToDeleteName} kg</Text>
        ) : itemToDeleteName !== '' ? (
          <Text style={styles.removeItem}>{itemToDeleteName}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => deleteMethod()}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => closeModal()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default RemoveModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: adjustSize(9.5),
  },
  removeHeader: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
    marginTop: '4%',
    marginStart: '5%',
  },
  removeItem: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Regular',
    marginTop: '4%',
    marginStart: '5%',
  },
  removeButton: {
    backgroundColor: '#ff0844',
    height: adjustSize(50),
    alignSelf: 'center',
    paddingHorizontal: '30%',
    marginTop: '10%',
    marginBottom: '3%',
    borderRadius: adjustSize(15),
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    textAlign: 'center',
  },
  cancelText: {
    alignSelf: 'center',
    color: '#ff0844',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
    marginBottom: '5%',
  },
});
