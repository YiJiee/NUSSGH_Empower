import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import globalStyles from '../../styles/globalStyles';
import BarChart from '../../components/dashboard/reports/BarChart';
import LineChart from '../../components/dashboard/reports/LineChart';
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
import HIGHLIGHTED_BGL_ICON from '../../resources/images/Patient-Icons/SVG/icon-lightgreen-bloodglucose.svg';
import HIGHLIGHTED_FOOD_ICON from '../../resources/images/Patient-Icons/SVG/icon-lightgreen-food.svg';
import HIGHLIGHTED_MED_ICON from '../../resources/images/Patient-Icons/SVG/icon-lightgreen-med.svg';
import HIGHLIGHTED_WEIGHT_ICON from '../../resources/images/Patient-Icons/SVG/icon-lightgreen-weight.svg';
import HIGHLIGHTED_ACTIVITY_ICON from '../../resources/images/Patient-Icons/SVG/icon-lightgreen-running-home.svg';
import ACTIVITY_ICON from '../../resources/images/Patient-Icons/SVG/icon-navy-running.svg';
import {Colors} from '../../styles/colors';
import {requestNutrientConsumption} from '../../netcalls/mealEndpoints/requestMealLog';
import {getLastMinuteFromTodayDate} from '../../commonFunctions/common';
import Moment from 'moment';
import {
  getActivitySummaries,
  getBloodGlucoseLogs,
  getMedicationLogs,
  getWeightLogs,
} from '../../netcalls/requestsLog';
import {
  MedicationDateDisplay,
  MedicationTable,
} from '../../components/dashboard/reports/MedicationTable';
import {
  COLOR_MAP,
  NutritionPie,
} from '../../components/dashboard/reports/NutritionPie';
import {getPlan} from '../../netcalls/requestsMedPlan';
import {ChartLegend} from '../../components/dashboard/reports/ChartLegend';
import {ExportReportsModal} from '../../components/dashboard/reports/ExportReportsModal';
import {replaceActivitySummary} from '../../commonFunctions/reportDataFormatter';
import {getEntryForDateRange, getEntry4Day} from '../../netcalls/requestsDiary';
import ReportInfo from '../../components/dashboard/reports/reportInfo';
import BgFilterDate from '../../components/dashboard/reports/bgFilterDate';
import {getDateObj} from '../../commonFunctions/diaryFunctions';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

import BGL_ICON from '../../resources/images/Patient-Icons/SVG/icon-navy-bloodglucose.svg';
import FOOD_ICON from '../../resources/images/Patient-Icons/SVG/icon-navy-food.svg';
import WEIGHT_ICON from '../../resources/images/Patient-Icons/SVG/icon-navy-weight.svg';
import MED_ICON from '../../resources/images/Patient-Icons/SVG/icon-navy-med.svg';

const EXPORT_BTN = require('../../resources/images/Patient-Icons/2x/icon-green-export-2x.png');

const iconProps = {
  width: adjustSize(30),
  height: adjustSize(30),
};

const BGL_TAB_KEY = 'Blood Glucose';
const FOOD_INTAKE_KEY = 'Food Intake';
const MEDICATION_KEY = 'Medication';
const WEIGHT_KEY = 'Weight';
const ACTIVITY_KEY = 'Activity';

const tabs = [
  {
    name: BGL_TAB_KEY,
    norm: () => <BGL_ICON {...iconProps} />,
    highlighted: () => <HIGHLIGHTED_BGL_ICON {...iconProps} />,
  },
  {
    name: FOOD_INTAKE_KEY,
    norm: () => <FOOD_ICON {...iconProps} />,
    highlighted: () => <HIGHLIGHTED_FOOD_ICON {...iconProps} />,
  },
  {
    name: MEDICATION_KEY,
    norm: () => <MED_ICON {...iconProps} />,
    highlighted: () => <HIGHLIGHTED_MED_ICON {...iconProps} />,
  },
  {
    name: WEIGHT_KEY,
    norm: () => <WEIGHT_ICON {...iconProps} />,
    highlighted: () => <HIGHLIGHTED_WEIGHT_ICON {...iconProps} />,
  },
  {
    name: ACTIVITY_KEY,
    norm: () => <ACTIVITY_ICON {...iconProps} />,
    highlighted: () => <HIGHLIGHTED_ACTIVITY_ICON {...iconProps} />,
  },
];

const DAY_FILTER_KEY = 'Day';
const WEEK_FILTER_KEY = 'Week';
const MONTH_FILTER_KEY = 'Month';
const timeFilterTabs = [
  {name: DAY_FILTER_KEY},
  {name: WEEK_FILTER_KEY},
  {name: MONTH_FILTER_KEY},
];

const padding = adjustSize(20);
const tabSpace = adjustSize(15);

const chartLegendSize = adjustSize(20);

const {width, height} = Dimensions.get('window');
const tabWidth = (width - 2 * padding) / tabs.length - tabSpace;

const boundaryFill = 'rgba(0,0,0, 0.1)'; // Fill for the upper and lower bounds of graphs

const ReportsScreen = (props) => {
  // Note all data here are the entire month dataset. We'll process it in the front-end before displaying.
  const [tabIndex, setTabIndex] = React.useState(0);
  const [timeTabIndexFilter, setTimeTabIndexFilter] = React.useState(1);
  const [showInfo, setShowInfo] = React.useState(false);
  const [openExportModal, setOpenExportModal] = React.useState(false);

  const [selectedDate, setSelectedDate] = useState(
    Moment(new Date()).format('YYYY-MM-DD'),
  );
  const [bgFoodData, setBgFoodData] = useState({});

  const [fullDataset, setFullDataset] = React.useState({
    bglData: [],
    weightData: [],
    medPlan: [],
    activityData: [],
    medData: [],
    foodData: [],
  });

  const initialTab =
    props.route.params?.initialTab === undefined
      ? 0
      : props.route.params.initialTab;

  //animation
  const slideRightAnimation = useRef(new Animated.Value(0)).current;
  const widthInterpolate = slideRightAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').width, 0],
    extrapolate: 'clamp',
  });

  // Load data when focused
  React.useEffect(() => {
    const subs = [
      props.navigation.addListener('focus', () => {
        if (props.route.params?.initialTab != null) {
          setTabIndex(props.route.params?.initialTab);
          setTimeTabIndexFilter(0);
        }

        //animate
        slideRightAnimation.setValue(0);
        Animated.timing(slideRightAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        init().then((d) => {
          setShowInfo(false);
          setFullDataset(d);
        });
      }),
    ];
    return function cleanup() {
      subs.forEach((unSub) => {
        unSub();
      });
    };
  }, [props.route.params, props.navigation, selectedDate]);

  const init = async () => {
    console.log('initing ');
    //load data
    const startDate = Moment(new Date()).subtract(28, 'days');
    const endDate = Moment(new Date()).add(1, 'day');
    const foodData = (
      await requestNutrientConsumption(
        startDate.format('DD/MM/YYYY HH:mm:ss'),
        getLastMinuteFromTodayDate(),
      )
    ).data;
    const weightData = (
      await getWeightLogs(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      )
    ).logs;
    const medData = (
      await getMedicationLogs(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      )
    ).logs;
    const bglData = (
      await getBloodGlucoseLogs(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
      )
    ).logs;
    const activityData = replaceActivitySummary(
      (
        await getActivitySummaries(
          startDate.format('YYYY-MM-DD'),
          endDate.format('YYYY-MM-DD'),
        )
      ).summaries,
    );
    const medPlan = await getPlan(
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD'),
    );

    let data = await getEntry4Day(selectedDate);
    const foodLogs = data?.[selectedDate]?.food?.logs;

    return {
      foodData,
      medData,
      bglData,
      activityData,
      weightData,
      medPlan,
      foodLogs,
    };
  };

  const handleTabSelectChange = (tabIndex) => {
    setTabIndex(tabIndex);
    setTimeTabIndexFilter(1); // Revert back to week datum
  };

  const toggleInfoCallback = () => {
    setShowInfo(!showInfo);
  };

  //for bg-food
  const onSelectFilterDate = async (value) => {
    console.log('setting selected date in reports ' + value);
    setSelectedDate(Moment(new Date(value)).format('YYYY/MM/DD'));

    let bgData4Day = [];

    for (var x of fullDataset.bglData) {
      let d1 = Moment(getDateObj(x?.record_date)).format('YYYY-MM-DD');
      if (d1 === value) {
        bgData4Day.push(x);
      }
    }

    let data = await getEntry4Day(value);
    const foodLogs = data?.[value]?.food?.logs;

    let obj = {bglData: bgData4Day, foodData: foodLogs};
    setBgFoodData(obj);
  };

  const tabName = tabs[tabIndex].name;
  const filterKey = timeFilterTabs[timeTabIndexFilter].name;

  return (
    <View style={{backgroundColor: Colors.backgroundColor, flex: 1}}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={() => props.navigation.navigate('Home')} />
        <TouchableOpacity onPress={() => setOpenExportModal(true)}>
          <Image
            source={EXPORT_BTN}
            style={{width: adjustSize(30), height: adjustSize(30)}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={[globalStyles.pageHeader, {flex: 1}]}>Report</Text>
        <ReportInfo closeModal={toggleInfoCallback} visible={showInfo} />
      </View>
      <ReportsTabs
        style={{marginLeft: '4%', marginRight: '4%'}}
        currentTab={tabIndex}
        setTabCallback={handleTabSelectChange}
      />
      <TimeFilterTab
        currentTab={timeTabIndexFilter}
        setTabCallback={setTimeTabIndexFilter}
        style={{alignSelf: 'center', width: '50%', marginTop: '3.5%'}}
      />
      <ScrollView
        style={{...styles.screen, ...props.style}}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={[{...globalStyles.pageContainer}]}>
          <Animated.View style={{transform: [{translateX: widthInterpolate}]}}>
            {tabName === BGL_TAB_KEY ? (
              <View style={{marginTop: adjustSize(20)}}>
                <Text style={globalStyles.pageDetails}>Blood Glucose</Text>
                <Text style={[globalStyles.pageDetails, {color: 'grey'}]}>
                  Readings - mmol/L
                </Text>
                {filterKey === DAY_FILTER_KEY && (
                  <BgFilterDate
                    date={selectedDate}
                    getSelectedDate={onSelectFilterDate}
                  />
                )}
                <View
                  style={[
                    globalStyles.pageDetails,
                    {flexDirection: 'row', marginTop: '2%'},
                  ]}>
                  <ChartLegend
                    size={chartLegendSize}
                    legendName="Safe"
                    color="#aad326"
                    textPaddingLeft={adjustSize(5)}
                    textPaddingRight={adjustSize(20)}
                  />
                  <ChartLegend
                    size={chartLegendSize}
                    legendName="Danger"
                    color="red"
                    textPaddingLeft={adjustSize(5)}
                    textPaddingRight={adjustSize(20)}
                  />
                  <ChartLegend
                    size={chartLegendSize}
                    legendName="Target Range (4.0 - 12.0)"
                    color={boundaryFill}
                    textPaddingLeft={adjustSize(5)}
                    textPaddingRight={adjustSize(20)}
                  />
                </View>
                {filterKey === DAY_FILTER_KEY ? (
                  <LineChart
                    data={
                      bgFoodData.bglData === undefined
                        ? fullDataset.bglData
                        : bgFoodData.bglData
                    }
                    key={'bgl-chart'}
                    filterKey={filterKey}
                    xExtractor={(d) => d.record_date}
                    yExtractor={(d) => d.bg_reading}
                    defaultMaxY={14}
                    lowerBound={4}
                    upperBound={12}
                    outsideBoundaryColor="red"
                    boundaryFill={boundaryFill}
                    width={width}
                    height={300}
                    showFood={true}
                    foodData={
                      bgFoodData.foodData === undefined
                        ? fullDataset.foodLogs
                        : bgFoodData.foodData
                    }
                    selectedDate={selectedDate}
                  />
                ) : (
                  <LineChart
                    data={fullDataset.bglData}
                    key={'bgl-chart'}
                    filterKey={filterKey}
                    xExtractor={(d) => d.record_date}
                    yExtractor={(d) => d.bg_reading}
                    defaultMaxY={14}
                    lowerBound={4}
                    upperBound={12}
                    outsideBoundaryColor="red"
                    boundaryFill={boundaryFill}
                    width={width}
                    height={300}
                  />
                )}
              </View>
            ) : tabName === FOOD_INTAKE_KEY ? (
              <View
                style={{
                  marginTop: adjustSize(20),
                  paddingBottom: adjustSize(50),
                }}>
                <Text style={globalStyles.pageDetails}>Food Intake</Text>
                <Text style={[globalStyles.pageDetails, {color: 'grey'}]}>
                  Total Calories Consumed - kcal
                </Text>
                <View
                  style={[globalStyles.pageDetails, {flexDirection: 'row'}]}>
                  <ChartLegend
                    size={chartLegendSize}
                    legendName="Target Range (1.7 K - 2.2 K)"
                    color={boundaryFill}
                    textPaddingLeft={adjustSize(5)}
                    textPaddingRight={adjustSize(20)}
                  />
                </View>
                <BarChart
                  data={fullDataset.foodData}
                  filterKey={filterKey}
                  xExtractor={(d) => d.date}
                  yExtractor={(d) => d.nutrients.energy.amount}
                  boundaryFill={boundaryFill}
                  defaultMaxY={2500}
                  lowerBound={1700}
                  upperBound={2200}
                  width={width}
                  height={adjustSize(300)}
                />
                <Text style={[globalStyles.pageDetails, {color: 'grey'}]}>
                  Nutrition Distribution
                </Text>
                <View
                  style={[globalStyles.pageDetails, {flexDirection: 'row'}]}>
                  {Object.entries(COLOR_MAP).map((nutr, index) => (
                    <ChartLegend
                      size={chartLegendSize}
                      textPaddingLeft={5}
                      textPaddingRight={20}
                      color={nutr[1]}
                      key={`pie-legend-${index}`}
                      legendName={nutr[0][0].toUpperCase() + nutr[0].slice(1)}
                    />
                  ))}
                </View>
                <NutritionPie
                  data={fullDataset.foodData}
                  width={width}
                  height={adjustSize(300)}
                  filterKey={filterKey}
                  pieKeys={['carbohydrate', 'total-fat', 'protein']}
                />
              </View>
            ) : tabName === MEDICATION_KEY ? (
              <View style={{marginTop: adjustSize(20)}}>
                <Text style={globalStyles.pageDetails}>Medication</Text>
                <Text style={[globalStyles.pageDetails, {color: 'grey'}]}>
                  Average Adherence - %
                </Text>
                <MedicationDateDisplay
                  style={globalStyles.pageDetails}
                  filterKey={filterKey}
                />
                <MedicationTable
                  plan={fullDataset.medPlan}
                  data={fullDataset.medData}
                  style={{marginLeft: '4%', marginRight: '4%'}}
                  filterKey={filterKey}
                  width={width}
                  height={height}
                />
              </View>
            ) : tabName === WEIGHT_KEY ? (
              <View style={{marginTop: adjustSize(20)}}>
                <Text style={globalStyles.pageDetails}>Weight</Text>
                <Text style={[globalStyles.pageDetails, {color: 'grey'}]}>
                  Progress - kg
                </Text>
                <View
                  style={[globalStyles.pageDetails, {flexDirection: 'row'}]}>
                  <ChartLegend
                    size={chartLegendSize}
                    legendName="Healthy"
                    color={boundaryFill}
                    textPaddingLeft={5}
                    textPaddingRight={20}
                  />
                </View>
                <LineChart
                  data={fullDataset.weightData}
                  filterKey={filterKey}
                  width={width}
                  height={adjustSize(300)}
                  xExtractor={(d) => d.record_date}
                  yExtractor={(d) => d.weight}
                  defaultMinY={30}
                  defaultMaxY={110}
                  showFood={false}
                />
              </View>
            ) : tabName === ACTIVITY_KEY ? (
              <View
                style={{
                  marginTop: adjustSize(20),
                  paddingBottom: adjustSize(50),
                }}>
                <Text style={globalStyles.pageDetails}>Activity</Text>
                <Text
                  style={[
                    globalStyles.pageDetails,
                    {color: 'grey', marginTop: adjustSize(5)},
                  ]}>
                  Calories Burnt
                </Text>
                <BarChart
                  data={fullDataset.activityData}
                  filterKey={filterKey}
                  width={width}
                  boundaryFill={boundaryFill}
                  defaultMaxY={1000}
                  xExtractor={(d) => d.date}
                  yExtractor={(d) => d.calories}
                  height={300}
                />
                <Text
                  style={[
                    globalStyles.pageDetails,
                    {color: 'grey', marginTop: adjustSize(5)},
                  ]}>
                  Duration (minutes)
                </Text>
                <BarChart
                  data={fullDataset.activityData}
                  filterKey={filterKey}
                  width={width}
                  boundaryFill={boundaryFill}
                  defaultMaxY={500}
                  xExtractor={(d) => d.date}
                  yExtractor={(d) => d.duration}
                  height={300}
                />
                <Text
                  style={[
                    globalStyles.pageDetails,
                    {color: 'grey', marginTop: adjustSize(5)},
                  ]}>
                  Steps Taken
                </Text>
                <View
                  style={[globalStyles.pageDetails, {flexDirection: 'row'}]}>
                  <ChartLegend
                    size={chartLegendSize}
                    legendName="Target Range (1K - 1.5K)"
                    color={boundaryFill}
                    textPaddingLeft={adjustSize(5)}
                    textPaddingRight={adjustSize(20)}
                  />
                </View>
                <BarChart
                  data={fullDataset.activityData}
                  filterKey={filterKey}
                  width={width}
                  boundaryFill={boundaryFill}
                  defaultMaxY={5000}
                  lowerBound={1000}
                  upperBound={1500}
                  xExtractor={(d) => d.date}
                  yExtractor={(d) => d.steps}
                  height={adjustSize(300)}
                />
              </View>
            ) : null}
            <View
              style={{
                //bottom padding just so it looks better
                paddingBottom: adjustSize(50),
              }}
            />
          </Animated.View>
        </View>
        <ExportReportsModal
          visible={openExportModal}
          setVisible={setOpenExportModal}
        />
      </ScrollView>
    </View>
  );
};

function ReportsTabs(props) {
  const {currentTab, setTabCallback} = props;
  return (
    <View
      style={[
        {flexDirection: 'row', justifyContent: 'space-between'},
        props.style,
      ]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            width: tabWidth,
            padding: adjustSize(10),
            borderBottomWidth: currentTab === index ? 3 : 0,
            borderColor: '#aad326',
          }}
          onPress={() => setTabCallback(index)}
          key={tab.name}>
          {currentTab === index ? tab.highlighted() : tab.norm()}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TimeFilterTab(props) {
  const {currentTab, setTabCallback} = props;

  return (
    <View style={[props.style, styles.timeFilterTabContainer]}>
      {timeFilterTabs.map((tab, index) => (
        <TouchableOpacity
          style={
            index === currentTab
              ? styles.selectedTimeFilterTabContainer
              : styles.normTimeFilterTabContainer
          }
          onPress={() => setTabCallback(index)}
          key={tab.name}>
          <Text
            style={
              index === currentTab
                ? styles.selectedTimeFilterText
                : styles.normTimeFilterText
            }>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    flexGrow: 1,
  },
  timeFilterTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: adjustSize(7),
    borderWidth: 1,
    borderColor: Colors.nextBtnColor,
  },
  selectedTimeFilterTabContainer: {
    backgroundColor: Colors.nextBtnColor,
    borderRadius: adjustSize(7),
    width: `${Math.round(100 / timeFilterTabs.length)}%`,
    alignItems: 'center',
    padding: adjustSize(7),
  },
  selectedTimeFilterText: {
    fontSize: adjustSize(13),
    fontWeight: 'bold',
    color: '#000',
  },
  normTimeFilterTabContainer: {
    borderRadius: adjustSize(5),
    width: `${Math.round(100 / timeFilterTabs.length)}%`,
    alignItems: 'center',
    padding: adjustSize(7),
  },
  normTimeFilterText: {
    fontSize: adjustSize(13),
    color: '#000',
  },
});

export {
  ReportsScreen,
  WEEK_FILTER_KEY,
  DAY_FILTER_KEY,
  MONTH_FILTER_KEY,
  ACTIVITY_KEY,
  WEIGHT_KEY,
  MEDICATION_KEY,
  FOOD_INTAKE_KEY,
  BGL_TAB_KEY,
};
