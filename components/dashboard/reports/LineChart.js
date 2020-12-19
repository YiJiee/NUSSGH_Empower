import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  Text,
  Dimensions,
} from 'react-native';
//third party lib
import Moment from 'moment';
import {
  Svg,
  Rect,
  Text as SvgText,
  Path,
  G,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from 'react-native-svg';
import {scaleTime, scaleLinear} from 'd3-scale';
import * as path from 'svg-path-properties';
import * as d3shape from 'd3-shape';
import {
  formatY,
  generateXAxisLabels,
  generateYAxisValues,
  getYStepSize,
  processData,
  squashToXY,
} from '../../../commonFunctions/reportDataFormatter';
import {DAY_FILTER_KEY} from '../../../screens/main/reports';
import {Colors} from '../../../styles/colors';
import {
  getEntryForDateRange,
  getEntry4Day,
} from '../../../netcalls/requestsDiary';
import ExpandFood from '../expandFood';
import {
  morningObj,
  afternoonObj,
  eveningObj,
} from '../../../commonFunctions/common';
import {
  filterMorning,
  filterAfternoon,
  filterEvening,
  getDateObj,
  showEdit,
} from '../../../commonFunctions/diaryFunctions';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

// initialise all the graph properties.
// global style options
const padding = adjustSize(20);
const paddingLeft = adjustSize(60);
const paddingRight = adjustSize(40);
const xAxisGapFromText = adjustSize(15);
const yAxisGapFromText = adjustSize(18);
const axisMargin = adjustSize(20);

const axisColour = '#cdcdcd';
const axisLabelColour = '#E1E7ED';
const axisTextLabelColour = '#3c3c43';

const showXAxis = true;
const showXAxisLines = false;
const showYAxis = true;
const showYAxisLines = true;

// cursor
const cursorRadius = adjustSize(10);
const THRESHOLD = adjustSize(12.5); // The min distance to switch index.

// x label
const xLabelTextBoxWidth = adjustSize(95);

// bar label properties
const barLabelHeight = adjustSize(25);
const barLabelWidth = adjustSize(50);
const barLabelYOffset = adjustSize(10) + cursorRadius;
const barLabelFontSize = adjustSize(14);
const barLabelTextYOffset = barLabelFontSize / 2 - cursorRadius;
const carrotHeight = barLabelHeight / 2;
const carrotWidth = barLabelWidth / 5;

const pointRadius = 2.5;
const pointColor = Colors.nextBtnColor;
const strokeColor = Colors.nextBtnColor;
const strokeWidth = 3;

export default class LineChart extends React.Component {
  cursor = React.createRef();
  cursorAxis = React.createRef();

  // For cursor label
  cursorLabel = React.createRef();
  cursorCarrot = React.createRef();

  xLabel = React.createRef(); // header label with cursor's current x value.

  scrollerKey = React.createRef(0);

  constructor(props) {
    super(props);
    const components = this.getComponent();

    this.state = {
      selectedIndex: 0,
      x: new Animated.Value(0),
      ...components,
      foodDate: Moment(new Date()).format('DD MMM YYYY'),
      startX: '',
      endX: '',
      showStart: false,
      showEnd: false,

      clickMorning: false,
      clickAfternoon: false,
      clickEvening: false,
    };
  }

  componentDidMount() {
    this.state.x.addListener(({value}) => this.moveCursor(value));
    this.updateComponent();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.filterKey !== this.props.filterKey ||
      prevProps.data !== this.props.data ||
      prevProps.selectedDate !== this.props.selectedDate
    ) {
      this.scrollerKey.current += 1;
      this.updateComponent();
      this.closePeriod();
    }
  }

  getComponent = () => {
    const {
      width,
      height,
      filterKey,
      xExtractor,
      yExtractor,
      defaultMaxY,
      defaultMinY,
      upperBound,
      lowerBound,
      boundaryFill,
      selectedDate,
    } = this.props;
    const data = processData(
      filterKey,
      this.props.data,
      xExtractor,
      yExtractor,
      'average',
      this.props.selectedDate,
    );
    // d3 properties
    const maxY = Math.max(
      defaultMaxY,
      1.25 * Math.max(...data.map((d) => d.y)),
    );
    const xAxisLabels = generateXAxisLabels(
      filterKey,
      this.props?.selectedDate,
    );
    const yAxisStartsFrom = Math.min(
      defaultMinY ? defaultMinY : 0,
      Math.round(0.75 * Math.min(...data.map((d) => d.y))),
    );
    const minX = xAxisLabels[0];
    const maxX = xAxisLabels[xAxisLabels.length - 1];
    const yAxisLabels = generateYAxisValues(
      getYStepSize(yAxisStartsFrom, maxY),
      yAxisStartsFrom,
      maxY,
    );

    // d3 scale properties
    const scaleX = scaleTime()
      .domain([minX, maxX])
      .range([paddingLeft, width - paddingRight]);
    const scaleY = scaleLinear()
      .domain([yAxisStartsFrom, maxY])
      .range([height - padding, padding]);
    const scaleHeight = scaleLinear()
      .domain([yAxisStartsFrom, maxY])
      .range([0, height - 2 * padding]);

    const line =
      data.length > 0
        ? d3shape
            .line()
            .x((d) => scaleX(d.x))
            .y((d) => scaleY(d.y))
            .curve(d3shape.curveLinear)(data)
        : null;
    const lineProperties = line && path.svgPathProperties(line);
    const lineLength = line ? lineProperties.getTotalLength(line) : 0;

    // new field for tracking cursor
    const dataCoordinates = data.map((d) => [scaleX(d.x), scaleY(d.y)]);

    return {
      scaleX,
      scaleY,
      scaleHeight,
      yAxisLabels,
      xAxisLabels,
      minX,
      maxY,
      maxX,
      yAxisStartsFrom,

      data,
      dataCoordinates,

      line,
      lineLength,
      lineProperties,
    };
  };

  updateComponent = () => {
    this.setState(this.getComponent(), () => {
      this.moveCursor(0);
    });
  };

  moveCursor(value) {
    const {
      pathLine,
      lineLength,
      lineProperties,
      selectedIndex,
      dataCoordinates,
      data,
      maxX,
      scaleX
    } = this.state;
    const {
      width
    } = this.props;

    //console.log('move cursor----');
    if (lineLength > 0) {
      const {x, y} = lineProperties.getPointAtLength(lineLength - value);
      const mapped = dataCoordinates.map((d) =>
        Math.round(Math.abs(d[0] - x) + Math.abs(d[1] - y)),
      );
      const minDist = Math.min(...mapped);
      let index = -1;
      if (minDist < THRESHOLD) {
        index = mapped.indexOf(minDist);
      }
      // show the label that is within threshold.
      if (index !== -1) {
        const shownDatapoint = dataCoordinates[index];
        this.cursorLabel.current.setNativeProps({
          top: shownDatapoint[1] - barLabelHeight - barLabelYOffset,
          left: shownDatapoint[0] - barLabelWidth / 2,
          opacity: 1,
          text: `${formatY(data[index].y)}`,
        });
        this.cursorCarrot.current.setNativeProps({
          top: shownDatapoint[1] - carrotHeight - cursorRadius,
          left: shownDatapoint[0] - carrotWidth,
          opacity: 1,
        });

        //console.log(Math.max(axisMargin + paddingLeft + xLabelTextBoxWidth / 2,Math.min(shownDatapoint[0] - xLabelTextBoxWidth / 2, width - xLabelTextBoxWidth / 2 - paddingRight - axisMargin)));
        this.xLabel.current.setNativeProps({
          text: `${Moment(this.state.scaleX.invert(shownDatapoint[0])).format(
            this.props.filterKey === DAY_FILTER_KEY ? 'h:mm a' : 'DD MMM YYYY',
          )}`,
          // clamp the left and right
          left: Math.max(paddingLeft - axisMargin, Math.min(shownDatapoint[0] - xLabelTextBoxWidth / 2, width  - paddingRight + axisMargin - xLabelTextBoxWidth)),
          opacity: 1,
        });
      } else {
        this.cursorLabel.current.setNativeProps({
          opacity: 0,
        });
        this.cursorCarrot.current.setNativeProps({
          opacity: 0,
        });
        this.xLabel.current.setNativeProps({
          opacity: 0,
        });
      }
      this.cursor.current.setNativeProps({
        top: y - cursorRadius,
        left: x - cursorRadius,
      });
      this.cursorAxis.current.setNativeProps({top: 0, left: x});

    }
  }

  //callback when click on the period text to show the line on graph
  shiftTimeLine = (startTime, endTime, dataSet, period) => {
    if (period === morningObj.name) {
      this.setState({
        clickMorning: true,
        clickAfternoon: false,
        clickEvening: false,
      });
    } else if (period === afternoonObj.name) {
      this.setState({
        clickAfternoon: true,
        clickMorning: false,
        clickEvening: false,
      });
    } else {
      this.setState({
        clickEvening: true,
        clickMorning: false,
        clickAfternoon: false,
      });
    }

    let start = Moment(getDateObj(startTime)).format('HH:mm a');
    let end = Moment(getDateObj(endTime)).format('HH:mm a');

    if (this.props.filterKey === DAY_FILTER_KEY) {
      let data = processData(
        DAY_FILTER_KEY,
        dataSet,
        this.props.xExtractor,
        this.props.yExtractor,
        'average',
        this.props.selectedDate,
      );
      this.setState({startX: data[0]?.x});
      this.setState({showStart: true});
      if (start !== end) {
        this.setState({endX: data[1]?.x});
        this.setState({showEnd: true});
      } else {
        this.setState({showEnd: false});
      }
    }
  };

  closePeriod = () => {
    this.setState({startX: '', endX: ''});
    this.setState({showStart: false, showEnd: false});
    this.setState({
      clickMorning: false,
      clickAfternoon: false,
      clickEvening: false,
    });
  };

  render() {
    const {
      width,
      height,
      filterKey,
      xExtractor,
      yExtractor,
      defaultMaxY,
      defaultMinY,
      upperBound,
      lowerBound,
      boundaryFill,
      showFood,
      foodData,
      selectedDate,
    } = this.props;
    const {
      selectedIndex,
      x,
      scaleX,
      scaleY,
      scaleHeight,
      yAxisLabels,
      xAxisLabels,
      minX,
      maxY,
      maxX,
      yAxisStartsFrom,
      data,
      lineLength,
      line,
      foodDate,
      startX,
      endX,
      showStart,
      showEnd,
      clickMorning,
      clickAfternoon,
      clickEvening,
    } = this.state;

    // linear gradient calculations
    const firstAndLastPoints = data.length > 0 && [
      data[0],
      data[data.length - 1],
    ];
    const backToStartXDistance =
      data.length > 0 &&
      scaleX(firstAndLastPoints[0].x) - scaleX(firstAndLastPoints[1].x);
    const yDistToBase = data.length > 0 && scaleHeight(firstAndLastPoints[1].y);

    const lowBound = lowerBound ? lowerBound : yAxisStartsFrom;
    const upBound = upperBound ? upperBound : maxY;

    return (
      <View>
        {
          // x - label
          this.state.lineLength !== 0 && (
            <TextInput
              ref={this.xLabel}
              key={`header-x-label`}
              style={styles.xLabel}
            />
          )
        }
        <View>
          {
            // cursor line
            this.state.lineLength !== 0 && (
              <View
                ref={this.cursorAxis}
                key={`cursor-line-${this.props.filterKey}`}
                style={{
                  width: 1,
                  backgroundColor: '#aad326',
                  height: height - padding,
                  position: 'absolute',
                }}
              />
            )
          }
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
                <Stop stopColor={'#aad326'} offset="0%" />
                <Stop
                  stopColor={Colors.backgroundColor}
                  stopOpacity={0.01}
                  offset="95%"
                />
                <Stop
                  stopColor={Colors.backgroundColor}
                  stopOpacity={0.01}
                  offset="100%"
                />
              </LinearGradient>
            </Defs>
            {
              // boundaries
              (lowerBound || upperBound) && (
                <Path
                  key="healthyRange"
                  stroke="none"
                  fill={boundaryFill || '#F1F6D7'}
                  d={`M ${paddingLeft - axisMargin} ${scaleY(lowBound)} l ${
                    width - paddingLeft - paddingRight + 2 * axisMargin
                  } 0
                              l 0 ${scaleY(upBound) - scaleY(lowBound)} l ${-(
                    width -
                    paddingLeft -
                    paddingRight +
                    2 * axisMargin
                  )} 0 Z`}
                />
              )
            }
            {
              //this.state.lineLength !== 0  && <Path d={`${line} l 0 ${yDistToBase} l ${backToStartXDistance} 0`} fill={'url(#gradient)'}/>
            }
            {
              // x-axis labels
              showXAxis &&
                xAxisLabels.map((x, index) => (
                  <SvgText
                    key={`x-axis-label-${index}-${this.props.filterKey}`}
                    fill={axisTextLabelColour}
                    y={height - padding + xAxisGapFromText}
                    x={scaleX(x)}
                    textAnchor="middle"
                    style={{fontSize: adjustSize(10)}}>
                    {Moment(x).format(
                      filterKey === DAY_FILTER_KEY ? 'H:mm' : 'DD/MM',
                    )}
                  </SvgText>
                ))
            }
            {
              // y axis labels
              showYAxis &&
                yAxisLabels.map((y, index) => (
                  <SvgText
                    key={`y-axis-label-${index}-${this.props.filterKey}`}
                    fill={axisTextLabelColour}
                    x={paddingLeft - axisMargin - yAxisGapFromText}
                    y={scaleY(y)}
                    textAnchor="middle"
                    style={{fontSize: adjustSize(10)}}>
                    {y}
                  </SvgText>
                ))
            }
            {showXAxisLines &&
              xAxisLabels.map((x, index) => (
                <Path
                  key={`x-axis-label-line-${index}`}
                  stroke={axisLabelColour}
                  d={`M ${scaleX(x)} ${padding} l 0 ${height - 2 * padding}`}
                />
              ))}
            {showYAxisLines &&
              yAxisLabels.map((y, index) => (
                <Path
                  key={`y-axis-label-line-${index}`}
                  stroke={axisLabelColour}
                  d={`M ${paddingLeft - axisMargin} ${scaleY(y)} l ${
                    width - paddingLeft - paddingRight + 2 * axisMargin
                  } 0`}
                />
              ))}
            {
              // one more for x axis.
              showXAxis && (
                <Path
                  stroke={axisLabelColour}
                  d={`M ${paddingLeft - axisMargin} ${scaleY(
                    yAxisStartsFrom,
                  )} l ${
                    width - paddingLeft - paddingRight + 2 * axisMargin
                  } 0`}
                />
              )
            }
            {
              // plot lines
              <LinePlot
                data={data}
                scaleX={scaleX}
                scaleY={scaleY}
                lineColor={strokeColor}
                lineWidth={strokeWidth}
              />
            }
            {
              // plot points
              data.map((d, index) => (
                <Circle
                  key={`point-${index}`}
                  cx={scaleX(d.x)}
                  cy={scaleY(d.y)}
                  r={pointRadius}
                  fill={
                    this.props.outsideBoundaryColor
                      ? d.y < lowBound ||
                        d.y > upBound
                        ? this.props.outsideBoundaryColor
                        : pointColor
                      : pointColor
                  }
                />
              ))
            }
            {
              // cursor point
              this.state.lineLength !== 0 && (
                <View
                  ref={this.cursor}
                  style={[styles.cursor, {position: 'absolute'}]}
                />
              )
            }
            {
              // cursor label
              this.state.lineLength !== 0 && (
                <React.Fragment>
                  <TextInput
                    ref={this.cursorLabel}
                    style={[styles.cursorLabel, {position: 'absolute'}]}
                  />
                  <View
                    ref={this.cursorCarrot}
                    style={[
                      styles.triangle,
                      {position: 'absolute', transform: [{rotate: '180deg'}]},
                    ]}
                  />
                </React.Fragment>
              )
            }
            {/*Line for BG-FOOD*/}
            {showStart ? (
              <Line
                stroke={Colors.leftArrowColor}
                x1={startX != null ? scaleX(startX) : 0}
                y1="0"
                x2={startX != null ? scaleX(startX) : 0}
                y2={height - padding}
                strokeWidth={2}
              />
            ) : null}
            {showEnd ? (
              <Line
                stroke={Colors.leftArrowColor}
                x1={startX != null ? scaleX(endX) : 0}
                y1="0"
                x2={startX != null ? scaleX(endX) : 0}
                y2={height - padding}
                strokeWidth={2}
              />
            ) : null}
            {showStart && showEnd && (
              <Rect
                x={scaleX(startX)}
                y="0"
                width={scaleX(endX) - scaleX(startX)}
                height={height - padding - height * 0.0005}
                fill={'rgba(22, 168, 80, 0.1)'}
              />
            )}
          </Svg>
          {
            <Animated.ScrollView
              key={`graph-scroller-${this.props.filterKey}-${this.scrollerKey.current}`}
              style={StyleSheet.absoluteFill}
              contentContainerStyle={{width: this.state.lineLength + width}}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={12}
              bounces={false}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {x},
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              horizontal
            />
          }
          {showFood && filterKey === DAY_FILTER_KEY && (
            <View style={styles.foodTableContainer}>
              <Text style={styles.foodConsumedText}>
                Food Consumed - {Moment(selectedDate).format('DD MMM YYYY')}
              </Text>
              {foodData?.length > 0 ? (
                <>
                  <ExpandFood
                    period={morningObj.name}
                    clickPeriod={clickMorning}
                    foodData={filterMorning(foodData)}
                    callback={this.shiftTimeLine}
                    closePeriod={this.closePeriod}
                  />
                  <ExpandFood
                    period={afternoonObj.name}
                    clickPeriod={clickAfternoon}
                    foodData={filterAfternoon(foodData)}
                    callback={this.shiftTimeLine}
                    closePeriod={this.closePeriod}
                  />
                  <ExpandFood
                    period={eveningObj.name}
                    clickPeriod={clickEvening}
                    foodData={filterEvening(foodData)}
                    callback={this.shiftTimeLine}
                    closePeriod={this.closePeriod}
                  />
                </>
              ) : (
                <Text style={styles.emptyFood}>No food logs for the day</Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}

function LinePlot({data, scaleX, scaleY, lineColor, lineWidth}) {

  if (data.length <= 1) {
    return null;
  } else {
    let currentDataPoint = data[0];
    let result = [];
    for (let i = 1; i < data.length; i++) {
      const currX = scaleX(currentDataPoint.x);
      const currY = scaleY(currentDataPoint.y);
      const nextPoint = data[i];
      const nextX = scaleX(nextPoint.x);
      const nextY = scaleY(nextPoint.y);

      const dy = nextY - currY;
      const dx = nextX - currX;
      // draw a line from the current data point to the next data point.
      const p = (
        <Path
          stroke={lineColor}
          strokeWidth={lineWidth || 1}
          d={`M ${currX} ${currY} l ${dx} ${dy}`}
          key={i}
        />
      );
      result.push(p);
      currentDataPoint = nextPoint;
    }

    return result;
  }
}

const styles = StyleSheet.create({
  cursor: {
    width: cursorRadius * 2,
    height: cursorRadius * 2,
    borderRadius: cursorRadius,
    borderColor: Colors.backgroundColor,
    borderWidth: 3,
    backgroundColor: '#aad326',
  },
  cursorLabel: {
    backgroundColor: '#3c3c43',
    opacity: 0.6,
    borderRadius: 5,
    padding: 0,
    margin: 0,
    width: barLabelWidth,
    height: barLabelHeight,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  xLabel: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(16),
    color: '#3c3c43',
    opacity: 0.6,
    width: xLabelTextBoxWidth,
    textAlign: 'center'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: carrotWidth,
    borderRightWidth: carrotWidth,
    borderBottomWidth: carrotHeight,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#444C54',
  },
  foodTableContainer: {
    margin: '2%',
    marginTop: '4%',
  },
  foodConsumedText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(20),
  },
  emptyFood: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: adjustSize(18),
  },
});
