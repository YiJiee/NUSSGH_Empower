import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import {TouchableOpacity, TextInput} from 'react-native-gesture-handler';
import {isEmpty} from '../../commonFunctions/common';

const SecurityQnDropdown = (props) => {
  const {num, selectedQn, list, expand, otherQn1, otherQn2, topValue} = props;
  const {onSelectQn, close, open} = props;

  const [top, setTop] = useState('');
  const [optionList, setOptionList] = useState([]);

  useEffect(() => {
    let newFiltered = list?.filter(
      (item) =>
        item?.content != otherQn1?.content &&
        item?.content != otherQn2?.content,
    );
    setOptionList(newFiltered);
  }, [otherQn1, otherQn2, list, selectedQn]);

  useEffect(() => {
    if (num === 1) {
      setTop('2%');
    } else if (num === 2) {
      setTop('50%');
    } else if (num === 3) {
      setTop('72%');
    } else {
      setTop(topValue);
    }
  }, []);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => open()}>
        <Text style={styles.questionText}>
          {!isEmpty(selectedQn)
            ? selectedQn?.content
            : num != undefined
            ? 'Security Question ' + num
            : 'Select Security Qn'}
        </Text>
        {expand ? (
          <EvilIcon name="chevron-up" size={30} />
        ) : (
          <EvilIcon name="chevron-down" size={30} />
        )}
      </TouchableOpacity>
      {expand && (
        <View style={[styles.expandContent, {top: top}]}>
          <>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.selectText}>Please select</Text>
              <EvilIcon name="chevron-up" size={30} onPress={() => close()} />
            </View>
            <ScrollView style={styles.scrollContent}>
              {optionList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor:
                      selectedQn._id === item._id ? '#aad326' : null,
                  }}
                  onPress={() => {
                    onSelectQn(item, num);
                    close();
                  }}>
                  <Text style={styles.options}>{item?.content}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        </View>
      )}
    </>
  );
};

export default SecurityQnDropdown;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e1e7ed',
    backgroundColor: 'white',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    margin: '2%',
    marginTop: '3%',
    flexDirection: 'row',
    borderRadius: 10,
    position: 'relative',
  },
  expandContent: {
    backgroundColor: 'white',
    marginStart: '2%',
    marginEnd: '2%',
    borderWidth: 1,
    borderColor: '#e1e7ed',
    borderRadius: 10,
    position: 'absolute',
    width: '96%',
    zIndex: 5,
    height: '55%',
  },
  questionText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
    flex: 1,
  },
  selectText: {
    fontFamily: 'SFProDisplay-Regular',
    opacity: 0.5,
    fontSize: adjustSize(19),
    marginStart: '2%',
    marginTop: '1%',
    flex: 1,
  },
  scrollContent: {
    position: 'relative',
    top: '4%',
    backgroundColor: 'white',
    borderColor: '#e1e7ed',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  options: {
    marginStart: '2%',
    marginBottom: '2%',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(19),
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
