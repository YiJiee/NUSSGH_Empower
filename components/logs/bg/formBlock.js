import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


const FormBlock = (props) => {
  const {question, value} = props;
  const {getFormSelection} = props;

  const getContentStyle = () => {
    const style = {
      yesOptionStyle: {
        borderTopStartRadius: adjustSize(9.5),
        borderBottomStartRadius: adjustSize(9.5),
        padding: '2%',
        paddingHorizontal: '5%',
        borderWidth: 1,
        borderColor: '#aad326',
      },
      noOptionStyle: {
        borderTopEndRadius: adjustSize(9.5),
        borderBottomEndRadius: adjustSize(9.5),
        padding: '2%',
        paddingHorizontal: '5%',
        borderWidth: 1,
        borderColor: '#aad326',
      },
    };
    if (value === false) {
      style.yesOptionStyle.backgroundColor = 'white';
      style.noOptionStyle.backgroundColor = '#aad326';
    } else {
      style.yesOptionStyle.backgroundColor = '#aad326';
      style.noOptionStyle.backgroundColor = 'white';
    }

    return style;
  };
  const contentStyle = getContentStyle();
  return (
    getContentStyle() && (
      <View>
        <Text style={styles.questionHeader}>{question}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={contentStyle.yesOptionStyle}
            onPress={() => getFormSelection(true)}>
            <Text style={styles.optionWord}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={contentStyle.noOptionStyle}
            onPress={() => getFormSelection(false)}>
            <Text style={styles.optionWord}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

export default FormBlock;

const styles = StyleSheet.create({
  questionHeader: {
    fontSize: adjustSize(17),
    color: 'black',
    marginTop: '5%',
    marginStart: '2%',
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: '3%',
  },
  buttonGroupStyle: {
    flexDirection: 'row',
    marginTop: ' 5%',
    marginStart: '5%',
  },
  optionWord: {
    fontSize: adjustSize(17),
  },
});
