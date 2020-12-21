import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party library
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import TimeSection from '../timeSection';
import WeightLogBlock from '../../logs/weight/weightLogBlock';
//style
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
import diaryStyles from '../../../styles/diaryStyles';
//function
import {afternoonObj, eveningObj, morningObj} from '../../../commonFunctions/common';
import {getMissedArr, getTime12hr, showEdit} from '../../../commonFunctions/diaryFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const WeightBlock = (props) => {
  const {
    visible,
    morningWeightLogs,
    afternoonWeightLogs,
    eveningWeightLogs,
    pass,
    miss,
    day,
    init,
  } = props;
  const {closeModal} = props;
  const [selectedLog, setSelectedLog] = useState({});
  const [missedArr, setMissedArr] = useState([]);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    setMissedArr(
      getMissedArr(morningWeightLogs, afternoonWeightLogs, eveningWeightLogs),
    );
  }, [morningWeightLogs, afternoonWeightLogs, eveningWeightLogs]);

  const editWeightLog = (item) => {
    setEditModal(true);
    setSelectedLog(item);
  };

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      backdropOpacity={1}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      onBackButtonPress={() => closeModal()}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={closeModal} />
        </View>
        <Text style={globalStyles.pageHeader}>Weight</Text>
        <Text style={globalStyles.pageDetails}>{day}</Text>
        {/* <MissedContent arr={missedArr} type={weight_key} /> */}
        {/*Show time section and data for log*/}
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <TimeSection name={morningObj.name} />
          {renderWeightLogs(morningWeightLogs, editWeightLog)}
          <TimeSection name={afternoonObj.name} />
          {renderWeightLogs(afternoonWeightLogs, editWeightLog)}
          <TimeSection name={eveningObj.name} />
          {renderWeightLogs(eveningWeightLogs, editWeightLog)}
        </ScrollView>
        {/*Edit Modal*/}
        {editModal ? (
          <WeightLogBlock
            visible={editModal}
            closeModal={() => setEditModal(false)}
            parent="editLog"
            selectedLog={selectedLog}
            init={init}
          />
        ) : null}
      </View>
    </Modal>
  );
};

function renderWeightLogs(logs, editLog) {
  if (logs.length > 0) {
    return (
      <View style={{marginBottom: '3%'}}>
        {logs.map((item, index) => (
          <View style={styles.logContent} key={index.toString()}>
            <Text style={diaryStyles.recordContent}>
              {item.weight} {item.unit} at {getTime12hr(item.record_date)}
            </Text>
            {showEdit(item.record_date) ? (
              <>
                <View style={{flex: 1}} />
                <TouchableOpacity onPress={() => editLog(item)}>
                  <Entypo name="edit" style={diaryStyles.editIcon} size={adjustSize(30)} />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        ))}
      </View>
    );
  } else {
    return (
      <View style={styles.noRecordContainer}>
        <Text style={diaryStyles.noRecordText}>No Record Found </Text>
        <Text style={diaryStyles.recordContent}>-</Text>
      </View>
    );
  }
}

export default WeightBlock;

const styles = StyleSheet.create({
  logContent: {
    flexDirection: 'row',
    marginTop: '1%',
    marginBottom: '2%',
  },
});
