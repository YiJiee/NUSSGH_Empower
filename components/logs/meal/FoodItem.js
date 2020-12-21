import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


export default function FoodItem({food}) {
  let foodName =
    food['food-name'][0].toUpperCase() + food['food-name'].slice(1);
  const adjustedFontSize = adjustSize(13);
  if (foodName.length > 20) {
    foodName = foodName.slice(0, 20) + '...';
  }
  return (
    <View style={styles.foodItem}>
      <Image source={{uri: food.imgUrl.url}} style={styles.foodImage} />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: adjustedFontSize, height: adjustSize(50), paddingTop: adjustSize(3)}}>
          {foodName}
        </Text>
        <Text style={{paddingTop: adjustSize(3)}}>{'Qty: ' + food['quantity']}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  foodImage: {
    width: adjustSize(80),
    height: adjustSize(80),
  },
  foodItem: {
    width: adjustSize(80),
    marginRight: adjustSize(20),
  },
});
//edit flag
