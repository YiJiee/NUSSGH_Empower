import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import Tick from '../../tick';
import globalStyles from '../../../styles/globalStyles';
import {TextInput} from 'react-native-gesture-handler';
import DeleteBin from '../../deleteBin';
import diaryStyles from '../../../styles/diaryStyles';
import logStyles from '../../../styles/logStyles';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


const effectsList = [
  {name: 'Constipation', selected: false},
  {name: 'Skin Rash', selected: false},
  {name: 'Diarrhea', selected: false},
  {name: 'Dizziness', selected: false},
  {name: 'Dry Mouth', selected: false},
  {name: 'Headache', selected: false},
  {name: 'Insomnia', selected: false},
  {name: 'Nausea', selected: false},
  {name: 'Other', selected: false},
];

const SideEffectModal = (props) => {
  const {visible, chosenSideEffects} = props;
  const {close, onReturnSideEffect, deleteSideEffect} = props;
  const [list, setList] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [otherText, setOtherText] = useState('');

  useEffect(() => {
    console.log('in side effect modal');
    let arr = JSON.parse(JSON.stringify(effectsList));

    setTimeout(() => {
      for (var y of arr) {
        for (var x of chosenSideEffects) {
          if (x === y?.name) {
            y.selected = true;
          }
          if (String(x).includes('Other') && y?.name === 'Other') {
            y.selected = true;
            let strArr = String(x).split('Other:');
            setShowInput(true);
            setOtherText(strArr[1]);
          }
        }
      }
      setList(arr);
    }, 500);
  }, [visible]);

  //set selected for item as true
  const add2List = (item) => {
    console.log('adding..');
    for (var z of list) {
      if (z?.name === item?.name) {
        if (z.selected) {
          z.selected = false;
          if (item?.name === 'Other') {
            setShowInput(false);
            setOtherText('');
          }
        } else {
          z.selected = true;
          if (item?.name === 'Other') {
            setShowInput(true);
          }
        }
      }
    }
    setList(JSON.parse(JSON.stringify(list)));
  };

  //pass back string of selected
  const sendBack = () => {
    let arr = [];
    for (var x of list) {
      if (x?.selected) {
        arr.push(x?.name);
      }
    }

    if (otherText.length > 0) {
      arr.pop();
      let other = 'Other: ' + otherText;
      arr.push(other);
    }

    onReturnSideEffect(arr);
    close();
  };

  const enableActionBtn = () => {
    let count = 0;
    for (var x of list) {
      if (x?.name === 'Other') {
        if (x?.selected && otherText.length === 0) {
          return false;
        }
      }
      if (x?.selected) {
        count++;
      }
    }

    if (count > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => close()}
      onBackdropPress={() => close()}
      style={{width: '80%', alignSelf: 'center'}}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View
          style={{backgroundColor: 'white', borderRadius: adjustSize(15), padding: '4%'}}>
          {chosenSideEffects.length === 0 ? (
            <Text style={styles.headerText}>Add Side Effect</Text>
          ) : (
            <Text style={styles.headerText}>Edit Side Effect</Text>
          )}
          {list.map((item, index) => (
            <>
              <TouchableOpacity
                key={index}
                onPress={() => add2List(item)}
                style={{flexDirection: 'row', padding: '2%'}}>
                <Tick selected={item?.selected} />
                <Text style={styles.effectText}>{item?.name}</Text>
              </TouchableOpacity>
              {item?.name === 'Other' && showInput && (
                <TextInput
                  style={[globalStyles.medContainer, {borderRadius: adjustSize(10)}]}
                  placeholder={'Please specify'}
                  value={otherText}
                  onChangeText={setOtherText}
                />
              )}
            </>
          ))}

          {chosenSideEffects.length === 0 ? (
            <>
              {enableActionBtn() === true ? (
                <TouchableOpacity
                  onPress={() => sendBack()}
                  style={[globalStyles.nextButtonStyle, {marginBottom: '5%'}]}>
                  <Text style={globalStyles.actionButtonText}>Add</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[globalStyles.skipButtonStyle, {marginBottom: '5%'}]}>
                  <Text style={globalStyles.actionButtonText}>Add</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => close()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                marginTop: '10%',
                paddingBottom: '2%',
              }}>
              <DeleteBin
                style={diaryStyles.binIcon}
                method={() => {
                  deleteSideEffect();
                  close();
                }}
              />
              <TouchableOpacity
                style={[logStyles.enableEditButton, {marginBottom: '2%'}]}
                onPress={() => sendBack()}>
                <Text style={globalStyles.actionButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SideEffectModal;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    margin: '2%',
  },
  effectText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
    marginStart: '2%',
    marginTop: '2%',
  },
  cancelText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
    color: '#aad326',
    alignSelf: 'center',
  },
});
