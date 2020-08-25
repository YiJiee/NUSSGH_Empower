import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

//show the calendar view with underline when there is medication for that particular day
const CalendarMedicationDay = (props) => {
  const {state, marking = {}, date} = props;

  const getContentStyle = () => {
    const style = {
      content: {},
      text: {
        color: '#181c26',
      },
    };

    if (state === 'disabled') {
      style.text.color = '#c1c2c1';
    } else if (marking.marked === true && marking.medicationList.length != 0) {
      console.log('hihihi');
      style.text.color = 'black';
      style.content.backgroundColor = '#aad326';
      style.content.borderRadius = 10;
    } else {
      style.content.backgroundColor = '#e2e2e2';
      style.content.borderRadius = 10;
    }
    return style;
  };

  //open modal with medication
  const onDayPress = () => {
    props.onPress(props.marking);
  };

  const contentStyle = getContentStyle();
  return (
    getContentStyle() && (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.content, contentStyle.content]}
          onPress={onDayPress}>
          <Text style={[styles.contentText, contentStyle.text]}>
            {String(date.day)}
          </Text>
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30%',
  },
  weekName: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#7c7c7c',
  },
  content: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
  },
});

export default CalendarMedicationDay;
