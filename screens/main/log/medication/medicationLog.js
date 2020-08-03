import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Image, Alert} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';
import {
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import SelectMedicationModalContent from './selectMedicationModalContent';

Entypo.loadFont();

export default class MedicationLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      selectedMedicationList: [],
      calendarVisible: false,
      selectModalOpen: false,
      successShow: false,
    };
    console.log(this.state.date);
  }

  setCalendarVisible(boolVal) {
    if (boolVal == true) {
      this.setState({calendarVisible: !this.state.calendarVisible});
    }
    if (boolVal == false) {
      this.setState({calendarVisible: !this.state.calendarVisible});
    }
  }

  setDate(date) {
    this.setState({date: date});
    console.log(this.state.date);
  }

  getSelectedMedicineFromModal(medicine) {
    console.log('Setting selected medication:');
    console.log(medicine);
  }

  render() {
    const {
      date,
      calendarVisible,
      selectedMedicationList,
      selectModalOpen,
    } = this.state;
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <RenderDateTime
          date={date}
          calendarVisible={calendarVisible}
          setDate={() => this.setDate}
          setCalendarVisible={() => this.setCalendarVisible(calendarVisible)}
        />
        {selectedMedicationList <= 0 ? (
          <Text style={styles.headerStyle}>Start Adding A Medication:</Text>
        ) : (
          <Text style={styles.headerStyle}>Medication Added:</Text>
        )}
        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() => this.setState({selectModalOpen: true})}>
          <Text style={styles.buttonText}>Add Medicine</Text>
        </TouchableOpacity>

        {/* Select Medicine Modal*/}
        <Modal isVisible={selectModalOpen} animationIn="slideInUp">
          <SelectMedicationModalContent
            setMedicine={this.getSelectedMedicineFromModal}
          />
        </Modal>
      </ScrollView>
    );
  }
}

function RenderDateTime({date, calendarVisible, setDate, setCalendarVisible}) {
  const [dateSelected, setDateSelected] = useState(date);
  return (
    <View
      style={{
        marginTop: '7%',
        marginStart: '5%',
        justifyContent: 'space-around',
      }}>
      <Text style={styles.inputHeader}>Record Date Time:</Text>
      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={styles.inputBox}
          value={Moment(dateSelected).format('MMMM Do YYYY, h:mm a')}
          placeholderTextColor="#a1a3a0"></TextInput>
        <Ionicons
          name="calendar-outline"
          size={20}
          style={{marginTop: '7%', marginStart: '7%'}}
          onPress={() => {
            setCalendarVisible(!calendarVisible);
          }}
        />
      </View>
      {calendarVisible && (
        <DatePicker
          visible={calendarVisible}
          date={dateSelected}
          onDateChange={(date) => {
            setDateSelected(date);
            setDate(dateSelected);
          }}
          mode="datetime"
        />
      )}
    </View>
  );
}

function RenderMedicationAdded({selectedMedicationList}) {
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#133d2c',
    marginBottom: '4%',
    alignSelf: 'center',
    marginTop: '5%',
  },
  inputHeader: {
    fontSize: 18,
    fontWeight: '500',
  },
  inputBox: {
    width: 300,
    height: 40,
    backgroundColor: '#EEF3BD',
    paddingStart: 30, //position placeholder text
    marginVertical: 10,
    marginEnd: '3%',
  },
  button: {
    marginTop: '4%',
    backgroundColor: '#EEF3BD',
    width: 300,
    height: 40,
    borderRadius: 20,
    marginVertical: 10,
    paddingVertical: 6,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 23,
    fontWeight: '500',
    textAlign: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
