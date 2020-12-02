import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
//component
import Clickable from '../../components/account/clickable';
//style
import globalStyles from '../../styles/globalStyles';
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
//third party lib
import Ant from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {Colors} from '../../styles/colors';
import {
  getPatientProfile,
  getCaregiverProfile,
} from '../../netcalls/requestsAccount';

import USER_MALE from '../../resources/images/Patient-Icons/SVG/user-male.svg';
import USER_FEMALE from '../../resources/images/Patient-Icons/SVG/user-female.svg';
import {getRole} from '../../storage/asyncStorageFunctions';
import {role_patient} from '../../commonFunctions/common';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import {getSecurityQnByUsername} from '../../netcalls/requestsSecurityQn';
import {getDateObj} from '../../commonFunctions/diaryFunctions';

const iconStyle = {
  height: adjustSize(200),
  width: adjustSize(200),
  alignSelf: 'center',
  marginBottom: '3%',
  marginTop: '3%',
};

const AccountDetailScreen = (props) => {
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState({});
  const [role, setRole] = useState('');
  const [qns, setQns] = useState([]);

  useEffect(() => {
    init().then();
  }, []);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      if (username.length != 0) {
        getSecurityQnByUsername(username).then((rsp) => {
          if (rsp.status === 200) {
            setQns(rsp?.qnList);
          }
        });
      }
    });
  }, [username]);

  const init = async () => {
    let role = await getRole();
    setRole(role);
    if (role === role_patient) {
      getPatientProfile().then((response) => {
        if (response != null) {
          let data = response.patient;
          setUser(data);
          setUsername(data.username);
          let nameString = data.first_name;
          setName(nameString);
          setPhoneNumber(data.contact_number);
          setSecurityQn(data.username);
        }
      });
    } else {
      getCaregiverProfile().then((response) => {
        if (response != null) {
          let caregiver = response.caregiver;
          setUser(caregiver);
          setUsername(caregiver.username);
          let nameString = caregiver.first_name;
          setName(nameString);
          setPhoneNumber(caregiver.contact_number);
          setSecurityQn(caregiver.username);
        }
      });
    }
  };

  const setSecurityQn = (username) => {
    getSecurityQnByUsername(username).then((rsp) => {
      if (rsp.status === 200) {
        setQns(rsp?.qnList);
      }
    });
  };

  return (
    <View style={[globalStyles.pageContainer]}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={() => props.navigation.navigate('Home')} />
      </View>
      <Text style={globalStyles.pageHeader}>Edit Account</Text>
      <ScrollView contentContainerStyle={{...props.style}}>
        {user?.gender === 'female' ? (
          <USER_FEMALE {...iconStyle} />
        ) : (
          <USER_MALE {...iconStyle} />
        )}
        <View style={{flexDirection: 'row', margin: '2%'}}>
          <Ant
            name="user"
            size={adjustSize(30)}
            color={Colors.lastLogValueColor}
          />
          <Text style={styles.sectionHeading}>Account Details</Text>
        </View>
        <Clickable
          heading={'Username'}
          content={username}
          click={false}
          usernameModalVisible={usernameModalVisible}
          openModal={() => setUsernameModalVisible(true)}
          closeModal={() => {
            setUsernameModalVisible(false);
          }}
        />
        <Clickable
          heading={'Name'}
          content={name}
          click={true}
          nameModalVisible={nameModalVisible}
          openModal={() => setNameModalVisible(true)}
          closeModal={() => {
            setNameModalVisible(false);
            init();
          }}
          user={user}
        />
        {/*
        <Clickable
          heading={'Phone Number'}
          content={phoneNumber}
          click={true}
          phoneModalVisible={phoneModalVisible}
          openModal={() => setPhoneModalVisible(true)}
          closeModal={() => {
            setPhoneModalVisible(false);
            init();
          }}
          user={user}
        />
        */}
        <Clickable
          heading={'Change Password'}
          content={''}
          click={true}
          modalVisible={passwordModalVisible}
          openModal={() => setPasswordModalVisible(true)}
          closeModal={() => setPasswordModalVisible(false)}
        />
        {/*
        <Clickable
          heading="Security Qns [Onboard]"
          content=""
          click={true}
          openModal={() =>
            props.navigation.navigate('SecurityQnSetUp', {type: 'add'})
          }
          closeModal={() => {}}
          modalVisible={false}
        />
        
        <Clickable
          heading="Medication Plan"
          content=""
          click={true}
          openModal={() => props.navigation.navigate('MedicationPlan')}
          closeModal={() => {}}
          modalVisible={false}
        />
        */}
        <Clickable
          heading="Security Questions"
          content={
            qns.length != 0
              ? 'Last Updated ' +
                moment(getDateObj(qns[0]?.updated_at)).format('DD MMM YYYY')
              : '-'
          }
          click={true}
          openModal={() =>
            props.navigation.navigate('SecurityQnSetUp', {
              type: 'edit',
              qns: qns,
            })
          }
          closeModal={() => {}}
          modalVisible={false}
        />

        {role === role_patient && (
          <>
            <View style={{flexDirection: 'row', margin: '2%'}}>
              <Entypo
                name="link"
                size={adjustSize(30)}
                color={Colors.lastLogValueColor}
              />
              <Text style={styles.sectionHeading}>External Account</Text>
            </View>
            <Clickable
              heading="Setup Fitbit"
              content=""
              click={true}
              openModal={() => props.navigation.navigate('FitbitSetup')}
              closeModal={() => {}}
              modalVisible={false}
            />

            <View style={{flex: 3}} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImg: {
    width: adjustSize(150),
    height: adjustSize(150),
    padding: '2%',
    borderRadius: adjustSize(150) / 2,
    borderWidth: adjustSize(4),
    borderColor: '#AAD326',
    marginTop: '7%',
    alignSelf: 'center',
  },
  sectionHeading: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(19),
    color: Colors.lastLogValueColor,
    marginTop: '2%',
    marginStart: '2%',
  },
});

export default AccountDetailScreen;
//edit flag
