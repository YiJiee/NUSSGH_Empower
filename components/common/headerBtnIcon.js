import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

Icon.loadFont();

const HeaderIcon = props => {
    return (
        <TouchableOpacity activeOpacity={0.3} onPress={props.clickFunc}>
            <View style={styles.container}>
                <Icon name={props.iconName} size={adjustSize(25)} color={'#000'}/>
                { props.text && <Text>{props.text}</Text> }
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:adjustSize(10),
        paddingTop:adjustSize(5),
    },
})

export default HeaderIcon;
//edit flag
