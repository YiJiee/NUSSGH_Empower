import React from 'react';
import {View} from 'react-native';
//third party libs
import {connect} from 'react-redux';
//functions
import {mapDispatchToProps, mapStateToProps} from '../../redux/reduxMapping';
import {storeRole, storeToken} from '../../storage/asyncStorageFunctions';
import {clearPushNotifState} from '../../commonFunctions/AuthorisePusherNotif';

const Logout = (props) => {
  storeToken('');
  clearPushNotifState(); // Remove user from receiving notifications
  props.logout();
  storeRole('');
  return <View></View>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
