import React from 'react';
import {Platform} from 'react-native';
import RNPusherPushNotifications from 'react-native-pusher-push-notifications';
import {notificationPathMapping} from '../config/AppConfig';
import {defaultRoute} from '../components/notification/PushNotifHandler';

const donutsInterest = 'debug-donuts';

function initPusherNotif(username, pusherToken) {
  // Disable notification for 0.1.1

  const PUSHER_INSTANCE_ID = 'c7a6e2ea-9db6-4035-ad44-cbf8e6f23bd8';

  RNPusherPushNotifications.setInstanceId(PUSHER_INSTANCE_ID);

  RNPusherPushNotifications.setUserId(
    username,
    pusherToken,
    (statusCode, resp) => console.log('Error occurred while setting user id'),
    () => {
      console.log('Registration success!')
    },
  );

  subscribe(donutsInterest);

  console.log("Successfully registered pusher notifications");
  // RNPusherPushNotifications.on('notification', handleNotification);
  /*
  RNPusherPushNotifications.getSubscriptions(
    (sub) => console.log('Get sub', sub),
    (e) => console.log(e),
  );*/
}

// This is the notification handler for ios devices. To modify the handling of android notifications, modify the
// PushNotifHandler.js file in ./components/notification/. Whenever there is a new notifcation behaviour you want to make,
// both this file and PushNotifHandler needs to make changes because the way ios and android handles notifications
// are different.
const handleNotification = (notification) => {
  // console.log(notification);

  // iOS app specific handling
  if (Platform.OS === 'ios') {
    switch (notification.appState) {
      case 'inactive':
      // inactive: App came in foreground by clicking on notification.
      //           Use notification.userInfo for redirecting to specific view controller
      if (notification.userInfo) {
        if (notification.userInfo.redirect && notificationPathMapping[notification.redirect]) {
          defaultRoute.current = notificationPathMapping[notification.redirect];
        }
      }
      case 'background':
      // background: App is in background and notification is received.
      //             You can fetch required data here don't do anything with UI
      case 'active':
        // App is foreground and notification is received. Show a alert or something.

      default:
        break;
    }
  } else {
    // console.log('android handled notification...'); // Will never be called if app fires from background
  }
};

// Subscribe to an interest
const subscribe = (interest) => {
  // Note that only Android devices will respond to success/error callbacks
  RNPusherPushNotifications.subscribe(
    interest,
    (statusCode, response) => {
      console.error(statusCode, response);
    },
    () => {
      // console.log('Success subscribing interest');
    },
  );
};

// Unsubscribe from an interest
const unsubscribe = (interest) => {
  RNPusherPushNotifications.unsubscribe(
    interest,
    (statusCode, response) => {
      console.tron.logImportant(statusCode, response);
    },
    () => {
      console.tron.logImportant('Success');
    },
  );
};

const clearPushNotifState = () => {
    RNPusherPushNotifications.clearAllState();
}

export {initPusherNotif, clearPushNotifState};
