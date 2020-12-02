import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Animated} from 'react-native';
import {Colors} from '../../../styles/colors';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

import TYPE_1 from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-type1-alert.svg';
import TYPE_2 from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-type2-alert.svg';
import HYPER from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-hyper-alert.svg';
import HYPO from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-hypo-alert.svg';
import INSULIN from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-insulin-alert.svg';
import PREGNANT from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-preg-alert.svg';
import PRIORITY from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-priority-alert.svg';
import STEROID from '../../../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-muscle-alert.svg';

const iconStyle = {
  width: adjustSize(30),
  height: adjustSize(30),
};

const PatientType = (props) => {
  const {patientTypes} = props;
  const [open, setOpen] = useState(true);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;

  console.log(patientTypes);

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
      style={{backgroundColor: Colors.dailyTab}}>
      <View
        style={styles.cardTab}
        onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity
          onPress={() => {
            toggle(open);
          }}
          style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>Patient Type</Text>
        </TouchableOpacity>
      </View>
      {/*Content */}
      {open && (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            backgroundColor: Colors.patientType,
          }}>
          <View style={{paddingBottom: '2%'}}>
            {patientTypes?.priority && (
              <View style={styles.typeContainer}>
                <PRIORITY {...iconStyle} />
                <Text style={styles.detail}>Priority</Text>
              </View>
            )}
            {patientTypes?.diabetes_type === 1 && (
              <View style={styles.typeContainer}>
                <TYPE_1 {...iconStyle} />
                <Text style={styles.detail}>Type 1 Diabetes</Text>
              </View>
            )}
            {patientTypes?.diabetes_type === 2 && (
              <View style={styles.typeContainer}>
                <TYPE_2 {...iconStyle} />
                <Text style={styles.detail}>Type 2 Diabetes</Text>
              </View>
            )}

            {patientTypes?.blevel_risk === 0 ? (
              <View style={styles.typeContainer}>
                <HYPER {...iconStyle} />
                <Text style={styles.detail}>Hyperglycemia Risk</Text>
              </View>
            ) : patientTypes?.blevel_risk === 1 ? (
              <View style={styles.typeContainer}>
                <HYPER {...iconStyle} />
                <Text style={styles.detail}>Hypoglycemia Risk</Text>
              </View>
            ) : null}
            {patientTypes?.newly_started_insulin && (
              <View style={styles.typeContainer}>
                <INSULIN {...iconStyle} />
                <Text style={styles.detail}>Newly Started Insulin</Text>
              </View>
            )}
            {patientTypes?.pregnancy && (
              <View style={styles.typeContainer}>
                <PREGNANT {...iconStyle} />
                <Text style={styles.detail}>Pregnancy</Text>
              </View>
            )}
            {patientTypes?.steroid === 0 ? (
              <View style={styles.typeContainer}>
                <STEROID {...iconStyle} />
                <Text style={styles.detail}>Steroid-Induced</Text>
              </View>
            ) : patientTypes?.steroid === 1 ? (
              <View style={styles.typeContainer}>
                <STEROID {...iconStyle} />
                <Text style={styles.detail}>Steroid with Chemo</Text>
              </View>
            ) : null}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default PatientType;

const styles = StyleSheet.create({
  cardTab: {
    backgroundColor: Colors.patientType,
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
  typeContainer: {
    marginStart: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
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
  detail: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Regular',
    marginStart: '3%',
  },
});
