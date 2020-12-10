import React, {Component} from 'react';
import {View, Linking} from 'react-native';
//third party libs
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Entypo from 'react-native-vector-icons/Entypo';
//functions
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from '../redux/reduxMapping';
//other screens

//components
import CaregiverDrawerNavigator from './drawerCaregiver';
import AccountDetailScreen from './more/accountDetails';
import DiaryScreen from './main/diary/diary';
import SecurityQns from './more/securityQns';
import LabResults from './more/labResults';
import AppointmentScreen from './more/appointments';

Entypo.loadFont();

const Stack = createStackNavigator();

class CaregiverRoot extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleRedirectUrl);
  }

  componentWillUnmount() {
    Linking.removeAllListeners('url');
  }

  render() {
    return (
      <>
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
          {this.props.isLogin ? (
            <>
              <Stack.Screen
                name="CaregiverDashBoard"
                component={CaregiverDrawerNavigator}
                options={{
                  headerShown: false,
                  animationEnabled: true,
                }}
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
                name="Appointment"
                component={AppointmentScreen}
                options={{
                  headerShown: false,
                }}
              />
              {/*Onboarding */}
              <Stack.Screen
                name="SecurityQnSetUp"
                component={SecurityQns}
                options={{headerShown: false}}
              />
            </>
          ) : (
            <></>
          )}
        </Stack.Navigator>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CaregiverRoot);
