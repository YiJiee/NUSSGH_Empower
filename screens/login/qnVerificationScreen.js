import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
//third party lib
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
//styles
import globalStyles from '../../styles/globalStyles';
import loginStyles, {loginLogoStyle} from '../../styles/loginStyles';
import {Colors} from '../../styles/colors';

import Logo from '../../resources/images/Patient-Icons/SVG/icon-color-empower.svg';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import {verifySecurityAns} from '../../netcalls/requestsSecurityQn';

function QnVerifcationScreen(props) {
  const [qn1, setQn1] = useState('');
  const [qn2, setQn2] = useState('');
  const [qn3, setQn3] = useState('');

  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [ans3, setAns3] = useState('');

  const [chance, setChance] = useState(3);
  const [showChance, setShowChance] = useState(false);

  useEffect(() => {
    let qnList = props.route.params?.qnList;
    let username = props.route.params?.username;
    if (qnList != null && username != null) {
      //selectRandomQn(qnList);
      //console.log('randomising qn list');
      setQn1(qnList[0]);
      setQn2(qnList[1]);
      setQn3(qnList[2]);
    }
  }, []);

  useEffect(() => {
    if (chance === 0) {
      console.log('Account locked');
    }
  }, [chance]);

  const selectRandomQn = (qnList) => {
    let arr = [...qnList];
    let qnArr = arr.sort(() => Math.random() - Math.random()).slice(0, 2);
    setQn1(qnArr[0]);
    setQn2(qnArr[1]);
  };

  const submitAns = () => {
    console.log('submitting ans');
    let obj = [
      {
        answer: ans1,
        question_id: qn1._id,
      },
      {
        answer: ans2,
        question_id: qn2._id,
      },
      {
        answer: ans3,
        question_id: qn3._id,
      },
    ];
    verifySecurityAns(obj, props.route.params?.username).then((rsp) => {
      if (rsp.status === 401) {
        setChance(chance - 1);
        setShowChance(true);
        if (chance <= 0) {
          //call api to send request to administrator*
        }
      } else if (rsp.status === 200) {
        props.navigation.navigate('ResetPasswordScreen', {
          token: rsp?.token,
          selection: rsp?.role,
        });
      } else {
        Alert.alert('Unexpected Error!', 'Please try again later', [
          {text: 'Got It'},
        ]);
      }
    });
  };

  return (
    <LinearGradient
      colors={Colors.loginColorArr}
      useAngle={true}
      angle={240}
      style={loginStyles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={{flex: 1}}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View style={{flex: 1}} />
            <Logo {...loginLogoStyle} />
            <Text style={loginStyles.headerText}>Verification</Text>
            <Text style={loginStyles.subText}>
              To help us verify your identity, please answer your security
              questions:
            </Text>
            <View style={{marginTop: '10%'}}>
              <Text style={styles.qnText}>{qn1?.content}</Text>
              <TextInput
                style={[loginStyles.inputBox, {width: '100%'}]}
                placeholder="Answer"
                onChangeText={setAns1}
                placeholderTextColor={Colors.loginPlaceholder}
                returnKeyType="done"
              />
              <Text style={styles.qnText}>{qn2?.content}</Text>
              <TextInput
                style={[loginStyles.inputBox, {width: '100%'}]}
                placeholder="Answer"
                onChangeText={setAns2}
                placeholderTextColor={Colors.loginPlaceholder}
                returnKeyType="done"
              />
              <Text style={styles.qnText}>{qn3?.content}</Text>
              <TextInput
                style={[loginStyles.inputBox, {width: '100%'}]}
                placeholder="Answer"
                onChangeText={setAns3}
                placeholderTextColor={Colors.loginPlaceholder}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[
                  globalStyles.nextButtonStyle,
                  {backgroundColor: 'white', marginBottom: 0, width: '100%'},
                ]}
                onPress={submitAns}>
                <Text style={globalStyles.actionButtonText}>Next</Text>
              </TouchableOpacity>
              <Text
                style={loginStyles.clickableText}
                onPress={() => props.navigation.goBack()}>
                Back
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>
        </View>
      </KeyboardAvoidingView>

      <TriesModal
        visible={showChance}
        chance={chance}
        close={() => setShowChance(false)}
      />
    </LinearGradient>
  );
}

export default QnVerifcationScreen;

class TriesModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {visible, chance, close} = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={() => close()}
        onBackdropPress={() => close()}>
        <View style={styles.triesModalStyle}>
          {chance > 0 ? (
            <>
              <Text style={[styles.qnText, {color: 'black'}]}>
                Incorrect Answer
              </Text>

              <Text style={[styles.text, {margin: '3%'}]}>
                You have {chance} {chance > 1 ? 'tries' : 'try'} left
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.qnText, {color: 'black'}]}>
                Account Temporarily Locked
              </Text>
              <Text style={[styles.text, {margin: '3%'}]}>
                A request has been sent to the administrator, you will get a
                call within 7 to 14 working days on how to reset your password
              </Text>
            </>
          )}
          <TouchableOpacity
            onPress={() => close()}
            style={[globalStyles.nextButtonStyle, {marginBottom: '3%'}]}>
            <Text style={globalStyles.actionButtonText}>
              {chance != 0 ? 'Continue' : 'Got It'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  qnText: {
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    fontSize: adjustSize(18),
    marginTop: '2%',
  },
  triesModalStyle: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: '3%',
    borderRadius: 15,
  },
  text: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Regular',
    margin: '4%',
  },
});
