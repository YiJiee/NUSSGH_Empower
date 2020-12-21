import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UncompleteLogCard from '../../uncompleteLogCard';
import {green_color, isEmpty, role_caregiver} from '../../../commonFunctions/common';
import {Colors} from '../../../styles/colors';
import {getRole} from '../../../storage/asyncStorageFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


const DailyCollapse = (props) => {
  const {uncompleteLogs, hour} = props;
  const {patient} = props;
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState('');
  const [count, setCount] = useState(0);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setOpen(true);
    init().then(() => {});
  }, []);

  useEffect(() => {
    setCount(uncompleteLogs.length);
  }, [uncompleteLogs]);

  useEffect(() => {
    init().then(() => {});
  }, [patient]);

  const init = async () => {
    let role = await getRole();
    setRole(role);

    if (role === role_caregiver) {
      setCount(0);
    }
  };

  const toggle = (visible) => {
    if (visible) {
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(dropDownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, maxHeight],
  });

  return (
    <View
      onLayout={(event) => setMaxHeight(event.nativeEvent.layout.height)}
      style={{backgroundColor: Colors.notifTab}}>
      <View
        style={styles.cardTab}
        onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity
          onPress={() => {
            toggle(open);
          }}
          style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>Daily Tasks</Text>
          <Text style={styles.headerText}>{count}</Text>
        </TouchableOpacity>
      </View>
      {/*Content */}
      {open ? (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            backgroundColor: Colors.dailyTab,
            paddingBottom: '2%',
          }}>
          {role === role_caregiver && isEmpty(patient) ? (
            <Text style={styles.taskText}>No tasks to be done</Text>
          ) : uncompleteLogs.length > 0 ? (
            <>
              <Text style={styles.greetingText}>
                Create a log for the {hour}
              </Text>
              <UncompleteLogCard
                uncompleteLogs={uncompleteLogs}
                color={green_color}
                hideChevron={true}
              />
            </>
          ) : (
            <Text style={styles.taskText}>
              You have completed your logs for the {hour}!
            </Text>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
};

export default DailyCollapse;

const styles = StyleSheet.create({
  cardTab: {
    backgroundColor: Colors.dailyTab,
    borderTopStartRadius: adjustSize(20),
    borderTopEndRadius: adjustSize(20),
  },
  headerTab: {
    padding: '3%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    fontSize: adjustSize(18),
    marginStart: '3%',
  },
  greetingText: {
    color: '#005c30',
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
    marginTop: '2%',
  },
  taskText: {
    fontFamily: 'SFProDisplay-Regular',
    color: 'white',
    marginStart: '5%',
    marginTop: '2%',
    fontSize: adjustSize(18),
  },
});
