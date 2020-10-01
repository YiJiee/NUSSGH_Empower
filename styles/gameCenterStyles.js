import {StyleSheet} from 'react-native';
import {Colors} from './colors';


const GameCenterStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        margin: '2%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.gameColorGrey,
    },
    cardGreen: {
        backgroundColor: '#fff',
        margin: '2%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.gameColorGreen,
    },
    cardPadding: {
        paddingHorizontal: '3%',
        paddingVertical: 10,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonStyle: {
        borderRadius: 9.5,
        margin: '2%',
        alignSelf: 'stretch',
        marginBottom: '15%',
        padding: '3%',
    },
    buttonStyleNarrow: {
        borderRadius: 9.5,
        marginVertical: '2%',
        marginHorizontal: '10%',
        alignSelf: 'stretch',
        marginBottom: '15%',
        padding: '3%',
    },
    nextColor:{
        backgroundColor: Colors.gameColorGreen,
    },
    backColor: {
        backgroundColor: Colors.gameColorGrey,
    },
    iconProps: {
        width: 30,
        height: 30,
    },
    subText:{
        fontSize: 20,
    },
    wordText:{
        fontSize: 18,
    },
    greenText:{
        color: Colors.gameColorGreen,
    },
    subContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    subContainerNarrow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    verticalContainer: {
        flex:1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column'
    },
    logo:{
        width:'100%',
        height: undefined,
        aspectRatio:2.5,
    },
    subLogo:{
        width:'80%',
        height: undefined,
        aspectRatio:2.5,
    },
});

export default GameCenterStyles;