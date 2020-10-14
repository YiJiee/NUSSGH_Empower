import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
//third party lib
import Moment from 'moment';
import Modal from 'react-native-modal';
import Ionicon from 'react-native-vector-icons/Ionicons';
//styles
import logStyles from '../../../styles/logStyles';
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
//function
import {
  bg_key,
  food_key,
  med_key,
  weight_key,
  renderLogIcon,
  checkLogDone,
  renderLogIconNavy,
} from '../../../commonFunctions/logFunctions';
import {
  getGreetingFromHour,
  morningObj,
  afternoonObj,
  navy_color,
  eveningObj,
} from '../../../commonFunctions/common';
//components
import LastLogButton from '../../../components/logs/lastLogBtn';
import DateSelectionBlock from '../../../components/logs/dateSelectionBlock';
import BloodGlucoseLogBlock from '../../../components/logs/bg/bloodGlucoseLogBlock';
import CrossBtn from '../../../components/crossBtn';
import MedicationLogBlock from '../../../components/logs/medication/medicationLogBlock';
import WeightLogBlock from '../../../components/logs/weight/weightLogBlock';
import {getDefaultMealType} from '../../../commonFunctions/mealLogFunctions';
import MealTypeSelectionBlock from '../../../components/logs/meal/MealTypeSelectionBlock';
import CreateMealLogBlock from '../../../components/logs/meal/CreateMealLogBlock';
import LeftArrowBtn from '../../../components/logs/leftArrowBtn';
import LoadingModal from '../../../components/loadingModal';
import UncompleteLogCard from '../../../components/uncompleteLogCard';
// Functions

const fixedDateTime = new Date();

// AddLog view
class AddLogScreen extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      recordDate: fixedDateTime,
      period: '',
      todayDate: '',

      showModal: false,
      selectedLogType: '',

      // exclusive for meal log
      selectedMealType: getDefaultMealType(new Date().getHours()),

      showBg: false,
      showFood: false,
      showMed: false,
      showWeight: false,
      showSuccess: false,

      loading: true,

      completedTypes: [], //for current period
      notCompletedTypes: [], //for current period

      uncompletedMorningType: [],
      uncompletedAfternoonType: [],

      slideRightAnimation: new Animated.Value(0),
    };

    this.setAnimation = this.setAnimation.bind(this);

    this.props.navigation.addListener('focus', () => {
      //check the period, date and which logs done
      this.state.slideRightAnimation = new Animated.Value(0); //reset
      this.init();
      this.setAnimation();
    });
    console.log('log contruct');
  }

  componentDidMount() {
    this.init();
    this.setAnimation();
    console.log('log mount');
  }

  componentDidUpdate() {
    this.setAnimation();
    console.log('log update');
  }

  setAnimation() {
    Animated.timing(this.state.slideRightAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  init() {
    let period = getGreetingFromHour(this.state.recordDate.getHours());
    this.setState({
      period: period,
      todayDate: Moment(this.state.recordDate).format('Do MMMM YYYY'),
    });
    checkLogDone(period).then((response) => {
      if (response !== undefined) {
        this.setState({loading: false});
        this.setState({completedTypes: response.completed});
        this.setState({notCompletedTypes: response.notCompleted});
      }
    });

    //get logs not done for morning and afternoon
    if (period != morningObj.name) {
      checkLogDone(morningObj.name).then((response) => {
        if (response != undefined) {
          this.setState({uncompletedMorningType: response.notCompleted});
        }
      });

      checkLogDone(afternoonObj.name).then((response) => {
        if (response != undefined) {
          this.setState({uncompletedAfternoonType: response.notCompleted});
        }
      });
    }
  }

  resetState() {
    this.setState({
      recordDate: new Date(),

      showModal: false,
      selectedLogType: '',

      // exclusive for meal log
      selectedMealType: getDefaultMealType(new Date().getHours()),

      showBg: false,
      showFood: false,
      showMed: false,
      showWeight: false,
      slideRightAnimation: new Animated.Value(0),
    });
  }

  openModalType = (logType) => {
    this.setState({selectedLogType: logType});
    this.setState({showModal: true});
  };

  closeModal = () => {
    this.setState({showModal: false});
    this.resetState();
    this.init(); //update log done check*
  };

  setDate = (date) => {
    this.setState({recordDate: date});
  };

  showLogForm = (logType) => {
    switch (logType) {
      case bg_key:
        this.setState({showBg: true});
        break;
      case food_key:
        this.setState({showFood: true});
        break;

      case med_key:
        this.setState({showMed: true});
        break;

      case weight_key:
        this.setState({showWeight: true});
        break;
    }
  };

  //close forms
  closeBgForm = () => {
    this.setState({showBg: false});
  };

  closeMedForm = () => {
    this.setState({showMed: false});
  };

  closeWeightForm = () => {
    this.setState({showWeight: false});
  };

  closeFoodForm = () => {
    this.setState({showFood: false});
  };

  render() {
    const {
      showModal,
      selectedLogType,
      recordDate,
      todayDate,
      period,
      notCompletedTypes,
      completedTypes,
      slideRightAnimation,
      loading,
      uncompletedMorningType,
      uncompletedAfternoonType,
    } = this.state;
    const {showBg, showMed, showWeight, showFood} = this.state;
    const widthInterpolate = slideRightAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Dimensions.get('window').width, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={globalStyles.pageContainer}>
        <Animated.View
          style={{
            ...globalStyles.pageContainer,
            transform: [{translateX: widthInterpolate}],
          }}>
          <View style={globalStyles.menuBarContainer}>
            <LeftArrowBtn
              close={() => this.props.navigation.navigate('Home')}
            />
          </View>
          <Text style={globalStyles.pageHeader}>Add Log</Text>
          <Text style={[globalStyles.pageDetails]}>{todayDate}</Text>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {/*Uncomplete log type for period of the day */}
            {period === afternoonObj.name &&
              RenderUncompleteLog(uncompletedMorningType, morningObj.name)}
            {period === eveningObj.name && (
              <>
                {RenderUncompleteLog(uncompletedMorningType, morningObj.name)}
                {RenderUncompleteLog(
                  uncompletedAfternoonType,
                  afternoonObj.name,
                )}
              </>
            )}

            <Text style={[globalStyles.pageDetails, {marginTop: '4%'}]}>
              Progress For {period}
            </Text>

            {notCompletedTypes.length > 0 && (
              <Text style={logStyles.complete}>Not Complete</Text>
            )}
            {notCompletedTypes.map((item, index) => (
              <TouchableOpacity
                style={logStyles.logItem}
                key={item}
                onPress={() => this.openModalType(item)}>
                {renderLogIconNavy(item)}
                <Text style={[globalStyles.pageDetails, {color: '#21293a'}]}>
                  {item}
                </Text>
                <Ionicon
                  name="alert-circle-outline"
                  size={40}
                  style={logStyles.completeIcon}
                  color="red"
                />
              </TouchableOpacity>
            ))}
            {completedTypes.length > 0 && (
              <Text style={logStyles.complete}>Completed</Text>
            )}
            {completedTypes.map((item, index) => (
              <TouchableOpacity
                style={logStyles.logItem}
                onPress={() => this.openModalType(item)}
                key={item}>
                {renderLogIconNavy(item)}
                <Text style={[globalStyles.pageDetails, {color: '#21293a'}]}>
                  {item}
                </Text>
                <Ionicon
                  name="checkmark"
                  size={40}
                  style={logStyles.completeIcon}
                  color={Colors.backArrowColor}
                />
              </TouchableOpacity>
            ))}
            {/* Modal for Add Log*/}
            <Modal
              isVisible={showModal}
              coverScreen={true}
              backdropOpacity={1}
              onBackButtonPress={this.closeModal}
              style={{margin: 0}}
              backdropColor={Colors.backgroundColor}>
              <ScrollView
                style={logStyles.modalContainer}
                contentContainerStyle={{paddingBottom: '15%'}}>
                <View style={globalStyles.menuBarContainer}>
                  <CrossBtn close={this.closeModal} />
                </View>
                <View style={[logStyles.bodyPadding, {flex: 1}]}>
                  <Text style={[logStyles.headerText]}>Add Log</Text>
                  <Text
                    style={[
                      logStyles.headersubText,
                      logStyles.componentMargin,
                    ]}>
                    {selectedLogType}
                  </Text>
                  <LastLogButton logType={selectedLogType} />
                  <Text style={[logStyles.greyText, logStyles.componentMargin]}>
                    Fill in if you wish to add a new record
                  </Text>

                  <DateSelectionBlock
                    date={recordDate}
                    setDate={this.setDate}
                    initialDate={fixedDateTime}
                  />
                  {/*selectedLogType === food_key && (
                  <MealTypeSelectionBlock
                    onSelectChange={(option) =>
                      this.setState({selectedMealType: option})
                    }
                    defaultValue={this.state.selectedMealType}
                  />
                )*/}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => this.showLogForm(selectedLogType)}>
                    <Ionicon
                      name="add-circle"
                      size={60}
                      color={Colors.nextBtnColor}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
              {/*Modal for the different form types */}
              <BloodGlucoseLogBlock
                visible={showBg}
                recordDate={recordDate}
                closeModal={this.closeBgForm}
                closeParent={this.closeModal}
                parent="addLog"
              />

              <MedicationLogBlock
                visible={showMed}
                recordDate={recordDate}
                closeModal={this.closeMedForm}
                closeParent={this.closeModal}
                parent="addLog"
              />

              <WeightLogBlock
                visible={showWeight}
                recordDate={recordDate}
                closeModal={this.closeWeightForm}
                closeParent={this.closeModal}
                parent="addLog"
              />
              <CreateMealLogBlock
                visible={showFood}
                parent="addLog"
                recordDate={recordDate}
                mealType={this.state.selectedMealType}
                closeModal={this.closeFoodForm}
                closeParent={this.closeModal}
                navigation={this.props.navigation}
              />
            </Modal>
          </ScrollView>
          <LoadingModal visible={loading} />
        </Animated.View>
        <LoadingModal visible={loading} />
      </View>
    );
  }
}

function RenderUncompleteLog(uncompleteLog, periodName) {
  return (
    <View style={[logStyles.logItem, styles.uncompleteContainer]}>
      <Text style={[globalStyles.pageDetails, styles.uncompleteText]}>
        Incomplete Logs for {periodName}:
      </Text>
      <UncompleteLogCard
        uncompleteLogs={uncompleteLog}
        color={navy_color}
        hideChevron={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignSelf: 'center',
  },
  uncompleteContainer: {
    borderColor: '#ff0844',
    flexDirection: 'column',
    padding: '3%',
  },
  uncompleteText: {
    color: '#ff0844',
  },
});

export default AddLogScreen;
