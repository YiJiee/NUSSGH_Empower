import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
//styles
import globalStyles from '../../styles/globalStyles';
import {Colors} from '../../styles/colors';
//component
import SecurityQnDropdown from '../../components/account/SecurityQnDropdown';
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
//function
import {getQuestions, setSecurityQn} from '../../netcalls/requestsSecurityQn';
import {isEmpty} from '../../commonFunctions/common';
import RadioButton from '../../components/radioButton';
import {submitSecurityQn} from '../../commonFunctions/onboardingFunction';
import SecurityQnComponent from '../../components/onboarding/securityQnComponent';

const SecurityQns = (props) => {
  const [type, setType] = useState('');
  const [qnList, setQnList] = useState([]);

  const [expand1, setExpand1] = useState(false);
  const [security1Qn, setSecurity1Qn] = useState({});
  const [security1Ans, setSecurity1Ans] = useState('');

  const [expand2, setExpand2] = useState(false);
  const [security2Qn, setSecurity2Qn] = useState({});
  const [security2Ans, setSecurity2Ans] = useState('');

  const [expand3, setExpand3] = useState(false);
  const [security3Qn, setSecurity3Qn] = useState({});
  const [security3Ans, setSecurity3Ans] = useState('');

  const [show3, setShow3] = useState(false);

  useEffect(() => {
    setType(props.route?.params?.type);
    setQnList(props.route?.params?.qns);
  }, [props.route?.params]);

  const enableNextButton = () => {
    if (
      !isEmpty(security1Qn) &&
      !isEmpty(security2Qn) &&
      security1Ans &&
      security2Ans
    ) {
      if (show3 && !isEmpty(security3Qn) && security3Ans) {
        return true;
      } else if (!show3) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const submit = async () => {
    if (enableNextButton()) {
      if (
        await submitSecurityQn(
          security1Qn,
          security1Ans,
          security2Qn,
          security2Ans,
          security3Qn,
          security3Ans,
          show3,
        )
      ) {
        Alert.alert('Security Questions Set Successfully!', '', [
          {text: 'Got It', onPress: () => props.navigation.goBack()},
        ]);
      } else {
        Alert.alert('Unexpected Error!', 'Please try again later', [
          {text: 'Got It'},
        ]);
      }
    }
  };
  return (
    <View
      style={[
        styles.pageContainer,
        {paddingTop: type === 'edit' ? '0%' : '8%'},
      ]}>
      {type === 'edit' ? (
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => props.navigation.goBack()} />
        </View>
      ) : null}
      <Text
        style={[
          globalStyles.pageHeader,
          type === undefined ? styles.stepText : null,
        ]}>
        {type === 'edit' ? 'Edit' : 'Step 1'}
      </Text>
      <Text style={globalStyles.pageDetails}>
        {type === 'edit' ? 'Security Questions' : 'Set Up Security Questions'}
      </Text>
      <Text style={[globalStyles.pageSubDetails, styles.stepContent]}>
        These security questions will be used to verify your identity and help
        recover your password if you ever forget it.
      </Text>

      <SecurityQnComponent
        qn1={security1Qn}
        ans1={security1Ans}
        qn2={security2Qn}
        ans2={security2Ans}
        qn3={security3Qn}
        ans3={security3Ans}
        type={'edit'}
        show3={show3}
        qnList={qnList}
        setShow3={setShow3}
        setQn1={setSecurity1Qn}
        setQn2={setSecurity2Qn}
        setQn3={setSecurity3Qn}
        setAns1={setSecurity1Ans}
        setAns2={setSecurity2Ans}
        setAns3={setSecurity3Ans}
      />

      {type === 'edit' && (
        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity
            onPress={() => submit()}
            style={
              enableNextButton()
                ? globalStyles.nextButtonStyle
                : globalStyles.skipButtonStyle
            }>
            <Text style={globalStyles.actionButtonText}>
              {type === 'edit' ? 'Save' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SecurityQns;

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  stepText: {
    marginTop: '10%',
  },
  stepContent: {
    marginTop: '3%',
    width: '90%',
  },
});
