import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CHEV_RIGHT from '../../resources/images/Patient-Icons/SVG/icon-grey-chevron-right.svg';
//styles
import globalStyles from '../../styles/globalStyles';
import {Colors} from '../../styles/colors';
import {horizontalMargins} from '../../styles/variables';
//component
import ProgressBar from '../../components/progressbar';
import GoalDetail from '../../components/goals/goalDetail';
import BgGoal from './blocks/bgGoal';
import FoodGoal from './blocks/foodGoal';
import MedicationGoal from './blocks/medicationGoal';
import StepsGoal from './blocks/stepsGoal';
import ActivityGoal from './blocks/activityGoal';
import WeightGoal from './blocks/weightGoal';
import {
    activity_key,
    bg_key,
    food_key,
    med_key,
    renderLogIconNavy,
    step_key,
    weight_key,
} from '../../commonFunctions/logFunctions';
import {
    activity,
    bg,
    bgpost,
    defaultv,
    filterForGoalType,
    food,
    getGoalObjById,
    med,
    phyv,
    renderGoalTypeName,
    selfv,
    steps,
    weight,
} from '../../commonFunctions/goalFunctions';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const progress = 0.3;

const GoalList = (props) => {
  const {goals, fromAddLog, toOpen} = props;
  const {init} = props;
  const [selectedGoal, setSelectedGoal] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  const [ownGoals, setOwnGoals] = useState([]);
  const [physicianGoals, setPhysicianGoals] = useState([]);
  const [suggestedGoal, setSuggestedGoals] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [parent, setParent] = useState('');

  useEffect(() => {
    if (selectedGoal?._id != null) {
      setSelectedGoal(getGoalObjById(selectedGoal._id, goals));
    } else {
      setSelectedGoal({});
    }
    //division of goal type
    if (goals !== undefined) {
      setOwnGoals(filterForGoalType(goals, selfv));
      setPhysicianGoals(filterForGoalType(goals, phyv));
      setSuggestedGoals(filterForGoalType(goals, defaultv));
    }
  }, [goals]);

  //open goal from add log page
  useEffect(() => {
    if (fromAddLog != null && toOpen != null) {
      console.log('opening goal detail from add log success');
      let type = fromAddLog;
      if (fromAddLog === bgpost) {
        type = bg;
      }
      if (toOpen.set_by !== defaultv) {
        setTimeout(() => {
          openGoalDetail(toOpen, type);
        }, 500);
      }
    }
  }, [fromAddLog]);

  const openGoalDetail = (item, type) => {
    setSelectedGoal(item);
    setSelectedType(type);
    //if is own set type -> show the detail page*
    if (item.set_by === selfv) {
      setShowDetail(true);
      setParent('edit');
    } else if (item.set_by === defaultv) {
      //if suggested, show edit type page
      setShowEditModal(true);
      setParent(defaultv);
    } else if (item.set_by === phyv) {
      setParent(phyv);
      setShowDetail(true);
    }
  };

  const openModal4Edit = () => {
    setShowDetail(false);
    setTimeout(() => {
      setShowEditModal(true);
    }, 500);

    setParent('edit');
  };

  const closeEdit = () => {
    setShowEditModal(false);
    init();
    if (selectedGoal?.set_by !== defaultv) {
      setTimeout(() => setShowDetail(true), 500);
    } else {
      setShowDetail(false);
    }
  };

  return (
    <>
      {/*Render Physician Goal*/}
      <Text style={globalStyles.goalFieldName}>Physician-Set Goals</Text>
      {physicianGoals.length === 0 ? (
        <Text style={styles.noGoalsText}>
          Your physician has not set a goal for you yet.
        </Text>
      ) : (
        RenderGoalItems(physicianGoals, openGoalDetail)
      )}
      {/*Render Patient Goal*/}
      <Text style={[globalStyles.goalFieldName, {marginBottom: '3%'}]}>
        Your Goals
      </Text>
      {ownGoals.length === 0 ? (
        <Text style={styles.noGoalsText}>Your have not set a goal yet.</Text>
      ) : (
        RenderGoalItems(ownGoals, openGoalDetail)
      )}

      {/*Render Suggested Goal*/}
      {suggestedGoal.length !== 0 && (
        <>
          <Text style={[globalStyles.goalFieldName, {marginBottom: '3%'}]}>
            Suggested Goals
          </Text>
          {RenderGoalItems(suggestedGoal, openGoalDetail)}
        </>
      )}
      {selectedGoal?.set_by !== defaultv && (
        <GoalDetail
          visible={showDetail}
          close={() => setShowDetail(false)}
          goalItem={selectedGoal}
          type={selectedType}
          openEditModal={openModal4Edit}
          init={() => {
            init();
          }}
          deleteInit={() => {
            init();
            setSelectedGoal({});
          }}
        />
      )}

      {/*Action modal - for suggested and editing goal**/}
      {selectedType === bg ? (
        <BgGoal
          visible={showEditModal}
          close={closeEdit}
          parent={parent}
          bg={selectedGoal}
        />
      ) : null}
      {selectedType === food ? (
        <FoodGoal
          visible={showEditModal}
          close={closeEdit}
          parent={parent}
          food={selectedGoal}
        />
      ) : null}
      {selectedType === med && (
        <MedicationGoal
          visible={showEditModal}
          close={closeEdit}
          parent={parent}
          med={selectedGoal}
        />
      )}
      {selectedType === steps && (
        <StepsGoal
          visible={showEditModal}
          close={closeEdit}
          parent={parent}
          step={selectedGoal}
        />
      )}
      {selectedType === activity && (
        <ActivityGoal
          visible={showEditModal}
          close={closeEdit}
          parent={parent}
          activity={selectedGoal}
        />
      )}
      {selectedType === weight && (
        <WeightGoal
          visible={showEditModal}
          close={closeEdit}
          parent={parent}
          weightObj={selectedGoal}
        />
      )}
    </>
  );
};

export default GoalList;

function RenderGoalItems(array, openGoalDetail) {
  return array.map((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.border}
        onPress={() => openGoalDetail(item.goal, item.type)}>
        {renderGoalType(item.goal, item.type)}
      </TouchableOpacity>
    );
  });
}

//later check who set the goal*
function renderGoalType(goalItem, type) {
  let percent = progress * 100 + '%';
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      {renderGoalLogo(type)}
      <View style={{flex: 1}}>
        <Text style={styles.goalType}>{renderGoalTypeName(type)}</Text>
        {goalItem?.set_by !== defaultv ? (
          <>
            <ProgressBar
              progress={percent}
              useIndicatorLevel={false}
              reverse={true}
              progressBarColor={'#aad326'}
              containerStyle={styles.progressContainer}
            />
            <Text
              style={[
                globalStyles.pageDetails,
                {marginStart: 0, marginTop: '2%'},
              ]}>
              {goalItem.name}
            </Text>
          </>
        ) : (
          <Text
            style={[globalStyles.pageDetails, {marginStart: 0, marginTop: 0}]}>
            {goalItem.name}
          </Text>
        )}
      </View>
      <CHEV_RIGHT height={adjustSize(23)} width={adjustSize(23)} marginTop={'2%'} />
    </View>
  );
}

function renderGoalLogo(type) {
  switch (type) {
    case bg:
      return renderLogIconNavy(bg_key);
    case food:
      return renderLogIconNavy(food_key);
    case med:
      return renderLogIconNavy(med_key);
    case weight:
      return renderLogIconNavy(weight_key);
    case activity:
      return renderLogIconNavy(activity_key);
    case steps:
      return renderLogIconNavy(step_key);
  }
}

const styles = StyleSheet.create({
  addbutton: {
    marginStart: '2%',
    color: '#aad326',
    fontSize: adjustSize(20),
    marginTop: '2%',
  },
  goalType: {
    fontFamily: 'SFProDisplay-Bold',
    color: Colors.lastLogValueColor,
    fontSize: adjustSize(15),
    marginBottom: '2%',
  },
  progressContainer: {
    borderRadius: adjustSize(9.5),
    height: adjustSize(7),
  },
  border: {
    borderBottomWidth: 0.5,
    borderColor: Colors.lastLogValueColor,
    margin: '3%',
  },
  partyGoal: {
    marginStart: horizontalMargins,
    marginBottom: '2%',
    marginTop: 0,
  },
  noGoalsText: {
    fontFamily: 'SFProDisplay-Regular',
    color: Colors.alertColor,
    fontSize: adjustSize(18),
    margin: '3%',
  },
  byWhoTag: {
    borderRadius: adjustSize(20),
    backgroundColor: '#aad326',
    marginStart: '3%',
    paddingHorizontal: '3%',
    paddingVertical: '1%',
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
