import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
//styles
import logStyles from '../../styles/logStyles';
import globalStyles from '../../styles/globalStyles';
//function
import {
    bg_key,
    food_key,
    isPeriod,
    isToday,
    med_key,
    renderLogIconWhite,
    weight_key,
} from '../../commonFunctions/logFunctions';
//third part lib
import Entypo from 'react-native-vector-icons/Entypo';
//function
import {
    getLastBgLog,
    getLastMealLog,
    getLastMedicationLog,
    getLastWeightLog,
} from '../../storage/asyncStorageFunctions';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//component
import BloodGlucoseLogDisplay from './bg/bloodGlucoseLogDisplay';
import MedicationLogDisplay from './medication/medicationLogDisplay';
import WeightLogDisplay from './weight/weightLogDisplay';
import ReadOnlyMealDisplay from './meal/ReadOnlyMealDisplay';

//show last values
const LastLogButton = (props) => {
  const {logType} = props;
  const [lastPeriod, setLastPeriod] = useState('');
  const [none4tdy, setnone4tdy] = useState(true);
  const [dataToDisplay, setDataToDisplay] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    getLastLog();
  }, []);

  const getLastLog = () => {
    if (logType === bg_key) {
      getLastBgLog().then((response) => {
        setStates(response);
      });
    } else if (logType === weight_key) {
      getLastWeightLog().then((response) => {
        setStates(response);
      });
    } else if (logType === med_key) {
      getLastMedicationLog().then((response) => {
        setStates(response);
      });
    } else if (logType === food_key) {
      getLastMealLog().then((response) => {
        setStates(response);
      });
    }
  };

  const setStates = (response) => {
    if (response && isToday(response.date)) {
      setnone4tdy(false);
      setLastPeriod(isPeriod(response.hour));
      setDataToDisplay(response);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={logStyles.lastLogContainer}
        onPress={() => setShow(!show)}>
        <View style={{marginEnd: '1%'}}>{renderLogIconWhite(logType)}</View>
        <View style={{flex: 1}}>
          <Text style={[globalStyles.pageDetails, {color: 'white'}]}>
            {logType}
          </Text>
          {none4tdy ? (
            <Text style={[logStyles.lastLogSummary]}>
              No Logs Done for Today
            </Text>
          ) : (
            <Text style={logStyles.lastLogSummary}>
              Last logged in the {lastPeriod}
            </Text>
          )}
        </View>
        {show === false ? (
          <Entypo
            name="chevron-down"
            size={adjustSize(30)}
            color="white"
            onPress={() => setShow(true)}
          />
        ) : (
          <Entypo
            name="chevron-up"
            size={adjustSize(30)}
            color="white"
            onPress={() => setShow(false)}
          />
        )}
      </TouchableOpacity>
      {!none4tdy && logType === bg_key && (
        <BloodGlucoseLogDisplay data={dataToDisplay} show={show} />
      )}
      {!none4tdy && logType === med_key && (
        <MedicationLogDisplay data={dataToDisplay} show={show} />
      )}
      {!none4tdy && logType === weight_key && (
        <WeightLogDisplay data={dataToDisplay} show={show} />
      )}
      {!none4tdy && logType === food_key && (
        <ReadOnlyMealDisplay data={dataToDisplay.value} show={show} />
      )}
    </>
  );
};

export default LastLogButton;
//edit flag
