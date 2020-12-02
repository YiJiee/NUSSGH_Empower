import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Animated} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
//styles
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import Collapsible from './collapsible';
//third part lib
import moment from 'moment';
import {getDateObj} from '../../commonFunctions/diaryFunctions';
import {ScrollView} from 'react-native-gesture-handler';

const LabReportDetail = (props) => {
  const {visible, date, labResults} = props;
  const {close} = props;

  const [keysArr, setKeysArr] = useState([]);

  useEffect(() => {
    let keyList = prepareProfile();
    setKeysArr(keyList);
  }, [labResults]);

  //assuming profile keys come in the form of xxx_profile
  const formatkeyNaming = (name) => {
    let arr = String(name).split('_');
    let type =
      arr[0].substr(0, 1).toUpperCase() + arr[0].substring(1, arr[0].length);
    return type + ' Profile';
  };

  //get profile keys
  const prepareProfile = () => {
    let keys = [];

    for (const key of Object.keys(labResults)) {
      if (key != 'date' && !keys.includes(key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      backdropOpacity={1}
      onBackButtonPress={() => closeModal()}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}
      onBackdropPress={() => close()}
      onBackButtonPress={() => close()}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => close()} />
        </View>
        <Text style={globalStyles.pageHeader}>
          {moment(getDateObj(date)).format('DD MMM YYYY')}
        </Text>
        <Text style={globalStyles.pageDetails}>
          {labResults?.title != null ? labResults?.title : 'Medical Report'}
        </Text>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {keysArr.map((item, index) => (
            <Collapsible
              title={formatkeyNaming(item)}
              key={index}
              detailArr={labResults[item]}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};
export default LabReportDetail;
