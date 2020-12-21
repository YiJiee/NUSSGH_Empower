import React, {Component} from 'react';
import {Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
//components
import LeftArrowBtn from '../../../components/logs/leftArrowBtn';
import TutorialPage from '../../../components/gameCenter/tutorialPage';
import WordItem from '../../../components/gameCenter/wordItem';

class GameCenter extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    (this.slideRightAnimation = new Animated.Value(0)),
      (this.widthInterpolate = this.slideRightAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').width, 0],
        extrapolate: 'clamp',
      }));
    this.state = {
      availableWords: [],
      games: [],
      activeGame: null,
      chances: 0,
      rewardPoints: 0,
      showTutorial: false,
    };

    this.props.navigation.addListener('focus', () => {
      this.slideRightAnimation.setValue(0);
      this.setAnimation();

      this.init();
    });
  }

  componentDidMount() {
    this.setAnimation();
    this.init();

    console.log('log mount');
  }

  setAnimation() {
    Animated.timing(this.slideRightAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  init = async () => {
    console.log('refresh game center');
    let responseObj = await requestGetOverview();
    this.setState({chances: responseObj.chances});
    this.setState({rewardPoints: responseObj.points});

    this.setState({availableWords: responseObj.available_words});
    this.setState({games: responseObj.games});

    this.setState({activeGame: null});
    if (this.state.games && this.state.games.length > 0) {
      for (let i = 0; i < this.state.games.length; i++) {
        console.log(this.state.games[i].active);
        if (this.state.games[i].active) {
          this.setState({activeGame: this.state.games[i]});
        }
      }
    }
  };

  render() {
    return (
      <View style={globalStyles.pageContainer}>
        <Animated.View
          style={{
            ...globalStyles.pageContainer,
            ...{transform: [{translateX: this.widthInterpolate}]},
          }}>
          <View style={globalStyles.menuBarContainer}>
            <LeftArrowBtn
              close={() => this.props.navigation.navigate('Home')}
            />
          </View>
          <View style={styles.titleWithHintContainer}>
            <Text style={globalStyles.pageHeader}>Game Center</Text>
            <Ionicon
              style={globalStyles.pageIcon}
              name="help-circle-outline"
              size={adjustSize(40)}
              color={Colors.gameColorGreen}
              onPress={() => this.setState({showTutorial: true})}
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
                {this.state.games.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('MyWord', {
                        games: this.state.games,
                      });
                    }}>
                    <Text
                      style={[
                        GameCenterStyles.subText,
                        GameCenterStyles.greenText,
                      ]}>
                      View All
                    </Text>
                  </TouchableOpacity>
                )}
                {this.state.availableWords.length > 0 && (
                  <Ionicon
                    name="add-circle-outline"
                    size={30}
                    color={Colors.gameColorGreen}
                    onPress={() =>
                      this.props.navigation.navigate('StartNewWord', {
                        availableWords: this.state.availableWords,
                      })
                    }
                  />
                )}
              </View>
              <View style={styles.divider} />
              {this.state.activeGame && this.state.activeGame.word !== '' ? (
                <WordItem
                  imageSource={GetIconByWord(this.state.activeGame.word)}
                  wordText={this.state.activeGame.word}
                  percentage={this.state.activeGame.word_progress + '%'}
                  showArrow={true}
                  clickFunc={() => {
                    this.props.navigation.navigate('FillTheCard', {
                      activeGame: this.state.activeGame,
                      chances: this.state.chances,
                    });
                  }}
                />
              ) : (
                <View
                  style={[
                    GameCenterStyles.center,
                    GameCenterStyles.cardPadding,
                  ]}>
                  <Text style={[GameCenterStyles.subText]}>
                    No Word Selected
                  </Text>
                </View>
              )}
            </View>

            <View
              style={[
                GameCenterStyles.card,
                GameCenterStyles.cardPadding,
                GameCenterStyles.subContainer,
              ]}>
              <Text style={GameCenterStyles.subText}>Chances</Text>
              <Text style={GameCenterStyles.subText}>
                {this.state.chances} Left
              </Text>
            </View>

            <View
              style={[
                GameCenterStyles.card,
                GameCenterStyles.cardPadding,
                GameCenterStyles.subContainer,
              ]}>
              <Text style={GameCenterStyles.subText}>Reward Points</Text>
              <Text style={GameCenterStyles.subText}>
                {this.state.rewardPoints} Available
              </Text>
            </View>

            <TouchableOpacity
              style={[
                GameCenterStyles.buttonStyle,
                GameCenterStyles.nextColor,
                GameCenterStyles.marginBottom,
              ]}
              onPress={() => {this.props.navigation.navigate('RedeemPage')}}
            >
              <Text style={globalStyles.actionButtonText}>Redeem</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        <Modal
          isVisible={this.state.showTutorial}
          transparent={true}
          animationType="fade"
          onRequestClose={() => this.setState({showTutorial: false})}>
          <TutorialPage
            closeModal={() => this.setState({showTutorial: false})}
          />
        </Modal>
      </View>
    );
  }
}

export default GameCenter;

const styles = StyleSheet.create({
  titleWithHintContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingVertical: adjustSize(100),
  },
  marginTop: {
    marginTop: adjustSize(15),
  },
  divider: {
    height: 2,
    backgroundColor: Colors.gameColorGrey,
  },
});
