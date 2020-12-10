import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
import PartialNFullCalendar from '../../components/partialNFullCalendar';
//third party lib
import Moment from 'moment';
//function
import {get3DayB4NAfter, convertDatestring} from '../../commonFunctions/common';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import AppointmentContainer from '../../components/appointmentContainer';
import {getAppointments} from '../../netcalls/requestsAppointment';
import {getDateObj} from '../../commonFunctions/diaryFunctions';

const AppointmentScreen = (props) => {
  const today_date = Moment(new Date()).format('YYYY-MM-DD');

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today_date); //to be used to get appointment*
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setDates(get3DayB4NAfter(new Date(today_date)));
    });
  }, []);

  useEffect(() => {
    getAppointments().then((rsp) => {
      if (rsp != null) {
        let arr = [];
        for (var x of rsp) {
          let d = Moment(getDateObj(x?.start)).format('YYYY-MM-DD');
          if (d === selectedDate) {
            arr.push(x);
          }
        }
        setAppointments(arr);
      }
    });
  }, [selectedDate]);

  return (
    <View style={{...globalStyles.pageContainer, ...props.style}}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={() => props.navigation.navigate('Home')} />
      </View>
      <Text style={globalStyles.pageHeader}>Appointments</Text>
      <PartialNFullCalendar
        today_date={today_date}
        dates={dates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setDates={setDates}
        allowBeyondToday={true}
      />
      <Text style={[globalStyles.pageDetails, styles.upcomingAppointment]}>
        Upcoming Appointment
      </Text>
      <ScrollView contentContainerStyle={{flexGrow: 0}}>
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <AppointmentContainer
              key={index}
              date={item.start}
              title={item.title + ' with ' + item?.physician}
              startTime={item?.start}
              endTime={item?.end}
              location={item?.location}
              sessionId={item?.session_id}
              type={'chat'}
            />
          ))
        ) : (
          <Text style={globalStyles.pageSubDetails}>
            No Appointment for the day
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  upcomingAppointment: {
    fontSize: adjustSize(23),
    opacity: 0.6,
  },
});
