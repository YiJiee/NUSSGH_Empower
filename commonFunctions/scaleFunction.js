import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');

const scale = width / 320; // based on iphone 5s's scale

const scaleFont = (fontSize) => {
  let newSize = fontSize * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const widthPercent2Dp = (value) => {
  let widthpercent = parseFloat(value);
  return PixelRatio.roundToNearestPixel((width * widthpercent) / 100);
};

const heightPercent2Dp = (value) => {
  let heightpercent = parseFloat(value);
  return PixelRatio.roundToNearestPixel((height * heightpercent) / 100);
};

const bottomNavigationIconStyle = {
  width: widthPercent2Dp('7%'),
  height: heightPercent2Dp('9%'),
};

const activityIconStyle = {
  width: widthPercent2Dp('11%'),
  height: heightPercent2Dp('8%'),
};

const logIconHomeStyle = {
  width: widthPercent2Dp('8%'),
  height: heightPercent2Dp('5%'),
  marginEnd: '5%',
};

const logIconAddLogStyle = {
  width: widthPercent2Dp('10%'),
  height: heightPercent2Dp('5%'),
  marginEnd: '5%',
};

const drawerIconStyle = {
  width: widthPercent2Dp('10%'),
  height: heightPercent2Dp('4%'),
  preserveAspectRatio: 'xMidYMid meet',
};

export {
  scaleFont,
  widthPercent2Dp,
  heightPercent2Dp,
  bottomNavigationIconStyle,
  activityIconStyle,
  logIconHomeStyle,
  logIconAddLogStyle,
  drawerIconStyle,
};
