import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
//third party lib
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const MonthPicker = (props) => {
  const {getMonthSelected} = props;
  const [month, setMonth] = useState(Moment(new Date()));
  const [monthText, setMonthText] = useState(month.format('MMM YYYY'));

  const prevMonth = () => {
    let newMonth = month.subtract(1, 'month');
    setMonth(newMonth);
    setMonthText(newMonth.format('MMM YYYY'));
    getMonthSelected(newMonth.format('YYYY-MM'));
  };

  const nextMonth = () => {
    let newMonth = month.add(1, 'month');
    setMonth(newMonth);
    setMonthText(newMonth.format('MMM YYYY'));
    getMonthSelected(newMonth.format('YYYY-MM'));
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '3%',
      }}>
      <TouchableOpacity onPress={() => prevMonth()}>
        <Feather name="chevron-left" size={20} color={'#8b8f9a'} />
      </TouchableOpacity>
      <Text style={styles.monthText}>{monthText}</Text>
      <TouchableOpacity onPress={() => nextMonth()}>
        <Feather name="chevron-right" size={20} color={'#8b8f9a'} />
      </TouchableOpacity>
    </View>
  );
};

export default MonthPicker;

const styles = StyleSheet.create({
  monthText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    justifyContent: 'center',
  },
});
