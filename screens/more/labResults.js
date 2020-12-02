import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import globalStyles from '../../styles/globalStyles';
//component
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
import MonthPicker from '../../components/lab/monthPicker';
//third part lib
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

import {getDateObj} from '../../commonFunctions/diaryFunctions';
import dummyData from '../../components/lab/dummyLabData.json';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import LabReportDetail from '../../components/lab/labReportDetail';
import {getLabResults} from '../../netcalls/requestsLab';

const LabResults = (props) => {
  const [labResults, setLabResults] = useState([]);
  const [selected, setSelected] = useState({});
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    let dateS = moment(new Date()).format('YYYY-MM');
    getMonthSelected(dateS);
  }, []);

  const getMonthSelected = (value) => {
    console.log('month selected ' + value);
    //call api to get lab results.
    getLabResults(value).then((rsp) => {
      if (rsp != null) {
        setLabResults(rsp?.data);
      }
    });
  };

  const openResult = (obj) => {
    setSelected(obj);
    setOpenDetail(true);
  };

  return (
    <View style={globalStyles.pageContainer}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={() => props.navigation.navigate('Home')} />
      </View>
      <Text style={globalStyles.pageHeader}>Lab Results</Text>
      <MonthPicker getMonthSelected={getMonthSelected} />
      {labResults.length > 0 ? (
        labResults.map((item, index) => (
          <TouchableOpacity
            style={styles.reportContainer}
            key={index}
            onPress={() => openResult(item)}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>Report</Text>
              <Text style={[styles.text, {opacity: 0.5}]}>
                {moment(getDateObj(item?.date)).format('DD MMM YYYY')}
              </Text>
            </View>
            <Feather name="chevron-right" size={30} color={'#8b8f9a'} />
          </TouchableOpacity>
        ))
      ) : (
        <Text
          style={[
            globalStyles.pageSubDetails,
            {textAlign: 'center', marginTop: '3%'},
          ]}>
          No Lab Reports for the month
        </Text>
      )}

      <LabReportDetail
        visible={openDetail}
        close={() => setOpenDetail(false)}
        labResults={selected}
        date={selected?.date}
      />
    </View>
  );
};

export default LabResults;

const styles = StyleSheet.create({
  reportContainer: {
    flexDirection: 'row',
    margin: '3%',
    marginBottom: '1%',
    backgroundColor: 'white',
    padding: '3%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e7ed',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
  },
});
