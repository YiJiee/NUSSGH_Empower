import React, {Component} from 'react';
import {View, Linking} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
//functions
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from '../redux/reduxMapping';
//other screens
import AccountDetailScreen from './more/accountDetails';
import DiaryScreen from './main/diary/diary';
import MedicationScreen from './more/medications';
import GoalsScreen from './more/goals';
import AppointmentScreen from './more/appointments';
import EducationMaterialsScreen from './more/educationMaterials';
import StartNewWord from './main/gameCenter/startNewWord';
import MyWord from './main/gameCenter/myWord';
import FillTheCard from './main/gameCenter/fillTheCard';
import RedeemPage from './main/gameCenter/redeemPage';
//components
import AskAdd from './onboarding/medicationPlan/askAdd';
import FitbitSetup from './onboarding/fitbit/FitbitSetup';
import DrawerNavigator from './drawer';
import MyCaregiverScreen from './more/myCaregiver';
import SecurityQns from './more/securityQns';
import LabResults from './more/labResults';

const Stack = createStackNavigator();

class PatientRoot extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <Stack.Navigator
        screenOptions={({route}) => ({
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        })}>
        <>
          <Stack.Screen
            name="DashBoard"
            component={DrawerNavigator}
            options={{
              headerShown: false,
              animationEnabled: true,
            }}
          />
          <Stack.Screen
            name="FitbitSetup"
            component={FitbitSetup}
            options={{headerShown: false}}
          />
          {/* Drawer Screen */}
          <Stack.Screen
            name="Edit Account"
            component={AccountDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LabResults"
            component={LabResults}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Diary"
            component={DiaryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Medication"
            component={MedicationScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Goals"
            component={GoalsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Appointment"
            component={AppointmentScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyCaregiver"
            component={MyCaregiverScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Resources"
            component={EducationMaterialsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="StartNewWord"
            component={StartNewWord}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyWord"
            component={MyWord}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FillTheCard"
            component={FillTheCard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RedeemPage"
            component={RedeemPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SecurityQnSetUp"
            component={SecurityQns}
            options={{headerShown: false}}
          />
        </>
      </Stack.Navigator>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientRoot);
