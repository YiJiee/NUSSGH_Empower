import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
// Components
import Searchbar from '../../Searchbar';
import FoodModalContent from './FoodModalContent';
import FavouriteMealComponent from './FavouriteMeals';
// Functions
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
// Others
import Ionicon from 'react-native-vector-icons/Ionicons';
import {requestFoodSearch} from '../../../netcalls/foodEndpoints/requestFoodSearch';
import {requestMealLogList} from '../../../netcalls/mealEndpoints/requestMealLog';
import globalStyles from '../../../styles/globalStyles';
import logStyles from '../../../styles/logStyles';
import Modal from 'react-native-modal';
import {Colors} from '../../../styles/colors';
import Moment from 'moment';
// third party lib

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);
const AnimatedIcon = Animated.createAnimatedComponent(Ionicon);

const TABS = {
  'Food Search': 'search',
  'Favourites List': 'favourites'
}

export default class FoodSearchEngineScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      favouritesQuery: '',
      isLoading: false,
      foodResults: [],
      keyboardShown: false,
      selectedTab: 'search',
      recentlyAddedFoodItems: [],
    };
    this.timeout = setTimeout(() => {}, 0); //Initialise timeout for lazy loading
    this.keyboardHeight = new Animated.Value(0);
    this.listResultY = new Animated.Value(0);
    this.backbuttonOpacity = new Animated.Value(1);
  }

  componentDidMount () {
    this.keyboardWillShowSub = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener(Platform.OS === 'android' ? "keyboardDidHide" : 'keyboardWillHide', this.keyboardWillHide);
    // Read recently selected food and add them here.
    const endDate = Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
    const startDate = Moment(new Date()).subtract(7, "days").format('YYYY-MM-DD');
    requestMealLogList(startDate, endDate).then(data => {
        let unprocessedRecentFoodItems = [];
        let recentFoodItems = [];
        let tracker = new Set();
        for (const mealLog of data.logs) {
            unprocessedRecentFoodItems = unprocessedRecentFoodItems.concat(mealLog.foodItems);
        }
        for (const food of unprocessedRecentFoodItems) {
            if (!tracker.has(food['food-name'])) {
              tracker.add(food['food-name']);
              recentFoodItems.push(food);
            }
        }
        this.setState({
            isLoading: false,
            recentlyAddedFoodItems: recentFoodItems
        });
    }).catch(err => Alert.alert('Error',err.message, [ { text: 'Ok' }]));
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.setState({keyboardShown: true});
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: true
      }),
      Animated.timing(this.listResultY, {
        duration: 500,
        toValue: Platform.OS === 'android' ? -50 : -50,
        useNativeDriver: true
      }),
      Animated.timing(this.backbuttonOpacity, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true
      }),
    ]).start();
  };

  keyboardWillHide = (event) => {
    this.setState({keyboardShown: false});
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: true
      }),
      Animated.timing(this.listResultY, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true
      }),
        Animated.timing(this.backbuttonOpacity, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true
        }),
    ]).start();
  };

  // handler for making lazy requests.
  updateQuery = (text) => {
    // Update query for food search text input
    if (this.state.selectedTab === TABS["Food Search"]) {
      // query is empty
      if (text === '') {
        clearTimeout(this.timeout);
        this.setState({
          query: text,
          isLoading: false,
          foodResults: [],
        });
      } else {
        // process query and send query request lazily.
        this.setState(
            {
              query: text,
              isLoading: true,
            },
            () => {
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.makeApiCallToFoodSearchEngine();
              }, 500); // 500ms delay before loading API.
            },
        );
      }
    } else {
      // update query for favourites filter
      this.setState({
        favouritesQuery: text
      })
    }
  };

  onSubmit = () => {
    clearTimeout(this.timeout);
    this.setState(
      {
        isLoading: true,
      },
      () => {
        // Fetch api here again
        this.makeApiCallToFoodSearchEngine();
      },
    );
  };

  makeApiCallToFoodSearchEngine = () => {
    requestFoodSearch(this.state.query, 'ALL')
      .then((data) => {
        this.setState({
          foodResults: data.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState(
          {
            isLoading: false,
          },
          () => alert(err.message),
        );
      });
  };

  handleTabChange = (tab) => {
    this.setState({
      selectedTab: tab
    })
  }

  render() {
    const {visible, addMealCallback, addFoodItemCallback, goBack} = this.props;
    const {query, favouritesQuery, isLoading, foodResults, keyboardShown, selectedTab, recentlyAddedFoodItems} = this.state;
    return (
        <Modal isVisible={visible} style={{margin: 0}} backdropColor={Colors.backgroundColor} useNativeDriver={true}>
          <AnimatedKeyboardAvoidingView enabled={true}
                                        style={[logStyles.modalContainer, {transform: [{translateY: this.listResultY}]}]}>
            <View style={[logStyles.menuBarContainer]}>
                <AnimatedIcon name="arrow-back-outline" onPress={goBack} color={'#4DAA50'} size={40} style={{opacity: this.backbuttonOpacity, marginLeft: '2%'}} />
            </View>
            <View style={[logStyles.bodyPadding, {flex: 1}]}>
              <Text style={[logStyles.headerText]}>{keyboardShown ? "Search" : "Add Item"}</Text>
            {
              !keyboardShown &&
              (<View style={[logStyles.componentMargin, styles.tabsContainer]}>
                <TouchableOpacity style={selectedTab === 'search' ? styles.selectedTab : styles.tabs} onPress={() => this.handleTabChange(TABS["Food Search"])}>
                  <Text style={selectedTab === 'search' ? styles.selectedTabText : styles.tabText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selectedTab === 'favourites' ? styles.selectedTab : styles.tabs} onPress={() => this.handleTabChange(TABS["Favourites List"])}>
                  <Text style={selectedTab === 'favourites' ? styles.selectedTabText : styles.tabText}>Favourites</Text>
                </TouchableOpacity>
              </View>)
            }
            {
              selectedTab === 'search' ? (<Searchbar
                  key='searchbar'
                  value={query}
                  containerStyle={logStyles.componentMargin}
                  onChangeText={this.updateQuery}
                  placeholder='Search food'
                  onSubmit={this.onSubmit}
              />) : (<Searchbar
                  key='favourites-searchbar'
                  value={favouritesQuery}
                  containerStyle={logStyles.componentMargin}
                  onChangeText={this.updateQuery}
                  placeholder='Search favourites'
                  onSubmit={this.onSubmit}
              />)
            }
            {
              isLoading && ( // Render loading progress
                  <View style={styles.searchLoading}>
                    <ActivityIndicator size="large" color="#B3D14C" />
                  </View>
              )
            }
            {
              (!isLoading && selectedTab === 'search' && query === '' && recentlyAddedFoodItems.length === 0) &&
                 (
                      <View style={styles.searchPromptBody}>
                        <Text style={styles.searchPromptText}>Begin your search</Text>
                        <Text style={styles.searchHintText}>
                          Type in the food name in the
                        </Text>
                        <Text style={styles.searchHintText}>search bar!</Text>
                      </View>
                  )
            }
            {
              (!isLoading && selectedTab === 'search' && query === '' && recentlyAddedFoodItems.length > 0) && (
                <View style={styles.foodSearchResults}>
                  <Text style={{alignSelf: 'flex-start',
                                paddingTop: 10,fontSize: 20,
                                fontWeight: 'bold', color: '#7d7d7d'}}>
                    Recently added items:
                  </Text>
                  <FoodResultList addFoodItemCallback={addFoodItemCallback}
                                  foodList={recentlyAddedFoodItems}
                  />
                </View>
              )
            }
            {
              (!isLoading && selectedTab === 'search' && query !== '' && foodResults.length > 0) && (
                  <View style={styles.foodSearchResults}>
                    <FoodResultList
                        addFoodItemCallback={addFoodItemCallback}
                        foodList={foodResults}
                    />
                  </View>
              )
            }
            {
              (!isLoading && selectedTab === 'search' && query !== '' && foodResults.length === 0) && (
                  <View style={styles.searchPromptBody}>
                    <Text style={styles.searchPromptText}>
                      No results for {query} :(
                    </Text>
                    <Text style={styles.searchHintText}>Try again with</Text>
                    <Text style={styles.searchHintText}>another query!</Text>
                  </View>
              )
            }
            { selectedTab === 'favourites' && <FavouriteMealComponent filterQuery={favouritesQuery} addMealCallback={addMealCallback} />}
            </View>
          </AnimatedKeyboardAvoidingView>
        </Modal>
    );
  }
}

function FoodResultList({foodList, addFoodItemCallback}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null); // Selected food item modal to show.

  const handleOpen = (item) => {
    setModalOpen(true);
    setSelected(item);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const addFoodToLog = () => {
    handleClose();
    addFoodItemCallback(selected);
  };

  const renderFoodListItem = ({item}) => {
    return (
      <TouchableOpacity style={listStyles.li} onPress={() => handleOpen(item)}>
        <Image source={{uri: item.imgUrl.url}} style={{width: adjustSize(70), height: adjustSize(70), borderRadius: adjustSize(10), marginRight: adjustSize(15)}} />
        <View style={listStyles.foodDescription}>
          <Text style={listStyles.foodServingText}>
            {item['household-measure']}
          </Text>
          <Text style={listStyles.foodNameText}>
            {item['food-name'][0].toUpperCase() + item['food-name'].slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <React.Fragment>
      <Modal isVisible={modalOpen} transparent={true} style={{margin: 0}}>
          {selected && (
              <FoodModalContent selected={selected} onClose={handleClose}>
                <View style={globalStyles.buttonContainer}>
                  <TouchableHighlight
                      style={globalStyles.submitButtonStyle}
                      underlayColor='#fff' onPress={addFoodToLog}>
                    <Text style={[globalStyles.actionButtonText, {color: '#fff'}]}>Add</Text>
                  </TouchableHighlight>
                </View>
              </FoodModalContent>
          )}
      </Modal>
      <FlatList
        style={listStyles.container}
        data={foodList}
        keyExtractor={(item) => item['food-name']}
        renderItem={renderFoodListItem}
      />
    </React.Fragment>
  );
}

// Function to determine color of indicator. In general, red is bad, yellow/orange is okay and green is good.
function getColorFromNutrient({rating}, nutrientName) {
  const Colours = {
    green: '#60A354',
    purple: '#8F31AA',
    yellow: '#F5C444',
    lightBlue: '#7BBFDB',
    blue: '#77B9D2',
    pink: '#E67471',
    white: '#ffffff',
    red: 'red',
    deepBlue: '#5F90D5',
    grey: '#5D5D5D',
  };
  if (nutrientName === 'dietary-fibre' || nutrientName === 'protein') {
    // In this case, the higher the nutrient quantity, the better.
    if (rating === 'high') {
      return Colours.green;
    } else if (rating === 'medium') {
      return Colours.yellow;
    } else if (rating === 'low') {
      return Colours.red;
    }
  } else {
    // In this case, the lower the nutrient quantity, the better.
    if (rating === 'high') {
      return Colours.red;
    } else if (rating === 'medium') {
      return Colours.yellow;
    } else if (rating === 'low') {
      return Colours.green;
    }
  }
}

const listStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  li: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: adjustSize(20),
    paddingBottom: adjustSize(20),
    borderBottomWidth: 1,
    borderColor: '#E2E7EE'
  },
  foodDescription: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center', // position of the food description
    overflow: 'hidden',
    height: '100%',
  },
  foodNameText: {
    fontWeight: 'bold',
  },
  foodServingText: {
    color: '#4d4d4d',
  }
});

const styles = StyleSheet.create({
  searchPromptBody: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchPromptText: {
    fontSize: adjustSize(32),
    fontWeight: 'bold',
  },
  searchHintText: {
    fontSize: adjustSize(16),
    color: '#9f9f9f',
  },
  searchLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodSearchResults: {
    flex: 1,
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '3%',
    marginTop: '3%'
  },
  tabs: {
    height: adjustSize(40),
    width: '45%',
    alignItems: 'center'
  },
  selectedTab: {
    height: adjustSize(35),
    borderBottomWidth: adjustSize(3.5),
    borderColor: '#aad326',
    width: '45%',
    alignItems: 'center'
  },
  tabText: {
    fontSize: adjustSize(20),
    color: '#8d8d8d'
  },
  selectedTabText: {
    color: '#aad326',
    fontSize: adjustSize(20)
  }
});
//edit flag
