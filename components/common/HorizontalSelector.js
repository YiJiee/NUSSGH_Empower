import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../styles/colors';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

function HorizontalSelector(props) {
    const {setSelected, currentlySelected, choices, style} = props;

    return (<View style={[styles.container, style]}>
        {
            choices.map(choice => (
                <TouchableOpacity onPress={()=>setSelected(choice.name)} style={currentlySelected === choice.name ? styles.selected : styles.unSelected}>
                    <Text style={currentlySelected === choice.name ? styles.selectedText : styles.unSelectedText}>{choice.name}</Text>
                </TouchableOpacity>
            ))
        }
    </View>);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.gameColorGrey,
        borderRadius: adjustSize(5)
    },
    selected: {
        backgroundColor: Colors.submitBtnColor,
        borderRadius: adjustSize(5)
    },
    unSelected: {

    },
    selectedText: {
        color: '#fff',
        fontSize: adjustSize(20),
        margin: adjustSize(5)
    },
    unSelectedText: {
        color: Colors.subsubHeaderColor,
        fontSize: adjustSize(20),
        margin: adjustSize(5)
    }
});

export {HorizontalSelector};
