import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Animated} from 'react-native';

import {Colors} from '../../../styles/colors';
import {useNavigation} from '@react-navigation/native';

import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
import {
  requestGetOverview,
  requestGetRewardOverview,
} from '../../../netcalls/gameCenterEndPoints/requestGameCenter';

const GameCollapse = (props) => {
  const {availableItems, allItems, points, chances} = props;
  const [open, setOpen] = useState(true);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;
  const [reedemable, setRedeemable] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {}, []);

  useEffect(() => {
    let count = 0;
    for (var x of availableItems) {
      for (var y of allItems) {
        if (y._id === x._id && y?.points <= points) {
          count++;
        }
      }
    }
    setRedeemable(count);
  }, [availableItems, allItems, points]);

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

  useEffect(() => {
    setOpen(true);
  }, []);

  const goGameCenter = () => {
    navigation.navigate('GameCenter');
  };

  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, maxHeight],
  });

  return (
    <View
      onLayout={(event) => setMaxHeight(event.nativeEvent.layout.height)}
      style={{backgroundColor: 'white'}}>
      <View
        style={styles.cardTab}
        onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity
          onPress={() => {
            toggle(open);
          }}
          style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>Game Center</Text>
        </TouchableOpacity>
      </View>
      {/*Content */}
      {open && (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            backgroundColor: Colors.gameTab,
            paddingBottom: '5%',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={() => goGameCenter()}>
              <Text style={styles.paramText}>Points</Text>
              <Text style={styles.valueText}>{points}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goGameCenter()}>
              <Text style={styles.paramText}>Chances</Text>
              <Text style={styles.valueText}>{chances}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.paramText}>Reedemable</Text>
              <Text style={styles.valueText}>{reedemable} Reward(s)</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default GameCollapse;

const styles = StyleSheet.create({
  cardTab: {
    flexGrow: 1,
    backgroundColor: Colors.gameTab,
    borderTopStartRadius: adjustSize(20),
    borderTopEndRadius: adjustSize(20),
  },
  headerTab: {
    padding: '3%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#3e3e43',
    fontSize: adjustSize(18),
    marginStart: '3%',
    opacity: 0.5,
  },
  paramText: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#3c3c43',
    fontSize: adjustSize(17),
    opacity: 0.5,
  },
  valueText: {
    color: '#16A64F',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(17),
  },
});
