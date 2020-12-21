import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
//styles
import logStyles from '../../styles/logStyles';
import {Colors} from '../../styles/colors';
import {normalTextFontSize} from '../../styles/variables';


const NameDateSelector = (props) => {
  const {goalName, startDate, endDate, opened} = props;
  const {setGoalName, setStartDate, setEndDate, setOpened} = props;

  const [dateOpened, setDateOpend] = useState(false);

  return (
    <>
      <TextInput
        style={[logStyles.inputField, {margin: '2%'}]}
        placeholder="Goal Name"
        value={goalName}
        onChangeText={setGoalName}
      />
      {/*
      <DateSelector
        date={startDate}
        setDate={setStartDate}
        type="start"
        checkAgainst={endDate}
        opened={opened}
        setOpened={setOpened}
      />
      <DateSelector
        date={endDate}
        setDate={setEndDate}
        checkAgainst={startDate}
        opened={opened}
        setOpened={setOpened}
      />
      */}
    </>
  );
};

export default NameDateSelector;

const styles = StyleSheet.create({
  dateFieldName: {
    color: Colors.lastLogValueColor,
    flex: 1,
    marginStart: '4%',
  },
  dateValue: {
    color: '#aad326',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: normalTextFontSize,
    marginTop: '3%',
    marginEnd: '3%',
  },
});
