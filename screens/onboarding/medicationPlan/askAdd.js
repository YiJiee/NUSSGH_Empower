import React, {Component} from 'react';
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
//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
//component
import LoadingModal from '../../../components/loadingModal';
import AddMedicationModal from '../../../components/medication/addMedicationModal';
import PlannedMedList from '../../../components/medication/displayMedList/plannedMedList';
//function
import {
  onboardAdd,
  onboardEdit,
  editMed,
} from '../../../commonFunctions/medicationFunction';
import {prepareData, postPlan} from '../../../netcalls/requestsMedPlan';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

class AskAdd extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      loading: false,
      showAddModal: false,
      parent: '',
      med2Edit: {},
      selectedMedList: [],
    };
  }

  componentDidMount() {
    this.setState({parent: onboardAdd});
  }

  componentDidUpdate() {}

  handleAddMedication = () => {
    this.setState({showAddModal: true});
    this.setState({parent: onboardAdd});
  };

  closeAddMedicationModal = () => {
    this.setState({showAddModal: false});
  };

  onAddMed = (item) => {
    console.log('adding medication ');
    let arr = this.state.selectedMedList;
    arr.push(item);
    this.setState({selectedMedList: arr});
  };

  editMed = (item) => {
    console.log('edting');
    this.setState({parent: onboardEdit});
    this.setState({med2Edit: item});
    this.setState({showAddModal: true});
  };

  handleEdit = (editedItem) => {
    let arr = editMed(
      this.state.med2Edit,
      editedItem,
      this.state.selectedMedList,
    );
    this.setState({selectedMedList: arr});
  };

  handleDelete = (toDelete) => {
    let arr = this.state.selectedMedList.filter(
      (item) => item.medication !== toDelete.medication,
    );
    this.setState({selectedMedList: arr});
    this.setState({showAddModal: false});
  };

  handleSkip = () => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false});
      this.props.navigation.navigate('Home');
    }, 1500);
  };

  handleSubmit = async () => {
    let status = await postPlan(prepareData(this.state.selectedMedList));
    console.log('status---');
    console.log(status);
    if (status === 200) {
      this.handleSkip();
    } else if (status === 500) {
      Alert.alert(
        'Existing Plan',
        'Head over to the Medication Page to edit your plan if you wish to make changes',
        [{text: 'Got It'}],
      );
    } else {
      Alert.alert('Unexpected Error Occured', 'Please try again later', [
        {text: 'Got It'},
      ]);
    }
  };

  render() {
    const {
      showAddModal,
      loading,
      selectedMedList,
      parent,
      med2Edit,
    } = this.state;
    return (
      <View style={styles.onboardingContainer}>
        <Text style={[globalStyles.pageHeader, styles.stepText]}>Step 3</Text>
        <Text style={globalStyles.pageDetails}>Add your Medicine Plan</Text>
        <Text style={[globalStyles.pageSubDetails, styles.stepContent]}>
          Would you like to add your scheduled medications for this month? We
          will help to track them.
        </Text>

        {selectedMedList.length === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={this.handleAddMedication}>
            <Ionicons
              name="add-circle"
              size={adjustSize(80)}
              color={Colors.nextBtnColor}
            />
          </TouchableOpacity>
        ) : (
          <PlannedMedList
            medList={selectedMedList}
            openAddModal={this.handleAddMedication}
            editMed={this.editMed}
          />
        )}
        <View style={{flex: 1}} />
        <View style={globalStyles.buttonContainer}>
          {selectedMedList.length > 0 ? (
            <TouchableOpacity
              style={globalStyles.nextButtonStyle}
              onPress={this.handleSubmit}>
              <Text style={globalStyles.actionButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.skipButtonStyle}
              onPress={this.handleSkip}>
              <Text style={globalStyles.actionButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {showAddModal ? (
          <AddMedicationModal
            visible={showAddModal}
            closeModal={() => this.closeAddMedicationModal()}
            onAddMed={this.onAddMed}
            parent={parent}
            currentMedList={selectedMedList}
            med2Edit={med2Edit}
            onEditMed={this.handleEdit}
            onDeleteMed={this.handleDelete}
          />
        ) : null}
      </View>
    );
  }
}

export default AskAdd;

const styles = StyleSheet.create({
  onboardingContainer: {
    paddingTop: '8%',
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  stepText: {
    marginTop: '10%',
  },
  stepContent: {
    marginTop: '3%',
    width: '90%',
  },
  addButton: {
    alignSelf: 'center',
  },
});
