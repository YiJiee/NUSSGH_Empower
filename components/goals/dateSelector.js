import React, {useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party libs
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
//styles
import {Colors} from '../../styles/colors';
import {normalTextFontSize} from '../../styles/variables';
import globalStyles from '../../styles/globalStyles';

const DateSelector = (props) => {
  const {date, type, opened, checkAgainst} = props;
  const {setDate, setOpened} = props;
  const [visible, setVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const formatDisplayDate = (value) => {
    return moment(value).format('DD MMM YYYY');
  };

  const heightInterpolate = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 225], //I don't know how to get the height of the datepicker but 225 seems to fit it just nice.
    extrapolate: 'clamp',
  });

  const handleOpenCloseWithAnimation = (currentVisibility) => {
    //change text
    setOpened(true);

    if (currentVisibility) {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300, // 300ms slide up animation when visible is set false.
        useNativeDriver: false,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300, // 300ms slide down animation when visible is set true.
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => handleOpenCloseWithAnimation(visible)}
        style={[{marginBottom: '2%'}, globalStyles.goalFieldBottomBorder]}>
        <View style={{flexDirection: 'row'}}>
          {type === 'start' ? (
            <Text style={[globalStyles.goalFieldName, {flex: 1}]}>
              Start Date
            </Text>
          ) : (
            <Text style={[globalStyles.goalFieldName, {flex: 1}]}>
              End Date
            </Text>
          )}
          {opened && (
            <Text style={styles.dateValue}>{formatDisplayDate(date)}</Text>
          )}
          {!opened && <Text style={styles.selectStyle}>Select Date</Text>}
        </View>
      </TouchableOpacity>
      {visible && (
        <Animated.View
          style={[
            styles.slideAnimationWrapperForDatePicker,
            {height: heightInterpolate},
          ]}>
          {type === 'start' ? (
            <DatePicker
              visible={visible}
              date={date}
              onDateChange={setDate}
              mode="date"
              minimumDate={new Date()}
              maximumDate={checkAgainst}
            />
          ) : (
            <DatePicker
              visible={visible}
              date={date}
              onDateChange={setDate}
              mode="date"
              minimumDate={checkAgainst}
            />
          )}
        </Animated.View>
      )}
      <View style={styles.border} />
    </>
  );
};

const styles = StyleSheet.create({
  slideAnimationWrapperForDatePicker: {
    overflow: 'hidden',
    alignSelf: 'center',
  },
  dateFieldName: {
    color: Colors.lastLogValueColor,
    flex: 1,
    marginStart: '4%',
  },
  dateValue: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: normalTextFontSize,
    marginTop: '3%',
    marginEnd: '3%',
  },
  selectStyle: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: normalTextFontSize,
    marginTop: '3%',
    marginEnd: '3%',
    color: '#aad326',
  },
  border: {
    borderBottomWidth: 0.2,
    borderColor: Colors.lastLogValueColor,
    paddingTop: '1%',
    marginStart: '3%',
    marginEnd: '3%',
  },
});

export default DateSelector;
