import React from 'react';
import {Platform} from 'react-native';
/*
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {notificationPathMapping} from "../../config/AppConfig";
import {appRootNavigation, navigate} from "../../screens/appRoot";

//export const defaultRoute = React.createRef(null);

// This is the notification handler for android devices. To modify the handling of ios notifications, modify the
// AuthorisePusherNotif.js file in ./commonFunctions/. Whenever there is a new notifcation behaviour you want to make,
// both this file and AuthorisePusherNotif needs to make changes because the way ios and android handles notifications
// are different.
// Also note that only the android portion of react-native-push-notification is setup. The ios version is not set up
// because we're using pusher's default react-native package (b8ne) for handling ios notification.
class NotificationHandler {
    // All notification attributes will be present in notification.
    // Access notification data using notification.data
    // This function is called only when the application is running in the background or closed.
    onNotification(notification) {
        console.log('Notification: ', notification);
        let redirect = null;
        if (notification === null || notification === undefined) {
            return ;
        }

        if (notification.data) {
            redirect = notification.data.redirect;
        }

        // I put this in here first because I heard it only works in release / deployed app
        // so it won't work on debug apps built on using xcode. - Hopefully when this gets pushed to
        // test flight, we can get a confirmation if it works.
        if (Platform.OS === 'ios') {
            //console.log('alert: ', notification.data?.aps?.alert);
            redirect = notification.data?.aps?.alert?.userinfo?.redirect;
        }

        // TWO CASES TO HANDLE:
        // 1. APP LAUNCHED FROM START. NAVIGATION HAS NOT BEEN SETUP YET - WE'LL LET APPROOT HANDLE NAVIGATION.
        // 2. APP LAUNCHED FROM BACKGROUND, NAVIGATION HAS ALREADY BEEN SET UP - WE'LL RESTART THE APPLICATION
        if (redirect && notificationPathMapping[redirect]) {
            if (navigate(notificationPathMapping[redirect], null)) {
                // can navigate directly because navigation has been setup.
            } else {
                // navigation not setup yet. we'll wait for app root to navigate - Not needed
                // defaultRoute.current = notificationPathMapping[redirect];
            };
        }

        if (typeof this._onNotification === 'function') {
            this._onNotification(notification);
        }
    }

    onRegister(token) {
        console.log('NotificationHandler:', token);

        if (typeof this._onRegister === 'function') {
            this._onRegister(token);
        }
    }

    onAction(notification) {
        console.log ('Notification action received:');
        console.log(notification.action);
        console.log(notification);

        if(notification.action === 'Yes') {
            PushNotification.invokeApp(notification);
        }
    }

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError(err) {
        console.log(err);
    }

    attachRegister(handler) {
        this._onRegister = handler;
    }

    attachNotification(handler) {
        this._onNotification = handler;
    }
}

const handler = new NotificationHandler();

const configure = (handler) => {
    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: handler.onRegister.bind(handler),

        // (required) Called when a remote or local notification is opened or received
        onNotification: handler.onNotification.bind(handler),

        // (optional) Called when Action is pressed (Android)
        onAction: handler.onAction.bind(handler),

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: handler.onRegistrationError.bind(handler),

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        requestPermissions: true,
    });
}

const testSendNotification = () => {
    PushNotification.localNotificationSchedule({
        title: 'Notification with my name',
        message: 'hello test message here!', // send msg
        aps: {
            alert: {
                userinfo: {
                    redirect: "LOG_NEW"
                },
                body: "Test from local"
            }
        },
        date: new Date(Date.now() + 10 * 1000) // now
    });
}

//testSendNotification()

export {handler, configure};
*/
