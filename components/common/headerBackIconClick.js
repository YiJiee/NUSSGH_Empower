import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

Icon.loadFont();

const HeaderBackIconClick = props => {
    return (
        <TouchableOpacity activeOpacity={0.3} onPress={props.clickFunc}>
            <Icon name={'arrow-left'} size={adjustSize(25)} color={'#000'}/>
        </TouchableOpacity>
    );
}

export default HeaderBackIconClick;
