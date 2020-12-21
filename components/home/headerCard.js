import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
//styles
import {Colors} from '../../styles/colors';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const HeaderCard = (props) => {
  const {username, hour} = props;

  return (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: '#F5F6F9',
        paddingBottom: '3%',
      }}>
      <Text style={styles.greetingText}>Good {hour},</Text>
      <Text style={styles.usernameText}>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingText: {
    color: 'black',
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
  },
  usernameText: {
    color: '#16A750',
    fontSize: adjustSize(40),
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
  },
  chevron: {
    marginTop: '5%',
    color: Colors.lastLogValueColor,
  },
});

export default HeaderCard;

//comment
