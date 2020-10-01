import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
//styles
import {Colors} from '../../styles/colors';

const SetDotStyles = (bingoPattern, pickState) => {
    if(bingoPattern === 1 && pickState){
        return styles.dotShouldSpinDone;
    }
    else if(bingoPattern === 1 && !pickState){
        return styles.dotShouldSpin;
    }
    return styles.dotShouldNotSpin;
}

const PickState = (number, spinNumber) => {
    return spinNumber.includes(number);
}

const SetDotTextStyles = (bingoPattern, pickState) => {
    if(bingoPattern === 0 && pickState){
        return styles.dotTextWasted;
    }
    return styles.dotText;
}

const Dot = (props) => {
    return (
        <View style={[styles.container, SetDotStyles(props.bingoPattern, PickState(props.number, props.spinNum))]}>
            <Text style={[styles.container, SetDotTextStyles(props.bingoPattern, PickState(props.number, props.spinNum))]}>{props.number}</Text>
        </View>
    );
};

export default Dot;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin:5,
    },

    dotShouldSpin: {
        borderRadius: 20,
        width:40,
        height:40,
        borderWidth: 2,
        borderColor: Colors.gameColorGreen,
        backgroundColor: Colors.gameColorWhite,
    },

    dotShouldSpinDone: {
        borderRadius: 20,
        width:40,
        height:40,
        backgroundColor: Colors.gameColorGreen,
    },

    dotShouldNotSpin: {
        borderRadius: 20,
        width:40,
        height:40,
        backgroundColor: Colors.gameColorGrey,
    },

    dotText:{
        color:'black',
        fontSize: 20,
    },

    dotTextWasted:{
        color:Colors.gameColorWhite,
        fontSize: 20,
    },
});

