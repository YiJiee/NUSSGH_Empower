import React from 'react';
import {Dimensions, Text, View} from 'react-native';
// Components
import FoodRow from './FoodRow';
import logStyles from '../../../styles/logStyles';

function ReadOnlyMealDisplay(props) {
  const {style, show, data} = props;
  return (
    show && (
      <View style={logStyles.lastLogDetailContainer}>
        <Text style={logStyles.lastLogDate}>{data.recordDate}</Text>
        <View style={logStyles.lastLogBorder} />
        <View style={{marginStart: Dimensions.get('window').width * 0.04}}>
          {data.foodItems.map((food) => (
            <FoodRow key={food['food-name']} food={food} />
          ))}
        </View>
        <View style={logStyles.lastLogBorder} />
      </View>
    )
  );
}

export default ReadOnlyMealDisplay;
//edit flag
