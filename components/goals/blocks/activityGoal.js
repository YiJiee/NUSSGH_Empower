import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {maxCalBurnt, maxDuration} from '../../../commonFunctions/diaryFunctions';
//third party lib
import Modal from 'react-native-modal';
//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import NameDateSelector from '../nameDateSelector';
import RenderCounter from '../../renderCounter';
import {addActivityGoalReq} from '../../../netcalls/requestsGoals';
import {defaultv} from '../../../commonFunctions/goalFunctions';

const ActivityGoal = (props) => {
  const {visible, parent, activity} = props;
  const {close} = props;

  const [goalName, setGoalName] = useState('');

  const [minute, setMinute] = useState(maxDuration);
  const [calBurnt, setCalBurnt] = useState(maxCalBurnt);

  const [pageText, setPageText] = useState('Add Goal');

  useEffect(() => {
    if (parent !== undefined && activity !== undefined) {
      setGoalName(activity.name);
      setMinute(activity.duration);
      setCalBurnt(activity.cal_burnt);
      setPageText('Edit Goal');
      if (parent === defaultv) {
        setPageText('Add Goal');
      }
    }
  }, [activity]);

  useEffect(() => {
    check();
    showSubmitBtn();
  }, [goalName]);

  const submit = async () => {
    let obj = {
      name: goalName,
      duration: minute,
      cal_burnt: calBurnt,
    };
    if (parent !== undefined && parent !== defaultv) {
      let status = await addActivityGoalReq(obj, activity._id);
      if (status === 200) {
        Alert.alert('Activity goal edited successfully', '', [
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
      let status = await addActivityGoalReq(obj);
      if (status === 200) {
        Alert.alert('Activity goal created successfully', '', [
          {
            text: 'Got It',
            onPress: () => close(),
          },
        ]);
      } else if (status === 400) {
        Alert.alert(
          'Already Exist',
          'Please remove your existing activity goal before creating a new one!',
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
    if (goalName?.length > 0 && minute > 0 && calBurnt > 0) {
      return true;
    }
    return false;
  };

  const check = () => {};

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
          Activity Goal
        </Text>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <NameDateSelector goalName={goalName} setGoalName={setGoalName} />
          <RenderCounter
            fieldName="Exercise"
            item={minute}
            setItem={setMinute}
            parameter={'mins'}
            maxLength={3}
            incrementValue={5}
          />
          <RenderCounter
            fieldName="Cal Burnt"
            item={calBurnt}
            setItem={setCalBurnt}
            parameter={'cal'}
            maxLength={4}
            incrementValue={100}
          />
        </ScrollView>
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

export default ActivityGoal;

