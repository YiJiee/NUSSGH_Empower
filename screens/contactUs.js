import React, {useState} from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
//style
import globalStyles from '../styles/globalStyles';
import {Colors} from '../styles/colors';
//component
import LeftArrowBtn from '../components/logs/leftArrowBtn';
import Tick from '../components/tick';

const forget_login = 'Forget Login Credential';
const phone_change = 'Request Phone Number Change';
const lost = 'Lost Phone';
const btnList = [forget_login, phone_change, lost];
const emailRgx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ContactUs = (props) => {
  const [selectedType, setSelectedType] = useState(forget_login);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setError] = useState();

  const submit = () => {
    Alert.alert(
      'Enquiry Sent successfully',
      'Please give us a few working days to get back to you!',
      [{text: 'Got It', onPress: () => props.navigation.navigate('Login')}],
    );
  };

  return (
    <View style={globalStyles.pageContainer}>
      <View style={globalStyles.menuBarContainer}>
        <LeftArrowBtn close={() => props.navigation.goBack()} />
      </View>
      <Text style={globalStyles.pageHeader}>Contact Us</Text>
      <Text style={globalStyles.pageSubDetails}>
        Please submit the form and we will get back to you soon!
      </Text>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.inner}>
          <TextInput
            style={[globalStyles.editInputBox, {margin: 0}]}
            placeholder="Email"
            placeholderTextColor="#a1a3a0"
            onChangeText={setEmail}
          />
          {!emailRgx.test(email) && email !== '' && (
            <Text style={[globalStyles.alertText, {marginBottom: '2%'}]}>
              Please input a valid email address
            </Text>
          )}
          <TextInput
            style={[
              globalStyles.editInputBox,
              {margin: 0, paddingBottom: '10%', paddingTop: '3%'},
            ]}
            placeholder="Description"
            placeholderTextColor="#a1a3a0"
            onChangeText={setDescription}
            multiline
          />
          <Text style={[globalStyles.pageSubDetails, styles.header]}>
            Select reason for enquiry:
          </Text>
          {btnList.map((item, index) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => setSelectedType(item)}
              key={index}>
              {selectedType === item ? (
                <Tick selected={true} />
              ) : (
                <Tick selected={false} />
              )}
              <Text style={[globalStyles.pageSubDetails, {marginTop: '1%'}]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAvoidingView>

      <View style={globalStyles.buttonContainer}>
        {description.length !== 0 && emailRgx.test(email) ? (
          <TouchableOpacity
            style={globalStyles.submitButtonStyle}
            onPress={() => submit()}>
            <Text style={globalStyles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={globalStyles.skipButtonStyle}>
            <Text style={globalStyles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  inner: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    padding: '3%',
  },
  option: {
    flexDirection: 'row',
  },
  header: {
    marginStart: 0,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '3%',
  },
});
