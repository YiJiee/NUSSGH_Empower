import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import NameDateSelector from '../nameDateSelector';
import WeightDragModal from '../weightDragModal';
import {normalTextFontSize} from '../../../styles/variables';
//function
import {addWeightGoalReq} from '../../../netcalls/requestsGoals';
import {defaultv} from '../../../commonFunctions/goalFunctions';

const WeightGoal = (props) => {
  const {visible, parent, weightObj} = props;
  const {close} = props;

  const [goalName, setGoalName] = useState('');
  const [openedWeight, setOpenedWeight] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [weight, setWeight] = useState(50);

  const [pageText, setPageText] = useState('Add Goal');

  useEffect(() => {
    if (parent !== undefined && weightObj !== undefined) {
      setGoalName(weightObj.name);
      setWeight(weightObj.goal_weight);
      setPageText('Edit Goal');
      setOpenedWeight(true);
      if (parent === defaultv) {
        setPageText('Add Goal');
      }
    }
  }, []);

  useEffect(() => {
    showSubmitBtn();
  }, [goalName, openedWeight]);

  const submit = async () => {
    let obj = {
      name: goalName,
      goal_weight: weight,
    };
    if (parent !== undefined && parent != defaultv) {
      let status = await addWeightGoalReq(obj, weightObj._id);
      if (status === 200) {
        Alert.alert('Weight goal edited successfully', '', [
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
      let status = await addWeightGoalReq(obj);
      if (status === 200) {
        Alert.alert('Weight goal created successfully', '', [
          {
            text: 'Got It',
            onPress: () => close(),
          },
        ]);
      } else if (status === 400) {
        Alert.alert(
          'Already Exist',
          'Please remove your existing weight goal before creating a new one!',
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

  const openWeightPicker = () => {
    setShowPicker(true);
    setOpenedWeight(true);
  };

  //no selected weight*
  const closeWeightPicker = () => {
    setShowPicker(false);
  };

  const showSubmitBtn = () => {
    if (goalName?.length > 0 && openedWeight) {
      return true;
    }
    return false;
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
          Weight Goal
        </Text>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <NameDateSelector goalName={goalName} setGoalName={setGoalName} />
          <TouchableOpacity
            onPress={() => openWeightPicker()}
            style={{marginBottom: '2%'}}>
            <View
              style={[
                {flexDirection: 'row'},
                globalStyles.goalFieldBottomBorder,
              ]}>
              <Text style={[globalStyles.goalFieldName, {flex: 1}]}>
                Goal Weight
              </Text>
              {!openedWeight ? (
                <Text style={styles.selectStyle}>Set Weight</Text>
              ) : (
                <Text style={[styles.selectStyle, {color: 'black'}]}>
                  {weight} kg
                </Text>
              )}
            </View>
          </TouchableOpacity>
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
      <WeightDragModal
        visible={showPicker}
        close={() => closeWeightPicker()}
        tick={() => setShowPicker(false)}
        weight={weight}
        setWeight={setWeight}
      />
    </Modal>
  );
};

export default WeightGoal;

const styles = StyleSheet.create({
  spacing: {
    marginStart: '4%',
    marginEnd: '4%',
  },
  selectStyle: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: normalTextFontSize,
    marginTop: '3%',
    marginEnd: '3%',
    color: '#aad326',
  },
});
