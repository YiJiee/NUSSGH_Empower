import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  maxSteps,
  maxCalBurnt,
} from '../../../commonFunctions/diaryFunctions';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import ProgressContent from './progressContent';
//third party library
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
//styles
import { Colors } from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
import diaryStyles from '../../../styles/diaryStyles';
import logStyles from '../../../styles/logStyles';
import { adjustSize } from '../../../commonFunctions/autoResizeFuncs';
//svg	import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
import HEARTRATE from '../../../resources/images/Patient-Icons/SVG/icon-navy-heartrate.svg';
import DISTANCE from '../../../resources/images/Patient-Icons/SVG/icon-navy-distance.svg';
import CALBURNT from '../../../resources/images/Patient-Icons/SVG/icon-navy-calburnt.svg';
import STEPS from '../../../resources/images/Patient-Icons/SVG/icon-navy-steps.svg';
import EXERCISE from '../../../resources/images/Patient-Icons/SVG/icon-navy-activemins.svg';
import { step_key } from '../../../commonFunctions/logFunctions';
import ProgressContent2 from './progressContent2';

const heartRate = 'heartrate';
const distance_key = 'distance';
const caloriesBurnt = 'Calories Burnt';
const steps_taken = 'Steps Taken';
const excerise = 'Exercise';

const iconStyle = {
  width: adjustSize(35),
  height: adjustSize(35),
  margin: '2%',
};

const ActivityBlock = (props) => {
  const {
    visible,
    activityLogs,
    pass,
    summary,
    miss,
    day,
    activityTarget,
  } = props;
  const { closeModal } = props;
  const distance = summary.distance + ' KM';
  const [expand, setExpand] = useState(true);
  const scrollViewRef = useRef();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setDuration(activityTarget.value);
  }, []);

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      backdropOpacity={1}
      onBackButtonPress={() => closeModal()}
      backdropColor={Colors.backgroundColor}
      style={{ margin: 0 }}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={closeModal} />
        </View>
        <Text style={globalStyles.pageHeader}>Activity</Text>
        <Text style={globalStyles.pageDetails}>{day}</Text>
        <View style={{ flexDirection: 'row', marginTop: '3%' }}>
          {miss ? (
            <Text style={globalStyles.pageDetails}>Missed</Text>
          ) : pass ? (
            <>
              <Text style={globalStyles.pageDetails}>
                {summary.duration} Mins Active
              </Text>
              <Ionicon
                name="checkmark"
                style={diaryStyles.passIcon}
                size={adjustSize(25)}
              />
            </>
          ) : (
                <>
                  <Text style={globalStyles.pageDetails}>
                    {summary.duration} Mins Active
              </Text>
                  <Ionicon
                    name="alert-circle-outline"
                    style={diaryStyles.failIcon}
                    size={adjustSize(25)}
                  />
                </>
              )}
        </View>
        <Text style={styles.header}>Summary</Text>
        <View style={styles.border} />
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }>
          {renderSummaryContent(distance_key, distance, 'Distance')}
          {renderSummaryContent(caloriesBurnt, caloriesBurnt, summary)}
          {renderSummaryContent(step_key, steps_taken, summary)}
          {renderSummaryContent(
            excerise,
            excerise,
            summary,
            expand,
            setExpand,
            duration,
          )}

          {!expand && (
            <View
              style={{
                marginStart: '14%',
                marginEnd: '6%',
                marginBottom: '20%',
              }}>
              {activityLogs.map((item, index) => (
                <>
                  <View style={styles.activityBlock} key={index}>
                    <Text style={styles.content}>{item.name}</Text>
                    <Text
                      style={[
                        styles.contentDetail,
                        { alignSelf: 'flex-end', marginStart: 0 },
                      ]}>
                      {item.duration} Mins
                    </Text>
                  </View>
                  <View style={logStyles.lastLogBorder} />
                </>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

function renderSummaryContent(
  type,
  content,
  detail,
  expand,
  setExpand,
  duration,
) {
  return (
    <>
      <View style={{ margin: '3%', flexDirection: 'row' }}>
        {type === excerise && <EXERCISE {...iconStyle} />}
        {type === distance_key && <DISTANCE {...iconStyle} />}
        {type === caloriesBurnt && <CALBURNT {...iconStyle} />}
        {type === step_key && <STEPS {...iconStyle} />}
        <View style={{ marginStart: '2%' }}>
          {content === steps_taken ? (
            <ProgressContent2
              value={detail.steps}
              target={maxSteps}
              flip={true}
              details={steps_taken}
              small={false}
            />
          ) : content === excerise ? (
            <ProgressContent2
              value={detail.duration}
              target={duration}
              flip={true}
              details={'Active'}
              targetUnit={'Mins'}
              clickable={expand}
              chevronDownMethod={setExpand}
              small={false}
            />
          ) : content === caloriesBurnt ? (
            <ProgressContent2
              value={detail.calories}
              target={maxCalBurnt}
              flip={true}
              details={caloriesBurnt}
              small={false}
            />
          ) : (
                  <>
                    <Text style={styles.content}>{content}</Text>
                    <Text style={styles.contentDetail}>{detail}</Text>
                  </>
                )}
        </View>
      </View>
      <View style={styles.detailBorder} />
    </>
  );
}

export default ActivityBlock;

const styles = StyleSheet.create({
  header: {
    fontFamily: 'SFProDisplay-Bold',
    color: Colors.lastLogValueColor,
    fontSize: adjustSize(20),
    marginTop: '7%',
    marginStart: '5%',
  },
  content: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(18),
    marginTop: '7%',
    marginStart: '5%',
    flex: 1,
  },
  contentDetail: {
    fontFamily: 'SFProDisplay-Bold',
    color: Colors.lastLogValueColor,
    fontSize: adjustSize(17),
    marginTop: '7%',
    marginStart: '5%',
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.lastLogValueColor,
    margin: '3%',
  },
  detailBorder: {
    borderWidth: 0.5,
    borderColor: Colors.lastLogValueColor,
    margin: '3%',
  },
  iconImg2: {
    height: adjustSize(50),
    width: adjustSize(50),
  },
  iconImg: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    width: adjustSize(30),
    height: adjustSize(30),
    resizeMode: 'contain', //resize image so dont cut off
  },
  activityBlock: {
    flexDirection: 'row',
    flex: 1,
  },
});

//comment
