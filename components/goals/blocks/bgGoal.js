import React, {useEffect, useState} from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import NameDateSelector from '../nameDateSelector';
//styles
//function
import {checkBloodGlucoseText, min_bg} from '../../../commonFunctions/logFunctions';
import {addBgGoalReq} from '../../../netcalls/requestsGoals';
import {defaultv} from '../../../commonFunctions/goalFunctions';
import RenderCounter from '../../renderCounter';
import {decimal} from '../../../commonFunctions/common';

const BgGoal = (props) => {
  const {visible, parent, bg} = props;
  const {close} = props;
  const [goalName, setGoalName] = useState('');
  const [minBg, setMinBg] = useState(5);
  const [maxBg, setMaxBg] = useState(12);
  const [errorMsg, setErrorMsg] = useState('');
  const [pageText, setPageText] = useState('Add Goal');

  useEffect(() => {
    if (parent != undefined || bg != undefined) {
      setGoalName(bg?.name);
      setMinBg(bg?.min_bg);
      setMaxBg(bg?.max_bg);
      setPageText('Edit Goal');
      if (parent === defaultv) {
        setPageText('Add Goal');
      }
    }
  }, [bg]);

  useEffect(() => {
    check();
    showSubmitBtn();
  }, [minBg, maxBg, goalName]);

  const submit = async () => {
    let obj = {
      name: goalName,
      min_bg: Number(minBg),
      max_bg: Number(maxBg),
    };
    if (parent !== undefined && parent !== defaultv) {
      let status = await addBgGoalReq(obj, bg._id);
      if (status === 200) {
        Alert.alert('Blood glucose goal edited successfully', '', [
          {
            text: 'Got It',
            onPress: () => close(),
          },
        ]);
      } else {
        Alert.alert('Unexpected Error Occured', 'Please try again later!', [
          {
            text: 'Got It',
          },
        ]);
      }
    } else {
      let status = await addBgGoalReq(obj);
      if (status === 200) {
        Alert.alert('Blood glucose goal created successfully', '', [
          {
            text: 'Got It',
            onPress: () => close(),
          },
        ]);
      } else if (status === 400) {
        Alert.alert(
          'Already Exist',
          'Please remove your existing blood glucose goal before creating a new one!',
          [
            {
              text: 'Got It',
            },
          ],
        );
      } else {
        Alert.alert('Unexpected Error Occured', 'Please try again later!', [
          {
            text: 'Got It',
          },
        ]);
      }
    }
  };

  const showSubmitBtn = () => {
    if (goalName?.length !== 0 && errorMsg === '') {
      return true;
    } else {
      return false;
    }
  };

  const check = () => {
    if (minBg !== '' && maxBg !== '') {
      let max = Number(maxBg);
      let min = Number(minBg);
      if (min <= min_bg || max <= min_bg) {
        setErrorMsg(
          'Please set a higher blood glucose level of more than ' +
            min_bg +
            ' mmol/L',
        );
        return;
      }
      if (max < min) {
        setErrorMsg(
          'Min blood glucose should be lesser than max blood glucose and vice versa',
        );
        return;
      }
      if (max === min) {
        setErrorMsg(
          'Min blood glucose should not be equal to maximum blood glucose',
        );
        return;
      }
    }
    setErrorMsg('');
    return;
  };

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => close()}
      backdropOpacity={1}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => close()} />
        </View>

        <Text style={globalStyles.pageHeader}>{pageText}</Text>

        <Text style={[globalStyles.pageDetails, {marginBottom: '4%'}]}>
          Blood Glucose Goal
        </Text>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <NameDateSelector goalName={goalName} setGoalName={setGoalName} />
              <RenderCounter
                fieldName="Min Reading"
                item={minBg}
                setItem={setMinBg}
                parameter={'mmol/L'}
                maxLength={5}
                valueType={decimal}
                incrementValue={0.5}
              />
              <RenderCounter
                fieldName="Max Reading"
                item={maxBg}
                setItem={setMaxBg}
                parameter={'mmol/L'}
                maxLength={5}
                valueType={decimal}
                incrementValue={0.5}
              />
              {errorMsg.length > 0 && (
                <Text style={[globalStyles.alertText, styles.spacing]}>
                  {errorMsg}
                </Text>
              )}
              {checkBloodGlucoseText(String(minBg)) !== '' && (
                <Text style={[globalStyles.alertText, styles.spacing]}>
                  Min Reading: {checkBloodGlucoseText(minBg)}
                </Text>
              )}
              {checkBloodGlucoseText(String(maxBg)) !== '' && (
                <Text style={[globalStyles.alertText, styles.spacing]}>
                  Max Reading: {checkBloodGlucoseText(maxBg)}
                </Text>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <View style={[globalStyles.buttonContainer]}>
          {showSubmitBtn() === false ? (
            <TouchableOpacity style={globalStyles.skipButtonStyle}>
              <Text style={globalStyles.actionButtonText}>{pageText}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.submitButtonStyle}
              onPress={() => submit()}>
              <Text style={globalStyles.actionButtonText}>{pageText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BgGoal;

const styles = StyleSheet.create({
  spacing: {
    marginStart: '4%',
    marginEnd: '4%',
  },
});
