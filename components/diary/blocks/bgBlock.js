import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
//function
import {afternoonObj, eveningObj, morningObj} from '../../../commonFunctions/common';
import {getMissedArr, getTime12hr, showEdit} from '../../../commonFunctions/diaryFunctions';
import {bg_key} from '../../../commonFunctions/logFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
//third party library
import Modal from 'react-native-modal';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
import diaryStyles from '../../../styles/diaryStyles';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import TimeSection from '../timeSection';
import MissedContent from './missedContent';
import BloodGlucoseLogBlock from '../../logs/bg/bloodGlucoseLogBlock';

const BgBlock = (props) => {
  const {
    visible,
    morningBgLogs,
    afternoonBgLogs,
    eveningBgLogs,
    avgBg,
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
    setMissedArr(getMissedArr(morningBgLogs, afternoonBgLogs, eveningBgLogs));
  }, [morningBgLogs, afternoonBgLogs, eveningBgLogs]);

  const editLog = (item) => {
    console.log('selecting item to edit');
    setSelectedLog(item);
    setEditModal(true);
  };

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      backdropOpacity={1}
      onBackButtonPress={() => closeModal()}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={closeModal} />
        </View>
        <Text style={globalStyles.pageHeader}>Blood Glucose</Text>
        <Text style={globalStyles.pageDetails}>{day}</Text>
        <MissedContent arr={missedArr} type={bg_key} />
        {missedArr.length !== 3 && (
          <View
            style={{flexDirection: 'row', marginTop: '3%', marginBottom: '2%'}}>
            {pass ? (
              <>
                <Text style={[globalStyles.pageDetails]}>
                  Average {avgBg} mmol/L
                </Text>

                <Ionicon
                  name="checkmark"
                  style={diaryStyles.passIcon}
                  size={adjustSize(25)}
                />
              </>
            ) : (
              <>
                <Text style={globalStyles.pageDetails}>
                  Average {avgBg} mmol/L
                </Text>

                <Ionicon
                  name="alert-circle-outline"
                  style={diaryStyles.failIcon}
                  size={adjustSize(25)}
                />
              </>
            )}
          </View>
        )}
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {/*Show time section and data for log*/}
          <TimeSection name={morningObj.name} />
          {renderLogs(morningBgLogs, editLog)}
          <TimeSection name={afternoonObj.name} />
          {renderLogs(afternoonBgLogs, editLog)}
          <TimeSection name={eveningObj.name} />
          {renderLogs(eveningBgLogs, editLog)}
        </ScrollView>

        {/*Edit Modal*/}
        {editModal ? (
          <BloodGlucoseLogBlock
            visible={editModal}
            closeModal={() => setEditModal(false)}
            parent="editLog"
            toEditbloodGlucose={selectedLog.bg_reading}
            selectedLog={selectedLog}
            init={init}
          />
        ) : null}
      </View>
    </Modal>
  );
};

export default BgBlock;

function renderLogs(logs, editLog) {
  if (logs.length > 0) {
    return (
      <View style={{marginBottom: '3%'}}>
        {logs.map((item, index) => (
          <View style={styles.logContent} key={index.toString()}>
            <Text style={diaryStyles.recordContent}>
              {item.bg_reading} mmol/L at {getTime12hr(item.record_date)}
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

const styles = StyleSheet.create({
  noRecordContainer: {
    marginBottom: '2%',
  },
  logContent: {
    flexDirection: 'row',
    marginTop: '1%',
    marginBottom: '2%',
  },
});

//comment
