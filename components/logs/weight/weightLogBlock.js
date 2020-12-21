import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
//components
import PickDrag from './pickDrag';
import LeftArrowBtn from '../leftArrowBtn';
import SuccessDialogue from '../../successDialogue';
import DateSelectionBlock from '../dateSelectionBlock';
import RemoveModal from '../../diary/removeModal';
//third party library
import Modal from 'react-native-modal';

//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
import logStyles from '../../../styles/logStyles';
import diaryStyles from '../../../styles/diaryStyles';
//function
import {checkWeight, handleSubmitWeight, weight_key} from '../../../commonFunctions/logFunctions';
import {getDateObj} from '../../../commonFunctions/diaryFunctions';
import {deleteWeightLog, editWeightLog} from '../../../netcalls/requestsDiary';
import DeleteBin from '../../deleteBin';

const WeightLogBlock = (props) => {
  const {
    visible,
    parent, //important when doing edit**
    recordDate,
    selectedLog, //to edit
  } = props;
  const {closeModal, closeParent, init} = props;
  const [weight, setWeight] = useState(50);
  const [success, setSuccess] = useState(false);

  //for editing
  const initialWeight = selectedLog ? selectedLog.weight : 0;
  const initialDate = selectedLog ? getDateObj(selectedLog.record_date) : '';
  const [datetime, setDatetime] = useState(initialDate);
  const [changed, setChanged] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (selectedLog !== undefined) {
      setWeight(initialWeight);
      setDatetime(initialDate);
    }
  }, []);

  useEffect(() => {
    checkChange();
  }, [weight, datetime]);

  const submitWeight = () => {
    if (parent === 'addLog') {
      postWeight();
    } else {
      if (editWeightLog(weight, datetime, selectedLog['_id'])) {
        Alert.alert('Weight Log edited successfully!', '', [
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

  const checkChange = () => {
    if (initialWeight === weight && String(datetime) === String(initialDate)) {
      setChanged(false);
      return;
    }
    setChanged(true);
    return;
  };

  const postWeight = async () => {
    if (await handleSubmitWeight(recordDate, weight)) {
      setSuccess(true);
    }
  };

  const closeSuccess = () => {
    setSuccess(false);
    closeModal();
    closeParent();
  };

  const getValue = (value) => {
    setWeight(value);
  };

  const deleteLog = () => {
    setDeleteModal(true);
  };

  const removeWeightLog = () => {
    deleteWeightLog(selectedLog['_id']).then((response) => {
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
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={closeModal} />
          <View style={{flex: 1}} />
        </View>
        <ScrollView contentContainerStyle={{flexGrow: 0}}>
          {parent === 'addLog' ? (
            <View style={{marginBottom: '10%'}}>
              <Text style={globalStyles.pageHeader}>Add Weight</Text>
              <View style={[logStyles.bodyPadding, {marginStart: 0}]}>
                <Text style={logStyles.fieldName}>Current Weight</Text>
                <Text style={[logStyles.fieldText, {marginStart: 0}]}>
                  {weight}kg
                </Text>
              </View>
            </View>
          ) : (
            <View style={{marginBottom: '10%'}}>
              <View style={[logStyles.bodyPadding, {marginStart: 0}]}>
                <Text style={logStyles.headerText}>Edit</Text>
                <DateSelectionBlock
                  date={datetime}
                  setDate={setDatetime}
                  initialDate={initialDate}
                />
                <Text style={logStyles.fieldName}>Weight</Text>
                <Text style={[logStyles.fieldText, {marginStart: 0}]}>
                  {weight}kg
                </Text>
              </View>
            </View>
          )}
          <View style={{flex: 1}} />
          <PickDrag
            min={40}
            max={200}
            onChange={getValue}
            interval={0.2}
            value={weight}
          />
        </ScrollView>
        <View style={{flex: 1}} />
        {parent === 'addLog' ? (
          <View style={[globalStyles.buttonContainer]}>
            {checkWeight(weight) ? (
              <TouchableOpacity
                style={globalStyles.submitButtonStyle}
                onPress={() => submitWeight()}>
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
              {checkWeight(weight) && changed ? (
                <TouchableOpacity
                  style={logStyles.enableEditButton}
                  onPress={() => submitWeight()}>
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
      </View>
      {/*Delete confirmation modal */}
      {deleteModal ? (
        <RemoveModal
          visible={deleteModal}
          closeModal={() => setDeleteModal(false)}
          logType={weight_key}
          itemToDeleteName={selectedLog.weight}
          deleteMethod={() => removeWeightLog()}
        />
      ) : null}

      {success ? (
        <SuccessDialogue
          visible={success}
          type={weight_key}
          closeSuccess={closeSuccess}
        />
      ) : null}
    </Modal>
  );
};

export default WeightLogBlock;
