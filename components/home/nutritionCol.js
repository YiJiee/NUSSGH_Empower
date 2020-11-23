import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Animated} from 'react-native';
import {renderNutrientPercent} from '../../commonFunctions/common';
import ProgressBar from '../progressbar';
import {scaleFont} from '../../commonFunctions/scaleFunction';

const NutritionCol = (props) => {
  const {amount, nutrientType, header} = props;
  const [percent, setPercent] = useState('0%');

  useEffect(() => {
    renderNutrientPercent(amount, nutrientType).then((value) => {
      if (value > 0) {
        let final = value + '%';
        setPercent(final);
      }
    });
  }, [amount]);

  return (
    <View>
      <Text style={styles.foodHeader}>{header}</Text>
      <ProgressBar
        containerStyle={{height: 5, marginBottom: 5, width: 70}}
        progress={percent}
        progressBarColor={'#005c30'}
        backgroundBarColor={'white'}
      />
      <Text style={styles.foodDetail}>{amount} g</Text>
    </View>
  );
};

export default NutritionCol;

const styles = StyleSheet.create({
  foodHeader: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: scaleFont(15),
    marginBottom: '6%',
    opacity: 0.5,
  },
  foodDetail: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: scaleFont(15),
    color: 'black',
  },
});
