import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import NameDateSelector from '../nameDateSelector';
import RenderCounter from '../../renderCounter';
//function
import {isEmpty} from '../../../commonFunctions/common';
import {addMedGoalReq} from '../../../netcalls/requestsGoals';
import {defaultv} from '../../../commonFunctions/goalFunctions';
import SearchBarMed from '../../medication/searchBarMed';

const MedicationGoal = (props) => {
  const {visible, parent, med} = props;
  const {close} = props;

  const [goalName, setGoalName] = useState('');
  const [selectedMed, setSelectedMed] = useState({});
  const [dosage, setDosage] = useState(0);
  const [pageText, setPageText] = useState('Add Goal');
  const [units, setUnits] = useState('');

  useEffect(() => {
    if (parent !== undefined && med !== undefined) {
      setGoalName(med.name);
      let medObj = {
        medication: med.medication,
      };
      setDosage(med.dosage);
      setSelectedMed(medObj);
      let formatUnit =
        String(med?.unit).substr(0, 1).toUpperCase() +
        String(med?.unit).substr(1, med?.unit?.length) +
        '(s)';
      setUnits(formatUnit);
      setPageText('Edit Goal');
      if (parent === defaultv) {
        setPageText('Add Goal');
      }
    }
  }, [med]);

  useEffect(() => {
    showSubmitBtn();
  }, [goalName, selectedMed, dosage]);

  const submit = async () => {
    let obj = {
      name: goalName,
      medication: selectedMed.medication,
      dosage: dosage,
    };
    if (parent !== undefined && parent !== defaultv) {
      let status = await addMedGoalReq(obj, med._id);
      if (status === 200) {
        Alert.alert('Medication goal edited successfully', '', [
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
      let status = await addMedGoalReq(obj);
      if (status === 200) {
        Alert.alert('Medication goal created successfully', '', [
          {
            text: 'Got It',
            onPress: () => close(),
          },
        ]);
      } else if (status === 400) {
        Alert.alert(
          'Already Exist',
          'Please remove your existing medication goal before creating a new one!',
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
    if (goalName?.length > 0 && dosage > 0 && !isEmpty(selectedMed)) {
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
          Medication Goal
        </Text>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <NameDateSelector goalName={goalName} setGoalName={setGoalName} />
              <Text style={globalStyles.goalFieldName}>Medication</Text>
              <SearchBarMed
                selectedMed={selectedMed}
                setSelectedMed={setSelectedMed}
                clickable={true}
              />
              <RenderCounter
                fieldName={'Dosage'}
                item={dosage}
                setItem={setDosage}
                parameter={
                  selectedMed?.dosage_unit === undefined
                    ? units
                    : selectedMed?.dosage_unit + '(s)'
                }
                maxLength={2}
                allowInput={false}
                showUnitInParam={false}
                style={{marginStart: '1%'}}
                incrementValue={0.5}
              />
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

export default MedicationGoal;

