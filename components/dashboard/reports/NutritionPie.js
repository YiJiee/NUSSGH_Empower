import React from 'react';
import { PieChart } from 'react-native-svg-charts';
import {Line, G, Text as SvgText, Circle, Rect} from 'react-native-svg';
import {DAY_FILTER_KEY, WEEK_FILTER_KEY} from "../../../screens/main/reports";
import {filterToDayData, filterToWeekData, getBinCount} from "../../../commonFunctions/reportDataFormatter";
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const COLOR_MAP = {
    'carbohydrate': '#73CA93',
    'total-fat': '#16A850',
    'protein': '#005C30',
}

const labelFontSize = adjustSize(13);
const emptyLabelFontSize = adjustSize(30);

const labelContainerWidth = adjustSize(40);
const labelContainerHeight = adjustSize(30);

function NutritionPie(props) {
    const pieData = filterAndProcessData(props.data, props.filterKey, props.pieKeys);
    const totalSum = pieData.reduce((acc, curr, index) => acc + curr.value, 0);

    const Labels = ({ slices }) => {
        return slices.map((slice, index) => {
            const { labelCentroid, pieCentroid, data } = slice;
            return (
                <G key={ index }>
                    <Line
                        x1={ labelCentroid[ 0 ] }
                        y1={ labelCentroid[ 1 ] }
                        x2={ pieCentroid[ 0 ] }
                        y2={ pieCentroid[ 1 ] }
                        stroke={ data.svg.fill }
                    />
                    {
                        /*
                        <Circle
                            cx={ labelCentroid[ 0 ] }
                            cy={ labelCentroid[ 1 ] }
                            r={ 20 }
                            fill={ data.svg.fill }
                        />
                         */
                    }
                    <Rect x={labelCentroid[0] - labelContainerWidth/2}
                          y={labelCentroid[1] - labelContainerHeight/2}
                          width={labelContainerWidth}
                          height={labelContainerHeight}
                          fill={data.svg.fill}
                          rx={10} />
                    <SvgText fill='#fff' textAnchor='middle'
                             fontSize={labelFontSize}
                             fontWeight='bold'
                             x={labelCentroid[0]}
                             y={labelCentroid[1] + labelFontSize / 4}>
                        {Math.round(data.value / totalSum * 100) + '%'};
                    </SvgText>
                </G>
            )
        })
    }

    return (
        <PieChart labelRadius={pieData.length > 1 ? 125 : -5}
              innerRadius={adjustSize(70)}
              outerRadius={adjustSize(100)}
              style={{ height: props.height || adjustSize(300), width: props.width || '100%' }}
              data={pieData}>
            {   pieData.length > 1 ?
                (<Labels />): (<EmptyLabels />)
            }
        </PieChart>
    )
}

function filterAndProcessData(data, filterKey, pieKeys) {
    const filteredData = filterKey === DAY_FILTER_KEY ? filterToDayData(data, new Date(), d=>d.date)
        : filterKey === WEEK_FILTER_KEY ? filterToWeekData(data, new Date(), d=>d.date) : data;
    let result = [];
    for (const key of pieKeys) {
        const binCount = getBinCount(filteredData, d=>key, d=>d.nutrients[key].amount);
        if (binCount !== -1) {
            result.push(binCount);
        }
    }

    const pieData = result.length > 0 ? result.map((d, index) => {
        const [nutrient, quantity] = Object.entries(d)[0];
        return ({
            name: nutrient,
            value: Math.round(quantity),
            svg: {
                fill: COLOR_MAP[nutrient],
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`
        });
    }) : [
        {
            name: 'empty',
            value: 100,
            svg: {
                fill: '#d8d8d8'
            },
            key: `pie-${0}`
        }
    ];

    return pieData
}

const EmptyLabels = ({ slices }) => {
    return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
            <G key={ index }>
                <Circle
                    cx={ labelCentroid[ 0 ] }
                    cy={ labelCentroid[ 1 ] }
                    r={ adjustSize(40) }
                    fill={ data.svg.fill }
                />
                <SvgText fill='#fff' textAnchor='middle'
                         fontSize={emptyLabelFontSize}
                         fontWeight='bold'
                         x={labelCentroid[0]}
                         y={labelCentroid[1] + labelFontSize}
                         style={{fontSize: adjustSize(10)}}>
                    0%
                </SvgText>
            </G>
        )
    })
}

export {NutritionPie, COLOR_MAP, filterAndProcessData};
