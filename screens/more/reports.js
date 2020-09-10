import React from 'react';
import {View, StyleSheet, Text, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CalorieReport from "../../components/dashboard/reports/CalorieReport";
import DailyBloodSugarLevelBarChart from "../../components/dashboard/reports/DailyBloodSugarLevelBarChart";
import BarChart from "../../components/dashboard/reports/BarChart";
import LineChart from "../../components/dashboard/reports/LineChart";

const tabs = [
  {name: 'Blood Glucose', icon: 'tint'},
  {name: 'Food Intake', icon: 'cookie-bite'},
  {name: 'Medication', icon: 'capsules'},
  {name: 'Weight', icon: 'weight'},
  {name: 'Activity', icon: 'running'}
];

const timeFilterTabs = [
  {name: 'Day'},
  {name: 'Week'},
  {name: 'Month'}
]

const padding = 20;
const tabSpace = 15;

const {width, height} = Dimensions.get('window');
const tabWidth = ((width - 2 * padding) / tabs.length) - tabSpace;

const ReportsScreen = (props) => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [timeFilter, setTimeFilter] = React.useState('Week');

  return (
    <ScrollView style={{...styles.screen, ...props.style}} contentContainerStyle={{flexGrow: 1}}>
      <Text style={styles.headerText}>Report</Text>
      <ReportsTabs style={{paddingLeft: padding, paddingBottom: padding}}
                   currentTab={tabIndex} setTabCallback={(index) => setTabIndex(index)} />
      {
        tabIndex === 0 ?
            <BarChart width={width} height={300}/> :
            tabIndex === 1 ?
                <LineChart width={width} height={300} /> :
                null
      }
    </ScrollView>
  );
};

function ReportsTabs(props) {
  const {currentTab, setTabCallback} = props;
  return (
      <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, props.style]}>
        {
          tabs.map((tab, index) => (
              <View style={{alignItems: 'center', width: tabWidth,
                borderBottomWidth: currentTab === index ? 3 : 0,
                borderColor: '#aad326'}}>
                <Icon name={tab.icon}
                      size={30}
                      color='#000'
                      onPress={()=>setTabCallback(index)}
                      style={{paddingBottom: 7.5}} />
              </View>
          ))
        }
      </View>
  )
}

function TimeFilterTab(props) {
  // To do
  return null;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 15,
    paddingLeft: 20
  }
});

export default ReportsScreen;