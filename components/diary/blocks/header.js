import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
//third part library
import Entypo from 'react-native-vector-icons/Entypo';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

Entypo.loadFont();

const Header = (props) => {
  const {title, closeModal} = props;
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Entypo
        name="cross"
        size={adjustSize(30)}
        style={{marginTop: '1%', alignSelf: 'flex-end'}}
        onPress={closeModal}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#aad326',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    padding: '3%',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: adjustSize(20),
    textAlign: 'center',
    marginTop: '1%',
    flex: 1, //for flex end to work for icon
  },
});
