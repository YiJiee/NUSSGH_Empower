import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
//third party lib
import Octicon from 'react-native-vector-icons/Octicons';

import ALERT from '../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-navy-footer-alert.svg';
import ALERT_FOCUSED from '../resources/images/Caregiver-Additional-Icons/SVG/cg-icon-green-footer-alert.svg';
import {adjustSize} from '../commonFunctions/autoResizeFuncs';


const iconstyle = {
  width: adjustSize(30),
  height: adjustSize(30),
};

const AlertNotifIcon = (props) => {
  const {focused, showBadge} = props;
  const [count, setCount] = useState(0);
  const [read, setRead] = useState(false);

  return focused ? (
    <>
      <ALERT_FOCUSED {...iconstyle} />
      {showBadge && (
        <Octicon
          name="primitive-dot"
          color={'red'}
          style={{alignSelf: 'center'}}
          style={styles.dotStyle}
          size={20}
        />
      )}
    </>
  ) : (
    <>
      <ALERT {...iconstyle} />
      {showBadge && (
        <Octicon
          name="primitive-dot"
          color={'red'}
          style={{alignSelf: 'center'}}
          style={styles.dotStyle}
          size={20}
        />
      )}
    </>
  );
};

export default AlertNotifIcon;

const styles = StyleSheet.create({
  dotStyle: {
    position: 'absolute',
    right: '35%',
    top: '6%',
  },
});
