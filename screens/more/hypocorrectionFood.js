import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Carousel from '../../components/hypofood/carousel';
import SampleData from './sampleHypoList.json';
import {FlatList} from 'react-native-gesture-handler';
import globalStyles from '../../styles/globalStyles';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const HypocorrectionFood = (props) => {

  return (
    <View style={globalStyles.pageContainer}>
      <Text style={styles.header}>Consume 15g from this food list now!</Text>
      <FlatList
        data={SampleData.data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingBottom: '20%'}}
        renderItem={({item}) => (
          <>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Carousel
              items={item.foodItems}
              itemsPerInterval={3}
              random={true}
              category={item.category}
            />
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    fontSize: adjustSize(20),
    margin: '2%',
    fontWeight: '700',
    color: '#d43f3a',
  },
  categoryText: {
    fontSize: adjustSize(18),
    fontWeight: '600',
    marginStart: '2%',
    marginTop: '2%',
  },
});

export default HypocorrectionFood;
