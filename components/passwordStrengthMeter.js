import React, {Component} from 'react';
import {View, TextInput, Animated, Text, StyleSheet} from 'react-native';
//third party lib
import zxcvbn from 'zxcvbn';
//styles
import globalStyles from '../styles/globalStyles';
import {adjustSize} from '../commonFunctions/autoResizeFuncs';
import {Colors} from '../styles/colors';

//using score 1 - 4, animate the respective bars to show strength
export default class PasswordStrengthMeter extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      passwordString: '',
      score: 0,
      animation: new Animated.Value(0),
      result: '',
    };
    this.setInputPassword = this.setInputPassword.bind(this);
    this.setResultString = this.setResultString.bind(this);
  }

  componentDidMount() {
    console.log('Mounting password strength meter');
    this.getPasswordResult(this.state.passwordString);
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevState.passwordString !== this.state.passwordString) {
      this.getPasswordResult(this.state.passwordString);
      this.setResultString(this.state.score);
      //animate
      Animated.timing(this.state.animation, {
        toValue: this.state.score,
        duration: 500,
        useNativeDriver: false,
      }).start();

      //pass back parent
      this.props.setPassword(this.state.passwordString, this.state.score);
    }
  }

  getPasswordResult(string) {
    let score = zxcvbn(string).score;
    this.setState({score: score});
  }

  setInputPassword(value) {
    this.setState({passwordString: value});
  }

  setResultString(score) {
    //set result
    switch (Number(score)) {
      case 0:
        this.setState({result: 'Weak'});
        break;
      case 1:
        this.setState({result: 'Poor'});
        break;
      case 2:
        this.setState({result: 'Fair'});
        break;
      case 3:
        this.setState({result: 'Good'});
        break;
      case 4:
        this.setState({result: 'Strong'});
        break;
    }
  }

  render() {
    const colorInterpolationA = this.state.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: getFullColorRange(),
    });

    const progressStyleA = {
      backgroundColor: colorInterpolationA,
      width: '100%',
      height: '40%',
      flex: 1,
      marginEnd: '2%',
      marginStart: '1%',
    };

    const colorInterpolationB = this.state.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: get2ndColorRange(),
    });

    const progressStyleB = {
      backgroundColor: colorInterpolationB,
      width: '100%',
      height: '40%',
      flex: 1,
      marginEnd: '2%',
      marginStart: '1%',
    };

    const colorInterpolationC = this.state.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: get2ndLastColorRange(),
    });

    const progressStyleC = {
      backgroundColor: colorInterpolationC,
      width: '100%',
      height: '40%',
      flex: 1,
      marginEnd: '2%',
      marginStart: '1%',
    };

    const colorInterpolationD = this.state.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: getLastColorRange(),
    });

    const progressStyleD = {
      backgroundColor: colorInterpolationD,
      width: '100%',
      height: '40%',
      flex: 1,
      marginEnd: '2%',
      marginStart: '1%',
    };

    return (
      <>
        <TextInput
          placeholder="New password"
          placeholderTextColor={
            this.props.notLogined === true ? Colors.loginPlaceholder : '#a1a3a0'
          }
          secureTextEntry
          onChangeText={this.setInputPassword}
          style={{...globalStyles.editInputBox, ...this.props.style}}
        />
        <View
          style={{
            flexDirection: 'row',
            height: adjustSize(10),
            marginStart: '4%',
            marginEnd: '4%',
          }}>
          <Animated.View
            style={{...progressStyleA, ...this.props.strengthContainerStyle}}
          />
          <Animated.View
            style={{...progressStyleB, ...this.props.strengthContainerStyle}}
          />
          <Animated.View
            style={{...progressStyleC, ...this.props.strengthContainerStyle}}
          />
          <Animated.View
            style={{...progressStyleD, ...this.props.strengthContainerStyle}}
          />
        </View>
        {this.props.notLogined ? (
          <Text
            style={{
              ...{
                alignSelf: 'flex-end',
                marginEnd: '4%',
                marginBottom: '2%',
                fontSize: adjustSize(16),
                color: 'white',
              },
            }}>
            {this.state.result}
          </Text>
        ) : (
          <Text
            style={{
              ...{
                alignSelf: 'flex-end',
                marginEnd: '4%',
                marginBottom: '2%',
                fontSize: adjustSize(16),
              },
            }}>
            {this.state.result}
          </Text>
        )}
      </>
    );
  }
}

//first bar
function getFullColorRange() {
  return [
    'rgb(220, 220, 220)',
    'rgb(254, 92, 92)',
    'rgb(247,186,49)',
    'rgb(64,172,134)',
    'rgb(0,129,84)',
  ];
}

//2nd bar
function get2ndColorRange() {
  return [
    'rgb(220, 220, 220)',
    'rgb(220, 220, 220)',
    'rgb(247,186,49)',
    'rgb(64,172,134)',
    'rgb(0,129,84)',
  ];
}

//2nd last bar
function get2ndLastColorRange() {
  return [
    'rgb(220, 220, 220)',
    'rgb(220, 220, 220)',
    'rgb(220, 220, 220)',
    'rgb(64,172,134)',
    'rgb(0,129,84)',
  ];
}

//last bar
function getLastColorRange() {
  return [
    'rgb(220, 220, 220)',
    'rgb(220, 220, 220)',
    'rgb(220, 220, 220)',
    'rgb(220, 220, 220)',
    'rgb(0,129,84)',
  ];
}
