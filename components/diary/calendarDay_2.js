import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const CalendarDay2Component = (props) => {
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
    } else if (marking.marked === true) {
      style.text.color = 'black';
      style.content.backgroundColor = '#aad326';
      style.content.borderRadius = 10;
    } else {
      style.content.backgroundColor = '#e2e8ee';
      style.content.borderRadius = 10;
    }
    return style;
  };

  //allow for day selection*
  const onDayPress = () => {
    props.onPress(props.date);
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
  content: {
    width: adjustSize(35),
    height: adjustSize(35),
    justifyContent: 'center',
    alignItems: 'center',
    margin: adjustSize(20),
  },
  contentText: {
    fontSize: adjustSize(18),
  },
});

export default CalendarDay2Component;

//comment
