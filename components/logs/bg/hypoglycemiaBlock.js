import React, {useEffect, useRef, useState} from 'react';
import {Animated, ScrollView, StyleSheet, Text} from 'react-native';
//styles
import globalStyles from '../../../styles/globalStyles';
//component
import FormBlock from './formBlock';
import logStyles from '../../../styles/logStyles';
import {min_bg} from '../../../commonFunctions/logFunctions';

import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const formQn1 = 'Did you eat lesser than usual today?';
const formQn2 = 'Did you exercise today';
const formQn3 = 'Did you have any alcoholic beverages today?';

//take in props blood glucose value, then determine whether to show form and returns the selection
const HypoglycemiaBlock = (props) => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {
    bloodGlucose,
    eatSelection,
    exerciseSelection,
    alcholicSelection,
  } = props;
  const {setEatSelection, setExerciseSelection, setAlcoholSelection} = props;

  useEffect(() => {
    if (Number(bloodGlucose) <= min_bg && bloodGlucose !== '') {
      setVisible(true);
      //fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [bloodGlucose]);

  return (
    visible && (
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Animated.View style={[{opacity: fadeAnim}, logStyles.bodyPadding]}>
          <Text style={globalStyles.alertText}>
            The reading entered is too low. We are concerned.
          </Text>
          <FormBlock
            question={formQn1}
            getFormSelection={setEatSelection}
            value={eatSelection}
          />
          <FormBlock
            question={formQn2}
            getFormSelection={setExerciseSelection}
            value={exerciseSelection}
          />
          <FormBlock
            question={formQn3}
            getFormSelection={setAlcoholSelection}
            value={alcholicSelection}
          />
        </Animated.View>
      </ScrollView>
    )
  );
};

export default HypoglycemiaBlock;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: '3%',
    width: '100%',
    flexGrow: 1,
    paddingBottom: '10%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: adjustSize(19),
    fontWeight: '700',
    color: 'black',
    marginStart: '5%',
  },
  questionContainer: {marginStart: '2%', marginBottom: '4%'},
  button: {
    marginTop: '9%',
    backgroundColor: '#eb90d6',
    width: adjustSize(300),
    height: adjustSize(40),
    borderRadius: adjustSize(20),
    marginVertical: adjustSize(10),
    paddingVertical: adjustSize(6),
  },
  buttonText: {
    fontSize: adjustSize(23),
    fontWeight: '500',
    textAlign: 'center',
  },
});
