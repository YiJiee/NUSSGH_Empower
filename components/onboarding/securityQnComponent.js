import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import SecurityQnDropdown from '../account/SecurityQnDropdown';
import {Colors} from '../../styles/colors';
import RadioButton from '../radioButton';
import {getQuestions} from '../../netcalls/requestsSecurityQn';

const SecurityQnComponent = (props) => {
  const {qn1, ans1, qn2, ans2, qn3, ans3, show3, type, qnList} = props;
  const {setQn1, setQn2, setQn3, setAns1, setAns2, setAns3, setShow3} = props;

  const [list, setList] = useState([]);
  const [expand1, setExpand1] = useState(false);
  const [expand2, setExpand2] = useState(false);
  const [expand3, setExpand3] = useState(false);

  useEffect(() => {
    async function getList() {
      let list = await getQuestions();
      setList(list);
    }
    getList();
    if (type === 'edit' && qnList != null) {
      setQn1(qnList[0]);
      setQn2(qnList[1]);
      if (qnList.length === 3) {
        setQn3(qnList[2]);
        setShow3(true);
      }
    }
  }, [qnList]);

  useEffect(() => {
    manageDropDownOpen();
  }, [expand1, expand2, expand3]);

  const filterQns = (selectedQn, num) => {
    if (num === 1) {
      setQn1(selectedQn);
    }
    if (num === 2) {
      setQn2(selectedQn);
    }
    if (num === 3) {
      setQn3(selectedQn);
    }
  };

  const manageDropDownOpen = () => {
    if (expand1) {
      setExpand2(false);
      setExpand3(false);
    }
    if (expand2) {
      setExpand1(false);
      setExpand3(false);
    }
    if (expand3) {
      setExpand1(false);
      setExpand2(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={{flex: 1}}>
        <ScrollView
          style={{
            flexGrow: 1,
            position: 'relative',
          }}>
          <SecurityQnDropdown
            num={1}
            selectedQn={qn1}
            onSelectQn={filterQns}
            list={list}
            expand={expand1}
            open={() => setExpand1(true)}
            close={() => setExpand1(false)}
            otherQn1={qn2}
            otherQn2={qn3}
          />
          <TextInput
            style={styles.answerInput}
            placeholder={'Answer'}
            placeholderTextColor={'#90949c'}
            value={ans1}
            onChangeText={setAns1}
          />
          <SecurityQnDropdown
            num={2}
            selectedQn={qn2}
            onSelectQn={filterQns}
            list={list}
            expand={expand2}
            open={() => setExpand2(true)}
            close={() => setExpand2(false)}
            otherQn1={qn1}
            otherQn2={qn3}
          />
          <TextInput
            style={styles.answerInput}
            placeholder={'Answer'}
            placeholderTextColor={'#90949c'}
            value={ans2}
            onChangeText={setAns2}
          />
          <TouchableOpacity
            onPress={() => setShow3(!show3)}
            style={{marginStart: '3%'}}>
            <RadioButton
              btnText={'Choose Third Qn'}
              color={'#aad326'}
              selected={show3}
            />
          </TouchableOpacity>

          {show3 && (
            <>
              <SecurityQnDropdown
                num={3}
                selectedQn={qn3}
                onSelectQn={filterQns}
                list={list}
                expand={expand3}
                open={() => setExpand3(true)}
                close={() => setExpand3(false)}
                otherQn1={qn1}
                otherQn2={qn2}
              />
              <TextInput
                style={styles.answerInput}
                placeholder={'Answer'}
                placeholderTextColor={'#90949c'}
                value={ans3}
                onChangeText={setAns3}
              />
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SecurityQnComponent;

const styles = StyleSheet.create({
  onboardingContainer: {
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
  answerInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e7ed',
    margin: '2%',
    backgroundColor: 'white',
    paddingVertical: '2%',
    paddingStart: '3%',
    zIndex: 1,
  },
});
