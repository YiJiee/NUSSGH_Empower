import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
//component
import DeleteBin from '../../deleteBin';
//styles
import globalStyles from '../../../styles/globalStyles';
import {Colors} from '../../../styles/colors';

//for the extra medication addded to log (not in med plan)
function ExtraMedItem({medication, handleDelete}) {
  return (
    <View style={globalStyles.medContainer}>
      <View style={{flex: 1}}>
        <Text style={globalStyles.pageSubDetails}>{medication.drugName}</Text>
        <Text style={[globalStyles.pageSubDetails, {color: Colors.textGrey}]}>
          {medication.dosage} {medication.unit}(s)
        </Text>
      </View>
      <DeleteBin
        style={styles.deleteMedication}
        method={() => handleDelete(medication)}
      />
    </View>
  );
}
export default ExtraMedItem;

const styles = StyleSheet.create({
  deleteMedication: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    margin: '1%',
  },
});
