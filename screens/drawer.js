import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Colors} from '../styles/colors';
import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
//third party library
import Ionicon from 'react-native-vector-icons/Ionicons';
//component
import DashboardScreen from './dashboard';
//functions
import {adjustSize} from '../commonFunctions/autoResizeFuncs';

import ACCOUNT from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-account.svg';
import DIARY from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-diary.svg';
import MED from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-med.svg';
import GOALS from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-goals.svg';
import APPT from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-appt.svg';
import RESOURCES from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-resources.svg';
import MY_CAREGIVER from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-mycaregiver.svg';
import LAB from '../resources/images/Patient-Icons/SVG/icon-white-sidemenu-lab.svg';

const iconStyle = {
  width: adjustSize(30),
  height: adjustSize(30),
};

const Drawer = createDrawerNavigator();

const DrawerContent = (props) => {
  return (
    <ScrollView contentContainerStyle={{flex: 1, marginTop: '20%'}}>
      <Text style={styles.headerTextStyle}>Menu</Text>
      <DrawerItem
        label="Edit Account"
        labelStyle={styles.subText}
        icon={() => <ACCOUNT {...iconStyle} />}
        onPress={() => props.navigation.navigate('Edit Account')}
      />
      <DrawerItem
        label="Lab Results"
        labelStyle={styles.subText}
        icon={() => <LAB {...iconStyle} />}
        onPress={() => props.navigation.navigate('LabResults')}
      />
      <DrawerItem
        label="Diary"
        labelStyle={styles.subText}
        icon={() => <DIARY {...iconStyle} />}
        onPress={() => props.navigation.navigate('Diary')}
      />
      <DrawerItem
        label="Medication"
        labelStyle={styles.subText}
        icon={() => <MED {...iconStyle} />}
        onPress={() => props.navigation.navigate('Medication')}
      />
      <DrawerItem
        label="Goals"
        labelStyle={styles.subText}
        icon={() => <GOALS {...iconStyle} />}
        onPress={() => props.navigation.navigate('Goals')}
      />
      <DrawerItem
        label="Appointments"
        labelStyle={styles.subText}
        icon={() => <APPT {...iconStyle} />}
        onPress={() => props.navigation.navigate('Appointment')}
      />
      <DrawerItem
        label="My Caregiver"
        labelStyle={styles.subText}
        icon={() => <MY_CAREGIVER {...iconStyle} />}
        onPress={() => props.navigation.navigate('MyCaregiver')}
      />
      <DrawerItem
        label="Resources"
        labelStyle={styles.subText}
        icon={() => <RESOURCES {...iconStyle} />}
        onPress={() => props.navigation.navigate('Resources')}
      />
      <View style={{position: 'absolute', bottom: '3%'}}>
        <DrawerItem
          label="Log Out"
          labelStyle={[styles.subText]}
          icon={() => (
            <Ionicon
              name="exit-outline"
              size={adjustSize(27)}
              color={'white'}
            />
          )}
          onPress={() => props.navigation.navigate('Log Out')}
        />
      </View>
    </ScrollView>
  );
};

const DrawerNavigator = (props) => {
  return (
    <Drawer.Navigator
      drawerType={'slide'}
      drawerStyle={{backgroundColor: Colors.menuColor, width: '65%'}}
      drawerContent={DrawerContent}>
      <Drawer.Screen name="Home" component={DashboardScreen} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: adjustSize(24),
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    margin: '5%',
    marginBottom: '10%',
    marginTop: '2%',
  },
  subText: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
  },
});
