import React, {Component} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
// third party lib
import Moment from 'moment';
//functions
import {
    getLastBgLog,
    getLastMealLog,
    getLastMedicationLog,
    getLastWeightLog,
} from '../../../storage/asyncStorageFunctions';
import {getDefaultMealType, handleSubmitMealLog} from '../../../commonFunctions/mealLogFunctions';
import {
    checkBloodGlucose,
    checkWeight,
    handleSubmitBloodGlucose,
    handleSubmitMedication,
    handleSubmitWeight,
} from '../../../commonFunctions/logFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
//components
import FormBlockFix from '../../../components/logs/formBlockFix';
import BloodGlucoseLogBlock from '../../../components/logs/bg/bloodGlucoseLogBlock';
import BloodGlucoseLogDisplay from '../../../components/logs/bg/bloodGlucoseLogDisplay';
import DailyMealLogComponent from '../../../components/logs/meal/DailyMealLogComponent';
import {BackAndForwardButton} from '../../../components/BackAndForwardButtons';
import WeightLogBlock from '../../../components/logs/weight/weightLogBlock';
import WeightLogDisplay from '../../../components/logs/weight/weightLogDisplay';
import MedicationLogDisplay from '../../../components/logs/medication/medicationLogDisplay';
import MedicationLogBlock from '../../../components/logs/medication/medicationLogBlock';
import MealLogDisplay from '../../../components/logs/meal/MealLogDisplay';

class DailyLog extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      currentStep: 1,
      showNewInput: false,

      dateBloodGlucose: new Date(),
      bloodGlucose: '',
      lastBloodGlucose: null,
      inputNewBloodGlucose: false,

      mealRecordDate: new Date(),
      mealType: getDefaultMealType(new Date().getHours()),
      meal: null,
      lastMealLog: null,
      inputNewMeal: false,

      dateMedication: new Date(),
      selectedMedicationList: [],
      lastMedication: null,
      inputNewMedication: false,

      dateWeight: new Date(),
      weight: '',
      lastWeight: null,
      inputNewWeight: false,
    };
  }

  componentDidMount() {
    Moment.locale('en');

    getLastBgLog().then((data) => {
      if (data && this.isToday(data.date)) {
        this.setState({lastBloodGlucose: data});
        this.setState({enableNext: true});
      } else {
        this.setState({
          showNewInput: true,
        });
      }
    });

    getLastMedicationLog().then((data) => {
      if (this.isToday(data.date)) {
        this.setState({lastMedication: data});
      }
    });

    getLastWeightLog().then((data) => {
      if (this.isToday(data.date)) {
        this.setState({lastWeight: data});
      }
    });

    getLastMealLog().then((data) => {
      if (this.isToday(data.date)) {
        this.setState({
          lastMealLog: data,
        });
      }
    });
  }

  isToday = (date) => {
    return date === Moment(new Date()).format('YYYY/MM/DD');
  };

  enableNext = () => {
    if (!this.state.showNewInput) {
      switch (this.state.currentStep) {
        case 1:
          if (this.state.lastBloodGlucose) {
            return true;
          }
          break;
        case 2:
          if (this.state.lastMealLog) {
            return true;
          }
          break;
        case 3:
          if (this.state.lastMedication) {
            return true;
          }
          break;
        case 4:
          if (this.state.lastWeight) {
            return true;
          }
          break;
      }
    }

    switch (this.state.currentStep) {
      case 1:
        return checkBloodGlucose(this.state.bloodGlucose);
        break;
      case 2:
        return this.state.meal !== null;
        break;
      case 3:
        return this.state.selectedMedicationList.length > 0;
        break;
      case 4:
        return checkWeight(this.state.weight);
        break;
      case 5:
        return true;
        break;
    }
    return false;
  };

  displayStepText = () => {
    switch (this.state.currentStep) {
      case 1:
        return 'Step 1: Blood Glucose Log';
      case 2:
        return 'Step 2: Food Intake';
      case 3:
        return 'Step 3: Medication Log';
      case 4:
        return 'Step 4: Weight Log';
      case 5:
        return 'Step 5 Summary';
    }
    return '';
  };

  stepImage = () => {
    switch (this.state.currentStep) {
      case 1:
        return require('../../../resources/images/progress1.png');
      case 2:
        return require('../../../resources/images/progress2.png');
      case 3:
        return require('../../../resources/images/progress3.png');
      case 4:
        return require('../../../resources/images/progress4.png');
      case 5:
        return require('../../../resources/images/progress5.png');
    }
    return '';
  };

  formText = () => {
    switch (this.state.currentStep) {
      case 1:
        return 'You already logged blood glucose today, Want to add a new record?';
      case 2:
        return 'You already logged food intake today, Want to add a new record?';
      case 3:
        return 'You already logged medication today, Want to add a new record?';
      case 4:
        return 'You already logged weight today, Want to add a new record?';
    }
    return '';
  };

  showFormText = () => {
    switch (this.state.currentStep) {
      case 1:
        if (this.state.lastBloodGlucose) {
          return true;
        }
        break;
      case 2:
        if (this.state.lastMealLog) {
          return true;
        }
        break;
      case 3:
        if (this.state.lastMedication) {
          return true;
        }
        break;
      case 4:
        if (this.state.lastWeight) {
          return true;
        }
        break;
      case 5:
        return false;
        break;
    }
    return false;
  };

  handleFormBlockChange = (boolValue) => {
    this.setState({
      showNewInput: boolValue,
    });
  };

  showLastLog = (step) => {
    if (step === this.state.currentStep) {
      switch (step) {
        case 1:
          if (
            this.state.lastBloodGlucose !== null &&
            !this.state.showNewInput
          ) {
            return true;
          }
          break;
        case 2:
          if (this.state.lastMealLog && !this.state.showNewInput) {
            return true;
          }
          break;
        case 3:
          if (this.state.lastMedication && !this.state.showNewInput) {
            return true;
          }
          break;
        case 4:
          if (this.state.lastWeight !== null && !this.state.showNewInput) {
            return true;
          }
          break;
      }
    }
    return false;
  };

  showNewLogInput = (step) => {
    if (step === this.state.currentStep) {
      switch (step) {
        case 1:
          if (this.state.lastBloodGlucose === null || this.state.showNewInput) {
            return true;
          }
          break;
        case 2:
          if (this.state.lastMealLog === null || this.state.showNewInput) {
            return true;
          }
          break;
        case 3:
          if (this.state.lastMedication === null || this.state.showNewInput) {
            return true;
          }
          break;
        case 4:
          if (this.state.lastWeight === null || this.state.showNewInput) {
            return true;
          }
          break;
      }
    }
    return false;
  };

  onMedicationList = (list) => {
    this.setState({selectedMedicationList: list});
  };

  // Meal handler events
  setMealCallback = (meal) => {
    this.setState({
      meal,
    });
  };

  setMealTypeCallback = (mealType) => {
    this.setState({
      mealType,
    });
  };

  setMealRecordDateCallback = (recordDate) => {
    this.setState({
      mealRecordDate: recordDate,
    });
  };

  handleSubmit = () => {
    // Array to hold all the requests
    let promises = [];

    // Blood glucose data to pass to endpoint
    if (this.state.inputNewBloodGlucose) {
      promises.push(
        new Promise((resolve, reject) => {
          resolve(
            handleSubmitBloodGlucose(
              this.state.dateBloodGlucose,
              this.state.bloodGlucose,
            ),
          );
        }),
      );
    }

    if (this.state.inputNewMedication) {
      promises.push(
        new Promise((resolve, reject) => {
          resolve(
            handleSubmitMedication(
              this.state.dateMedication,
              this.state.selectedMedicationList,
            ),
          );
        }),
      );
    }

    if (this.state.inputNewWeight) {
      promises.push(
        new Promise((resolve, reject) => {
          resolve(handleSubmitWeight(this.state.dateWeight, this.state.weight));
        }),
      );
    }

    // Meal data to pass to endpoint
    if (this.state.inputNewMeal) {
      const {meal, mealType, mealRecordDate} = this.state;
      if (meal) {
        const mealDataToLog = {
          ...meal,
          mealType,
          recordDate: Moment(mealRecordDate).format('DD/MM/YYYY HH:mm:ss'),
        };
        // Append async promise to promises array.
        promises.push(
          new Promise((resolve, reject) => {
            resolve(handleSubmitMealLog(mealDataToLog, mealRecordDate));
          }),
        );
      }
    }

    if (promises.length > 0) {
      // Call all requests asynchronously.
      Promise.all(promises)
        .then((respArr) => {
          // All have been recorded
          this.props.navigation.goBack();
          Alert.alert('Log success', 'Your logs have been recorded', [
            {text: 'Okay'},
          ]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.props.navigation.goBack();
      Alert.alert('No new records', 'You have no new records', [
        {text: 'Okay'},
      ]);
    }
  };

  incrementStepper = () => {
    this.handleNext();
    this.setState({
      currentStep: this.state.currentStep + 1,
      showNewInput: this.handleShowNewInput(this.state.currentStep + 1),
    });
  };

  decrementStepper = () => {
    this.setState({
      currentStep: this.state.currentStep - 1,
      showNewInput: this.handleShowNewInput(this.state.currentStep - 1),
    });
  };

  handleNext = () => {
    console.log(
      'handleNext : ' +
        this.state.currentStep +
        ' showNewInput : ' +
        this.state.showNewInput,
    );
    switch (this.state.currentStep) {
      case 1:
        this.setState({inputNewBloodGlucose: this.state.showNewInput});
        break;
      case 2:
        this.setState({inputNewMeal: this.state.showNewInput});
        break;
      case 3:
        this.setState({inputNewMedication: this.state.showNewInput});
        break;
      case 4:
        this.setState({inputNewWeight: this.state.showNewInput});
        break;
    }
  };

  handleShowNewInput = (step) => {
    switch (step) {
      case 1:
        if (!this.state.lastBloodGlucose || this.state.inputNewBloodGlucose) {
          console.log(
            'lastBloodGlucose : ' +
              this.state.lastBloodGlucose +
              ' inputNewBloodGlucose : ' +
              this.state.inputNewBloodGlucose,
          );
          return true;
        }
        break;
      case 2:
        if (!this.state.lastMealLog || this.state.inputNewMeal) {
          console.log(
            'lastMealLog : ' +
              this.state.lastMealLog +
              ' inputNewMeal : ' +
              this.state.inputNewMeal,
          );
          return true;
        }
        break;
      case 3:
        if (!this.state.lastMedication || this.state.inputNewMedication) {
          console.log(
            'lastMedication : ' +
              this.state.lastMedication +
              ' inputNewMedication : ' +
              this.state.inputNewMedication,
          );
          return true;
        }
        break;
      case 4:
        if (!this.state.lastWeight || this.state.inputNewWeight) {
          console.log(
            'lastWeight : ' +
              this.state.lastWeight +
              ' inputNewWeight : ' +
              this.state.inputNewWeight,
          );
          return true;
        }
        break;
    }
    console.log('handleShowNewInput : not trigger ' + step);
    return false;
  };

  render() {
    const {navigation, route} = this.props;
    const {meal, mealType, mealRecordDate, currentStep} = this.state;

    return (
      <ScrollView
        style={{width: '100%', flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        centerContent
        ref={(scrollView) => (this.scrollView = scrollView)}>
        <View style={styles.screen}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{this.displayStepText()}</Text>
          </View>
          <Image
            style={styles.progress}
            resizeMode="contain"
            source={this.stepImage()}
          />

          {this.showFormText() && (
            <View
              style={[
                styles.container,
                styles.shadow,
                {marginBottom: '4%', paddingEnd: '1%'},
              ]}>
              <FormBlockFix
                question={this.formText()}
                getFormSelection={this.handleFormBlockChange}
                selectYes={this.state.showNewInput}
                color={'#aad326'}
              />
            </View>
          )}

          {this.showLastLog(1) && (
            <BloodGlucoseLogDisplay data={this.state.lastBloodGlucose} />
          )}
          {this.showLastLog(2) && (
            <MealLogDisplay data={this.state.lastMealLog} />
          )}
          {this.showLastLog(3) && (
            <MedicationLogDisplay data={this.state.lastMedication} />
          )}
          {this.showLastLog(4) && (
            <WeightLogDisplay data={this.state.lastWeight} />
          )}

          {this.showNewLogInput(1) && (
            <BloodGlucoseLogBlock
              date={this.state.dateBloodGlucose}
              setDate={(date) => {
                this.setState({dateBloodGlucose: date});
              }}
              bloodGlucose={this.state.bloodGlucose}
              setBloodGlucose={(value) => {
                this.setState({bloodGlucose: value});
              }}
            />
          )}
          {this.showNewLogInput(2) && (
            <DailyMealLogComponent
              onMealUpdateListener={this.setMealCallback}
              onMealTypeUpdateListener={this.setMealTypeCallback}
              onDateTimeUpdateListener={this.setMealRecordDateCallback}
              recordDate={mealRecordDate}
              mealType={mealType}
              selectedMeal={meal}
              navigation={navigation}
              route={route}
            />
          )}
          {this.showNewLogInput(3) && (
            <MedicationLogBlock
              date={this.state.dateMedication}
              setDate={(date) => {
                this.setState({dateMedication: date});
              }}
              selectedMedicationList={this.state.selectedMedicationList}
              onListChange={this.onMedicationList}
            />
          )}
          {this.showNewLogInput(4) && (
            <WeightLogBlock
              date={this.state.dateWeight}
              setDate={(date) => {
                this.setState({dateWeight: date});
              }}
              weight={this.state.weight}
              setWeight={(value) => {
                this.setState({weight: value});
              }}
            />
          )}
          {this.state.currentStep === 5 && this.state.inputNewBloodGlucose && (
            <BloodGlucoseLogDisplay
              data={{
                value: this.state.bloodGlucose,
                date: Moment(this.state.dateBloodGlucose).format('YYYY/MM/DD'),
                time: Moment(this.state.dateBloodGlucose).format('h:mm a'),
              }}
              isNewSubmit={true}
            />
          )}
          {this.state.currentStep === 5 && this.state.inputNewMeal && (
            <MealLogDisplay
              data={{
                value: {
                  ...meal,
                  mealType,
                  mealRecordDate,
                },
                date: Moment(this.state.mealRecordDate).format('YYYY/MM/DD'),
                time: Moment(this.state.mealRecordDate).format('h:mm a'),
              }}
              isNewSubmit={true}
            />
          )}
          {this.state.currentStep === 5 && this.state.inputNewMedication && (
            <MedicationLogDisplay
              data={{
                value: this.state.selectedMedicationList,
                date: Moment(this.state.dateMedication).format('YYYY/MM/DD'),
                time: Moment(this.state.dateWeight).format('h:mm a'),
              }}
              isNewSubmit={true}
            />
          )}
          {this.state.currentStep === 5 && this.state.inputNewWeight && (
            <WeightLogDisplay
              data={{
                value: this.state.weight,
                date: Moment(this.state.dateWeight).format('YYYY/MM/DD'),
                time: Moment(this.state.dateWeight).format('h:mm a'),
              }}
              isNewSubmit={true}
            />
          )}

          {currentStep === 1 ? ( // Only render the forward button
            <BackAndForwardButton
              onPressBack={this.props.navigation.goBack}
              onPressForward={this.incrementStepper}
              overrideBackwardTitle="Cancel"
              enableForward={this.enableNext}
            />
          ) : currentStep === 5 ? (
            <BackAndForwardButton
              onPressBack={this.decrementStepper}
              onPressForward={this.handleSubmit}
              overrideForwardTitle="Submit"
              enableForward={this.enableNext}
            />
          ) : (
            <BackAndForwardButton
              onPressBack={this.decrementStepper}
              onPressForward={this.incrementStepper}
              enableForward={this.enableNext}
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    padding: adjustSize(20),
    backgroundColor: 'white',
  },
  textContainer: {
    width: '100%',
  },
  text: {
    fontSize: adjustSize(18),
  },
  progress: {
    width: '100%',
    height: adjustSize(100),
  },
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '5%',
    borderRadius: adjustSize(20),
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
});

export default DailyLog;
