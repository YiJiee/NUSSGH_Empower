import React, {Component} from 'react';
import {Dimensions, InteractionManager, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/colors';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

//Props:
//max, min: range of number
//onChange to get the selected value
//interval: (0.1 onwards), 1 stands for whole numbers, 0.2 means 1-20, will have 1.2, 1.4... 19.8, 20
//wholenumIntervalStyle: style for the invervals that is whole number
//decimalIntervalStyle: style for intervals that is decimals
//intervalTextColor: color for interval
const interval_width = 30;

//scale from offset to value
const scale = (v, inputMin, interval) => {
  console.log('v: ' + v);
  let factor = Math.round(v / interval_width);
  let num = 0;
  if (factor === 0) {
    num = inputMin;
  } else {
    num = inputMin + (factor - 1) * interval;
  }

  if (String(num).length > 4) {
    let newNum = String(num).substring(0, 5);
    return Number(newNum);
  }

  return num;
};

//scale from value to offset
const scaleToOffset = (value, min, interval) => {
  let diff = value - min;
  let position = (diff / interval).toFixed(2) * interval_width + 30;
  return position;
};

export default class PickDrag extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      initial: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.scrollInitial();
  }

  componentDidUpdate(prevProp) {
    if (prevProp !== this.props) {
      this.scrollInitial();
    }
  }

  //for android
  scrollInitial() {
    const {value, min, interval} = this.props;
    if (Platform.OS === 'android' && this.state.initial === false) {
      console.log('-----updating to initial value');
      let offset = scaleToOffset(value, min, interval);
      InteractionManager.runAfterInteractions(() => {
        this.scrollView.scrollTo({x: offset, animated: true});
      });
    }
  }

  getScrollMax(props = this.props) {
    return (props.max - props.min) * interval_width;
  }

  scaleValue(value, props = this.props) {
    let {min, max, interval} = props;
    return scale(value, min, interval);
  }

  //when user scroll
  handleScroll(event) {
    console.log('------Scrolling event happening');
    const {value, min, interval} = this.props;
    let offset = 0;
    if (offset === 0 && !this.state.initial) {
      console.log('entering first time');
      offset = scaleToOffset(value, min, interval);
      this.setState({initial: true});
      this.scrollView.scrollTo({x: offset, animated: true});
    } else {
      offset = event.nativeEvent.contentOffset.x;
    }
    let val = this.scaleValue(offset);
    this.props.onChange(val);
  }

  renderScale() {
    let {min, max, interval} = this.props;
    let arr = [];
    let count = 0;
    while (true) {
      let val = min + interval * count;
      arr.push(val);
      count++;
      if (val >= max) {
        break;
      }
    }
    return arr.map((val, i) => {
      let numberstring = String(val).substring(0, 4);
      return !numberstring.includes('.') ? (
        <View key={`val-${i}`} style={{width: interval_width}}>
          <View
            style={{
              ...styles.interval,
              ...styles.wholeNumInterval,
              ...this.props.wholenumIntervalStyle,
            }}
          />
          <Text
            style={{...styles.intervalValue, ...this.props.intervalTextColor}}>
            {numberstring}
          </Text>
        </View>
      ) : (
        <View key={`val-${i}`} style={{width: interval_width}}>
          <View
            style={{...styles.interval, ...this.props.decimalIntervalStyle}}
          />
        </View>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cursor} />
        <ScrollView
          ref={(r) => (this.scrollView = r)}
          horizontal={true}
          onScroll={this.handleScroll}
          scrollEventThrottle={100}
          snapToInterval={interval_width}
          contentOffset={{x: interval_width}}
          contentContainerStyle={{
            paddingStart:
              interval_width * Dimensions.get('window').width * 0.0194,
            paddingEnd: interval_width * 6 - 6,
          }}
          style={styles.scrollcontainer}>
          <View style={styles.intervalContainer}>{this.renderScale()}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.backgroundColor,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2}, // change this for more shadow
    shadowOpacity: 0.2,
    shadowRadius: adjustSize(6),
    elevation: adjustSize(10),
  },
  scrollcontainer: {
    width: '100%',
    height: adjustSize(150),
    flexGrow: 1,
    marginTop: '-8%',
  },
  intervalContainer: {
    flexDirection: 'row',
  },
  interval: {
    width: 1,
    backgroundColor: '#979797',
    height: '40%',
    margin: 3,
    color: '#e2e8ee',
  },
  intervalValue: {
    fontSize: adjustSize(18),
    width: '120%',
    margin: 2,
    color: '#aad326',
    fontWeight: '700',
    marginStart: '-8%',
  },
  cursor: {
    width: 0,
    height: 0,
    borderLeftWidth: adjustSize(28),
    borderRightWidth: adjustSize(28),
    borderTopWidth: adjustSize(30),
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.backArrowColor,
    alignSelf: 'center',
    marginStart: '3%',
    zIndex: 2,
  },
  wholeNumInterval: {
    height: '60%',
    backgroundColor: '#aad326',
    width: 4,
  },
});
