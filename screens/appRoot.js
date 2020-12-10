import React, {Component} from 'react';
import {View, Linking} from 'react-native';
//third party libs
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Entypo from 'react-native-vector-icons/Entypo';
import Animated, {Easing} from 'react-native-reanimated';
//functions
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from '../redux/reduxMapping';
//other screens
import Login from './login/login';
import ForgetPasswordScreen from './login/ForgetPasswordScreen';
import ResetPasswordScreen from './login/resetPassword';
import Logout from './more/logout';
//components
import ContactUs from './contactUs';
import PatientRoot from './patientRoot';
import {getRole, getUsername} from '../storage/asyncStorageFunctions';
import {role_patient, role_caregiver} from '../commonFunctions/common';
import CaregiverRoot from './caregiverRoot';
import LoadingScreen from '../components/account/initLoadingScreen';

import {appRootUrl, availablePaths} from '../config/AppConfig';
import {
  defaultRoute,
  handler,
} from '../components/notification/PushNotifHandler';
import PushNotification from 'react-native-push-notification';
import QnVerifcationScreen from './login/qnVerificationScreen';
import OnboardingWizard from './onboarding/onboardingWizard';
import {getSecurityQnByUsername} from '../netcalls/requestsSecurityQn';

const Stack = createStackNavigator();

// Allows for navigation to occur anywhere in app.
export const appRootNavigation = React.createRef();
export function navigate(name, params) {
  appRootNavigation.current?.navigate(name, params);
  return appRootNavigation.current;
}

class AppRoot extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      user: '',
      firstLogin: false,
    };
  }

  async componentDidMount() {
    console.log('in mount----');
    Linking.addEventListener('url', this.handleRedirectUrl);
    this.setState({role: this.props.role});
    await this.initrole();
  }

  componentDidUpdate(prevProp, prevState) {
    getRole().then((data) => {
      if (data !== prevState.user) {
        this.setState({user: data});
      }
    });
  }

  checkFirstTime = async () => {
    let username = await getUsername();
    let formattedUsername = String(username).toLowerCase();
    let qn = await getSecurityQnByUsername(formattedUsername);
    return qn;
  };

  //called from onboard page
  fromOnboard = () => {
    this.checkFirstTime().then((rsp) => {
      if (rsp?.qnList.length != 0) {
        this.props.login();
      }
    });
  };

  componentWillUnmount() {
    console.log('unmounting -------');
    Linking.removeAllListeners('url');
    this.setState({role: ''});
    this.setState({qnList: []});
  }

  async initrole() {
    let role = await getRole();
    this.setState({user: role});
  }

  onReady = async () => {
    // Handle deep link from url
    const url = await Linking.getInitialURL();
    if (url && this.props.isLogin) {
      const path = url.split(appRootUrl)[1];
      console.log(`application opened from web. navigating to ${path}`);
      if (availablePaths.has(path)) {
        appRootNavigation.current.navigate(path);
      }
    }

    // Handle link from notification redirect
    PushNotification.popInitialNotification((notif) =>
      handler.onNotification(notif),
    );
  };

  render() {
    const {user, firstLogin} = this.state;
    return (
      <>
        <NavigationContainer ref={appRootNavigation} onReady={this.onReady}>
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
                {/* View depending on user role and first login */}
                {user === role_patient ? (
                  <Stack.Screen
                    name="PatientDashBoard"
                    component={PatientRoot}
                    options={{
                      headerShown: false,
                    }}
                  />
                ) : user === role_caregiver ? (
                  <Stack.Screen
                    name="CaregiverDashBoard"
                    component={CaregiverRoot}
                    options={{
                      headerShown: false,
                    }}
                  />
                ) : (
                  <Stack.Screen
                    name="Loading"
                    component={LoadingScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                )}
                <Stack.Screen
                  name="Log Out"
                  component={Logout}
                  options={{
                    headerShown: false,
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="OnboardingWizard"
                  options={{header: () => <View />}}
                  children={() => (
                    <OnboardingWizard fromOnboard={this.fromOnboard} />
                  )}
                />
                <Stack.Screen
                  name="ContactUsScreen"
                  component={ContactUs}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="ForgetPassword"
                  component={ForgetPasswordScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="QnVerficationScreen"
                  component={QnVerifcationScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="ResetPasswordScreen"
                  component={ResetPasswordScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRoot);
