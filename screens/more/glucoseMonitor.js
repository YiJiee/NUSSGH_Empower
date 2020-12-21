import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const GlucoseMonitorsScreen = (props) => {
  return (
    <View style={{...styles.screen, ...props.style}}>
      <Text>Glucose Monitors</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: adjustSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GlucoseMonitorsScreen;
