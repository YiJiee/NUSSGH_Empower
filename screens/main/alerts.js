import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import globalStyles from '../../styles/globalStyles';
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
import {getGreetingFromHour, notif_addlog} from '../../commonFunctions/common';
import NotificationRow from '../../components/home/notificationRow';
import {useNavigation} from '@react-navigation/native';
import {storeReadNotifDate} from '../../storage/asyncStorageFunctions';
import moment from 'moment';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const AlertsScreen = (props) => {
  const {logsNotDone} = props;
  const {reInit, setBadge} = props;
  const [currHour, setCurrHour] = useState(new Date().getHours());
  const slideRightAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    reInit().then(() => {});
  }, []);

  useEffect(() => {
    //slide right when enter screen
    navigation.addListener('focus', () => {
      //init notifications set from caregiverdashboard
      reInit().then(() => {});
      //when enter screen, set notification as read
      let obj = {
        period: getGreetingFromHour(currHour),
        date: moment(new Date()).format('YYYY-MM-DD'),
      };
      storeReadNotifDate(obj).then(() => {});
      setBadge();

      slideRightAnimation.setValue(0);
      Animated.timing(slideRightAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [navigation]);

  console.log('in alerts ');
  console.log(logsNotDone);

  const widthInterpolate = slideRightAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').width, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={globalStyles.pageContainer}>
      <Animated.View
        style={{
          ...props.style,
          ...{transform: [{translateX: widthInterpolate}]},
        }}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => navigation.navigate('Home')} />
        </View>
        <Text style={globalStyles.pageHeader}>Alert</Text>
        {logsNotDone.map(
          (item, index) =>
            item?.msg.length > 0 && (
              <NotificationRow
                key={index}
                type={notif_addlog}
                hour={currHour}
                text={item.msg}
                style={{
                  borderColor: '#e1e7ed',
                  borderWidth: 1,
                  padding: '4%',
                }}
                icon={item.type}
              />
            ),
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatScreen: {
    flex: 1,
    padding: adjustSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AlertsScreen;
