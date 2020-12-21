import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import DotRow from './dotRow';
//styles
import GameCenterStyles from '../../styles/gameCenterStyles';


const DotBoard = props => {

    return (
        <View style={[styles.board, GameCenterStyles.cardGreen, GameCenterStyles.cardPadding]}>
            <Image resizeMode="contain" style={GameCenterStyles.subLogo} source={require('../../resources/images/gameCenter/img-header.png')}/>
            {props.boardNum.map((item, index) => (
                <DotRow key={index} row={item} bingoPattern={props.bingoPattern[index]} />
            ))}
        </View>
    );
};

export default DotBoard;

const styles = StyleSheet.create({
    board: {
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});
