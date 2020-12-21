import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// styles
import logStyles from '../../styles/logStyles';
import {Colors} from '../../styles/colors';
//third party lib
import Entypo from 'react-native-vector-icons/Entypo';
import {normalTextFontSize} from '../../styles/variables';
import globalStyles from '../../styles/globalStyles';
import {frequencyOption} from '../../commonFunctions/goalFunctions';

import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const DropDownSelector = (props) => {
  const {selected, setSelected, fieldName, dropDownType, optionList} = props;
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState([]);

  useEffect(() => {
    if (dropDownType === 'frequency') {
      setSelectedMenu(frequencyOption);
    } else {
      setSelectedMenu(optionList);
    }
  });

  const formatSelected = (text) => {
    return (
      String(text).substr(0, 1).toUpperCase() +
      String(text).substr(1, String(text).length - 1)
    );
  };

  return (
    <>
      <Text style={[globalStyles.goalFieldName, {flex: 0}]}>{fieldName}</Text>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={[logStyles.inputField, styles.dropDownContainer]}>
        <Text style={styles.selectedText}>{formatSelected(selected.name)}</Text>
        {open ? (
          <Entypo
            name="chevron-thin-up"
            color={Colors.lastLogValueColor}
            size={adjustSize(20)}
          />
        ) : (
          <Entypo
            name="chevron-thin-down"
            color={Colors.lastLogValueColor}
            size={adjustSize(20)}
          />
        )}
      </TouchableOpacity>
      {open && (
        <View style={styles.dropDownItemContainer}>
          {selectedMenu.map((item) =>
            item.value === selected.value ? (
              <TouchableOpacity
                key={item.value}
                style={{backgroundColor: '#aad326'}}
                onPress={() => {
                  setSelected(item);
                  setOpen(false);
                }}>
                <Text style={styles.dropdownItemLabel}>{item.name}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  setSelected(item);
                  setOpen(false);
                }}>
                <Text style={styles.dropdownItemLabel}>{item.name}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      )}
    </>
  );
};

export default DropDownSelector;

const styles = StyleSheet.create({
  selectedText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: normalTextFontSize,
    flex: 1,
  },
  dropDownContainer: {
    marginStart: '4%',
    marginEnd: '4%',
    flexDirection: 'row',
    borderRadius: 3,
  },
  dropDownItemContainer: {
    marginStart: '4%',
    marginEnd: '4%',
    backgroundColor: 'white',
    marginTop: '-2%',
  },
  dropdownItemLabel: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: normalTextFontSize,
    margin: '2%',
  },
});
