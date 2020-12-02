import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import Moment from 'moment';
import {getDateObj} from '../commonFunctions/diaryFunctions';
import {adjustSize} from '../commonFunctions/autoResizeFuncs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from '../styles/colors';

const AppointmentContainer = (props) => {
  const {date, title, startTime, endTime, sessionId, type, location} = props;
  const {onClick} = props;
  const start = Moment(getDateObj(startTime));
  const end = Moment(getDateObj(endTime));

  const now = Moment(new Date());

  const showChatBtn = () => {
    if (start.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')) {
      let starttime = Number(start.format('hhmm'));
      let endtime = Number(end.format('HHmm'));
      let nowtime = Number(now.format('HHmm'));

      if (starttime <= nowtime && nowtime <= endtime) {
        return true;
      }
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.dateContainer}>
          <Text style={[styles.textBold, {textAlign: 'center'}]}>
            {Moment(getDateObj(date)).format('DD MMM')}
          </Text>
        </View>
        <View style={{margin: '3%'}}>
          <Text style={styles.textBold}>{title}</Text>
          <Text style={styles.text}>
            {Moment(start).format('hh:mm a')} - {Moment(end).format('hh:mm a')}
          </Text>
          {location?.length != 0 && <Text style={styles.text}>{location}</Text>}
        </View>
      </View>
      {location.length === 0 && (
        <View style={{flexDirection: 'row', marginTop: '2%'}}>
          <Text style={[styles.text, {opacity: 0.5, flex: 1}]}>
            Session ID: {sessionId}
          </Text>
          {showChatBtn() ? (
            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.buttonText}>Chat Now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.chatButton,
                {backgroundColor: Colors.lastLogValueColor},
              ]}>
              <Text style={styles.buttonText}>
                {start.isBefore(now) ? 'Ended' : 'Upcoming'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default AppointmentContainer;

const styles = StyleSheet.create({
  container: {
    borderRadius: 9.5,
    borderWidth: 1,
    borderColor: '#e2e8ee',
    margin: '2%',
    padding: '3%',
    backgroundColor: 'white',
  },
  dateContainer: {
    backgroundColor: '#e2e8ee',
    borderRadius: 4.1,
    padding: '3%',
    width: '15%',
    justifyContent: 'center',
  },
  textBold: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
  },
  text: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(16),
  },
  chatButton: {
    backgroundColor: '#16A950',
    paddingVertical: '3%',
    paddingHorizontal: '10%',
    borderRadius: 9.5,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    fontSize: adjustSize(18),
  },
});
