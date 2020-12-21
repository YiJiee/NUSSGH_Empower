import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../styles/colors';
import {bg_key, food_key, med_key, renderLogIconNavy, weight_key} from '../../../commonFunctions/logFunctions';
import BgBlock from '../../diary/blocks/bgBlock';
import {filterAfternoon, filterEvening, filterMorning} from '../../../commonFunctions/diaryFunctions';
import FoodBlock from '../../diary/blocks/foodBlock';
import MedBlock from '../../diary/blocks/medBlock';
import WeightBlock from '../../diary/blocks/weightBlock';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


const OverviewCollapse = (props) => {
  const {bgl, bgLogs, bgPass, bgMiss, dateString, lastBg} = props;
  const {foodLogs, carbs, protein, fats, foodPass, calorie} = props;
  const {medLogs, medResult, weightLogs, lastWeight} = props;
  const {init} = props;

  const [open, setOpen] = useState(true);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;

  const [showBg, setShowBg] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showMed, setShowMed] = useState(false);
  const [showWeight, setShowWeight] = useState(false);

  const closeBg = () => {
    setShowBg(false);
    init();
  };

  const closeFood = () => {
    setShowFood(false);
    init();
  };

  const closeMed = () => {
    setShowMed(false);
    init();
  };

  const closeWeight = () => {
    setShowWeight(false);
    init();
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  const toggle = (visible) => {
    if (visible) {
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(dropDownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, maxHeight],
  });

  return (
    <View
      onLayout={(event) => setMaxHeight(event.nativeEvent.layout.height)}
      style={{backgroundColor: Colors.activityTab}}>
      <View
        style={styles.cardTab}
        onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>Overview</Text>
        </TouchableOpacity>
      </View>
      {/*Content */}
      {open && (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            backgroundColor: Colors.overviewTab,
          }}>
          <View style={{margin: '4%'}}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowBg(true)}>
              <View style={{flexDirection: 'row', marginBottom: '3%'}}>
                {renderLogIconNavy(bg_key)}
                <View style={styles.content}>
                  <Text style={styles.metricText}>Blood Glucose</Text>
                  <Text style={styles.measuredText}>
                    {bgl ? bgl + ' mmol/L' : lastBg}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowFood(true)}>
              <View style={{flexDirection: 'row', marginBottom: '3%'}}>
                {renderLogIconNavy(food_key)}
                <View style={styles.content}>
                  <Text style={styles.metricText}>Food Intake</Text>
                  <Text style={styles.measuredText}>{calorie} kcal</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowMed(true)}>
              <View style={{flexDirection: 'row', marginBottom: '3%'}}>
                {renderLogIconNavy(med_key)}
                <View style={styles.content}>
                  <Text style={styles.metricText}>Medication</Text>
                  <Text style={styles.measuredText}>{medResult}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, {borderBottomWidth: 0}]}
              onPress={() => setShowWeight(true)}>
              <View style={{flexDirection: 'row', marginBottom: '3%'}}>
                {renderLogIconNavy(weight_key)}
                <View style={styles.content}>
                  <Text style={styles.metricText}>Weight</Text>
                  <Text style={styles.measuredText}>{lastWeight}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      <BgBlock
        visible={showBg}
        closeModal={() => closeBg()}
        morningBgLogs={filterMorning(bgLogs)}
        afternoonBgLogs={filterAfternoon(bgLogs)}
        eveningBgLogs={filterEvening(bgLogs)}
        avgBg={bgl}
        pass={bgPass}
        miss={bgMiss}
        day={dateString}
        init={() => init()}
      />
      <FoodBlock
        visible={showFood}
        closeModal={() => closeFood()}
        morningMealLogs={filterMorning(foodLogs)}
        afternoonMealLogs={filterAfternoon(foodLogs)}
        eveningMealLogs={filterEvening(foodLogs)}
        carbs={carbs}
        fats={fats}
        protein={protein}
        pass={foodPass}
        day={dateString}
        init={() => init()}
      />
      <MedBlock
        visible={showMed}
        closeModal={() => closeMed()}
        morningMedLogs={filterMorning(medLogs)}
        afternoonMedLogs={filterAfternoon(medLogs)}
        eveningMedLogs={filterEvening(medLogs)}
        day={dateString}
        init={() => init()}
      />
      <WeightBlock
        visible={showWeight}
        closeModal={() => closeWeight()}
        morningWeightLogs={filterMorning(weightLogs)}
        afternoonWeightLogs={filterAfternoon(weightLogs)}
        eveningWeightLogs={filterEvening(weightLogs)}
        day={dateString}
        init={() => init()}
      />
    </View>
  );
};

export default OverviewCollapse;

const styles = StyleSheet.create({
  cardTab: {
    backgroundColor: Colors.overviewTab,
    borderTopStartRadius: adjustSize(20),
    borderTopEndRadius: adjustSize(20),
  },
  headerTab: {
    padding: '3%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    marginStart: '3%',
  },
  greetingText: {
    color: '#005c30',
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
  },
  taskText: {
    fontFamily: 'SFProDisplay-Regular',
    color: 'white',
    marginStart: '5%',
    fontSize: adjustSize(18),
  },
  metricText: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#7d7d7d',
    fontSize: adjustSize(14),
  },
  measuredText: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#000',
    fontSize: adjustSize(18),
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e7ed',
    marginBottom: '2%',
  },
});
