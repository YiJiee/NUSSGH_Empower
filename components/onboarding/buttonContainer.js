import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import globalStyles from '../../styles/globalStyles';

const BtnContainer = (props) => {
  const {onSkip, onNext, stepNo} = props;
  const {enable1, enable2} = props;

  return (
    <View style={globalStyles.buttonContainer}>
      {stepNo === 1 ? (
        enable1() === true ? (
          <TouchableOpacity
            style={globalStyles.nextButtonStyle}
            onPress={() => onNext()}>
            <Text style={globalStyles.actionButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              globalStyles.nextButtonStyle,
              {backgroundColor: '#eef6d3'},
            ]}>
            <Text style={[globalStyles.actionButtonText, {opacity: 0.2}]}>
              Next
            </Text>
          </TouchableOpacity>
        )
      ) : null}

      {stepNo === 2 ? (
        enable2() ? (
          <TouchableOpacity
            style={globalStyles.skipButtonStyle}
            onPress={() => onSkip(stepNo)}>
            <Text style={globalStyles.actionButtonText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={globalStyles.nextButtonStyle}
            onPress={() => onNext()}>
            <Text style={globalStyles.actionButtonText}>Next</Text>
          </TouchableOpacity>
        )
      ) : null}

      {stepNo === 3 ? (
        <TouchableOpacity
          style={globalStyles.skipButtonStyle}
          onPress={() => onSkip(stepNo)}>
          <Text style={globalStyles.actionButtonText}>Skip</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default BtnContainer;
