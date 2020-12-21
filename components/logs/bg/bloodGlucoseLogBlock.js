import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
//components
import HypoglycemiaBlock from './hypoglycemiaBlock';
import LeftArrowBtn from '../leftArrowBtn';
import DateSelectionBlock from '../dateSelectionBlock';
import RemoveModal from '../../diary/removeModal';
import SuccessDialogue from '../../successDialogue';
//functions
import {
    bg_key,
    checkBloodGlucose,
    checkBloodGlucoseText,
    handleSubmitBloodGlucose,
} from '../../../commonFunctions/logFunctions';
import {getDateObj} from '../../../commonFunctions/diaryFunctions';
import {deleteBgLog, editBgLog} from '../../../netcalls/requestsDiary';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
//styles
import globalStyles from '../../../styles/globalStyles';
import {Colors} from '../../../styles/colors';
import logStyles from '../../../styles/logStyles';
import diaryStyles from '../../../styles/diaryStyles';
//third party lib
import Modal from 'react-native-modal';
import DeleteBin from '../../deleteBin';

const BloodGlucoseLogBlock = (props) => {
  const {
    visible,
    parent, //important when doing edit**
    recordDate,
    selectedLog, //to edit
  } = props;

  const {closeModal, closeParent, init} = props;
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [eatSelection, setEatSelection] = useState(false);
  const [exerciseSelection, setExerciseSelection] = useState(false);
  const [alcholicSelection, setAlcoholSelection] = useState(false);
  const [success, setSuccess] = useState(false);

  //for editing
  const initialBg = selectedLog ? selectedLog.bg_reading : 0;
  const initialDate = selectedLog ? getDateObj(selectedLog.record_date) : '';
  const initialEat =
    selectedLog && selectedLog.questionnaire != null
      ? selectedLog.questionnaire.eat_lesser
      : false;
  const initialEx =
    selectedLog && selectedLog.questionnaire != null
      ? selectedLog.questionnaire.exercised
      : false;
  const initialAlcohol =
    selectedLog && selectedLog.questionnaire != null
      ? selectedLog.questionnaire.alcohol
      : false;

  const [datetime, setDatetime] = useState(initialDate);
  const [changed, setChanged] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    console.log('Navigating to bg modal from ' + parent);
    if (selectedLog !== undefined) {
      setBloodGlucose(String(initialBg));
      setDatetime(initialDate);
      setEatSelection(initialEat);
      setExerciseSelection(initialEx);
      setAlcoholSelection(initialAlcohol);
    }
  }, []);

  useEffect(() => {
    checkChange();
  }, [
    datetime,
    bloodGlucose,
    exerciseSelection,
    alcholicSelection,
    eatSelection,
  ]);

  const submitBg = async () => {
    if (parent === 'addLog') {
      postBg();
    } else {
      //handle edit (get the questionaire ans)
      if (
        await editBgLog(
          datetime,
          eatSelection,
          exerciseSelection,
          alcholicSelection,
          selectedLog['_id'],
          bloodGlucose,
        )
      ) {
        Alert.alert('Blood Glucose Log edited successfully!', '', [
          {
            text: 'Got It',
            onPress: () => {
              init();
              closeModal();
            },
          },
        ]);
      }
    }
  };

  //submit value
  const postBg = async () => {
    if (
      await handleSubmitBloodGlucose(
        recordDate,
        bloodGlucose,
        eatSelection,
        exerciseSelection,
        alcholicSelection,
      )
    ) {
      setSuccess(true);
    }
  };

  const closeSuccess = () => {
    setSuccess(false);
    closeModal();
    closeParent();
  };

  //for edit
  const setDate = (value) => {
    setDatetime(value);
  };

  const checkChange = () => {
    if (
      bloodGlucose !== initialBg ||
      String(initialDate) !== String(datetime) ||
      eatSelection !== initialEat ||
      exerciseSelection !== initialEx ||
      alcholicSelection !== initialAlcohol
    ) {
      setChanged(true);
      return;
    }
    setChanged(false);
    return;
  };

  const deleteLog = () => {
    setDeleteModal(true);
  };

  const removeBgLog = () => {
    console.log('Deleting bg log');
    deleteBgLog(selectedLog['_id']).then((response) => {
      if (response != null) {
        init();
        closeModal();
      }
    });
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
        <View style={logStyles.menuBarContainer}>
          <LeftArrowBtn close={closeModal} />
          <View style={{flex: 1}} />
        </View>
        <View style={logStyles.bodyPadding}>
          {parent === 'addLog' ? (
            <>
              <Text style={[logStyles.headerText]}>Add Blood Glucose</Text>
              <Text
                style={[
                  logStyles.headersubText,
                  logStyles.componentMargin,
                  {color: Colors.subsubHeaderColor},
                ]}>
                Current Reading
              </Text>
            </>
          ) : (
            <>
              <Text style={logStyles.headerText}>Edit</Text>
              <DateSelectionBlock
                date={datetime}
                setDate={setDate}
                initialDate={initialDate}
              />
              <Text style={[logStyles.fieldName, styles.fieldStyle2]}>
                Reading
              </Text>
            </>
          )}
          <View style={[logStyles.componentMargin, {flexDirection: 'row'}]}>
            <TextInput
              style={[logStyles.inputField, styles.inputContainer]}
              placeholderTextColor="#a1a3a0"
              placeholder={bloodGlucose}
              keyboardType="decimal-pad"
              value={bloodGlucose}
              onChangeText={(value) => {
                setBloodGlucose(value);
              }}
              returnKeyType="done"
            />
            <Text style={styles.unitText}>mmol/L</Text>
          </View>
          {checkBloodGlucoseText(bloodGlucose) !== '' && (
            <Text style={[globalStyles.alertText]}>
              {checkBloodGlucoseText(bloodGlucose)}
            </Text>
          )}
        </View>
        <HypoglycemiaBlock
          eatSelection={eatSelection}
          setEatSelection={setEatSelection}
          exerciseSelection={exerciseSelection}
          setExerciseSelection={setExerciseSelection}
          alcholicSelection={alcholicSelection}
          setAlcoholSelection={setAlcoholSelection}
          bloodGlucose={bloodGlucose}
        />
      </View>

      {parent === 'addLog' ? (
        <View style={[globalStyles.buttonContainer]}>
          {checkBloodGlucose(bloodGlucose) ? (
            <TouchableOpacity
              style={globalStyles.submitButtonStyle}
              onPress={() => submitBg()}>
              <Text style={globalStyles.actionButtonText}>Submit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={globalStyles.skipButtonStyle}>
              <Text style={globalStyles.actionButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={[globalStyles.buttonContainer]}>
          <View style={{flexDirection: 'row'}}>
            <DeleteBin style={diaryStyles.binIcon} method={deleteLog} />
            {checkBloodGlucose(bloodGlucose) && changed === true ? (
              <TouchableOpacity
                style={logStyles.enableEditButton}
                onPress={() => submitBg()}>
                <Text style={globalStyles.actionButtonText}>Done</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={logStyles.disableEditButton}>
                <Text style={globalStyles.actionButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/*Delete confirmation modal */}
      {deleteModal ? (
        <RemoveModal
          visible={deleteModal}
          closeModal={() => setDeleteModal(false)}
          logType={bg_key}
          itemToDeleteName={selectedLog.bg_reading}
          deleteMethod={() => removeBgLog()}
        />
      ) : null}

      {success ? (
        <SuccessDialogue
          visible={success}
          type={bg_key}
          closeSuccess={closeSuccess}
        />
      ) : null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '40%',
  },
  fieldStyle: {
    marginTop: '7%',
  },
  fieldStyle2: {
    marginTop: '2%',
  },
  unitText: {
    marginTop: '5%',
    marginStart: '3%',
    fontSize: adjustSize(18),
  },
});

export default BloodGlucoseLogBlock;
