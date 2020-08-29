import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
    Animated,
    Keyboard,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
// Components
import Searchbar from '../../../../components/Searchbar';
import FoodModalContent from '../../../../components/logs/meal/FoodModalContent';
// Functions
import {getToken} from '../../../../storage/asyncStorageFunctions';
// Others
import carbohydrate from '../../../../resources/images/icons/carbohydrate.png';
import energy from '../../../../resources/images/icons/energy.png';
import fat from '../../../../resources/images/icons/fat.png';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {foodSearchEndpoint} from '../../../../netcalls/urls';
import requestFoodSearch from '../../../../netcalls/foodEndpoints/requestFoodSearch';

Icon.loadFont();

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class FoodSearchEngineScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      isLoading: false,
      foodResults: [],
      keyboardShown: false
    };
    this.timeout = setTimeout(() => {}, 0); //Initialise timeout for lazy loading
    this.keyboardHeight = new Animated.Value(0);
    this.listResultY = new Animated.Value(0);
    this.backbuttonOpacity = new Animated.Value(1);
  }

  componentDidMount () {
    this.keyboardWillShowSub = Keyboard.addListener(Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener(Platform.OS == 'android' ? "keyboardDidHide" : 'keyboardWillHide', this.keyboardWillHide);
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
        toValue: -50,
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
        duration: 500,
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
    if (text === '') {
      clearTimeout(this.timeout);
      this.setState({
        query: text,
        isLoading: false,
        foodResults: [],
      });
    } else {
      // Do lazy loading
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

  render() {
    const {navigation, route} = this.props;
    const {query, isLoading, foodResults, keyboardShown} = this.state;
    const type = route.params.type;
    return (
      <AnimatedKeyboardAvoidingView enabled={false} style={[styles.root, {transform: [{translateY: this.listResultY}]}]}>
        <View style={styles.header}>
            <AnimatedIcon name="arrow-left" onPress={navigation.goBack} size={40} style={{opacity: this.backbuttonOpacity}} />
            <Text style={styles.addItemText}>{keyboardShown ? "Search" : "Add Item"}</Text>
        </View>
        <Searchbar
            containerStyle={{marginLeft: 20, marginRight: 20}}
            onChangeText={this.updateQuery}
            onSubmit={this.onSubmit}
        />

        {query === '' ? ( // Render search prompt "Begin your search"
          <View style={styles.searchPromptBody}>
            <Text style={styles.searchPromptText}>Begin your search</Text>
            <Text style={styles.searchHintText}>
              Type in the food name in the
            </Text>
            <Text style={styles.searchHintText}>search bar!</Text>
          </View>
        ) : isLoading ? ( // Render loading progress
          <View style={styles.searchLoading}>
            <ActivityIndicator size="large" color="#B3D14C" />
          </View>
        ) : foodResults.length > 0 ? ( // Render food result list
          <View style={styles.foodSearchResults}>
            <FoodResultList
              navigation={navigation}
              route={route}
              type={type}
              foodList={foodResults}
            />
          </View> // Render no search results
        ) : (
          <View style={styles.searchPromptBody}>
            <Text style={styles.searchPromptText}>
              No results for {query} :(
            </Text>
            <Text style={styles.searchHintText}>Try again with</Text>
            <Text style={styles.searchHintText}>another query!</Text>
          </View>
        )}
      </AnimatedKeyboardAvoidingView>
    );
  }
}

function FoodResultList({foodList, navigation, route, type}) {
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

  const navigateBackToCreateMealLog = () => {
    navigation.navigate('CreateMealLog', {
      item: {...selected},
      type: type,
    });
    handleClose();
  };

  const addFoodToLog = () => {
    // Check if it already exists in the list. If yes, throw alert, otherwise navigate back to create meal log.
    const selectedFoodName = selected['food-name'];
    if (route.params.existingItems.indexOf(selectedFoodName) != -1) {
      // We already have this food item in the cart.
      Alert.alert(
        'Error',
        `${selectedFoodName} is already in your cart! Select something else.`,
        [{text: 'Ok'}],
      );
    } else {
      navigateBackToCreateMealLog();
    }
  };

  const renderFoodListItem = ({item}) => {
    return (
      <TouchableOpacity style={listStyles.li} onPress={() => handleOpen(item)}>
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
      <Modal visible={modalOpen} transparent={true}>
        {selected && (
          <FoodModalContent selected={selected} onClose={handleClose}>
            <TouchableHighlight
              style={styles.button}
              underlayColor="#fff"
              onPress={addFoodToLog}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
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
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  foodDescription: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // position of the food description
    overflow: 'hidden',
    height: '100%',
    borderBottomWidth: 1,
    borderColor: '#E2E7EE'
  },
  foodNameText: {
    fontWeight: 'bold',
  },
  foodServingText: {
    color: '#4d4d4d',
  }
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: '18%',
    padding: 20,
    justifyContent: 'flex-end',
  },
  addItemText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchPromptBody: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchPromptText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  searchHintText: {
    fontSize: 16,
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
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#aad326',
    justifyContent: 'center',
    alignSelf: 'center',
    //transform: [{"translateY": 27.5}] // Half of height
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default FoodSearchEngineScreen;
