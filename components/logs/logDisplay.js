import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  getLastBgLog,
  getLastWeightLog,
} from '../../storage/asyncStorageFunctions';

//for displaying the most recent value for weight/blood glucose log
//pass in a prop type="Weight" or "BloodGlucose"

const BloodGlucoseType = 'BloodGlucose';
const WeightType = 'Weight';

const LogDisplay = (props) => {
  const {type} = props;
  const [lastValue, setLastValue] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (type === BloodGlucoseType) {
      getLastBgLog().then((data) => {
        setValues(data);
      });
    }
    if (type === WeightType) {
      getLastWeightLog().then((data) => {
        setValues(data);
      });
    }
  }, []);

  const setValues = (data) => {
    if (data != null) {
      setLastValue(data.value);
      setTime(data.time);
    }
  };

  return (
    <>
      {lastValue === '' ? (
        <View></View>
      ) : (
        <View style={[styles.container, styles.shadow]}>
          {type === BloodGlucoseType && (
            <Text style={styles.textStyle}>
              Your most recent blood glucose log is{' '}
              <Text style={styles.bold}>{lastValue}</Text> mmol/L at{' '}
              <Text style={styles.bold}>{time}</Text> today.
            </Text>
          )}
          {type === WeightType && (
            <Text style={styles.textStyle}>
              Your most recent weight log is{' '}
              <Text style={styles.bold}>{lastValue}</Text> kg at{' '}
              <Text style={styles.bold}>{time}</Text> today.
            </Text>
          )}
        </View>
      )}
    </>
  );
};

export default LogDisplay;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '5%',
    borderRadius: 20,
    padding: '4%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    fontSize: 17,
  },
  bold: {
    fontWeight: '700',
    color: '#d22b55',
  },
});