import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Octicon from 'react-native-vector-icons/Octicons';
import {morningObj, notif_addlog, notif_log} from '../../commonFunctions/common';
import {useNavigation} from '@react-navigation/native';
import {renderLogIcon} from '../../commonFunctions/logFunctions';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import {notificationPathMapping} from '../../config/AppConfig';


const NotificationRow = (props) => {
  const {type, text, hour, icon} = props;
  const navigation = useNavigation();

  useEffect(() => {
    console.log('rendered');
  }, []);

  const showLogNotComplete = () => {
    if (hour === morningObj.name) {
      return false;
    }
    return true;
  };

  const notifPress = () => {
    if (type in notificationPathMapping) {
      navigation.navigate(notificationPathMapping[type]);
    }
    if (type === notif_log) {
      navigation.navigate('AddLog');
    }
    if (type === notif_addlog) {
      navigation.navigate('AddLog', {type: icon});
    }
  };

  return (
    <TouchableOpacity
      style={{...styles.container, ...props.style}}
      onPress={() => notifPress()}>
      {type === notif_log && showLogNotComplete() && (
        <>
          <Ionicon name="alert-circle-outline" size={40} color="red" />
          <View style={{flex: 1}}>
            <Text style={styles.notifDetails}>Incomplete Logs - </Text>
            <Text style={styles.notifDetails}>{text}</Text>
          </View>
          <Octicon
            name="primitive-dot"
            color={'red'}
            style={{alignSelf: 'center'}}
          />
        </>
      )}
      {type === notif_addlog && text.length > 1 && (
        <>
          {renderLogIcon(icon)}
          <View style={{flex: 1}}>
            <Text style={styles.notifDetails}>{text}</Text>
          </View>
          <Octicon
            name="primitive-dot"
            color={'red'}
            style={{alignSelf: 'center'}}
          />
        </>
      )}
      {
        type in notificationPathMapping && (
            <>
              <View style={{flex: 1}}>
                <Text style={styles.notifDetails}>{text}</Text>
              </View>
              <Octicon
                  name="primitive-dot"
                  color={'red'}
                  style={{alignSelf: 'center'}}
              />
            </>
        )
      }
    </TouchableOpacity>
  );
};

export default NotificationRow;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: adjustSize(10),
    margin: '3%',
    flexDirection: 'row',
    padding: '2%',
  },
  notifDetails: {
    fontFamily: 'SFProDisplay-Regular',
    marginStart: '2%',
    fontSize: adjustSize(15),
  },
});
