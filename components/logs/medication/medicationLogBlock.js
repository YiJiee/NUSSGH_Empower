import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
// component
import LeftArrowBtn from '../leftArrowBtn';
import SelectMedicationModalContent from './selectMedicationModalContent';
import ExtraMedItem from './extraMedItem';
import SuccessDialogue from '../../successDialogue';
// functions
import {handleSubmitMedication, med_key} from '../../../commonFunctions/logFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
//style
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
import logStyles from '../../../styles/logStyles';
import ScheduledMedicationList from './scheduledMedicationList';
import {ScrollView} from 'react-native-gesture-handler';
import SideEffectModal from './sideEffectModal';
import diaryStyles from '../../../styles/diaryStyles';

const extra = 'extra';

const MedicationLogBlock = (props) => {
  const {
    visible,
    parent, //important when doing edit**
    recordDate,
  } = props;
  const {closeModal, closeParent} = props;
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedMedList, setSelectedMedList] = useState([]); //from planned
  const [extraAddedList, setExtraAddedList] = useState([]); //from newly added
  const [sideEffects, setSideEffects] = useState([]);
  const [sideEffectString, setSideEffectString] = useState('');
  const [showEffectModal, setShowEffectModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSelectedMedList([]);
    setExtraAddedList([]);
    setSideEffects([]);
  }, []);

  useEffect(() => {
    combineArr();
  }, [selectedMedList, extraAddedList]);

  const getSelectedMedicineFromModal = (medicineObj, type) => {
    console.log('Setting selected medication: ' + medicineObj.medication);
    //format object before adding
    let obj = {
      dosage: medicineObj.dosage,
      unit: medicineObj.dosage_unit,
      drugName: medicineObj.medication,
    };
    if (type === extra) {
      let list = extraAddedList;
      list.push(obj);
      setExtraAddedList(list);
    } else {
      add2List(obj);
    }
    //set new states
    setShowSelectModal(false);
  };

  const handleDelete = (item, type) => {
    console.log('removing');
    if (type === extra) {
      setExtraAddedList(
        extraAddedList.filter((medication) => medication !== item),
      );
      return;
    } else {
      setSelectedMedList(
        selectedMedList.filter(
          (medication) => medication.drugName !== item.medication,
        ),
      );
      return;
    }
  };

  //for planned medicine - update dosage / add med
  const add2List = (item) => {
    let arr = [];
    let found = false;
    for (var x of selectedMedList) {
      //if item exist, update dosage if change
      if (item.drugName === x.drugName) {
        if (item.dosage !== x.dosage) {
          x.dosage = item.dosage;
          found = true;
        }
      }
      arr.push(x);
    }
    //item does not exist
    if (found === false) {
      arr.push(item);
    }

    setSelectedMedList(arr);
  };

  const combineArr = () => {
    let newArr = selectedMedList.concat(extraAddedList);

    for (var x of newArr) {
      x.side_effects = sideEffects;
    }

    return newArr;
  };

  const submit = () => {
    if (parent === 'addLog') {
      postMed();
    }
  };

  const postMed = async () => {
    if (await handleSubmitMedication(recordDate, combineArr())) {
      setSuccess(true);
    }
  };

  const closeSuccess = () => {
    setSuccess(false);
    closeModal();
    closeParent();
  };

  const onReturnSideEffect = (arr) => {
    console.log(arr);
    setSideEffects(arr);

    let string = arr.join(', ');
    setSideEffectString(string);
  };

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      backdropOpacity={1}
      onBackButtonPress={() => closeModal()}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}>
      <View style={logStyles.modalContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={closeModal} />
          <View style={{flex: 1}} />
        </View>
        <View style={[logStyles.bodyPadding, {flex: 1}]}>
          <Text style={[logStyles.headerText, logStyles.componentMargin]}>
            Medication Taken
          </Text>
          <ScrollView contentContainerStyle={{flexGrow: 0}}>
            <Text style={[logStyles.fieldName, logStyles.componentMargin]}>
              Scheduled Medication
            </Text>
            {/* List of medication from plan */}
            <ScheduledMedicationList
              addMed={getSelectedMedicineFromModal}
              deleteMed={handleDelete}
            />
            <Text style={[logStyles.fieldName, logStyles.componentMargin]}>
              Other Medications Taken
            </Text>
            {/*List of extra medication added*/}
            {extraAddedList.map((item, index) => (
              <ExtraMedItem
                medication={item}
                handleDelete={() => handleDelete(item, extra)}
                key={index}
              />
            ))}
            <TouchableOpacity
              onPress={() => setShowSelectModal(true)}
              style={{flexDirection: 'row'}}>
              <AntDesign
                name="pluscircleo"
                color={'#aad326'}
                size={25}
                style={{margin: '2%'}}
              />
              <Text style={[logStyles.fieldName, {color: '#aad326'}]}>
                Add Medication
              </Text>
            </TouchableOpacity>

            <Text style={[logStyles.fieldName, logStyles.componentMargin]}>
              Side Effect
            </Text>
            {sideEffects.length === 0 ? (
              <TouchableOpacity
                onPress={() => setShowEffectModal(true)}
                style={{flexDirection: 'row'}}>
                <AntDesign
                  name="pluscircleo"
                  color={'#aad326'}
                  size={adjustSize(25)}
                  style={{margin: '2%'}}
                />
                <Text style={[logStyles.fieldName, {color: '#aad326'}]}>
                  Add Side Effect
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[globalStyles.medContainer, {marginBottom: '3%'}]}
                onPress={() => setShowEffectModal(true)}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'SFProDisplay-Regular',
                    fontSize: adjustSize(18),
                  }}>
                  {sideEffectString}
                </Text>
                <Entypo name="edit" style={diaryStyles.editIcon} size={adjustSize(30)} />
              </TouchableOpacity>
            )}
          </ScrollView>

          {/*Select medication modal */}
          {showSelectModal === true ? (
            <SelectMedicationModalContent
              showSelectModal={showSelectModal}
              closeSelectModal={() => setShowSelectModal(false)}
              selectedMedList={extraAddedList}
              getSelectedMedicineFromModal={getSelectedMedicineFromModal}
              recordDate={recordDate}
              medplanlist={selectedMedList}
            />
          ) : null}

          {/*Side Effect Modal */}
          {showEffectModal ? (
            <SideEffectModal
              visible={showEffectModal}
              close={() => setShowEffectModal(false)}
              parent="add"
              chosenSideEffects={sideEffects}
              onReturnSideEffect={onReturnSideEffect}
              deleteSideEffect={() => setSideEffects([])}
            />
          ) : null}
        </View>
        <View style={[globalStyles.buttonContainer]}>
          {combineArr().length > 0 ? (
            <TouchableOpacity
              style={globalStyles.submitButtonStyle}
              onPress={() => submit()}>
              <Text style={globalStyles.actionButtonText}>Submit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={globalStyles.skipButtonStyle}>
              <Text style={globalStyles.actionButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {success ? (
        <SuccessDialogue
          visible={success}
          type={med_key}
          closeSuccess={closeSuccess}
        />
      ) : null}
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default MedicationLogBlock;
