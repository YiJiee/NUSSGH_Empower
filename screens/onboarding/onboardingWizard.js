import React, {Component, useRef, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
//component
import BtnContainer from '../../components/onboarding/buttonContainer';
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
import {isEmpty} from '../../commonFunctions/common';
import MedPlanComponent from '../../components/onboarding/medPlanComponent';
import SecurityQnComponent from '../../components/onboarding/securityQnComponent';
import FitbitComponent from '../../components/onboarding/fitbit/fitbitComponent';
import LoadingModal from '../../components/loadingModal';
import {
  submitSecurityQn,
  submitMedPlan,
} from '../../commonFunctions/onboardingFunction';
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from '../../redux/reduxMapping';

class OnboardingWizard extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      currentStep: 1,

      //step 1 inputs
      qn1: {},
      qn2: {},
      qn3: {},
      ans1: '',
      ans2: '',
      ans3: '',
      show3: false,

      //step 2 inputs
      med2Edit: {},
      selectedMedList: [],
      skip2: false,

      //track if subsequent step is skipped
      skip3: false,
      authorised: false,

      load: false,
    };
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    console.log('unmounting');
    this.setState({load: false});
  }

  renderStepSubDetail = (stepNum) => {
    switch (stepNum) {
      case 1:
        return 'Set up Security Questions';
      case 2:
        return 'Add your Medicine Plan';
      case 3:
        return 'Link Your Fitbit Account';
    }
  };

  renderStepInstruction = (stepNum) => {
    switch (stepNum) {
      case 1:
        return 'These security questions will be used to verify your identity and help recover your password if you ever forget it.';
      case 2:
        return 'Would you like to add your scheduled medications for this month? We will help to track them.';
      case 3:
        return 'Would you like to link your fitbit account to track your activity? Alternatively, you can choose to set this up later';
    }
  };

  //step 1
  setQn1 = (value) => {
    this.setState({qn1: value});
  };

  setQn2 = (value) => {
    this.setState({qn2: value});
  };
  setQn3 = (value) => {
    this.setState({qn3: value});
  };

  setAns1 = (value) => {
    this.setState({ans1: value});
  };

  setAns2 = (value) => {
    this.setState({ans2: value});
  };

  setAns3 = (value) => {
    this.setState({ans3: value});
  };

  setShow3 = (bool) => {
    this.setState({show3: bool});
  };

  checkSecurityInput = () => {
    const {qn1, qn2, qn3, ans1, ans2, ans3, show3} = this.state;
    if (!isEmpty(qn1) && !isEmpty(qn2) && ans1 && ans2) {
      if (show3 && !isEmpty(qn3) && ans3) {
        return true;
      }
      if (!show3) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  //step 2 function
  setMed2Edit = (value) => {
    this.setState({med2Edit: value});
  };

  setSelectedMedList = (arr) => {
    this.setState({selectedMedList: arr});
  };

  checkMedPlanInput = () => {
    if (this.state.selectedMedList.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  //step 3
  setAuthorised = (val) => {
    console.log('in set authorised 1');
    if (val === true) {
      this.setState({load: true});
      console.log('in set authorised 2');
      this.handleSubmit();
    }
  };

  //button function
  onNext = () => {
    this.setState({currentStep: this.state.currentStep + 1});
  };

  goBack = () => {
    this.setState({currentStep: this.state.currentStep - 1});
  };

  onSkip = (value) => {
    if (value === 2) {
      this.setState({skip2: true});
      this.onNext();
    } else if (value === 3) {
      this.setState({skip3: true});
      this.setState({load: true});
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const {
      qn1,
      qn2,
      qn3,
      ans1,
      ans2,
      ans3,
      show3,
      selectedMedList,
      skip2,
      skip3,
    } = this.state;
    let promises = [];
    console.log('Calling handle submit loading: ' + this.state.load);
    setTimeout(() => {
      //step 1
      promises.push(
        new Promise((resolve, reject) => {
          resolve(submitSecurityQn(qn1, ans1, qn2, ans2, qn3, ans3, show3));
        }),
      );
      if (!skip2) {
        promises.push(
          new Promise((resolve, reject) => {
            resolve(submitMedPlan(selectedMedList));
          }),
        );
      }
      console.log('After pushing promise loading: ' + this.state.load);

      Promise.all(promises)
        .then((rsp) => {
          this.setState({load: false});
          this.props.fromOnboard();
        })
        .catch((err) => {
          console.log(err);
        });
    }, 7000);
  };

  render() {
    const {
      currentStep,
      qn1,
      qn2,
      qn3,
      ans1,
      ans2,
      ans3,
      show3,
      selectedMedList,
      med2Edit,
      authorised,
      load,
    } = this.state;
    return (
      <View
        style={[
          styles.onboardingContainer,
          {paddingTop: currentStep === 1 ? '24%' : 0},
        ]}>
        {currentStep > 1 && (
          <View style={globalStyles.menuBarContainer}>
            <LeftArrowBtn close={this.goBack} />
          </View>
        )}
        <Text style={[globalStyles.pageHeader, styles.stepText]}>
          Step {currentStep}
        </Text>
        <Text style={globalStyles.pageDetails}>
          {this.renderStepSubDetail(currentStep)}
        </Text>
        <Text style={[globalStyles.pageSubDetails, styles.stepContent]}>
          {this.renderStepInstruction(currentStep)}
        </Text>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={{flex: 1}}>
            {currentStep === 1 && (
              <SecurityQnComponent
                qn1={qn1}
                ans1={ans1}
                qn2={qn2}
                ans2={ans2}
                qn3={qn3}
                ans3={ans3}
                show3={show3}
                setShow3={this.setShow3}
                setQn1={this.setQn1}
                setQn2={this.setQn2}
                setQn3={this.setQn3}
                setAns1={this.setAns1}
                setAns2={this.setAns2}
                setAns3={this.setAns3}
              />
            )}

            {currentStep === 2 && (
              <MedPlanComponent
                selectedMedList={selectedMedList}
                med2Edit={med2Edit}
                setMed2Edit={this.setMed2Edit}
                setSelectedMedList={this.setSelectedMedList}
              />
            )}
            {currentStep === 3 && (
              <FitbitComponent
                authorised={authorised}
                setAuthorised={this.setAuthorised}
              />
            )}
            {load ? (
              <LoadingModal
                visible={load}
                message={'Setting up your account'}
              />
            ) : null}
          </View>
        </KeyboardAvoidingView>
        {/* If step ==3 need to submit when skip or next**/}
        <BtnContainer
          onNext={this.onNext}
          stepNo={currentStep}
          enable1={this.checkSecurityInput}
          enable2={this.checkMedPlanInput}
          onSkip={this.onSkip}
        />
      </View>
    );
  }
}

export default OnboardingWizard;

const styles = StyleSheet.create({
  onboardingContainer: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  stepContent: {
    marginTop: '3%',
    width: '90%',
  },
});
