import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import LeftArrowBtn from '../logs/leftArrowBtn';
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const sampleNum = '654321';

const AuthoriseModal = (props) => {
  const {visible} = props;
  const {closeModal, closeParent} = props;
  const [pinNum, setPinNum] = useState('');
  const [pinArr, setPinArr] = useState([]);

  useEffect(() => {
    setPinNum(sampleNum);
    let chars = pinNum.split('');
    setPinArr(chars);
  }, [visible]);

  const goBack = () => {
    closeModal();
    closeParent();
  };
  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      backdropOpacity={1}
      onBackButtonPress={() => closeModal()}
      style={{margin: 0}}
      backdropColor={Colors.backgroundColor}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => closeModal()} />
        </View>
        <Text style={globalStyles.pageHeader}>Add Caregiver</Text>
        <Text style={styles.subHeading}>Authorization</Text>
        <Text style={[globalStyles.pageSubDetails, {marginTop: '4%'}]}>
          To appoint a Caregiver, show the below authorization code to the
          Caregiver
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            margin: '10%',
          }}>
          {pinArr?.map((item, index) => (
            <Text key={index} style={styles.pinNo}>
              {item}
            </Text>
          ))}
        </View>
      </View>
      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.submitButtonStyle}
          onPress={() => goBack()}>
          <Text style={globalStyles.actionButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AuthoriseModal;

const styles = StyleSheet.create({
  subHeading: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
    marginStart: '3%',
    color: Colors.grey,
    opacity: 0.6,
  },
  pinNo: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
  },
});
