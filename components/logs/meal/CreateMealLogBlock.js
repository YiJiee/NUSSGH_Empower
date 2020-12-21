import React from 'react';
import {
    Alert,
    Animated,
    FlatList,
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    UIManager,
    View,
} from 'react-native';
// Components
import FoodModalContent from './FoodModalContent';
import IntegerQuantitySelector from '../../IntegerQuantitySelector';
// Functions
import {requestFavouriteMealList} from '../../../netcalls/mealEndpoints/requestMealLog';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
// Others such as images, icons.
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import FlashMessage from '../../FlashMessage';
import {handleSubmitMealLog, isValidMeal} from '../../../commonFunctions/mealLogFunctions';
import FoodSearchEngineScreen from './FoodSearchEngine';
import SuccessDialogue from '../../successDialogue';
import {food_key} from '../../../commonFunctions/logFunctions';
import globalStyles from '../../../styles/globalStyles';
import logStyles from '../../../styles/logStyles';
import CrossBtn from '../../crossBtn';
import {Colors} from '../../../styles/colors';

Icon.loadFont();
// Any meal log selected (e.g Create, Recent or Favourites)
// will be rendered to this page for confirmation before the submitting to database.

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Global var
const MAXIMUM_ALLOWED_FOOD_QUANTITY = 50;

export default class CreateMealLogBlock extends React.Component {
  constructor(props) {
    super(props);
    // NAMING MUST FOLLOW KEYWORDS FOR STATE ITEMS.
    this.state = {
      foodItems: [],
      isFavourite: false,
      mealName: '',
      selected: null,
      modalOpen: false,
      showFoodSearchEngineModal: false,
      success: false,
    };
  }

  // Animation property for items when they are deleted.
  setAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: {type: LayoutAnimation.Types.easeInEaseOut, springDamping: 0.4},
    });
  };

  redirectToFoodSearchEngine = () => {
    this.setState({
      showFoodSearchEngineModal: true,
    });
  };

  componentDidMount() {
    if (this.props.meal) {
      this.setState(this.props.meal);
    }
  }

  // Callback function to add a food item to this meal log.
  addFoodItemCallback = (item) => {
    const copy = {...item};
    copy.quantity = 1;
    const newFoodItems = this.state.foodItems.map((x) => x);
    const dup = this.state.foodItems.filter(
      (x) => x['food-name'] === item['food-name'],
    );
    if (dup.length > 0) {
      dup[0].quantity += 1;
    } else {
      newFoodItems.push(copy);
    }
    this.setState({
      foodItems: newFoodItems,
      showFoodSearchEngineModal: false,
    });
  };

  // Callback function to add all food items in a meal to this meal log.
  addMealCallback = (meal) => {
    const newFoodItems = this.state.foodItems.map((x) => x);
    for (const newFoodItem of meal.foodItems) {
      const dup = this.state.foodItems.filter(
        (x) => x['food-name'] === newFoodItem['food-name'],
      );
      if (dup.length > 0) {
        dup[0].quantity = Math.min(
          MAXIMUM_ALLOWED_FOOD_QUANTITY,
          newFoodItem.quantity + dup[0].quantity,
        );
      } else {
        newFoodItems.push(newFoodItem);
      }
    }
    this.setState({
      foodItems: newFoodItems,
      showFoodSearchEngineModal: false,
    });
  };

  handleMealNameChange = (text) => {
    this.setState({
      mealName: text,
    });
  };

  toggleFavouriteIcon = (event) => {
    const toggledBoolean = !this.state.isFavourite;
    this.setState({
      isFavourite: toggledBoolean,
    });
  };

  // Find the food item and its index, replace the index with a new food item.
  // Update state with this new state.
  onQuantityChange = (foodName, newQuantity) => {
    const foodItem = this.state.foodItems.filter(
      (food) => food['food-name'] === foodName,
    )[0];
    const index = this.state.foodItems.indexOf(foodItem);
    const newFoodItem = {...foodItem};
    newFoodItem.quantity = newQuantity;
    const newState = {...this.state};
    newState.foodItems[index] = newFoodItem;
    this.setState(newState);
  };

  handleDelete = (foodName) => {
    // Copy the previous state
    const newState = {...this.state};
    // Filter the food item / delete the corresponding food
    newState.foodItems = newState.foodItems.filter(
      (foodItem) => foodItem['food-name'] !== foodName,
    );
    this.setState(newState, this.setAnimation);
  };

  handleModalOpen = (food) => {
    this.setState({
      selected: food,
      modalOpen: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      selected: null,
      modalOpen: false,
    });
  };

  // Check if meal name is not duplicate (if it is favourited).
  // Submit if meal name is not duplicate.
  onSubmitLog = () => {
    const {mealName, isFavourite, foodItems} = this.state;
    const {mealType, recordDate, parent} = this.props;
    if (mealName.trim() === '' && isFavourite) {
      Alert.alert('Error', 'Please give your favourite meal a name', [
        {text: 'Ok'},
      ]);
      return;
    }

    if (!isValidMeal(foodItems)) {
      Alert.alert('Error', 'Your meal cannot be empty :(', [{text: 'Ok'}]);
      return;
    }

    const meal = {
      mealName,
      isFavourite,
      foodItems,
      recordDate,
      mealType,
    };
    if (isFavourite) {
      requestFavouriteMealList()
        .then((data) => {
          // Duplicate favourite meal name
          if (data.data.filter((m) => m.mealName === mealName).length !== 0) {
            Alert.alert(
              'Error',
              `There is already another favourite meal with the same name as ${mealName}`,
              [{text: 'Ok'}],
            );
            return;
          } else {
            handleSubmitMealLog(meal).then((resp) => {
              this.setState({success: true});
            });
          }
        })
        .catch((err) => alert(err.message));
    } else {
      console.log(meal);
      handleSubmitMealLog(meal).then((resp) => {
        this.setState({success: true});
      });
    }
  };

  handleSuccessLog = () => {
    this.setState({
      success: false,
    });
    this.props.closeModal();
    this.props.closeParent();
  };

  render() {
    const {
      isFavourite,
      mealName,
      selected,
      modalOpen,
      foodItems,
      showFoodSearchEngineModal,
      success,
    } = this.state;
    const {
      mealType,
      recordDate,
      parent,
      closeModal,
      closeParent,
      visible,
    } = this.props;
    return (
      <Modal visible={visible} transparent={true}>
        <View style={[logStyles.modalContainer, styles.root]}>
          <View style={[logStyles.menuBarContainer, {paddingLeft: '4%'}]}>
            <CrossBtn close={closeModal} />
            <View style={{flex: 1}} />
          </View>
          <View style={[logStyles.bodyPadding, {flex: 1}]}>
            <Text style={[logStyles.headerText]}>Add Meal</Text>
            <View style={styles.mealNameTextAndIcon}>
              <TextInput
                style={[styles.mealNameTextInput, logStyles.componentMargin]}
                placeholder="Give your meal a name! (optional)"
                value={mealName}
                onChangeText={this.handleMealNameChange}
              />
              <Icon
                name="star"
                size={adjustSize(40)}
                color={isFavourite ? '#B3D14C' : '#e4e4e4'}
                onPress={this.toggleFavouriteIcon}
                style={styles.favouriteIcon}
              />
            </View>
            <Text
              style={[
                logStyles.componentMargin,
                {fontSize: adjustSize(18), color: '#8A8A8E', fontWeight: 'bold'},
              ]}>
              Food intake
            </Text>
            <TouchableOpacity onPress={this.redirectToFoodSearchEngine}>
              <View
                style={[
                  logStyles.componentMargin,
                  {flexDirection: 'row', alignItems: 'center'},
                ]}>
                <Icon name="plus-square" size={adjustSize(30)} color="#4DAA50" />
                <Text
                  style={{fontSize: adjustSize(18), color: '#4DAA50', paddingLeft: adjustSize(7.5)}}>
                  Add Item
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{flex: 1, paddingBottom: adjustSize(15)}}>
              <FlatList
                data={foodItems}
                showScrollIndicator={false}
                keyExtractor={(i) => i['food-name']}
                renderItem={({item}) => (
                  <FoodItem
                    item={item}
                    onImagePress={() => this.handleModalOpen(item)}
                    handleDelete={() => this.handleDelete(item['food-name'])}
                    onQuantityChange={(val) =>
                      this.onQuantityChange(item['food-name'], val)
                    }
                  />
                )}
              />
            </View>
          </View>
          <View style={globalStyles.buttonContainer}>
            <TouchableHighlight
              style={globalStyles.submitButtonStyle}
              underlayColor="#fff"
              onPress={this.onSubmitLog}>
              <Text style={[globalStyles.actionButtonText, {color: '#fff'}]}>
                Submit
              </Text>
            </TouchableHighlight>
          </View>
          <FlashMessage
            triggerValue={this.state.isFavourite}
            offsetY={150}
            renderFlashMessageComponent={(val) =>
              val ? (
                <View
                  style={{
                    backgroundColor: Colors.leftArrowColor,
                    borderRadius: adjustSize(20),
                    paddingLeft: adjustSize(15),
                    paddingRight: adjustSize(15),
                    height: adjustSize(50),
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: adjustSize(24), fontWeight: 'bold'}}>
                    Favourited!
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: Colors.alertColor,
                    borderRadius: adjustSize(20),
                    height: adjustSize(50),
                    paddingLeft: adjustSize(15),
                    paddingRight: adjustSize(15),
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: adjustSize(24), fontWeight: 'bold'}}>
                    Unfavourited!
                  </Text>
                </View>
              )
            }
            messageComponentHeight={adjustSize(50)}
          />
          <Modal visible={modalOpen} coverScreen={true}>
            {selected && (
              <FoodModalContent
                onClose={this.handleCloseModal}
                selected={selected}>
                <View style={globalStyles.buttonContainer}>
                  <TouchableHighlight
                    style={globalStyles.submitButtonStyle}
                    underlayColor="#fff"
                    onPress={this.handleCloseModal}>
                    <Text
                      style={[globalStyles.actionButtonText, {color: '#fff'}]}>
                      Close
                    </Text>
                  </TouchableHighlight>
                </View>
              </FoodModalContent>
            )}
          </Modal>
          {success && (
            <SuccessDialogue
              visible={success}
              type={food_key}
              closeSuccess={this.handleSuccessLog}
            />
          )}
          {showFoodSearchEngineModal && (
            <FoodSearchEngineScreen
              addFoodItemCallback={this.addFoodItemCallback}
              addMealCallback={this.addMealCallback}
              goBack={() => this.setState({showFoodSearchEngineModal: false})}
              visible={showFoodSearchEngineModal}
            />
          )}
        </View>
      </Modal>
    );
  }
}

// Handle delete should:
// Box out animation before calling handleDelete method. Shrink size animated can do the trick.
function FoodItem({onImagePress, item, handleDelete, onQuantityChange}) {
  // Item here refers to the food object.
  // render view for foodObj
  const boxOutAnimation = React.useRef(new Animated.Value(1)).current;

  const handleDeleteWithAnimation = () => {
    // Run animation first.
    Animated.timing(boxOutAnimation, {
      toValue: 0,
      duration: 500, // 0.5 second box out time
      useNativeDriver: false,
    }).start(() => {
      handleDelete();
      boxOutAnimation.setValue(1);
    });
  };

  let foodName =
    item['food-name'][0].toUpperCase() + item['food-name'].slice(1);
  const adjustedFontSize = 20;
  if (foodName.length > 20) {
    foodName = foodName.slice(0, 20) + '...';
  }
  return (
    <TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.foodItem,
          {
            opacity: boxOutAnimation,
            transform: [{scaleX: boxOutAnimation}, {scaleY: boxOutAnimation}],
          },
        ]}>
        <TouchableWithoutFeedback onPress={onImagePress}>
          <Image
            source={{uri: item.imgUrl.url}}
            style={{width: adjustSize(65), height: adjustSize(65), borderRadius: adjustSize(10)}}
          />
        </TouchableWithoutFeedback>
        <View style={styles.foodTextWrapper}>
          <Text style={{fontSize: adjustedFontSize}}>{foodName}</Text>
          <IntegerQuantitySelector
            value={item.quantity}
            changeAmount={0.5}
            minValue={0.5}
            maxValue={50}
            buttonColor="#288259"
            onChange={onQuantityChange}
          />
        </View>
        <View style={{width: '10%'}}>
          <Icon
            name="trash"
            color="red"
            size={adjustSize(30)}
            onPress={handleDeleteWithAnimation}
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mealNameTextAndIcon: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: adjustSize(20),
    alignItems: 'center',
  },
  mealNameTextInput: {
    height: adjustSize(50),
    padding: adjustSize(10),
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: adjustSize(5),
    flex: 1,
  },
  favouriteIcon: {
    paddingLeft: adjustSize(20),
  },
  button: {
    ...globalStyles.buttonContainer,
  },
  foodItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e8e8e8',
    borderBottomWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  foodTextWrapper: {
    paddingLeft: adjustSize(10),
    width: adjustSize(80),
    height: adjustSize(40),
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
});
//edit flag
