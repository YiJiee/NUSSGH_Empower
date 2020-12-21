import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//component
import ProgressBar from '../../progressbar';
//style
import {Colors} from '../../../styles/colors';
//third party lib
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const ProgressContent2 = (props) => {
  const {
    header,
    value,
    target,
    flip,
    details,
    targetUnit,
    clickable,
    small,
  } = props;
  const {chevronDownMethod} = props;
  const percentage = Math.floor((Number(value) / Number(target)) * 100) + '%';
  return !flip ? (
    <View style={{flex: 1, marginEnd: '1.5%', alignSelf: 'flex-start'}}>
      <Text style={styles.header}>{header}</Text>
      <ProgressBar
        progress={percentage}
        useIndicatorLevel={true}
        reverse={false}
        containerStyle={styles.progressContainer}
      />
      <Text style={styles.valueStyle}>
        {value}{' '}
        <Text style={styles.outOf}>
          {' '}
          / {target} {targetUnit}
        </Text>
      </Text>
    </View>
  ) : (
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{marginEnd: '5%'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.valueStyle}>
            {value}{' '}
            <Text style={styles.outOf}>
              {' '}
              / {target} {targetUnit}
            </Text>
          </Text>
        </View>
        {small ? (
          <ProgressBar
            progress={percentage}
            useIndicatorLevel={true}
            reverse={false}
            containerStyle={styles.progressContainer}
          />
        ) : (
          <ProgressBar
            progress={percentage}
            useIndicatorLevel={true}
            reverse={true}
            containerStyle={styles.progressContainerLarge}
          />
        )}
        <Text style={styles.header}>{details}</Text>
      </View>
      <View style={{flex: 1}} />
      {clickable === true && (
        <TouchableOpacity
          style={styles.chevron}
          onPress={() => chevronDownMethod(!clickable)}>
          <EvilIcons name="chevron-down" size={adjustSize(50)} />
        </TouchableOpacity>
      )}
      {clickable === false && (
        <TouchableOpacity
          style={styles.chevron}
          onPress={() => chevronDownMethod(!clickable)}>
          <EvilIcons name="chevron-up" size={adjustSize(50)} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProgressContent2;

const styles = StyleSheet.create({
  progressContainer: {
    borderRadius: adjustSize(9.5),
    height: adjustSize(7),
  },
  progressContainerLarge: {
    borderRadius: adjustSize(9.5),
    width: adjustSize(250),
    height: adjustSize(7),
  },
  header: {
    fontFamily: 'SFProDisplay-Bold',
    color: Colors.lastLogValueColor,
    fontSize: adjustSize(18),
    margin: '1%',
  },
  outOf: {
    fontFamily: 'SFProDisplay-Bold',
    color: Colors.lastLogValueColor,
    fontSize: adjustSize(16),
    margin: '1%',
  },
  valueStyle: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(19),
    margin: '1%',
  },
  chevron: {
    alignSelf: 'flex-end',
  },
});

//comment
