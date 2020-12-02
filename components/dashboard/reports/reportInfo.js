import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import GameCenterStyles from '../../../styles/gameCenterStyles';
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const ReportInfo = (props) => {
  const {visible} = props;
  const {closeModal} = props;

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [0, 0, 0];

  const prevHandler = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextHandler = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      props.closeModal();
    }
  };

  const reportTutorialImage = (currentStep) => {
    switch (currentStep) {
      case 0:
        return require('../../../resources/images/Report-Modal/img-report-modal-01.gif');
      case 1:
        return require('../../../resources/images/Report-Modal/img-report-modal-02.gif');
      default:
        return require('../../../resources/images/Report-Modal/img-report-modal-03.gif');
    }
  };

  const reportContent = (currentStep) => {
    switch (currentStep) {
      case 0:
        return (
          <View style={{width: '100%', alignItems: 'center', marginTop: '5%'}}>
            <Text style={globalStyles.pageDetails}>
              Interact with the Graph
            </Text>
            <Text style={styles.subText}>
              Tap the <View style={styles.cursor} /> on the graph and drag left
              or right to see the data
            </Text>
          </View>
        );

      case 1:
        return (
          <View style={{width: '100%', alignItems: 'center', marginTop: '5%'}}>
            <Text style={globalStyles.pageDetails}>Compare with the Graph</Text>
            <Text style={styles.subText}>
              Tap the period of the food consumed and see the highlight on the
              graph
            </Text>
          </View>
        );

      default:
        return (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <Text style={globalStyles.pageDetails}>
              Interact with the Chart
            </Text>
            <Text style={styles.subText}>
              Tap the bar on the chart to see the data
            </Text>
          </View>
        );
    }
  };

  const StepDotColor = (currentStep, step) => {
    if (currentStep === step) {
      return Colors.gameColorGreen;
    }
    return Colors.gameColorGrey;
  };

  const NextBtnText = (currentStep) => {
    if (currentStep === 2) {
      return 'Close';
    }
    return 'Next';
  };

  return (
    <>
      <TouchableOpacity onPress={() => closeModal()} style={{margin: '3%'}}>
        <Icon name="info-outline" color={'#aad326'} size={adjustSize(35)} />
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        onBackdropPress={() => closeModal()}
        onBackButtonPress={() => closeModal()}>
        <View
          style={[
            {
              padding: '3%',
              borderRadius: adjustSize(10),
              backgroundColor: currentStep === 0 ? '#fbfbfb' : 'white',
            },
          ]}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              resizeMode="contain"
              style={{
                width: '80%',
                aspectRatio: 0.9,
                height: undefined,
              }}
              source={reportTutorialImage(currentStep)}
            />
          </View>
          {reportContent(currentStep)}
          <View
            style={[GameCenterStyles.subContainerNarrow, {paddingTop: '20%'}]}>
            {steps.map((item, index) => (
              <Ionicon
                key={index}
                name="ellipse"
                size={adjustSize(10)}
                style={{marginHorizontal: '1%'}}
                color={StepDotColor(currentStep, index)}
              />
            ))}
          </View>
          <View
            style={{flexDirection: 'row', alignSelf: 'center', margin: '4%'}}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[
                  GameCenterStyles.buttonStyle,
                  GameCenterStyles.backColor,
                  {width: '50%'},
                ]}
                onPress={prevHandler}>
                <Text style={globalStyles.actionButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                GameCenterStyles.buttonStyle,
                GameCenterStyles.nextColor,
                {width: '50%'},
              ]}
              onPress={nextHandler}>
              <Text style={globalStyles.actionButtonText}>
                {NextBtnText(currentStep)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ReportInfo;

const styles = StyleSheet.create({
  cursor: {
    backgroundColor: Colors.nextBtnColor,
    width: adjustSize(20),
    height: adjustSize(20),
    borderRadius: adjustSize(10),
  },

  subText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
    textAlign: 'center',
    marginStart: '3%',
    marginEnd: '3%',
    marginBottom: '6%',
  },
});
