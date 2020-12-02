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
import TargetBlock from '../../../components/diary/targetBlock';
import CalendarDay2Component from '../../../components/diary/calendarDay_2';
//functions
import {getDateRange} from '../../../commonFunctions/diaryFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
//style
import globalStyles from '../../../styles/globalStyles';
import {Colors} from '../../../styles/colors';
//third party lib
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar} from 'react-native-calendars';
import LeftArrowBtn from '../../../components/logs/leftArrowBtn';
import PartialNFullCalendar from '../../../components/partialNFullCalendar';

const DiaryScreen = (props) => {
  const today_date = Moment(new Date()).format('YYYY-MM-DD');

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today_date);

  //set useeffect to render this week refresh every 1min
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setDates(getDateRange(6, new Date()));
    });
  }, []);

  return (
    <View style={globalStyles.pageContainer}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={() => props.navigation.navigate('Home')} />
      </View>
      <Text style={globalStyles.pageHeader}>Diary</Text>
      <PartialNFullCalendar
        today_date={today_date}
        dates={dates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setDates={setDates}
        allowBeyondToday={false}
        type={'diary'}
      />
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
  viewLog: {
    fontSize: adjustSize(23),
    color: Colors.lastLogValueColor,
  },
  chevronDown: {
    color: Colors.backArrowColor,
    alignSelf: 'center',
  },
});

export default DiaryScreen;
