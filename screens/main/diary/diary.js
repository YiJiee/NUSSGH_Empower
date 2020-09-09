import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
//component
import MenuBtn from '../../../components/menuBtn';
import TargetBlock from '../../../components/diary/targetBlock';
//functions
import {getDateRange} from '../../../commonFunctions/diaryFunctions';
//style
import globalStyles from '../../../styles/globalStyles';
import {Colors} from '../../../styles/colors';
//third party lib
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar} from 'react-native-calendars';
import CalendarDayComponent from '../../../components/onboarding/medication/calendarDay';
import CalendarTemplate from '../../../components/calendar/calendarTemplate';

const DiaryScreen = (props) => {
  const today_date = Moment(new Date()).format('YYYY-MM-DD');

  const [dates, setDates] = useState([]);
  const [partialVisible, setPartialVisible] = useState(true); //show 7days
  const [showCalendarFull, setShowCalendarFull] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today_date);
  const [calendarselect, setCalendarSelect] = useState({});

  //set useeffect to render this week*
  useEffect(() => {
    setDates(getDateRange(6, new Date()));
  }, []);

  //select date from half calendar
  chooseDate = (item) => {
    setSelectedDate(item);
  };

  //select date from full calendar
  selectDate = (item) => {
    setSelectedDate(item);
    setDates(getDateRange(6, new Date(item)));
    let newobj = {
      [item]: {
        selected: true,
        marked: true,
      },
    };
    setCalendarSelect(newobj);
  };

  displayCalendar = () => {
    setShowCalendarFull(!showCalendarFull);
    setPartialVisible(!partialVisible);
  };

  return (
    <View style={globalStyles.pageContainer}>
      <MenuBtn />
      <ScrollView contentContainerStyle={{flexGrow: 0}}>
        <>
          <Text style={globalStyles.pageHeader}>Diary</Text>
          {showCalendarFull ? (
            <Calendar
              dayComponent={CalendarDayComponent}
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
                    justifyContent: 'center', //added
                    marginTop: 6,
                    alignItems: 'center',
                  },
                  headerContainer: {
                    width: '80%',
                    flexDirection: 'row',
                  },
                  monthText: {
                    fontSize: 20,
                    fontFamily: 'SFProDisplay-Bold',
                    textAlign: 'center',
                  },
                },
                arrowColor: Colors.lastLogValueColor,
              }}
            />
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
              <Icon
                name="angle-double-up"
                size={40}
                style={styles.chevronDown}
              />
            ) : (
              <Icon
                name="angle-double-down"
                size={40}
                style={styles.chevronDown}
              />
            )}
          </TouchableOpacity>
          {/*Day Summary for Log*/}
          <Text style={[globalStyles.pageDetails, styles.viewLog]}>
            View Your Logs
          </Text>
          <TargetBlock date={selectedDate} navigation={props.navigation} />
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
