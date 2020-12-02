import React, {useState, useRef} from 'react';
import {View, StyleSheet, Text, Animated, Linking, Image} from 'react-native';
//function
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
// components
import ResponseModal from '../../../components/onboarding/fitbit/ResponseModal';
import LeftArrowBtn from '../../../components/logs/leftArrowBtn';
// others
import {STATUS} from '../../../components/onboarding/fitbit/Status';
import globalStyles from '../../../styles/globalStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from '../../../styles/colors';
import FitbitComponent from '../../../components/onboarding/fitbit/fitbitComponent';

export default function FitbitSetup(props) {
  const authorised = useRef(false);

  return (
    <View style={styles.onboardingContainer}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={props.navigation.goBack} />
      </View>
      <Text style={[globalStyles.pageHeader, styles.stepText]}>
        Fitbit Account
      </Text>
      <Text style={[globalStyles.pageSubDetails, styles.stepContent]}>
        Would you like to add your Fitbit account to track your activity?
        Alternatively, you can set this up later
      </Text>
      <FitbitComponent authorised={authorised} />

      <View style={{flex: 1}} />
      {authorised.current ? (
        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.nextButtonStyle]}
            onPress={() => props.navigation.goBack()}>
            <Text style={globalStyles.actionButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity
            style={globalStyles.skipButtonStyle}
            onPress={() => props.navigation.goBack()}>
            <Text style={globalStyles.actionButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingContainer: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  remainingContainer: {
    flex: 1,
  },
  fitbitIconStyle: {
    width: adjustSize(50),
    height: adjustSize(50),
    margin: adjustSize(5),
  },
  fitbitPromptContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fitbitPromptText: {
    fontSize: adjustSize(24),
    fontWeight: 'bold',
    paddingBottom: adjustSize(50),
  },
  fitbitDoneMainText: {
    fontSize: adjustSize(24),
    fontWeight: 'bold',
  },
  fitbitDoneSubText: {
    fontSize: adjustSize(20),
  },
  fitbitRedirectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: adjustSize(15),
    backgroundColor: '#4FACB6',
    borderRadius: adjustSize(15),
    justifyContent: 'center',
  },
});
