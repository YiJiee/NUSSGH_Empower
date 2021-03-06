import React from 'react';
import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import globalStyles from "../../styles/globalStyles";
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';

const topBottomPadding = adjustSize(15);
const {width, height} = Dimensions.get('window');
const textWidth = 0.75 * width;

function HypoCorrectionFoodRow(props) {
    const {item, onPress} = props;
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.15)',
                paddingTop: topBottomPadding,
                paddingBottom: topBottomPadding}}>
                <Image source={{uri: item.imgUrl.url}} style={{width: adjustSize(70), height: adjustSize(70), borderRadius: adjustSize(8)}} />
                <View style={{width: textWidth}}>
                    <Text style={[globalStyles.pageDetails]}>
                        {item['food-name'][0].toUpperCase() + item['food-name'].slice(1)}
                    </Text>
                    <Text style={[globalStyles.pageDetails, {fontWeight: 'normal', color: 'rgba(0,0,0,0.6)'}]}>
                        {"1 Serving(s)"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export {HypoCorrectionFoodRow};
