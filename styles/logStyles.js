import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from './colors';
import {
    boldFontFamily,
    headerHeight,
    headerTextFontSize,
    horizontalMargins,
    normalTextFontSize,
    regularFontFamily,
    statusBarHeight,
    verticalMarginsBetweenComponent,
} from './variables';
import {adjustSize} from '../commonFunctions/autoResizeFuncs';


const {width, height} = Dimensions.get('window');

const logStyles = StyleSheet.create({
  //added
  menuBarContainer: {
    height: statusBarHeight + headerHeight,
    marginLeft: horizontalMargins,
    marginRight: horizontalMargins,
    marginBottom: verticalMarginsBetweenComponent,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bodyPadding: {
    marginLeft: horizontalMargins,
    marginRight: horizontalMargins,
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  componentMargin: {
    marginTop: verticalMarginsBetweenComponent,
    marginBottom: verticalMarginsBetweenComponent,
  },
  headerText: {
    fontSize: headerTextFontSize,
    fontFamily: boldFontFamily,
  },
  headersubText: {
    fontSize: normalTextFontSize,
    fontFamily: boldFontFamily,
  },
  normalText: {
    fontSize: normalTextFontSize,
    fontFamily: regularFontFamily,
  },
  greyText: {
    fontSize: normalTextFontSize,
    fontFamily: regularFontFamily,
    color: Colors.grey,
  },
  // previous
  logItem: {
    backgroundColor: 'white',
    borderRadius: adjustSize(9.31),
    margin: '3%',
    padding: '6%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8ee',
  },
  complete: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#acacb1',
    fontSize: normalTextFontSize,
    marginStart: '4%',
    marginTop: '3%',
  },
  loglogo: {
    position: 'absolute',
    top: '60%',
    left: '7%',
    width: adjustSize(40),
    height: adjustSize(40),
    resizeMode: 'contain', //resize image so dont cut off
    flex: 1,
  },
  completeIcon: {
    position: 'absolute',
    top: '60%',
    right: '7%',
    width: adjustSize(40),
    height: adjustSize(40),
  },
  //modal content
  modalContainer: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  fieldText: {
    fontSize: normalTextFontSize,
    fontFamily: 'SFProDisplay-Regular',
    color: Colors.grey,
  },
  fieldName: {
    fontSize: normalTextFontSize,
    fontFamily: 'SFProDisplay-Bold',
    color: Colors.grey,
    marginTop: '3%',
  },
  inputField: {
    padding: '2%',
    backgroundColor: 'white',
    borderRadius: adjustSize(9.5),
    borderWidth: 1,
    borderColor: '#e2e8ee',
    fontSize: normalTextFontSize,
    marginTop: '2%',
    marginBottom: '2%',
  },
  //last log
  lastLogSummary: {
    fontSize: adjustSize(18),
    marginStart: horizontalMargins,
    fontFamily: 'SFProDisplay-Regular',
    color: 'white',
  },
  lastLogContainer: {
    backgroundColor: Colors.lastLogButtonColor,
    padding: '3%',
    borderRadius: adjustSize(9.31),
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastLogDetailContainer: {
    width: '100%',
  },
  lastLogDetail: {
    fontSize: normalTextFontSize,
    fontFamily: 'SFProDisplay-Regular',
    color: 'white',
    marginStart: width * 0.04,
  },
  mini_loglogo: {
    width: adjustSize(40),
    height: adjustSize(40),
    resizeMode: 'contain', //resize image so dont cut off
    padding: '3%',
  },
  lastLogDate: {
    fontSize: normalTextFontSize,
    fontFamily: 'SFProDisplay-Bold',
    color: Colors.grey,
    marginStart: horizontalMargins,
    marginTop: height * 0.02,
  },
  lastLogContent: {
    fontSize: normalTextFontSize,
    fontFamily: 'SFProDisplay-Regular',
    color: Colors.grey,
    marginStart: horizontalMargins,
  },
  lastLogBorder: {
    borderWidth: 0.4,
    borderColor: Colors.lastLogValueColor,
    margin: horizontalMargins,
  },
  enableEditButton: {
    backgroundColor: Colors.nextBtnColor,
    height: adjustSize(45),
    width: '90%',
    borderRadius: adjustSize(9.5),
    margin: '5%',
    alignSelf: 'center',
    marginBottom: '15%',
    paddingTop: '3%',
    flex: 1,
  },
  disableEditButton: {
    backgroundColor: '#e4e4e4',
    height: adjustSize(45),
    width: '90%',
    borderRadius: adjustSize(9.5),
    margin: '5%',
    alignSelf: 'center',
    marginBottom: '15%',
    paddingTop: '3%',
    flex: 1,
  },
});

export default logStyles;
