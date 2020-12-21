import React, {useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
//function
import {
    activity_key,
    bg_key,
    food_key,
    med_key,
    renderLogIconNavy,
    step_key,
    weight_key,
} from '../../commonFunctions/logFunctions';
//styles
import logStyles from '../../styles/logStyles';
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import BgGoal from './blocks/bgGoal';
import FoodGoal from './blocks/foodGoal';
import MedicationGoal from './blocks/medicationGoal';
import ActivityGoal from './blocks/activityGoal';
import StepsGoal from './blocks/stepsGoal';
import WeightGoal from './blocks/weightGoal';

const AddGoalModal = (props) => {
  const {visible} = props;
  const {close} = props;
  const buttonList = [
    bg_key,
    food_key,
    med_key,
    weight_key,
    activity_key,
    step_key,
  ];
  const [openBg, setOpenBg] = useState(false);
  const [openFood, setOpenFood] = useState(false);
  const [openMed, setOpenMed] = useState(false);
  const [openWeight, setOpenWeight] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openSteps, setOpenSteps] = useState(false);
  const [type, setType] = useState('');

  const trimPhrase = (phrase) => {
    if (String(phrase).includes('Log')) {
      return String(phrase).substr(0, phrase.length - 4);
    } else {
      return phrase;
    }
  };

  const openGoalType = (type) => {
    if (type === bg_key) {
      setOpenBg(true);
    }
    if (type === food_key) {
      setOpenFood(true);
    }
    if (type === med_key) {
      setOpenMed(true);
    }
    if (type === weight_key) {
      setOpenWeight(true);
    }
    if (type === activity_key) {
      setOpenActivity(true);
    }
    if (type === step_key) {
      setOpenSteps(true);
    }
  };

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
        <Text style={[globalStyles.greyPageDetails, {marginBottom: '4%'}]}>
          Select Goal Type
        </Text>
        <FlatList
          data={buttonList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={logStyles.logItem}
              onPress={() => openGoalType(item)}>
              {renderLogIconNavy(item)}
              <Text
                style={[globalStyles.pageDetails, {flex: 1, color: '#21293a'}]}>
                {trimPhrase(item)} Goal
              </Text>
              <Icon
                name="chevron-right"
                size={20}
                color={Colors.lastLogValueColor}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Goal Type Modal to open */}
      {openBg ? (
        <BgGoal visible={openBg} close={() => setOpenBg(false)} />
      ) : null}
      {openFood ? (
        <FoodGoal visible={openFood} close={() => setOpenFood(false)} />
      ) : null}
      {openMed ? (
        <MedicationGoal visible={openMed} close={() => setOpenMed(false)} />
      ) : null}
      {openWeight ? (
        <WeightGoal visible={openWeight} close={() => setOpenWeight(false)} />
      ) : null}
      {openActivity ? (
        <ActivityGoal
          visible={openActivity}
          close={() => setOpenActivity(false)}
        />
      ) : null}
      {openSteps ? (
        <StepsGoal visible={openSteps} close={() => setOpenSteps(false)} />
      ) : null}
    </Modal>
  );
};

export default AddGoalModal;
