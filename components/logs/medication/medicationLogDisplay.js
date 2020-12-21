import React, {useEffect, useRef} from 'react';
import {Animated, FlatList, Text, View} from 'react-native';
//styles
import logStyles from '../../../styles/logStyles';
import {Colors} from '../../../styles/colors';

const MedicationLogDisplay = (props) => {
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
          <FlatList
            keyExtractor={(item) => item.drugName}
            data={data.value}
            style={{flexGrow: 0}}
            renderItem={({item}) => (
              <View style={{marginBottom: '2%'}}>
                <Text style={logStyles.lastLogContent}>{item.drugName}</Text>
                <Text
                  style={[
                    logStyles.lastLogContent,
                    {color: Colors.lastLogValueColor},
                  ]}>
                  {item.dosage} {item.unit}(s)
                </Text>
              </View>
            )}
          />
          <View style={logStyles.lastLogBorder} />
        </View>
      </Animated.View>
    )
  );
};

export default MedicationLogDisplay;
