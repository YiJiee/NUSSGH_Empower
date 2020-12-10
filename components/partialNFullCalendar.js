import React, {useState, useEffect, useRef} from 'react';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {View, StyleSheet, Text, TouchableOpacity, Animated} from 'react-native';
import {Calendar} from 'react-native-calendars';
import CalendarDay2Component from './diary/calendarDay_2';
import {Colors} from '../styles/colors';
import {adjustSize} from '../commonFunctions/autoResizeFuncs';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getDateRange} from '../commonFunctions/diaryFunctions';
import {get3DayB4NAfter} from '../commonFunctions/common';

const PartialNFullCalendar = (props) => {
  const {today_date, dates, selectedDate, type, allowBeyondToday} = props;
  const {setSelectedDate, setDates} = props;
  const [maxDate, setMaxDate] = useState(allowBeyondToday ? null : today_date);

  const [calendarselect, setCalendarSelect] = useState({
    [today_date]: {
      selected: true,
      marked: true,
    },
  });
  const [showCalendarFull, setShowCalendarFull] = useState(false);
  const [partialVisible, setPartialVisible] = useState(true); //show 7days
  const dropDownAnimation = useRef(new Animated.Value(0)).current;

  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  //animate drop down calendar
  useEffect(() => {
    if (showCalendarFull) {
      Animated.timing(dropDownAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }).start();
    }
  }, [showCalendarFull]);

  const displayCalendar = () => {
    setShowCalendarFull(!showCalendarFull);
    setPartialVisible(!partialVisible);
  };

  //select date from half calendar
  const chooseDate = (item) => {
    setSelectedDate(item);
    setSelected(item);
  };

  //select date from full calendar (diff for appointment and diary*)
  const selectDate = (item) => {
    setSelectedDate(item);
    setSelected(item);

    if (type === 'diary') {
      setDates(getDateRange(6, new Date(item)));
    } else {
      setDates(get3DayB4NAfter(new Date(item)));
    }
  };

  const setSelected = (item) => {
    let newobj = {
      [item]: {
        selected: true,
        marked: true,
      },
    };
    setCalendarSelect(newobj);
  };

  return (
    <>
      {showCalendarFull ? (
        <Animated.View style={{maxHeight: heightInterpolation}}>
          <Calendar
            dayComponent={CalendarDay2Component}
            maxDate={maxDate}
            markedDates={calendarselect}
            onDayPress={(day) => {
              selectDate(day.dateString);
            }}
            renderArrow={(direction) =>
              direction === 'left' ? (
                <EvilIcon name="chevron-left" size={30} />
              ) : (
                <EvilIcon name="chevron-right" size={30} />
              )
            }
            theme={{
              calendarBackground: Colors.backgroundColor,
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  marginTop: '2%',
                  alignItems: 'center',
                  alignSelf: 'center',
                },
                headerContainer: {
                  width: '80%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                },
                monthText: {
                  fontSize: adjustSize(20),
                  fontFamily: 'SFProDisplay-Bold',
                },
              },
              arrowColor: Colors.lastLogValueColor,
            }}
          />
        </Animated.View>
      ) : null}
      {partialVisible && (
        <View style={styles.dateList}>
          {dates.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[
                type != 'diary' &&
                  Moment(item) < Moment(today_date) && {
                    backgroundColor: '#ebebeb',
                  },
                selectedDate != item
                  ? styles.dateContainer
                  : styles.selectedDateContainer,
              ]}
              onPress={() => chooseDate(item)}>
              <Text
                style={[
                  selectedDate != item
                    ? styles.dateText
                    : styles.selectedDateText,
                  type != 'diary' &&
                    Moment(item) < Moment(today_date) && {
                      opacity: 0.5,
                    },
                ]}>
                {Moment(new Date(item)).format('D MMM')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => displayCalendar()}>
        {showCalendarFull ? (
          <Icon
            name="angle-double-up"
            size={adjustSize(40)}
            style={styles.chevronDown}
          />
        ) : (
          <Icon
            name="angle-double-down"
            size={adjustSize(40)}
            style={styles.chevronDown}
          />
        )}
      </TouchableOpacity>
    </>
  );
};

export default PartialNFullCalendar;

const styles = StyleSheet.create({
  dateList: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: '2%',
    justifyContent: 'space-around',
    marginStart: '2%',
  },
  dateText: {
    textAlign: 'center',
    fontSize: adjustSize(17),
    fontFamily: 'SFProDisplay-Regular',
  },
  selectedDateText: {
    textAlign: 'center',
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
  },
  dateContainer: {
    backgroundColor: '#e2e8ee',
    width: '11%',
    marginStart: '2%',
    paddingTop: '5%',
    paddingBottom: '5%',
    paddingHorizontal: '1%',
    borderRadius: 9.5,
  },
  selectedDateContainer: {
    backgroundColor: '#aad326',
    width: '12%',
    marginStart: '2%',
    paddingTop: '5%',
    paddingBottom: '5%',
    paddingHorizontal: '1%',
    borderRadius: adjustSize(9.5),
  },
  viewLog: {
    fontSize: adjustSize(23),
    color: Colors.lastLogValueColor,
  },
  chevronDown: {
    color: Colors.backArrowColor,
    alignSelf: 'center',
  },
});
