import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import globalStyles from '../../../styles/globalStyles';
import Tick from '../../tick';
import StepCounter from '../../stepCounter';
import {Colors} from '../../../styles/colors';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


const Med4Day = (props) => {
  const {medication} = props;
  const {addMed, deleteMed} = props;
  const [dosage, setDosage] = useState(medication.dosage);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    let obj = {
      dosage: dosage,
      dosage_unit: medication.dosage_unit,
      medication: medication.medication,
    };
    if (selected) {
      //add medicine
      addMed(obj);
    } else {
      deleteMed(obj);
    }
  }, [selected, dosage]);

  const selectMedicine = () => {
    setSelected(!selected);
  };

  return (
    <TouchableOpacity
      style={globalStyles.medContainer}
      onPress={() => selectMedicine()}>
      <View style={{flex: 1}}>
        <Text style={globalStyles.pageSubDetails}>{medication.medication}</Text>
        {!selected ? (
          <Text style={[globalStyles.pageSubDetails, {color: Colors.textGrey}]}>
            {medication.dosage} {medication.dosage_unit}(s)
          </Text>
        ) : (
          <StepCounter
            count={dosage}
            setCount={setDosage}
            parameter={medication.dosage_unit + '(s)'}
            fieldName={''}
            enableInput={false}
            style={{width: '65%'}}
            incrementValue={0.5}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.tickContainer}
        onPress={() => selectMedicine()}>
        <Tick selected={selected} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Med4Day;

const styles = StyleSheet.create({
  medContainer: {
    backgroundColor: 'white',
    borderRadius: adjustSize(20),
    borderColor: '#e1e7ed',
    borderWidth: 1,
    padding: '3%',
    marginTop: '3%',
    flexDirection: 'row',
  },
  tickContainer: {
    alignSelf: 'center',
  },
});
