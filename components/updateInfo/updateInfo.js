import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
//styles
import {Colors} from '../../styles/colors';


const UpdateInfo = (props) => {
    return (
        <View style={[styles.card, styles.cardPadding]}>
            <Text style={styles.bigText}>Updated version</Text>
            <Text style={styles.medianText}>Bug fix</Text>
            <TouchableOpacity
                style={[styles.buttonStyle, styles.nextColor]}
                onPress={() => {props.closeModal()}}>
                <Text style={styles.actionButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateInfo;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        margin: '2%',
        borderRadius: adjustSize(10),
        borderWidth: 2,
        borderColor: Colors.gameColorDarkGreen,
    },
    cardPadding: {
        paddingHorizontal: '3%',
        paddingVertical: adjustSize(10),
    },
    buttonStyle: {
        borderRadius: adjustSize(9.5),
        margin: '2%',
        alignSelf: 'stretch',
        padding: '3%',
    },
    nextColor:{
        backgroundColor: '#aad326',
    },
    actionButtonText: {
        fontSize: adjustSize(19),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    medianText: {
        fontSize: adjustSize(16),
        textAlign: 'center',
    },
    bigText: {
        fontSize: adjustSize(19),
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

