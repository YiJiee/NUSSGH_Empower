import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


export default function RenderMealItem({item, options, containerStyle, onSelectMeal}) {
    return (
        <TouchableOpacity style={{...styles.mealItem, ...containerStyle}} onPress={onSelectMeal}>
            {
                options?.buttons.map(buttonOption => (
                    <TouchableOpacity style={{...styles.button, ...buttonOption.buttonStyle}}
                                      onPress={()=>buttonOption.onPress(item)}>
                        {
                            buttonOption.icon ? <Icon size={adjustSize(34)} name={buttonOption.icon.name}
                                                      color={buttonOption.icon.color} /> : null
                        }
                    </TouchableOpacity>
                ))
            }
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{item["mealName"]}</Text>
                <Text style={[styles.headerText, {color: '#7d7d7d'}]}>{item.foodItems.length + ' Different Item(s)'}</Text>
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mealItem: {
        borderBottomWidth: 0.5,
        borderColor: '#cfcfcf',
        paddingTop: adjustSize(10),
        paddingBottom: adjustSize(10),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerContainer: {
        paddingLeft: '3%'
    },
    headerText: {
        fontSize: adjustSize(16),
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: adjustSize(15),
        fontWeight: 'bold',
        color: "#fff"
    }
})
//edit flag
