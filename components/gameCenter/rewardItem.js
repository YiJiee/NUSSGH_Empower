import React from 'react';
import {Image, Text, View, Dimensions, TouchableOpacity} from 'react-native';
import GameCenterStyles from '../../styles/gameCenterStyles';
import {rewardItemInALine} from '../../constants/gameCenter/gameCenterConstant';
import {GetRewardIconByKey} from '../../commonFunctions/gameCenterFunctions';


const widthCal = () => {
    let percentage = 100/rewardItemInALine - 4;
    return percentage + '%';
}

const imgWidthCal = (width) => {
    return width / rewardItemInALine - 30;
}

const RewardItem = (props) => {
    const {width} = Dimensions.get('window');

    const {item, clickFunc} = props;

    return (
        <TouchableOpacity
            style={[
                GameCenterStyles.card,
                GameCenterStyles.cardPadding,
                GameCenterStyles.subContainerVertical,
                {width: widthCal()}
            ]} onPress={() => {clickFunc(item)}}>
                <Image
                    resizeMode="contain"
                    style={{width: imgWidthCal(width), height: imgWidthCal(width)}}
                    source={GetRewardIconByKey(item.content.icon)}
                />

                <Text style={[GameCenterStyles.subText, GameCenterStyles.textBold]}>{item.content.name}</Text>
                <Text style={[GameCenterStyles.subText]}>{item.content.points} points</Text>
        </TouchableOpacity>

    );
}

export default RewardItem;
