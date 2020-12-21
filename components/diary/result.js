import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
//third party library
import Entypo from 'react-native-vector-icons/Entypo';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

Entypo.loadFont();

const Result = (props) => {
  const {success, message} = props;

  return (
    <View>
      {success ? (
        <View style={{flexDirection: 'row', marginBottom: '2%'}}>
          <Entypo name="check" size={adjustSize(30)} style={{color: 'green'}} />
          <Text style={styles.msg}>{message}</Text>
        </View>
      ) : (
        <View style={{flexDirection: 'row'}}>
          <Entypo name="cross" size={adjustSize(30)} style={{color: 'red'}} />
          <Text style={styles.msg}>{message}</Text>
        </View>
      )}
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  msg: {
    fontSize: adjustSize(17),
    marginTop: '1%',
    marginStart: '1%',
    flex: 1,
  },
});
