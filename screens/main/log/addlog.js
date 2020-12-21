import React, {Component} from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
    checkLogDone,
    food_key,
    med_key,
    renderLogIconNavy,
    renderUncompleteLogText,
    weight_key,
} from '../../../commonFunctions/logFunctions';
import {afternoonObj, getGreetingFromHour, morningObj} from '../../../commonFunctions/common';
//components
import LastLogButton from '../../../components/logs/lastLogBtn';
import DateSelectionBlock from '../../../components/logs/dateSelectionBlock';
import BloodGlucoseLogBlock from '../../../components/logs/bg/bloodGlucoseLogBlock';
import CrossBtn from '../../../components/crossBtn';
import MedicationLogBlock from '../../../components/logs/medication/medicationLogBlock';
import WeightLogBlock from '../../../components/logs/weight/weightLogBlock';
import {getDefaultMealType} from '../../../commonFunctions/mealLogFunctions';
import CreateMealLogBlock from '../../../components/logs/meal/CreateMealLogBlock';
import LeftArrowBtn from '../../../components/logs/leftArrowBtn';
import LoadingModal from '../../../components/loadingModal';
// Functions
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

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
      if (this.props.route.params?.type != undefined) {
        this.openModalType(this.props.route.params?.type);
        delete this.props.route.params; //prevent opening again from tab press
      }
    });
    console.log('log contruct');
  }

  componentDidMount() {
    this.init();
    this.setAnimation();
    console.log('log mount');
  }

  componentDidUpdate(prevProp, prevState) {
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
      todayDate: Moment(new Date()).format('Do MMMM YYYY'),
    });
    checkLogDone(period).then((response) => {
      if (response !== undefined) {
        this.setState({loading: false});
        this.setState({completedTypes: response.completed});
        this.setState({notCompletedTypes: response.notCompleted});
      }
    });
    this.initUncomplete();
  }

  initUncomplete() {
    let period = getGreetingFromHour(this.state.recordDate.getHours());
    //get logs not done for morning and afternoon
    if (period !== morningObj.name) {
      checkLogDone(morningObj.name).then((response) => {
        if (response !== undefined) {
          this.setState({uncompletedMorningType: response.notCompleted});
        }
      });

      checkLogDone(afternoonObj.name).then((response) => {
        if (response !== undefined) {
          this.setState({uncompletedAfternoonType: response.notCompleted});
        }
      });
    }
  }

  resetState() {
    this.setState({
      recordDate: new Date(),
      period: '',

      showModal: false,
      selectedLogType: '',

      // exclusive for meal log
      selectedMealType: getDefaultMealType(new Date().getHours()),

      showBg: false,
      showFood: false,
      showMed: false,
      showWeight: false,
      slideRightAnimation: new Animated.Value(0),

      uncompletedMorningType: [],
      uncompletedAfternoonType: [],
    });
  }

  openModalType = (logType) => {
    this.setState({selectedLogType: logType});
    this.setState({showModal: true});
  };

  closeModal = () => {
    this.setState({showModal: false});
    this.resetState();
    setTimeout(() => this.init(), 500);
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
                {renderUncompleteLogText(
                  uncompletedMorningType,
                  uncompletedAfternoonType,
                  period,
                  item,
                ).length > 0 ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.logHeader}>{item}</Text>
                    <Text style={styles.uncompleteDetail}>
                      {renderUncompleteLogText(
                        uncompletedMorningType,
                        uncompletedAfternoonType,
                        period,
                        item,
                      )}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.logHeader}>{item}</Text>
                )}

                <Ionicon
                  name="alert-circle-outline"
                  size={adjustSize(40)}
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
                {renderUncompleteLogText(
                  uncompletedMorningType,
                  uncompletedAfternoonType,
                  period,
                  item,
                ).length > 0 ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.logHeader}>{item}</Text>
                    <Text style={styles.uncompleteDetail}>
                      {renderUncompleteLogText(
                        uncompletedMorningType,
                        uncompletedAfternoonType,
                        period,
                        item,
                      )}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.logHeader}>{item}</Text>
                )}
                <Ionicon
                  name="checkmark"
                  size={adjustSize(40)}
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
                <View
                  style={[globalStyles.menuBarContainer, {paddingLeft: '4%'}]}>
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
                      size={adjustSize(60)}
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
  uncompleteDetail: {
    color: '#ff0844',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(14),
  },
  logHeader: {
    fontSize: adjustSize(18),
    fontWeight: '800',
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: '2%',
    color: '#21293a',
  },
});

export default AddLogScreen;
