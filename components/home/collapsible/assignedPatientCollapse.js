import React, {useEffect, useRef, useState} from 'react';
import {Alert, Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../styles/colors';
//third party lib
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import USER_F from '../../../resources/images/Patient-Icons/SVG/user-female.svg';
import USER_M from '../../../resources/images/Patient-Icons/SVG/user-male.svg';

import OptionsList from '../../optionList';
import {bin, isEmpty, text} from '../../../commonFunctions/common';
import {unassignCaregiver} from '../../../netcalls/requestsMyCaregiver';
import {storeAuthorisedStatusCaregiver} from '../../../storage/asyncStorageFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const optionList = [
  {
    name: 'Remove Patient',
    icon: bin,
    textColor: text,
  },
];

const iconStyle = {
  height: adjustSize(50),
  width: adjustSize(50),
  margin: '3%',
  marginStart: '5%',
};

const AssignedPatientCollapse = (props) => {
  const {patient, setPatient} = props;
  const [open, setOpen] = useState(true);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;
  const [openOption, setOpenOption] = useState(false);

  const deletePatient = () => {
    console.log('Deleting Patient');
    unassignCaregiver().then((rsp) => {
      if (rsp === 200) {
        Alert.alert('Removed Patient Successfully', '', [
          {
            text: 'Got It',
            onPress: () => {
              setPatient({});
              setOpenOption(false);
              storeAuthorisedStatusCaregiver(false).then(() => {});
            },
          },
        ]);
      }
    });
  };

  const toggle = (visible) => {
    if (visible) {
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(dropDownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, maxHeight],
  });

  return (
    <View onLayout={(event) => setMaxHeight(event.nativeEvent.layout.height)}>
      <View
        style={styles.cardTab}
        onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity
          onPress={() => {
            toggle(open);
          }}
          style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>Assigned Patient</Text>
        </TouchableOpacity>
      </View>
      {/*Content */}
      {open && !isEmpty(patient) ? (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            backgroundColor: Colors.notifTab,
          }}>
          <View style={{flexDirection: 'row'}}>
            {patient?.gender === 'female' ? (
              <USER_F {...iconStyle} />
            ) : (
              <USER_M {...iconStyle} />
            )}
            <Text style={styles.patientName}>{patient?.first_name}</Text>
            <TouchableOpacity
              style={styles.optionIcon}
              onPress={() => setOpenOption(true)}>
              <Icon name="options" color={'white'} size={20} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : null}
      <OptionsList
        visible={openOption}
        options={optionList}
        callback={deletePatient}
        onCancel={() => setOpenOption(false)}
      />
    </View>
  );
};

export default AssignedPatientCollapse;

const styles = StyleSheet.create({
  cardTab: {
    flexGrow: 1,
    backgroundColor: Colors.notifTab,
    borderTopStartRadius: adjustSize(20),
    borderTopEndRadius: adjustSize(20),
  },
  headerTab: {
    padding: '3%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    fontSize: adjustSize(18),
    marginStart: '3%',
  },
  patientName: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
    color: 'white',
    flex: 1,
    alignSelf: 'center',
  },
  optionIcon: {
    alignSelf: 'center',
    marginEnd: '3%',
  },
});
