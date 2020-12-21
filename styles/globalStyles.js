import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from './colors';
import {
    headerHeight,
    headerTextFontSize,
    horizontalMargins,
    normalTextFontSize,
    statusBarHeight,
    verticalMarginsBetweenComponent,
} from './variables';
import {adjustSize} from '../commonFunctions/autoResizeFuncs';

const globalStyles = StyleSheet.create({
  //added from ui / ux change
  alertText: {
    //tweak
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Regular',
    color: Colors.alertColor,
  },
  buttonContainer: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -adjustSize(10)},
    shadowOpacity: 0.15,
    shadowRadius: adjustSize(6),
    elevation: adjustSize(30),
    paddingBottom: '10%',
    height: adjustSize(120),
    margin: 0,
    alignSelf: 'flex-end',
    width: Dimensions.get('window').width,
  },
  crossIcon: {
    color: Colors.crossColor,
  },
  chevronDown: {
    color: Colors.backArrowColor,
  },
  leftArrowBack: {
    color: Colors.leftArrowColor,
  },
  nextButtonStyle: {
    backgroundColor: Colors.nextBtnColor,
    height: adjustSize(45),
    width: '90%',
    borderRadius: adjustSize(9.5),
    margin: '5%',
    alignSelf: 'center',
    marginBottom: '15%',
    justifyContent: 'center',
  },
  submitButtonStyle: {
    backgroundColor: Colors.submitBtnColor,
    height: adjustSize(45),
    width: '90%',
    borderRadius: adjustSize(9.5),
    margin: '5%',
    alignSelf: 'center',
    marginBottom: '15%',
    paddingTop: '3%',
  },
  skipButtonStyle: {
    backgroundColor: '#e4e4e4',
    height: adjustSize(45),
    width: '90%',
    borderRadius: adjustSize(9.5),
    margin: '5%',
    alignSelf: 'center',
    marginBottom: '15%',
    paddingTop: '3%',
  },
  actionButtonText: {
    fontSize: adjustSize(19),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pageHeader: {
    fontSize: headerTextFontSize,
    paddingTop: '2%',
    marginBottom: '1%',
    fontFamily: 'SFProDisplay-Bold',
    marginStart: horizontalMargins,
    marginEnd: horizontalMargins,
  },
  pageDetails: {
    fontSize: normalTextFontSize,
    fontWeight: '800',
    marginStart: horizontalMargins,
    marginEnd: horizontalMargins,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: '2%',
  },
  greyPageDetails: {
    fontSize: normalTextFontSize,
    fontWeight: '800',
    marginStart: horizontalMargins,
    marginEnd: horizontalMargins,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: '2%',
    color: Colors.lastLogValueColor,
  },
  pageSubDetails: {
    fontSize: normalTextFontSize,
    marginStart: horizontalMargins,
    marginEnd: horizontalMargins,
    fontFamily: 'SFProDisplay-Regular',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  menuBarContainer: {
    height: statusBarHeight + headerHeight,
    marginLeft: horizontalMargins,
    marginRight: horizontalMargins,
    marginBottom: verticalMarginsBetweenComponent,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  //edit pages
  editPageContainer: {
    flex: 1,
    backgroundColor: Colors.editBackgroundColor,
  },
  editInputBox: {
    fontSize: adjustSize(18),
    marginBottom: '2%',
    backgroundColor: 'white',
    padding: '3%',
    margin: '4%',
    borderRadius: adjustSize(9.5),
    borderWidth: 0.5,
    borderColor: Colors.inputBorderColor,
  },
  //goal
  goalFieldName: {
    color: Colors.lastLogValueColor,
    marginStart: '4%',
    fontSize: normalTextFontSize,
    fontFamily: 'SFProDisplay-Bold',
    marginTop: '3%',
  },
  goalFieldBottomBorder: {
    borderBottomColor: '#e1e7ed',
    borderBottomWidth: 1,
    paddingBottom: '2%',
  },
  //delete modal
  deleteDetails: {
    fontSize: adjustSize(16),
    margin: '4%',
  },
  deleteButton: {
    backgroundColor: '#ff0844',
    height: adjustSize(45),
    width: '70%',
    alignSelf: 'center',
    borderRadius: adjustSize(15),
    margin: '4%',
  },
  deleteButtonText: {
    fontSize: adjustSize(20),
    textAlign: 'center',
    marginVertical: '3%',
    fontWeight: '500',
    color: 'white',
  },
  subOptionText: {
    fontSize: adjustSize(20),
    textAlign: 'center',
    color: '#ff0844',
    marginBottom: '3%',
  },
  pageIcon: {
    paddingTop: '2%',
    marginBottom: '1%',
    marginStart: horizontalMargins,
    marginEnd: horizontalMargins,
  },
  //medicationItem
  medContainer: {
    backgroundColor: 'white',
    borderRadius: adjustSize(20),
    borderColor: '#e1e7ed',
    borderWidth: 1,
    padding: '3%',
    marginTop: '3%',
    flexDirection: 'row',
  },
  //mycaregiver
  row: {
    backgroundColor: 'white',
    borderRadius: adjustSize(9.5),
    borderWidth: 1,
    borderColor: '#e3e8ee',
    padding: '3%',
    margin: '3%',
  },
  field: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(19),
    marginStart: '3%',
    alignSelf: 'center',
    flex: 1,
  },
});

export default globalStyles;
