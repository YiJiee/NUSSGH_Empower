import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {maxDuration, maxCalBurnt} from '../../commonFunctions/diaryFunctions';
//third party lib
import Modal from 'react-native-modal';
import Moment from 'moment';
//styles
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import NameDateSelector from './nameDateSelector';
import FrequencySelector from './dropDownSelector';
import RenderCounter from './renderCounter';

const ActivityGoal = (props) => {
  const {visible} = props;
  const {close} = props;

  const [goalName, setGoalName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  //change select date to date option *
  const [opened, setOpened] = useState(false);
  const [frequency, setFrequency] = useState('daily');

  const [minute, setMinute] = useState(maxDuration);
  const [calBurnt, setCalBurnt] = useState(maxCalBurnt);

  useEffect(() => {
    check();
    showSubmitBtn();
  }, [goalName]);

  const submit = () => {
    let obj = {
      goalName: goalName,
      startDate: Moment(startDate).format('DD/MM/YYYY HH:mm:ss'),
      endDate: Moment(endDate).format('DD/MM/YYYY HH:mm:ss'),
      frequency: frequency,
      exercise_min: minute,
      calBurnt: calBurnt,
    };
    console.log(obj);
  };

  const showSubmitBtn = () => {
    if (goalName.length > 0 && opened) {
      return true;
    }
    return false;
  };

  const check = () => {};

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => close()}
      onBackButtonPress={() => close()}
      backdropOpacity={1}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => close()} />
        </View>
        <Text style={globalStyles.pageHeader}>Add Goal</Text>
        <Text style={[globalStyles.pageDetails, {marginBottom: '4%'}]}>
          Activity Goal
        </Text>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <NameDateSelector
            goalName={goalName}
            setGoalName={setGoalName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            opened={opened}
            setOpened={setOpened}
          />
          <FrequencySelector
            selected={frequency}
            setSelected={setFrequency}
            fieldName="Frequency"
            dropDownType="frequency"
          />
          <RenderCounter
            fieldName="Excercise"
            item={minute}
            setItem={setMinute}
            parameter={'mins'}
          />
          <RenderCounter
            fieldName="Cal Burnt"
            item={calBurnt}
            setItem={setCalBurnt}
            parameter={'cal'}
          />
        </ScrollView>
        <View style={[globalStyles.buttonContainer]}>
          {showSubmitBtn() === false ? (
            <TouchableOpacity style={globalStyles.skipButtonStyle}>
              <Text style={globalStyles.actionButtonText}>Add Goal</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.submitButtonStyle}
              onPress={() => submit()}>
              <Text style={globalStyles.actionButtonText}>Add Goal</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ActivityGoal;

const styles = StyleSheet.create({
  spacing: {
    marginStart: '4%',
    marginEnd: '4%',
  },
});