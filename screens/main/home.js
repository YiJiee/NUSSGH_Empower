import React, {useEffect, useState, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
//third party lib
import Moment from 'moment';
//component
import NotificationsCard from '../../components/dashboard/todayOverview/cards/NotificationsCard';
import DiaryCard from '../../components/dashboard/todayOverview/cards/DiaryCard';
import ActivityCard from '../../components/dashboard/todayOverview/cards/ActivityCard';
import MenuBtn from '../../components/menuBtn';
import HeaderCard from '../../components/home/headerCard';
//styles
import globalStyles from '../../styles/globalStyles';
import {Colors} from '../../styles/colors';
//function
import {
  checkLogDone,
  dateFrom2dayWeightLog,
} from '../../commonFunctions/logFunctions';
import {requestNutrientConsumption} from '../../netcalls/mealEndpoints/requestMealLog';
import {
  getGreetingFromHour,
  getLastMinuteFromTodayDate,
  getTodayDate,
  morningObj,
  afternoonObj,
  renderNutrientPercent,
  carbs,
  fats,
  protein,
} from '../../commonFunctions/common';
import {getEntry4Day} from '../../netcalls/requestsDiary';
import {
  checkMedTaken4Day,
  getMedDonePeriods,
  renderGreetingText,
} from '../../commonFunctions/diaryFunctions';
import GameCard from '../../components/home/gameCard';
import NotifCollapse from '../../components/home/collapsible/notifCollapse';
import DailyCollapse from '../../components/home/collapsible/dailyCollapse';
import {getPatientProfile} from '../../netcalls/requestsAccount';
import ActivityCollapse from '../../components/home/collapsible/activityCollapse';
import OverviewCollapse from '../../components/home/collapsible/overviewCollapse';
import GameCollapse from '../../components/home/collapsible/gameCollapse';
import {getActivitySummaries} from '../../netcalls/requestsLog';

// properties
const {width, height} = Dimensions.get('window');
const today_date = Moment(new Date()).format('YYYY-MM-DD');
const dateString = Moment(new Date()).format('DD MMM YYYY');

const point = 1600;
const chances = 35;
const rewards = 1;

const HomeScreen = (props) => {
  const [currHour, setCurrHour] = useState(new Date().getHours());
  const [uncompleteLogs, setUncompleteLogs] = useState([]);
  const [firstName, setFirstName] = useState('');

  // diary card
  const [bgl, setBgl] = useState(null);
  const [calorie, setCalorie] = useState(null);
  const [weight, setWeight] = useState(null);
  const [med, setMed] = useState('');

  const [bgLogs, setBgLogs] = useState([]);
  const [bgPass, setBgPass] = useState(false);
  const [bgMiss, setBgMiss] = useState(false);
  const [foodLogs, setFoodLogs] = useState([]);
  const [foodPass, setFoodPass] = useState(true);
  const [medLogs, setMedLogs] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [lastWeight, setLastWeight] = useState('');

  // activity card
  const [proteinAmt, setProteinAmt] = useState(null);
  const [carb, setCarb] = useState(null);
  const [fat, setFat] = useState(null);
  const [activitySummary, setActivitySummary] = useState(null);
  const [activityTarget, setActivityTarget] = useState(null);

  //animation
  const slideRightAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    //slide right when enter screen
    props.navigation.addListener('focus', () => {
      getPatientProfile().then((response) => {
        if (response != null) {
          setFirstName(response?.patient?.first_name);
        }
      });
      slideRightAnimation.setValue(0);
      Animated.timing(slideRightAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [props.navigation]);

  const widthInterpolate = slideRightAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').width, 0],
    extrapolate: 'clamp',
  });

  //notification
  const [morningNotDone, setMorningNotDone] = useState([]);
  const [afternoonNotDone, setAfternoonNotDone] = useState([]);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      getPatientProfile().then((response) => {
        if (response != null) {
          setFirstName(response?.patient?.first_name);
        }
      });

      checkLogDone(getGreetingFromHour(currHour))
        .then((response) => {
          if (response != null) {
            setUncompleteLogs(response.notCompleted);
          }
        })
        .catch((err) => console.log(err));

      initLogs();
    });
  }, []);

  const initUncompleteLog = () => {
    if (currHour != morningObj.name) {
      checkLogDone(morningObj.name).then((response) => {
        if (response != null) {
          setMorningNotDone(response.notCompleted);
        }
      });

      checkLogDone(afternoonObj.name).then((response) => {
        if (response != null) {
          setAfternoonNotDone(response.notCompleted);
        }
      });
    }
  };

  const initLogs = async () => {
    console.log('calling init');
    checkLogDone(getGreetingFromHour(currHour)).then((response) => {
      if (response != null) {
        setUncompleteLogs(response.notCompleted);
      }
    });

    getEntry4Day(today_date)
      .then((data) => {
        if (data != undefined) {
          const bglLogs = data[today_date].glucose.logs;
          const weightLogs = data[today_date].weight.logs;
          const foodLogs = data[today_date].food.logs;
          const activitySummary = data[today_date].activity.summary;
          const activityTarget = data[today_date].activity.summary_target.value;
          const medLogs = data[today_date].medication.logs;
          const bgTarget = data[today_date].glucose.target;
          //set logs need to pass to diary card*
          setBgLogs(bglLogs);
          setFoodLogs(foodLogs);
          setMedLogs(medLogs);
          setWeightLogs(weightLogs);
          setActivitySummary(activitySummary);
          setActivityTarget(activityTarget);

          //evalulate logs
          let averageBgl = bglLogs.reduce(
            (acc, curr, index) => acc + curr.bg_reading,
            0,
          );
          if (bglLogs.length > 0) {
            averageBgl = Math.round((averageBgl * 100) / bglLogs.length) / 100;
            setBgl(averageBgl);
            if (bgTarget.comparator === '<=') {
              if (averageBgl <= bgTarget.value) {
                setBgPass(true);
              }
            }
            if (bgTarget.comparator === '>=') {
              if (averageBgl >= bgTarget.value) {
                setBgPass(true);
              }
            }
          } else {
            setBgMiss(true);
            setBgl(null);
          }

          //for med data log
          if (medLogs.length === 0) {
            setMed('Missed');
          } else {
            checkMedTaken4Day(medLogs, today_date).then((response) => {
              if (response === false) {
                //med not completed
                let arr = getMedDonePeriods(medLogs);
                let greetings = 'Taken in the ' + renderGreetingText(arr);
                setMed(greetings);
              } else {
                setMed('Completed');
              }
            });
          }
        }
      })
      .catch((err) => console.log(err));

    dateFrom2dayWeightLog().then((response) => {
      setLastWeight(response);
    });
    loadNutritionalData().then(() => {});
    initUncompleteLog();
  };

  const loadNutritionalData = async () => {
    // reload nutrition data
    let data = await requestNutrientConsumption(
      getTodayDate(),
      getLastMinuteFromTodayDate(),
    );
    const nutrientData = data.data;
    const calorieAmount = Math.round(
      nutrientData.reduce(
        (acc, curr, index) => acc + curr.nutrients.energy.amount,
        0,
      ),
    );
    const proteinAmount = Math.round(
      nutrientData.reduce(
        (acc, curr, index) => acc + curr.nutrients.protein.amount,
        0,
      ),
    );
    const carbAmount = Math.round(
      nutrientData.reduce(
        (acc, curr, index) => acc + curr.nutrients.carbohydrate.amount,
        0,
      ),
    );
    const fatAmount = Math.round(
      nutrientData.reduce(
        (acc, curr, index) => acc + curr.nutrients['total-fat'].amount,
        0,
      ),
    );
    setCalorie(calorieAmount);
    setProteinAmt(proteinAmount);
    setCarb(carbAmount);
    setFat(fatAmount);

    let carbpercent = await renderNutrientPercent(carbAmount, carbs);
    let proteinpercent = await renderNutrientPercent(proteinAmount, protein);
    let fatpercent = await renderNutrientPercent(fatAmount, fats);

    setTimeout(() => {
      if (carbpercent >= 100 && proteinpercent >= 100 && fatpercent >= 100) {
        setFoodPass(false);
      } else {
        setFoodPass(true);
      }
    }, 500);
  };

  console.log('food pass ' + foodPass);

  return (
    <View style={globalStyles.pageContainer}>
      <Animated.View
        style={[
          globalStyles.pageContainer,
          {
            backgroundColor: '#F5F6F9',
            transform: [{translateX: widthInterpolate}],
          },
        ]}>
        <View style={globalStyles.menuBarContainer}>
          <MenuBtn green={false} />
        </View>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: Colors.backgroundColor,
          }}>
          {/* Greetings and log to do*/}
          <HeaderCard
            username={firstName}
            hour={getGreetingFromHour(currHour)}
          />
          <NotifCollapse
            hour={getGreetingFromHour(currHour)}
            morningNotDone={morningNotDone}
            afternoonNotDone={afternoonNotDone}
          />
          <DailyCollapse
            uncompleteLogs={uncompleteLogs}
            hour={getGreetingFromHour(currHour)}
          />
          <ActivityCollapse
            carbAmt={carb}
            proteinAmt={proteinAmt}
            fatAmt={fat}
            activitySummary={activitySummary}
            activityTarget={activityTarget}
          />
          <OverviewCollapse
            bgl={bgl}
            calorie={calorie}
            medResult={med}
            lastWeight={lastWeight}
            dateString={dateString}
            bgPass={bgPass}
            bgMiss={bgMiss}
            bgLogs={bgLogs}
            foodLogs={foodLogs}
            carbs={carb}
            fats={fat}
            protein={proteinAmt}
            foodPass={foodPass}
            weightLogs={weightLogs}
            medLogs={medLogs}
            init={() => initLogs()}
          />
          <GameCollapse points={point} chances={chances} rewards={rewards} />
          {/* Diary overview of weight, blood glucose, food, medication and physical activity */}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
  },
  taskText: {
    fontFamily: 'SFProDisplay-Regular',
    color: 'white',
    marginStart: '5%',
    fontSize: 18,
  },
  bold: {
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    marginStart: '5%',
    fontSize: 18,
  },
  logCard: {
    backgroundColor: 'white',
    borderRadius: 9.5,
    marginTop: '3%',
    marginStart: '5%',
    marginEnd: '5%',
    padding: '3%',
  },
  logLogo: {
    marginEnd: '3%',
    marginStart: '5%',
    marginTop: '3%',
  },
  usernameText: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
  },
  buttonStyle: {
    backgroundColor: '#aad326',
    padding: '2%',
    borderRadius: 20,
    margin: '4%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  chevron: {
    marginTop: '5%',
    color: Colors.lastLogValueColor,
  },
});

export default HomeScreen;
//edit flag
