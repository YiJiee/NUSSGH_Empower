import React, {useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party libs
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//styles
import logStyles from '../../styles/logStyles';
import AboutDateSelection from './aboutDateSelection';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const DateSelectionBlock = (props) => {
  const {initialDate} = props;

  console.log(
    'Initial Date ' + Moment(initialDate).format('DD-MM-YYYY HH:mm:ss'),
  );

  const [visible, setVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [showInfo, setShowInfo] = useState(false);

  const heightInterpolate = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 225], //I don't know how to get the height of the datepicker but 225 seems to fit it just nice.
    extrapolate: 'clamp',
  });

  const handleOpenCloseWithAnimation = (currentVisibility) => {
    if (currentVisibility) {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300, // 300ms slide up animation when visible is set false.
        useNativeDriver: false,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300, // 300ms slide down animation when visible is set true.
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <>
      <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
        <Text style={[logStyles.fieldName, {flex: 1}]}>Record Date Time:</Text>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={() => setShowInfo(true)}>
          <Icon name="information-outline" size={adjustSize(25)} color={'#aad326'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleOpenCloseWithAnimation(visible)}>
        <Text
          style={logStyles.inputField}
          editable={false}
          placeholderTextColor="#a1a3a0">
          {Moment(props.date).format('MMMM Do YYYY, h:mm a')}
        </Text>
      </TouchableOpacity>
      {visible && (
        <Animated.View
          style={[
            styles.slideAnimationWrapperForDatePicker,
            {height: heightInterpolate},
          ]}>
          <DatePicker
            visible={visible}
            date={props.date}
            onDateChange={props.setDate}
            minimumDate={Moment(initialDate).subtract(1, 'days').toDate()}
            maximumDate={Moment(initialDate).add(10, 'minutes').toDate()}
            mode="datetime"
          />
        </Animated.View>
      )}
      {showInfo && (
        <AboutDateSelection
          visible={showInfo}
          closeModal={() => setShowInfo(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  slideAnimationWrapperForDatePicker: {
    overflow: 'hidden',
    marginStart: '4%',
    marginEnd: '4%',
  },
});

export default DateSelectionBlock;
