import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {horizontalMargins} from "../../styles/variables";
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const redeemTabTitles = [
    {
        name: "Catalogue",
        portion: 0.5
    },
    {
        name: "Redeemed",
        portion: 0.5
    }
]

const {width} = Dimensions.get('window');

const RedeemTab = props => {
    const {currentTab, setTabCallback} = props;
    return (
        <View
            style={[
                {flexDirection: 'row', justifyContent: 'space-between'},
                props.style,
            ]}>
            {redeemTabTitles.map((tab, index) => (
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        width: (width - horizontalMargins) * tab.portion,
                        paddingTop: adjustSize(10),
                        paddingBottom: adjustSize(10),
                        borderBottomWidth: currentTab === index ? 3 : 0,
                        borderColor: '#aad326',
                    }}
                    onPress={() => setTabCallback(index)}
                    key={tab.name}>
                    <Text style={{color: currentTab === index ? "#aad326" : "#000", fontSize: adjustSize(18)}}>
                        {tab.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

}

export default RedeemTab;
