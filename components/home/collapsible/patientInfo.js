import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Animated} from 'react-native';
import {Colors} from '../../../styles/colors';
import {isEmpty, getAge} from '../../../commonFunctions/common';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const PatientInfo = (props) => {
  const {patient} = props;
  const [open, setOpen] = useState(true);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;

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
    <View
      onLayout={(event) => setMaxHeight(event.nativeEvent.layout.height)}
      style={{backgroundColor: Colors.patientType}}>
      <View
        style={styles.cardTab}
        onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity
          onPress={() => {
            toggle(open);
          }}
          style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>Patient Info</Text>
        </TouchableOpacity>
      </View>
      {/*Content */}
      {open ? (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            backgroundColor: 'white',
          }}>
          <View style={{marginBottom: '2%'}}>
            <View style={styles.content}>
              <Text style={styles.header}>Trial ID</Text>
              <Text style={styles.detail}>
                {patient?.trial_id?.length === 0 ? '-' : patient?.trial_id}
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.header}>Age</Text>
              <Text style={styles.detail}>
                {isEmpty(patient) ? '-' : patient?.age}
              </Text>
            </View>
            {/*
            <View style={styles.content}>
              <Text style={styles.header}>Weight</Text>
              <Text style={styles.detail}>
                {isEmpty(patient) ? '-' : patient?.weight} kg
              </Text>
            </View>
        */}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
};

export default PatientInfo;

const styles = StyleSheet.create({
  cardTab: {
    backgroundColor: 'white',
    borderTopStartRadius: adjustSize(20),
    borderTopEndRadius: adjustSize(20),
  },
  headerTab: {
    padding: '3%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    marginStart: '3%',
  },
  patientName: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
    color: 'white',
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    marginStart: '5%',
    marginTop: '2%',
    marginBottom: '3%',
  },
  header: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    color: '#21293A',
    opacity: 0.6,
    flex: 1,
  },
  detail: {
    justifyContent: 'center',
    marginEnd: '3%',
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Regular',
  },
});
