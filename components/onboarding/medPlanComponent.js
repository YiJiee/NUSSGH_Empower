import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
//third party library
import Ionicons from 'react-native-vector-icons/Ionicons';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import {Colors} from '../../styles/colors';
import PlannedMedList from '../medication/displayMedList/plannedMedList';
import {
  onboardEdit,
  onboardAdd,
  editMed,
} from '../../commonFunctions/medicationFunction';
import AddMedicationModal from '../medication/addMedicationModal';

const MedPlanComponent = (props) => {
  const {selectedMedList, med2Edit} = props;
  const {setMed2Edit, setSelectedMedList} = props;
  const [parent, setParent] = useState('');
  const [showAddModel, setShowAddModal] = useState(false);

  handleAddMedication = () => {
    setShowAddModal(true);
    setParent(onboardAdd);
  };

  editMedicine = (item) => {
    console.log('edting');
    setParent(onboardEdit);
    setMed2Edit(item);
    setShowAddModal(true);
  };

  onAddMed = (item) => {
    console.log('adding medication ');
    let arr = selectedMedList;
    arr.push(item);
    setSelectedMedList(arr);
  };

  handleEdit = (editedItem) => {
    let arr = editMed(med2Edit, editedItem, selectedMedList);
    setSelectedMedList(arr);
  };

  handleDelete = (toDelete) => {
    let arr = selectedMedList.filter(
      (item) => item.medication !== toDelete.medication,
    );
    setSelectedMedList(arr);
    setShowAddModal(false);
  };

  return (
    <>
      {selectedMedList.length === 0 ? (
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={handleAddMedication}>
          <Ionicons
            name="add-circle"
            size={adjustSize(80)}
            color={Colors.nextBtnColor}
          />
        </TouchableOpacity>
      ) : (
        <PlannedMedList
          medList={selectedMedList}
          openAddModal={handleAddMedication}
          editMed={editMedicine}
        />
      )}
      {showAddModel ? (
        <AddMedicationModal
          visible={showAddModel}
          closeModal={() => setShowAddModal(false)}
          onAddMed={onAddMed}
          parent={parent}
          currentMedList={selectedMedList}
          med2Edit={med2Edit}
          onEditMed={handleEdit}
          onDeleteMed={handleDelete}
        />
      ) : null}
    </>
  );
};

export default MedPlanComponent;
