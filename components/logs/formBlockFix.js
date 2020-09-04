import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import RadioButton from '../radioButton';

const FormBlockFix = (props) => {
  return (
    <View>
      <Text style={styles.questionHeader}>{props.question}</Text>
      <View style={styles.buttonGroupStyle}>
        <TouchableOpacity onPress={() => props.getFormSelection(true)}>
          <RadioButton
            btnText={'Yes'}
            color={props.color}
            selected={props.selectYes}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginStart: '40%'}}
          onPress={() => props.getFormSelection(false)}>
          <RadioButton
            btnText={'No'}
            color={props.color}
            selected={!props.selectYes}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormBlockFix;

const styles = StyleSheet.create({
  questionHeader: {
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
    marginTop: '5%',
    marginStart: '2%',
  },
  buttonGroupStyle: {
    flexDirection: 'row',
    marginTop: ' 5%',
    marginStart: '5%',
  },
});
