import React from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
//third party lib
import Moment from 'moment';
import {Svg, Rect, Text as SvgText, Path, G} from 'react-native-svg';
import {scaleTime, scaleLinear} from "d3-scale";
import {
    formatY,
    generateXAxisLabels,
    generateYAxisValues,
    getYStepSize,
    processData,
} from "../../../commonFunctions/reportDataFormatter";
import {DAY_FILTER_KEY, WEEK_FILTER_KEY} from "../../../screens/main/reports";
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

// initialise all the graph properties.
// global style options
const padding = adjustSize(20);
const paddingLeft = adjustSize(60);
const paddingRight = adjustSize(40);
const xAxisGapFromText = adjustSize(15);
const yAxisGapFromText = adjustSize(12);
const axisMargin = adjustSize(20);
const barWidth = adjustSize(9.5);
let xAxisTextFontSize = adjustSize(12);
const yAxisStartsFrom = 0;
// bar label properties
const barLabelHeight = adjustSize(25);
const barLabelWidth = adjustSize(35);
const barLabelYOffset = adjustSize(10);
const barLabelFontSize = adjustSize(14);
const barLabelTextYOffset = barLabelFontSize / 2;

const axisColour = '#E1E7ED';
const axisTextLabelColour = '#3c3c43';

const showXSteps = false;
const showYSteps = true;
const showXAxis = true;
const showYAxis = true;

export default function BarChart(props) {
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const data = processData(props.filterKey, props.data, props.xExtractor, props.yExtractor, 'sum');
    const {width, height} = props;
    // d3 properties
    const maxY = Math.max(props.defaultMaxY, 1.25* Math.max(...data.map(d => d.y)));
    const xAxisLabels = generateXAxisLabels(props.filterKey);
    const minX = xAxisLabels[0];
    const maxX = xAxisLabels[xAxisLabels.length - 1];
    const yAxisLabels = generateYAxisValues(getYStepSize(yAxisStartsFrom, maxY), yAxisStartsFrom, maxY);

    // d3 scale properties
    const scaleX = scaleTime().domain([minX, maxX]).range([paddingLeft, width - paddingRight]);
    const scaleY = scaleLinear().domain([yAxisStartsFrom, maxY]).range([height - padding, padding]);
    const scaleHeight = scaleLinear().domain([yAxisStartsFrom, maxY]).range([0, height - 2 * padding]);

    // event handlers
    const handleSelect = (index) => {
        setSelectedIndex(index);
    }

    const lowBound = props.lowerBound ? props.lowerBound : 0;
    const upBound = props.upperBound ? props.upperBound : maxY;

    return (
        <View style={styles.root}>
            <View style={styles.barchartContainer}>
                <Svg width={width} height={height}>
                    {   // boundaries
                        (props.lowerBound || props.upperBound) &&
                        <Path key='healthyRange' stroke='none' fill={props.boundaryFill || '#F1F6D7'}
                              d={`M ${paddingLeft - axisMargin - barWidth / 2} ${scaleY(lowBound)} l ${width - paddingLeft - paddingRight + 2 * axisMargin + barWidth} 0
                              l 0 ${-scaleHeight(upBound - lowBound)} l ${-(width - paddingLeft - paddingRight + 2 * axisMargin + barWidth)} 0 Z`}/>


                    }
                    {   // x axis labels
                        showXAxis &&
                        xAxisLabels.map((xVal, index) => (
                            <SvgText x={scaleX(xVal)}
                                     key={xVal.toString()}
                                     fontSize={xAxisTextFontSize}
                                     textAnchor='middle'
                                     y={height - padding + xAxisGapFromText} fill={axisTextLabelColour}
                                     style={{fontSize: adjustSize(10)}}>
                                {Moment(xVal).format(props.filterKey === DAY_FILTER_KEY ? "H:mm" : "DD/MM")}
                            </SvgText>
                        ))
                    }
                    {
                        // y axis labels
                        showYAxis &&
                        yAxisLabels.map((y, index) => (
                            <SvgText x={paddingLeft - barWidth / 2 - axisMargin - yAxisGapFromText}
                                     y={scaleY(y)} fill={axisTextLabelColour} textAnchor='middle'
                                     style={{fontSize: adjustSize(10)}}>
                                {formatY(y)}
                            </SvgText>
                        ))
                    }
                    {
                        // vertical lines for x axis labels
                        showXSteps &&
                        xAxisLabels.map((xVal, index) => (
                            <Path stroke={axisColour}
                                  d={`M ${scaleX(xVal)} ${height - padding} l 0 ${ - (height - 2 * padding)}`}
                            />
                        ))
                    }
                    {
                        // horizontal lines
                        showYSteps &&
                        yAxisLabels.map((v, index) => (
                            <Path stroke={axisColour}
                                  key={v.toString()}
                                  d={`M ${paddingLeft - barWidth / 2 - axisMargin} ${scaleY(v)} l ${width - paddingRight - paddingLeft + barWidth + 2 * axisMargin} 0`} />
                        ))

                    }
                    {
                        showYSteps &&
                        <Path stroke={axisColour}
                              d={`M ${paddingLeft - barWidth / 2 - axisMargin} ${height - padding} l ${width - paddingRight - paddingLeft + barWidth + 2 * axisMargin} 0`} />

                    }
                    {   // bars
                        data.map((d, index) => {
                            return (<Rect
                                onPress={() => handleSelect(index)}
                                rx={3}
                                ry={3}
                                x={scaleX(d.x) - barWidth / 2}
                                y={scaleY(d.y)}
                                width={barWidth}
                                fill={selectedIndex === index ? '#60a354' : '#B2D04B'} height={scaleHeight(d.y)}
                            />)
                        })

                    }
                    {
                        // bar labels: rectangle, triangle and text
                        data.map((d, index) => (
                            <G>
                                <Path opacity={selectedIndex === index ? 1 : 0}
                                      fill='#444C54'
                                      stroke='#444C54'
                                      d={`M ${scaleX(d.x) - barLabelWidth / 8}
                                      ${scaleY(d.y) - barLabelYOffset} l ${barLabelWidth / 8} ${barLabelHeight / 4}
                                      l ${barLabelWidth / 8} ${-barLabelHeight / 4} Z
                                      `} // triangle size is 1/4 of the height of the bar label, and 1/8 of bar width.
                                    // Maintain this ratio if adjustments are needed
                                />
                                <Rect
                                    rx={5}
                                    ry={5}
                                    width={barLabelWidth + formatY(d.y).length * 2 * 2}
                                    height={barLabelHeight}
                                    opacity={selectedIndex === index ? 1 : 0}
                                    fill='#444C54'
                                    y={scaleY(d.y) - barLabelHeight - barLabelYOffset}
                                    x={scaleX(d.x) - barLabelWidth / 2 - formatY(d.y).length * 2}
                                />
                                <SvgText opacity={selectedIndex === index ? 1 : 0}
                                         fontSize={barLabelFontSize}
                                         fontWeight='bold'
                                         y={scaleY(d.y) - barLabelHeight + barLabelTextYOffset} textAnchor='middle'
                                         x={scaleX(d.x)} fill='#fff'
                                         style={{fontSize: adjustSize(14)}}>
                                    {formatY(d.y)}
                                </SvgText>
                            </G>
                        ))
                    }
                </Svg>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
    },
    barchartContainer: {
        paddingBottom: '5%',
    }
});
