import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// Components
import Select from '../../select';
import logStyles from '../../../styles/logStyles';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


const options = [{name: "Breakfast", value: "breakfast"},
    {name: "Lunch", value: "lunch"},
    {name: "Dinner", value: "dinner"},
    {name: "Supper", value: "supper"},
    {name: "Snack / Tea", value: "snack"}];

export default function MealTypeSelectionBlock({onSelectChange, defaultValue}) {
    return (
        <View style={{flexDirection: 'column', width: '100%'}}>
            <Text style={[logStyles.fieldName, logStyles.componentMargin]}>Meal Type:</Text>
            <Select
                defaultValue={defaultValue}
                options={options}
                onSelect={onSelectChange} containerStyle={styles.selectStyle}
                rightIcon="chevron-down"/>
        </View>
    )
}

const styles = StyleSheet.create({
    selectStyle: {
        height: adjustSize(43),
    },
})
//edit flag
