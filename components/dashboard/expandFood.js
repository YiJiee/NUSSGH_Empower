import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
  Image,
} from 'react-native';
//third party lib
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../styles/colors';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const ExpandFood = (props) => {
  const {period, foodData, clickPeriod} = props;
  const {callback, closePeriod} = props;

  const [open, setOpen] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [calories, setCalories] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getCalories();
  }, [foodData]);

  const toggle = (visible) => {
    if (visible) {
      setShowBottom(false);
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      setShowBottom(true);
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

  const onClickPeriod = () => {
    if (clickPeriod) {
      closePeriod();
    } else {
      let startdate = foodData[0]?.record_date;
      let enddate = foodData[foodData.length - 1]?.record_date;

      callback(startdate, enddate, foodData, period);
    }
  };

  const getCalories = () => {
    let total = 0;
    for (var x of foodData) {
      for (var o of x?.foodItems) {
        total += Number(o?.nutrients?.energy?.amount) * Number(o.quantity);
      }
    }
    setCalories(Math.trunc(total));
  };

  return (
    <View onLayout={(event) => setMaxHeight(event.nativeEvent.layout.height)}>
      <View
        style={[
          styles.periodContainer,
          showBottom ? {borderBottomWidth: 1} : {borderBottomWidth: 0},
        ]}>
        <TouchableOpacity
          onPress={() => onClickPeriod()}
          style={{flexDirection: 'row'}}>
          {clickPeriod && (
            <View
              style={{
                backgroundColor: Colors.lastLogButtonColor,
                padding: '2%',
                marginEnd: '3%',
              }}
            />
          )}
          <Text
            style={[
              styles.periodText,
              clickPeriod && {color: Colors.leftArrowColor},
            ]}>
            {period}
          </Text>
          <Text
            style={[
              styles.periodText,
              clickPeriod && {color: Colors.leftArrowColor},
            ]}>
            {'  -  '}
            {calories} kCal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            toggle(open);
          }}>
          {open ? (
            <Entypo name="chevron-small-up" size={adjustSize(30)} />
          ) : (
            <Entypo name="chevron-small-down" size={adjustSize(30)} />
          )}
        </TouchableOpacity>
      </View>
      {open ? (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            paddingBottom: '2%',
          }}>
          {foodData.map((item, index) => (
            <View key={index}>
              {item?.foodItems.length > 0
                ? item?.foodItems.map((inner, index) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: '2%',
                      }}>
                      <Image
                        source={{uri: inner.imgUrl.url}}
                        style={styles.foodImg}
                      />
                      <View>
                        <Text style={styles.periodText}>
                          {inner['food-name']}
                        </Text>
                        <Text style={[styles.periodText, {opacity: 0.6}]}>
                          {inner?.nutrients?.energy?.amount} kCal *{' '}
                          {inner?.quantity} qty
                        </Text>
                      </View>
                    </View>
                  ))
                : null}
            </View>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
};

export default ExpandFood;

const styles = StyleSheet.create({
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8ee',
    padding: '2%',
    marginTop: '2%',
  },
  periodText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(17),
    alignSelf: 'flex-start',
  },
  foodImg: {
    height: adjustSize(80),
    width: adjustSize(80),
    borderRadius: adjustSize(9.5),
    borderWidth: 2,
    borderColor: '#e2e8ee',
    marginEnd: '2%',
  },
});
