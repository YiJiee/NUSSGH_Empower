import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
//styles
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import logStyles from '../../styles/logStyles';
//function
import {normalTextFontSize} from '../../styles/variables';
import {
    activity,
    bg,
    bgpost,
    food,
    isMonday,
    med,
    phyv,
    renderGoalTypeName,
    selfv,
    weight,
} from '../../commonFunctions/goalFunctions';
import {deleteGoal} from '../../netcalls/requestsGoals';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//component
import LeftArrowBtn from '../logs/leftArrowBtn';
import DeleteBin from '../deleteBin';
import CircularProgress from '../dashboard/todayOverview/CircularProgress';
import DeleteModal from '../deleteModal';
import ProgressBar from '../progressbar';

//set default progress first
//havent differentiate who is setting the goal*
const progress = 0.3;
const GoalDetail = (props) => {
  const {visible, goalItem, type} = props;
  const {close, init, deleteInit, openEditModal} = props;
  const [showDelete, setShowDelete] = useState(false);
  const [deleteContent, setDeleteContent] = useState('');

  const confirmDelete = () => {
    setShowDelete(true);
    let content = goalItem.name + ' Goal';
    setDeleteContent(content);
  };

  const removeGoal = async () => {
    let goalType = type;
    if (goalType === bg) {
      goalType = bgpost;
    }
    console.log('removing ' + goalType + ' ' + goalItem['_id']);
    if (await deleteGoal(goalType, goalItem._id)) {
      deleteInit();
      setShowDelete(false);
      close();
    } else {
      Alert.alert('Unexpected error occured!', 'Please try again later.', [
        {text: 'Got It'},
      ]);
    }
  };

  const showActionButton = () => {
    if (isMonday() && goalItem?.set_by !== phyv) {
      return true;
    }
    return false;
  };

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => close()}
      backdropOpacity={1}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={close} />
        </View>
        <Text style={globalStyles.pageHeader}>View Goal</Text>
        {goalItem?.set_by === selfv ? (
          <Text style={globalStyles.pageDetails}>Your Goals</Text>
        ) : goalItem?.set_by === phyv ? (
          <Text style={globalStyles.pageDetails}>Set by physician</Text>
        ) : null}

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {type !== food
            ? RenderProgressCard(type, goalItem?.name, progress)
            : RenderProgressBarCard(type, goalItem?.name, progress)}

          {/*Render goal type specific fields*/}
          {type === bg ? (
            <>
              {RenderField('Min Reading', goalItem?.min_bg, 'mmol/L')}
              {RenderField('Max Reading', goalItem?.max_bg, 'mmol/L')}
            </>
          ) : type === food ? (
            <>
              {RenderField('Calories', goalItem?.calories, 'cal')}
              {RenderField('Carbs', goalItem?.carbs, 'g')}
              {RenderField('Fat', goalItem?.fats, 'g')}
              {RenderField('Protein', goalItem?.protein, 'g')}
            </>
          ) : type === med ? (
            <>
              {RenderField('Medication', goalItem?.medication)}
              {RenderField('Dosage', goalItem?.dosage, goalItem?.unit)}
            </>
          ) : type === weight ? (
            <>{RenderField('Goal Weight', goalItem?.goal_weight, 'kg')}</>
          ) : type === activity ? (
            <>
              {RenderField('Exercise', goalItem?.duration, 'mins')}
              {RenderField('Cal Burnt', goalItem?.cal_burnt, 'cal')}
            </>
          ) : (
            <>{RenderField('Min Steps', goalItem?.steps)}</>
          )}
        </ScrollView>
      </View>
      {/*Should check if physician/monday user set to show this action button**/}
      {showActionButton() && (
        <View style={globalStyles.buttonContainer}>
          <View style={{flexDirection: 'row'}}>
            <DeleteBin
              method={confirmDelete}
              style={{marginTop: '6%', marginStart: '2%'}}
            />
            <TouchableOpacity
              style={logStyles.enableEditButton}
              onPress={() => openEditModal()}>
              <Text style={globalStyles.actionButtonText}>Edit Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <DeleteModal
        visible={showDelete}
        close={() => setShowDelete(false)}
        item={deleteContent}
        confirmMethod={removeGoal}
      />
    </Modal>
  );
};

export default GoalDetail;

function RenderField(fieldName, fieldData, units) {
  let string = '';
  let formatUnit =
    String(units).substr(0, 1).toUpperCase() +
    String(units).substr(1, units?.length) +
    '(s)';

  if (fieldData != null) {
    let stringLength = fieldData.length;
    string = fieldData;
    if (stringLength > 20) {
      string = string.substr(0, 20) + '...';
    }
  }
  return (
    <View style={[{flexDirection: 'row'}, globalStyles.goalFieldBottomBorder]}>
      <Text style={[globalStyles.goalFieldName, {flex: 1}]}>{fieldName}</Text>
      {fieldName === 'Dosage' ? (
        <Text style={styles.data}>
          {string} {formatUnit}
        </Text>
      ) : (
        <Text style={styles.data}>
          {string} {units}
        </Text>
      )}
    </View>
  );
}

function RenderProgressBarCard(type, goalName, progress) {
  let percent = '0%';
  if (progress != null) {
    percent = progress * 100 + '%';
  }
  return (
    <View
      style={[
        styles.card,
        styles.shadow,
        {flexDirection: 'column', alignItems: 'flex-start'},
      ]}>
      <Text style={globalStyles.pageDetails}>{renderGoalTypeName(type)}</Text>
      <Text
        style={[
          globalStyles.pageDetails,
          styles.goalName,
          {fontWeight: 'bold'},
        ]}>
        {goalName}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <ProgressBar
          containerStyle={{
            height: adjustSize(20),
            marginBottom: adjustSize(5),
            flex: 1,
            marginStart: '3%',
            marginEnd: '2%',
          }}
          progress={percent}
          reverse={false}
          useIndicatorLevel={true}
        />
        {progress > 0.65 ? (
          <View
            style={{
              flexDirection: 'column',
              alignSelf: 'flex-end',
            }}>
            <Text style={[styles.targetStyle, styles.foodpercent]}>
              {percent}
            </Text>
            <Text style={[styles.targetStyle, {color: '#ff0844'}]}>
              Not On Target
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'column',
              alignSelf: 'flex-end',
              marginTop: '-10%',
            }}>
            <Text
              style={[
                styles.targetStyle,
                styles.foodpercent,
                {color: Colors.lastLogButtonColor},
              ]}>
              {percent}
            </Text>
            <Text
              style={[styles.targetStyle, {color: Colors.lastLogButtonColor}]}>
              On Target
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function RenderProgressCard(type, goalName, progress) {
  let percent = progress * 100 + '%';
  return (
    <View style={[styles.card, styles.shadow]}>
      <CircularProgress
        color="#aad326"
        percent={progress}
        centreComponent={{
          width: adjustSize(40) / 2,
          height: adjustSize(40) / 2,
          component: <Text style={styles.percentageText}>{percent}</Text>,
        }}
        radius={adjustSize(40)}
        padding={adjustSize(5)}
        strokeWidth={adjustSize(5)}
        fontSize={adjustSize(15)}
      />
      <View style={{flex: 1}}>
        <Text style={globalStyles.pageDetails}>{renderGoalTypeName(type)}</Text>
        <Text style={[globalStyles.pageDetails, styles.goalName]}>
          {goalName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  data: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: normalTextFontSize,
    marginTop: '3%',
    marginEnd: '4%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: adjustSize(10),
    margin: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '3%',
    justifyContent: 'space-around',
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
  percentageText: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
    color: '#a8d126',
  },
  goalName: {
    color: Colors.textGrey,
    fontSize: adjustSize(15),
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: 'bold',
  },
  targetStyle: {
    fontSize: adjustSize(18),
  },
  foodpercent: {
    color: '#ff0844',
    alignSelf: 'flex-end',
    fontSize: adjustSize(20),
  },
});
