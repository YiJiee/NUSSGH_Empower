import {StyleSheet} from 'react-native';
import {Colors} from './colors';
import {adjustSize} from '../commonFunctions/autoResizeFuncs';

export const loginLogoStyle = {
  height: adjustSize(100),
  width: '20%',
};

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#0D8b43',
    paddingStart: '6%',
    paddingEnd: '6%',
    justifyContent: 'center',
  },
  logoStyle: {
    width: '20%',
    height: adjustSize(100),
    marginBottom: adjustSize(10),
    borderRadius: adjustSize(20),
  },
  headerText: {
    fontSize: adjustSize(30),
    color: 'white',
    fontFamily: 'SFProDisplay-Bold',
  },
  subText: {
    fontSize: adjustSize(18),
    color: 'white',
    fontFamily: 'SFProDisplay-Regular',
  },
  inputBox: {
    width: '90%',
    fontSize: adjustSize(18),
    height: adjustSize(50),
    borderRadius: adjustSize(15),
    backgroundColor: '#12683E',
    paddingStart: adjustSize(30), //position placeholder text
    marginVertical: adjustSize(5),
    alignSelf: 'center',
    color: 'white',
  },
  clickableText: {
    margin: '4%',
    color: 'white',
    textAlign: 'center',
    fontSize: adjustSize(17),
  },
});

export default loginStyles;
