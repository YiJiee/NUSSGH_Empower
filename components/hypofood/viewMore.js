import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
//data
import SampleData from '../../screens/more/sampleHypoList.json';
//component
import Item from './item';

//using sample data for now
const ViewMore = (props) => {
  const {category} = props.route.params;
  const [arr, setArr] = useState([]);

  useEffect(() => {
    //initialise list of items under same category
    for (var x of SampleData.data) {
      if (x.category === category) {
        setArr(x.foodItems);
      }
    }
  }, []);

  return (
    <View style={styles.screen}>
      <FlatList
        keyExtractor={(item, index) => item._id}
        data={arr}
        numColumns={2}
        renderItem={({item}) => <Item content={item} />}
      />
    </View>
  );
};

export default ViewMore;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    padding: '2%',
  },
});
