import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import GameCenterStyles from '../../styles/gameCenterStyles';
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';


const RedeemSuccessPage = (props) => {
    return (
        <View style={[GameCenterStyles.modalViewSmall, GameCenterStyles.card, GameCenterStyles.cardPadding]}>
            <Text style={[GameCenterStyles.subText, {marginVertical: '5%'}]}>Successfully Redeemed</Text>
            <Ionicon
                name="checkmark-circle-outline"
                size={80}
                color={Colors.gameColorGreen}
                onPress={() => this.setState({showTutorial: true})}
            />
            <TouchableOpacity style={{marginTop: '2%'}} onPress={() => {}}>
                <Text style={[globalStyles.actionButtonText]}>Ok</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RedeemSuccessPage;
