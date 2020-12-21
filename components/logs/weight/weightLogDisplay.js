import React, {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';
//styles
import logStyles from '../../../styles/logStyles';
import {Colors} from '../../../styles/colors';

const WeightLogDisplay = (props) => {
  const {data, show} = props;
  const dropDownAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      Animated.timing(dropDownAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [show]);

  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  return (
    show && (
      <Animated.View style={{maxHeight: heightInterpolation}}>
        <View style={logStyles.lastLogDetailContainer}>
          <Text style={logStyles.lastLogDate}>{data.dateString}</Text>
          <View style={logStyles.lastLogBorder} />
          <Text style={logStyles.lastLogContent}>Last Weight Recorded</Text>
          <Text
            style={[
              logStyles.lastLogContent,
              {color: Colors.lastLogValueColor},
            ]}>
            {data.value} kg
          </Text>
          <View style={logStyles.lastLogBorder} />
        </View>
      </Animated.View>
    )
  );
};

export default WeightLogDisplay;
