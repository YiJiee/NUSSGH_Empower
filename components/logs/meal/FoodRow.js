import {Image, Text, View} from 'react-native';
import React from 'react';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';


export default function FoodRow({food}) {
    return (
        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E2E7EE', alignItems: 'center', paddingBottom: adjustSize(10), paddingTop: adjustSize(10)}}>
            <Image source={{uri: food.imgUrl.url}} style={{height: adjustSize(60), width: adjustSize(60), borderRadius: adjustSize(10)}}/>
            <View style={{paddingLeft: '3%', flex: 1}}>
                <Text style={{fontSize: adjustSize(20)}}>{food["food-name"][0].toUpperCase() + food["food-name"].slice(1)}</Text>
                <Text style={{fontSize: adjustSize(16), color: '#7d7d7d'}}>{food["quantity"] + " Serving(s)"}</Text>
            </View>
        </View>
    )
}
//edit flag
