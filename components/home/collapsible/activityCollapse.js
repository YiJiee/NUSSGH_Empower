import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../styles/colors';
import {maxCalBurnt, maxSteps} from '../../../commonFunctions/diaryFunctions';
import CircularProgress from '../../dashboard/todayOverview/CircularProgress';

import STEP from '../../../resources/images/Patient-Icons/SVG/icon-darkgreen-steps-home.svg';
import RUN from '../../../resources/images/Patient-Icons/SVG/icon-darkgreen-running-home.svg';
import CALBURNT from '../../../resources/images/Patient-Icons/SVG/icon-darkgreen-calburnt-home.svg';

import {carbs, fats, protein} from '../../../commonFunctions/common';
import NutritionCol from '../nutritionCol';
import {useNavigation} from '@react-navigation/native';

import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const logoStyle = {
  width: adjustSize(50),
  height: adjustSize(50),
};

const ActivityCollapse = (props) => {
  const {activitySummary, activityTarget, carbAmt, proteinAmt, fatAmt} = props;
  const [open, setOpen] = useState(true);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

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
      style={{backgroundColor: Colors.dailyTab}}>
      <View
        style={styles.cardTab}
        onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity
          onPress={() => {
            toggle(open);
          }}
          style={styles.headerTab}>
          <Text style={[styles.headerText, {flex: 1}]}>
            {'Activity & Food Intake'}
          </Text>
        </TouchableOpacity>
      </View>
      {/*Content */}
      {open && (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            backgroundColor: Colors.activityTab,
            paddingBottom: '4%',
          }}>
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('Reports', {initialTab: 4})}
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={styles.activityCircular}>
                <CircularProgress
                  color="#005c30"
                  percent={
                    activitySummary?.steps / maxSteps > 1
                      ? 1
                      : activitySummary?.steps / maxSteps
                  }
                  centreComponent={{
                    width: adjustSize(50) / 2,
                    height: adjustSize(50) / 1.5,
                    component: <STEP {...logoStyle} />,
                  }}
                  radius={adjustSize(50)}
                  padding={adjustSize(10)}
                  strokeWidth={adjustSize(5)}
                  fontSize={adjustSize(15)}
                />
                <Text style={styles.activityCount}>
                  {activitySummary?.steps}
                </Text>
                <Text style={styles.activityParam}>Steps</Text>
              </View>
              <View style={styles.activityCircular}>
                <CircularProgress
                  color="#005c30"
                  percent={
                    activitySummary?.duration / activityTarget > 1
                      ? 1
                      : activitySummary?.duration / activityTarget
                  }
                  centreComponent={{
                    width: adjustSize(50) / 2,
                    height: adjustSize(50) / 1.5,
                    component: <RUN {...logoStyle} />,
                  }}
                  radius={adjustSize(50)}
                  padding={adjustSize(10)}
                  strokeWidth={adjustSize(5)}
                  fontSize={adjustSize(15)}
                />
                <Text style={styles.activityCount}>
                  {activitySummary?.duration}
                </Text>
                <Text style={styles.activityParam}>Mins</Text>
              </View>
              <View style={styles.activityCircular}>
                <CircularProgress
                  color="#005c30"
                  percent={
                    activitySummary?.calories / maxCalBurnt > 1
                      ? 1
                      : activitySummary?.calories / maxCalBurnt
                  }
                  centreComponent={{
                    width: adjustSize(50) / 2,
                    height: adjustSize(50) / 1.5,
                    component: <CALBURNT {...logoStyle} />,
                  }}
                  radius={adjustSize(50)}
                  padding={adjustSize(10)}
                  strokeWidth={adjustSize(5)}
                  fontSize={adjustSize(15)}
                />
                <Text style={styles.activityCount}>
                  {activitySummary?.calories}
                </Text>
                <Text style={styles.activityParam}>Cal Burnt</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.whiteborder} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Reports', {initialTab: 1})}
              style={{justifyContent: 'space-around', flexDirection: 'row'}}>
              <NutritionCol
                amount={carbAmt}
                nutrientType={carbs}
                header="Carbs"
              />
              <NutritionCol amount={fatAmt} nutrientType={fats} header="Fat" />
              <NutritionCol
                amount={proteinAmt}
                nutrientType={protein}
                header="Protein"
              />
            </TouchableOpacity>
          </>
        </Animated.View>
      )}
    </View>
  );
};

export default ActivityCollapse;

const styles = StyleSheet.create({
  cardTab: {
    backgroundColor: Colors.activityTab,
    borderTopStartRadius: adjustSize(20),
    borderTopEndRadius: adjustSize(20),
  },
  headerTab: {
    padding: '3%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#21293a',
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
  activityCircular: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  activityCount: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#005c30',
    fontSize: adjustSize(20),
  },
  activityParam: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(17),
  },
  whiteborder: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    margin: '4%',
  },
});
