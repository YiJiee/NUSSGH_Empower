import React, {useEffect, useState, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
//component
import MenuBtn from '../../components/menuBtn';
import HeaderCard from '../../components/home/headerCard';
//styles
import globalStyles from '../../styles/globalStyles';
import {Colors} from '../../styles/colors';
//function
import {checkLogDone} from '../../commonFunctions/logFunctions';
import {getGreetingFromHour} from '../../commonFunctions/common';
import DailyCollapse from '../../components/home/collapsible/dailyCollapse';
import {getCaregiverProfile} from '../../netcalls/requestsAccount';
import AssignedPatientCollapse from '../../components/home/collapsible/assignedPatientCollapse';
import PatientType from '../../components/home/collapsible/patientTypeCollapse';
import PatientInfo from '../../components/home/collapsible/patientInfo';
import {
  getAuthorisedStatusCaregiver,
  storeAuthorisedStatusCaregiver,
  storePermissions,
} from '../../storage/asyncStorageFunctions';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import AuthorisationCaregiver from '../../components/home/authorisationCaregiver';
import {getPendingReq} from '../../netcalls/requestsMyCaregiver';

const HomeScreenCaregiver = (props) => {
  const [caregiver, setCaregiver] = useState({});
  const [patient, setPatient] = useState({});
  const [patientTypes, setPatientType] = useState({});
  const [currHour, setCurrHour] = useState(new Date().getHours());
  const [uncompleteLogs, setUncompleteLogs] = useState([]);

  const [authorise, setAuthorise] = useState(false);
  const [pendingReq, setPendingReq] = useState({});

  //animation
  const slideRightAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    //determine whether authorised
    getAuthorisedStatusCaregiver().then((rsp) => {
      setAuthorise(rsp);
    });
  }, []);

  useEffect(() => {
    //slide right when enter screen
    props.navigation.addListener('focus', () => {
      slideRightAnimation.setValue(0);
      Animated.timing(slideRightAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [props.navigation]);

  const widthInterpolate = slideRightAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').width, 0],
    extrapolate: 'clamp',
  });

  //init
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      initCaregiver().then(() => {});

      checkLogDone(getGreetingFromHour(currHour))
        .then((response) => {
          if (response != null) {
            setUncompleteLogs(response.notCompleted);
          }
        })
        .catch((err) => console.log(err));
    });
  }, []);

  const initCaregiver = async () => {
    let data = await getCaregiverProfile();
    setCaregiver(data?.caregiver);
    await storePermissions(data?.caregiver?.permissions);

    if (data?.patient === null) {
      await storeAuthorisedStatusCaregiver(false);
      setAuthorise(false);
      //check if there is any pending req
      let obj = await getPendingReq();
      if (obj?.status === 200) {
        setPendingReq(obj?.response);
      } else {
        setPendingReq({});
        setTimeout(initCaregiver, 5000);
      }
    } else {
      setPatient(data?.patient);
      setPatientType(data?.patient_type);
      await storeAuthorisedStatusCaregiver(true);
      setAuthorise(true);
    }
  };

  const toDoAfterOTP = () => {
    console.log('reininting caregiver check');
    initCaregiver().then(() => {});
  };

  return (
    <View style={globalStyles.pageContainer}>
      <Animated.View
        style={[
          globalStyles.pageContainer,
          {
            backgroundColor: '#F5F6F9',
            transform: [{translateX: widthInterpolate}],
          },
        ]}>
        <View style={globalStyles.menuBarContainer}>
          <MenuBtn green={false} />
        </View>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: Colors.backgroundColor,
          }}>
          {/* Greetings and log to do*/}
          <HeaderCard
            username={caregiver?.first_name}
            hour={getGreetingFromHour(currHour)}
          />

          <View style={{backgroundColor: 'transparent'}}>
            {authorise ? (
              <>
                <AssignedPatientCollapse
                  patient={patient}
                  setPatient={setPatient}
                />
                <DailyCollapse
                  patient={patient}
                  uncompleteLogs={uncompleteLogs}
                  hour={getGreetingFromHour(currHour)}
                />
                <PatientType patientTypes={patientTypes} />
                <PatientInfo patient={patient} />
              </>
            ) : (
              <AuthorisationCaregiver
                toDoAfterOTP={toDoAfterOTP}
                pendingReq={pendingReq}
              />
            )}
          </View>

          {/* Diary overview of weight, blood glucose, food, medication and physical activity */}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingText: {
    color: 'black',
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
  },
  taskText: {
    fontFamily: 'SFProDisplay-Regular',
    color: 'white',
    marginStart: '5%',
    fontSize: adjustSize(18),
  },
  bold: {
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    marginStart: '5%',
    fontSize: adjustSize(18),
  },
  logCard: {
    backgroundColor: 'white',
    borderRadius: adjustSize(9.5),
    marginTop: '3%',
    marginStart: '5%',
    marginEnd: '5%',
    padding: '3%',
  },
  logLogo: {
    marginEnd: '3%',
    marginStart: '5%',
    marginTop: '3%',
  },
  usernameText: {
    color: 'white',
    fontSize: adjustSize(40),
    fontFamily: 'SFProDisplay-Bold',
    marginStart: '5%',
  },
  buttonStyle: {
    backgroundColor: '#aad326',
    padding: '2%',
    borderRadius: adjustSize(20),
    margin: '4%',
  },
  buttonText: {
    fontSize: adjustSize(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  chevron: {
    marginTop: '5%',
    color: Colors.lastLogValueColor,
  },
});

export default HomeScreenCaregiver;
//edit flag
