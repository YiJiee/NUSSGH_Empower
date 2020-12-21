import React, {Component} from 'react';
import {Alert, Text, View} from 'react-native';
//styles
import globalStyles from '../../styles/globalStyles';
//components
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
//style
import {Colors} from '../../styles/colors';
import {
    deleteMedPlan,
    getCompletePlan,
    postPlan,
    prepareData,
    prepareDataFromAPI,
} from '../../netcalls/requestsMedPlan';
import {editMed, med_planAdd, med_planEdit} from '../../commonFunctions/medicationFunction';
import LoadingModal from '../../components/loadingModal';
import PlannedMedList from '../../components/medication/displayMedList/plannedMedList';
import AddMedicationModal from '../../components/medication/addMedicationModal';

export default class MedicationScreen extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      plan: [],
      loading: true,
      showAddMed: false,
      selectedMed: {},
      parent: med_planAdd,
    };

    this.props.navigation.addListener('focus', () => {
      //check the period, date and which logs done
      this.setUp();
    });
  }

  componentDidMount() {
    this.setUp();
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevProp.route.params !== this.props.route.params) {
      console.log('in update-----');
      this.setUp();
    }
  }

  setUp = () => {
    this.setState({loading: true});
    this.setState({selectedMed: {}});
    this.setState({plan: []});
    getCompletePlan()
      .then((response) => {
        if (response != null) {
          this.setState({loading: false});
          this.setState({plan: prepareDataFromAPI(response.plans)});
        }
      })
      .catch((err) => console.log(err));
  };

  openAddModal = () => {
    this.setState({showAddMed: true});
    this.setState({selectedMed: {}});
    this.setState({parent: med_planAdd});
  };

  openEditModal = (item) => {
    this.setState({showAddMed: true});
    this.setState({selectedMed: item});
    this.setState({parent: med_planEdit});
  };

  closeAddModal = () => {
    this.setState({showAddMed: false});
  };

  addMedicine = (item) => {
    console.log('adding item ' + item.medication);
    let arr = this.state.plan;
    arr.push(item);
    this.setState({plan: arr});
    this.callUpdateAPI().then((data) => {});
  };

  handleEdit = (item) => {
    console.log('editing item ' + item.medication);
    let arr = editMed(this.state.selectedMed, item, this.state.plan);
    this.setState({plan: arr});
    setTimeout(() => this.callUpdateAPI().then((data) => {}), 200);
    this.setState({showAddMed: false});
  };

  handleDelete = (item) => {
    console.log('removing item ' + item.medication);
    this.setState({showAddMed: false});
    deleteMedPlan(item._id).then((status) => {
      if (status === 200) {
        Alert.alert('Medication Plan Updated Successfully.', '', [
          {text: 'Got It', onPress: () => this.setUp()},
        ]);
      } else {
        Alert.alert('Unexpected Error Occured', 'Please try again later', [
          {text: 'Got It'},
        ]);
      }
    });
  };

  callUpdateAPI = async () => {
    console.log('sending in ');
    console.log(this.state.plan);
    postPlan(prepareData(this.state.plan)).then((status) => {
      if (status === 200) {
        Alert.alert('Medication Plan Updated Successfully.', '', [
          {text: 'Got It', onPress: () => this.setUp()},
        ]);
      } else {
        Alert.alert('Unexpected Error Occured', 'Please try again later', [
          {text: 'Got It'},
        ]);
      }
    });
  };

  render() {
    const {loading, plan, showAddMed, selectedMed, parent} = this.state;
    return (
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={() => this.props.navigation.navigate('Home')} />
        </View>
        <Text style={globalStyles.pageHeader}>Medication</Text>
        <Text
          style={[
            globalStyles.pageSubDetails,
            {marginBottom: '4%', color: Colors.textGrey},
          ]}>
          Scheduled Medication
        </Text>
        <View style={{flex: 1, marginBottom: '7%'}}>
          <PlannedMedList
            medList={plan}
            openAddModal={this.openAddModal}
            editMed={this.openEditModal}
          />
        </View>
        {showAddMed ? (
          <AddMedicationModal
            visible={showAddMed}
            closeModal={() => this.closeAddModal()}
            onAddMed={this.addMedicine}
            parent={parent}
            currentMedList={plan}
            med2Edit={selectedMed}
            onEditMed={this.handleEdit}
            onDeleteMed={this.handleDelete}
          />
        ) : null}

        {loading ? (
          <LoadingModal
            visible={loading}
            message={'Retrieving your Medication Plan'}
          />
        ) : null}
      </View>
    );
  }
}
