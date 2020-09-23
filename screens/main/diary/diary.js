import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
//component
import MenuBtn from '../../../components/menuBtn';
import TargetBlock from '../../../components/diary/targetBlock';
import CalendarDay2Component from '../../../components/diary/calendarDay_2';
//functions
import {getDateRange} from '../../../commonFunctions/diaryFunctions';
//style
import globalStyles from '../../../styles/globalStyles';
import {Colors} from '../../../styles/colors';
//third party lib
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar} from 'react-native-calendars';
import LeftArrowBtn from '../../../components/logs/leftArrowBtn';

const DiaryScreen = (props) => {
  const today_date = Moment(new Date()).format('YYYY-MM-DD');

  const [dates, setDates] = useState([]);
  const [partialVisible, setPartialVisible] = useState(true); //show 7days
  const [showCalendarFull, setShowCalendarFull] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today_date);
  const [calendarselect, setCalendarSelect] = useState({
    [today_date]: {
      selected: true,
      marked: true,
    },
  });
  const dropDownAnimation = useRef(new Animated.Value(0)).current;
  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  //set useeffect to render this week refresh every 1min
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setDates(getDateRange(6, new Date()));
    });
  }, []);

  //animate drop down calendar
  useEffect(() => {
    if (showCalendarFull) {
      Animated.timing(dropDownAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [showCalendarFull]);

  //select date from half calendar
  const chooseDate = (item) => {
    setSelectedDate(item);
    setSelected(item);
  };

  //select date from full calendar
  const selectDate = (item) => {
    setSelectedDate(item);
    setSelected(item);
    setDates(getDateRange(6, new Date(item)));
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

  const displayCalendar = () => {
    setShowCalendarFull(!showCalendarFull);
    setPartialVisible(!partialVisible);
  };

  return (
    <View style={globalStyles.pageContainer}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={() => props.navigation.navigate('Home')} />
      </View>
      <Text style={globalStyles.pageHeader}>Diary</Text>
      {showCalendarFull ? (
        <Animated.View style={{maxHeight: heightInterpolation}}>
          <Calendar
            dayComponent={CalendarDay2Component}
            maxDate={today_date}
            hideArrows={false}
            selectAll={false}
            markedDates={calendarselect}
            onDayPress={(day) => {
              selectDate(day.dateString);
            }}
            theme={{
              calendarBackground: Colors.backgroundColor,
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  marginTop: 6,
                  alignItems: 'center',
                },
                headerContainer: {
                  width: '85%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
                monthText: {
                  fontSize: 20,
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
          {dates.map((item, index) =>
            selectedDate === item ? (
              <TouchableOpacity
                key={item}
                style={styles.selectedDateContainer}
                onPress={() => chooseDate(item)}>
                <Text style={styles.selectedDateText}>
                  {Moment(new Date(item)).format('D MMM')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={item}
                style={styles.dateContainer}
                onPress={() => chooseDate(item)}>
                <Text style={styles.dateText}>
                  {Moment(new Date(item)).format('D MMM')}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      )}
      <TouchableOpacity onPress={() => displayCalendar()}>
        {showCalendarFull ? (
          <Icon name="angle-double-up" size={40} style={styles.chevronDown} />
        ) : (
          <Icon name="angle-double-down" size={40} style={styles.chevronDown} />
        )}
      </TouchableOpacity>
      <Text style={[globalStyles.pageDetails, styles.viewLog]}>
        View Your Logs
      </Text>
      <ScrollView contentContainerStyle={{flexGrow: 0}}>
        <>
          {/*Day Summary for Log*/}
          <View style={{flex: 1}}>
            <TargetBlock date={selectedDate} navigation={props.navigation} />
          </View>
        </>
      </ScrollView>
    </View>
  );
};

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
    fontSize: 17,
    fontFamily: 'SFProDisplay-Regular',
  },
  selectedDateText: {
    textAlign: 'center',
    fontSize: 18,
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
    borderRadius: 9.5,
  },
  viewLog: {
    fontSize: 23,
    color: Colors.lastLogValueColor,
  },
  chevronDown: {
    color: Colors.backArrowColor,
    alignSelf: 'center',
  },
});

export default DiaryScreen;
