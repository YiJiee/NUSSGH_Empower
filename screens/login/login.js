import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
//third party libs
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
//functions
import {mapStateToProps, mapDispatchToProps} from '../../redux/reduxMapping';
import {
  storeUsername,
  getUsername,
  storePassword,
  getPassword,
  storeToken,
  storeRole,
} from '../../storage/asyncStorageFunctions';
import {loginRequest} from '../../netcalls/requestsAuth';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//components
import Loading from '../../components/loading';
import globalStyles from '../../styles/globalStyles';
import loginStyles, {loginLogoStyle} from '../../styles/loginStyles';
//svg
import Logo from '../../resources/images/Patient-Icons/SVG/icon-color-empower.svg';
import {role_patient, role_caregiver} from '../../commonFunctions/common';
import {Colors} from '../../styles/colors';
import {getSecurityQnByUsername} from '../../netcalls/requestsSecurityQn';

const tabs = [role_patient, role_caregiver];

class Login extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      username: '',
      password: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    this.props.logout();
    const username = await getUsername();
    if (username !== null && username !== '') {
      console.log('username : ' + username);
      this.setState({username: username});
    }
    const password = await getPassword();
    if (password !== null && password !== '') {
      console.log('password : ' + password);
      this.setState({password: password});
    }
  };

  handleLogin = async () => {
    this.setState({isLoading: true});

    let rsp = await loginRequest(this.state.username, this.state.password);
    console.log('----');
    console.group(rsp);
    let token = rsp?.token;
    let role = rsp?.type;

    if (token != null) {
      await storeUsername(this.state.username);
      await storePassword(this.state.password);
      await storeToken(token);
      await storeRole(role);
      let formatUsername = String(this.state.username).toLowerCase();
      let qn = await getSecurityQnByUsername(formatUsername);
      if (qn?.qnList.length === 0) {
        console.log('start onboarding!');
        this.props.navigation.navigate('OnboardingWizard');
      } else {
        this.props.login();
        console.log('login success!');
      }
    } else {
      Alert.alert('Error', 'Invalid username/password combination.', [
        {text: 'Got It'},
      ]);
    }
    this.setState({isLoading: false});
  };

  handleUsernameInput = (inputText) => {
    this.setState({username: inputText});
  };

  handlePasswordInput = (inputText) => {
    this.setState({password: inputText});
  };

  render() {
    return (
      <LinearGradient
        colors={Colors.loginColorArr}
        useAngle={true}
        angle={240}
        style={loginStyles.container}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={{flex: 1}} />
          <Logo {...loginLogoStyle} />
          <Text style={loginStyles.headerText}>Welcome</Text>
          <Text style={loginStyles.subText}>
            To proceed with the app, please log in with your credential.
          </Text>

          <View style={{flex: 3, marginTop: '10%'}}>
            <TextInput
              style={loginStyles.inputBox}
              placeholder="Username"
              placeholderTextColor={Colors.loginPlaceholder}
              value={this.state.username}
              onChangeText={this.handleUsernameInput}
            />
            <TextInput
              style={loginStyles.inputBox}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor={Colors.loginPlaceholder}
              value={this.state.password}
              onChangeText={this.handlePasswordInput}
            />
            <TouchableOpacity
              style={[
                globalStyles.nextButtonStyle,
                {backgroundColor: 'white', marginBottom: 0},
              ]}
              onPress={this.handleLogin}>
              <Text style={globalStyles.actionButtonText}>Login</Text>
            </TouchableOpacity>
            <Text
              style={loginStyles.clickableText}
              onPress={() => this.props.navigation.navigate('ForgetPassword')}>
              Forget Password?
            </Text>
            <Loading isLoading={this.state.isLoading} />
          </View>
        </KeyboardAvoidingView>

        <View
          style={{
            justifyContent: 'flex-end',
            padding: '5%',
            paddingBottom: '10%',
          }}>
          <Text style={styles.light}>
            Having trouble?{' '}
            <Text
              style={styles.bold}
              onPress={() => this.props.navigation.navigate('ContactUsScreen')}>
              Contact Us Now!
            </Text>
          </Text>
        </View>
      </LinearGradient>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  light: {
    color: 'white',
    fontSize: adjustSize(17),
    marginTop: '3%',
    fontFamily: 'SFProDisplay-Regular',
  },
  bold: {
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'SFProDisplay-Bold',
  },
  border: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width: adjustSize(150),
  },
});
