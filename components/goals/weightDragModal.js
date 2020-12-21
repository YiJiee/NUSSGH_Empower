import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import CrossBtn from '../crossBtn';
import PickDrag from '../logs/weight/pickDrag';

import TICK from '../../resources/images/Patient-Icons/SVG/icon-green-accept.svg';
import globalStyles from '../../styles/globalStyles';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const WeightDragModal = (props) => {
  const {visible, weight} = props;
  const {close, setWeight, tick} = props;
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      onBackButtonPress={() => close()}
      onBackdropPress={() => close()}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.actionContainer}>
          <CrossBtn close={() => close()} />
          <TICK height={adjustSize(30)} width={adjustSize(30)} onPress={() => tick()} />
        </View>
        <Text style={[globalStyles.pageHeader, styles.bottom]}>
          Goal Weight
        </Text>
        <Text style={[globalStyles.pageSubDetails, styles.bottom]}>
          Your goal weight is
        </Text>
        <Text style={[globalStyles.pageDetails, styles.bottom]}>
          {weight} kg
        </Text>
        <View style={{width: Dimensions.get('window').width}}>
          <PickDrag
            min={40}
            max={200}
            onChange={setWeight}
            interval={0.2}
            value={weight}
          />
        </View>
      </View>
    </Modal>
  );
};

export default WeightDragModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    paddingTop: '3%',
    paddingBottom: '10%',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '5%',
  },
  bottom: {
    marginBottom: '4%',
    marginStart: Dimensions.get('window').width * 0.05,
  },
});
