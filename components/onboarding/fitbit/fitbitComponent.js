import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Linking,
  Image,
  TouchableOpacity,
} from 'react-native';
// config
import {
  fitbitOAuthUri,
  client_id,
  redirect_uri,
  scope,
} from '../../../config/FitbitConfig';
// third party lib
import InAppBrowser from 'react-native-inappbrowser-reborn';
//function
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
import {getFitbitToken} from '../../../storage/asyncStorageFunctions';
import {AuthoriseFitbit} from '../../../commonFunctions/AuthoriseFitbit';
//others
import {STATUS} from './Status';
import ResponseModal from './ResponseModal';
import {Colors} from '../../../styles/colors';
import FitbitLogo from '../../../resources/images/Patient-Icons/SVG/icon-white-fitbit.svg';

const iconstyle = {
  width: adjustSize(90),
  height: adjustSize(90),
};

const qs = require('qs');

const oAuthUrl =
  fitbitOAuthUri +
  '?' +
  qs.stringify({
    response_type: 'code',
    client_id,
    redirect_uri,
    scope,
    expires_in: '604800',
  });

const FitbitComponent = (props) => {
  const {authorised, setAuthorised} = props;
  const [expand, setExpand] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(STATUS.NOT_STARTED);

  const expandAnimation = React.useRef(new Animated.Value(0));
  React.useEffect(() => {
    let cancelled = false;
    if (expand) {
      Animated.timing(expandAnimation.current, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => !cancelled && setExpand(!expand));
    } else {
      Animated.timing(expandAnimation.current, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => !cancelled && setExpand(!expand));
    }
    return () => {
      cancelled = true;
    };
  }, [expand]);

  useEffect(() => {
    if (typeof setAuthorised === 'function') {
      setModalVisible(false);
    }
    if (!authorised.current) {
      setTimeout(() => {
        getFitbitToken().then((resp) => {
          if (resp) {
            authorised.current = true;
            if (typeof setAuthorised === 'function') {
              setModalVisible(false);
              setAuthorised(true);
            }
          }
        });
      }, 500);
    }
  }, [authorised, processingStatus]);

  const scale = expandAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1], // Grows from 80% size to 100% size
  });

  const handleOpenFitbitOAuthUrl = async () => {
    try {
      if (await InAppBrowser.isAvailable()) {
        setProcessingStatus(STATUS.IN_PROGRESS);
        setModalVisible(true);
        InAppBrowser.openAuth(oAuthUrl, redirect_uri, {
          // iOS Properties
          ephemeralWebSession: false,
          // Android Properties
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        }).then((response) => {
          if (response.type === 'success' && response.url) {
            AuthoriseFitbit(response.url).then((resp) => {
              if (resp) {
                authorised.current = true;
                setProcessingStatus(STATUS.FINISHED_SUCCESSFULLY);
              } else {
                setProcessingStatus(STATUS.ERROR);
              }
            });
            //Linking.openURL(response.url);
          } else if (
            response.type === 'dismiss' ||
            response.type === 'cancel'
          ) {
            // Cancel loading
            setProcessingStatus(STATUS.CANCELLED);
          }
        });
      } else {
        await Linking.openURL(oAuthUrl);
      }
    } catch (error) {
      await Linking.openURL(oAuthUrl);
    }
  };

  const handleCloseModal = () => {
    setProcessingStatus(STATUS.NOT_STARTED);
    setModalVisible(false);
  };

  return (
    <>
      {authorised.current ? (
        <View style={{padding: adjustSize(15)}}>
          <Text style={styles.fitbitDoneMainText}>Done!</Text>
          <Text style={styles.fitbitDoneSubText}>You are all set</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={handleOpenFitbitOAuthUrl}>
          <View
            style={[styles.fitbitRedirectButton, {marginTop: adjustSize(50)}]}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                fontSize: adjustSize(20),
              }}>
              Continue with
            </Text>
            <Animated.View
              style={[
                styles.fitbitIconStyle,
                {transform: [{scale}], justifyContent: 'center'},
              ]}>
              <FitbitLogo {...iconstyle} />
            </Animated.View>
          </View>
        </TouchableOpacity>
      )}
      <ResponseModal
        visible={modalVisible}
        closeModal={handleCloseModal}
        status={processingStatus}
      />
    </>
  );
};

export default FitbitComponent;

const styles = StyleSheet.create({
  remainingContainer: {
    flex: 1,
  },
  fitbitIconStyle: {
    width: adjustSize(50),
    height: adjustSize(50),
    margin: adjustSize(5),
  },
  fitbitPromptContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fitbitPromptText: {
    fontSize: adjustSize(24),
    fontWeight: 'bold',
    paddingBottom: adjustSize(50),
  },
  fitbitDoneMainText: {
    fontSize: adjustSize(24),
    fontWeight: 'bold',
  },
  fitbitDoneSubText: {
    fontSize: adjustSize(20),
  },
  fitbitRedirectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: adjustSize(15),
    backgroundColor: '#4FACB6',
    borderRadius: adjustSize(15),
    justifyContent: 'center',
  },
});
