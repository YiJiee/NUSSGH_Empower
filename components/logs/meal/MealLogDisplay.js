import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReadOnlyMealDisplay from './ReadOnlyMealDisplay';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


const MealLogDisplay = (props) => {
    console.log(props.data);
    return (
        <View style={[styles.container, styles.shadow]}>
            <Text style={styles.textStyle}>
                {prefix(props.isNewSubmit)}{' '}
            </Text>
             <ReadOnlyMealDisplay style={{marginTop: '3%', marginBottom: '3%'}} meal={props.data.value} />
            <Text style={[styles.textStyle, styles.bold]}> at {props.data.time} today.</Text>
        </View>
    );
};

const prefix = isNewSubmit => {
    if(isNewSubmit){
        return 'Your new log of meal is';
    }else{
        return 'Your most recent meal log is';
    }
}

export default MealLogDisplay;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: adjustSize(20),
        padding: '4%',
        alignItems: 'center',
        marginBottom: '5%'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textStyle: {
        fontSize: adjustSize(17),
    },
    bold: {
        fontWeight: '700',
        color: '#d22b55',
    },
});
