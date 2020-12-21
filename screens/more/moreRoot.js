import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
//third party libs
import {connect} from 'react-redux';
//functions
import {mapDispatchToProps, mapStateToProps} from '../../redux/reduxMapping';
import {storeToken} from '../../storage/asyncStorageFunctions';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//components
import MoreFunctionBlock from '../../components/moreFunctionBlock';

const MoreRootScreen = (props) => {
  const clickHandler = (id) => {
    switch (id) {
      case 1:
        props.navigation.navigate('AccountDetail');
        break;
      case 2:
        props.navigation.navigate('Medication');
        break;

      case 3:
        props.navigation.navigate('Appointments');
        break;

      case 4:
        props.navigation.navigate('HypocorrectionFood');
        break;

      case 5:
        props.navigation.navigate('Reports');
        break;
      case 6:
        props.navigation.navigate('EducationMaterials');
        break;

      case 7:
        props.navigation.navigate('Goals');
        break;

      case 8:
        props.navigation.navigate('Reminders');
        break;

      case 9:
        props.navigation.navigate('GameCenter');
        break;
      case 10:
        props.navigation.navigate('GlucoseMonitors');
        break;

      case 11:
        storeToken('');
        props.logout();
        break;

      case 12:
        props.navigation.navigate('FitbitSetup');
        break
    }
  };

  const functionList = [
    {id: 1, value: 'View Account Details'},
    {id: 2, value: 'View My Medications'},
    {id: 3, value: 'View My Appointments'},
    {id: 4, value: 'View Hypo-correction Food'},
    {id: 5, value: 'View My Reports'},
    {id: 6, value: 'View Educational Materials'},
    {id: 7, value: 'Manage My Goals'},
    {id: 8, value: 'Manage My Reminders'},
    {id: 9, value: 'Game Center'},
    {id: 10, value: 'Bluetooth Glucose Monitors'},
    {id: 11, value: 'Logout'},
    {id: 12, value: 'Fitbit setup'}
  ];

  return (
    <View style={{...styles.moreScreen, ...props.style}}>
      <FlatList
        style={styles.list}
        keyExtractor={(item, index) => item.id}
        data={functionList}
        renderItem={(itemData) => (
          <MoreFunctionBlock
            id={itemData.item.id}
            text={itemData.item.value}
            clickFunc={clickHandler}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  moreScreen: {
    flex: 1,
    padding: adjustSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MoreRootScreen);
