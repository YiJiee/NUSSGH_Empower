import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';

const DataField = (props) => {
  const {fieldName, value} = props;
  return (
    <>
      <Text style={[styles.inputHeader, {marginTop: adjustSize(20)}]}>{fieldName} : </Text>
      <TextInput
        style={styles.inputBox}
        placeholderTextColor="black"
        keyboardType="decimal-pad"
        placeholder={String(value)}
        editable={false}
        returnKeyType="done"
      />
    </>
  );
};

export default DataField;

const styles = StyleSheet.create({
  inputBox: {
    fontSize: adjustSize(19),
    backgroundColor: '#EEF3BD',
    paddingStart: adjustSize(20), //position placeholder text
    marginVertical: adjustSize(10),
    padding: '2%',
  },
  inputHeader: {
    fontSize: adjustSize(18),
    fontWeight: '700',
  },
});
