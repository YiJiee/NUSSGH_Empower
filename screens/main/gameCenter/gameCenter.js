import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
//third party libs
import Ionicon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
//styles
import globalStyles from '../../../styles/globalStyles';
import {Colors} from '../../../styles/colors';
import GameCenterStyles from '../../../styles/gameCenterStyles';
//functions
import {requestGetOverview} from '../../../netcalls/gameCenterEndPoints/requestGameCenter';
import {GetIconByWord} from '../../../commonFunctions/gameCenterFunctions';
//components
import LeftArrowBtn from '../../../components/logs/leftArrowBtn';
import TutorialPage from '../../../components/gameCenter/tutorialPage';
import WordItem from '../../../components/gameCenter/wordItem';



class GameCenter extends Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.slideRightAnimation = new Animated.Value(0),
    this.widthInterpolate = this.slideRightAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Dimensions.get('window').width, 0],
      extrapolate: 'clamp',
    });
    this.availableWords = [];
    this.games = [];
    this.state = {
      activeWord : '',
      chances : 0,
      rewardPoints: 0,
      showTutorial: false,
    }

    this.props.navigation.addListener('focus', () => {
      this.slideRightAnimation.setValue(0);
      Animated.timing(this.slideRightAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      this.refresh();
    });
  }

  refresh = async() => {
    console.log('refresh game center');
    let responseObj = await requestGetOverview();
    this.setState({chances: responseObj.chances});
    this.setState({rewardPoints: responseObj.points});

    this.availableWords = responseObj.available_words;
    this.games = responseObj.games;

    console.log('availableWords : ' + this.availableWords);
    console.log('chances : ' + this.state.chances);
  }

  render() {
    return (
        <View style={globalStyles.pageContainer}>
          <Animated.View
              style={{
                ...globalStyles.pageContainer,
                ...{transform: [{translateX: this.widthInterpolate}]},
              }}>
            <View style={globalStyles.menuBarContainer}>
              <LeftArrowBtn close={() => this.props.navigation.navigate('Home')}/>
            </View>
            <View style={styles.titleWithHintContainer}>
              <Text style={globalStyles.pageHeader}>Game Center</Text>
              <Ionicon
                  style={globalStyles.pageIcon}
                  name="help-circle-outline"
                  size={40}
                  color={Colors.gameColorGreen}
                  onPress={() => this.setState({showTutorial:true})}
              />
            </View>
            <Text style={[globalStyles.pageDetails]}>Season 1: Word Bingo</Text>

            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <Image
                  resizeMode="contain"
                  style={GameCenterStyles.logo}
                  source={require('../../../resources/images/gameCenter/img-header.png')}
              />

              <View style={[GameCenterStyles.card, styles.marginTop]}>
                <View
                    style={[
                      GameCenterStyles.cardPadding,
                      GameCenterStyles.subContainer,
                    ]}>
                  <Text style={GameCenterStyles.subText}>My Word</Text>
                  <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('MyWord');
                      }}>
                    <Text
                        style={[
                          GameCenterStyles.subText,
                          GameCenterStyles.greenText,
                        ]}>
                      View All
                    </Text>
                  </TouchableOpacity>
                  {this.availableWords.length > 0 &&
                    <Ionicon
                        name="add-circle-outline"
                        size={30}
                        color={Colors.gameColorGreen}
                        onPress={() => this.props.navigation.navigate('StartNewWord', {
                          availableWords: this.availableWords
                        })}/>
                  }
                </View>
                <View style={styles.divider}/>
                {this.state.activeWord !== '' ? <WordItem imageSource={GetIconByWord(this.state.activeWord)}
                                               wordText={this.state.activeWord}
                                               percentage={'50%'}
                                               showArrow={true}
                                               clickFunc={() => {
                                                 this.props.navigation.navigate('FillTheCard')
                                               }}/>
                    :
                    <View style={[GameCenterStyles.center, GameCenterStyles.cardPadding]}>
                      <Text style={[GameCenterStyles.subText]}>No Word Selected</Text>
                    </View>}
              </View>

              <View
                  style={[
                    GameCenterStyles.card,
                    GameCenterStyles.cardPadding,
                    GameCenterStyles.subContainer,
                  ]}>
                <Text style={GameCenterStyles.subText}>Chances</Text>
                <Text style={GameCenterStyles.subText}>{this.state.chances} Left</Text>
              </View>

              <View
                  style={[
                    GameCenterStyles.card,
                    GameCenterStyles.cardPadding,
                    GameCenterStyles.subContainer,
                  ]}>
                <Text style={GameCenterStyles.subText}>Reward Points</Text>
                <Text style={GameCenterStyles.subText}>{this.state.rewardPoints} Available</Text>
              </View>

              <TouchableOpacity
                  style={[
                    GameCenterStyles.buttonStyle,
                    GameCenterStyles.nextColor,
                    GameCenterStyles.marginBottom,
                  ]}>
                <Text style={globalStyles.actionButtonText}>Redeem</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>

          <Modal
              isVisible={this.state.showTutorial}
              transparent={true}
              animationType="fade"
              onRequestClose={() => this.setState({showTutorial:false})}>
            <TutorialPage closeModal={() => this.setState({showTutorial:false})}/>
          </Modal>
        </View>
    );
  }
};

export default GameCenter;

const styles = StyleSheet.create({
  titleWithHintContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingVertical: 100,
  },
  marginTop: {
    marginTop: 15,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.gameColorGrey,
  },
});
