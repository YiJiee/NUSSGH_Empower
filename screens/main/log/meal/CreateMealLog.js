import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    TextInput,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import main from '../../../../resources/images/icons/meal.png';
import beverage from '../../../../resources/images/icons/mug.png';
import side from '../../../../resources/images/icons/salad.png';
import dessert from '../../../../resources/images/icons/parfait.png';
import ImageWithBadge from "../../../../components/ImageWithBadge";
import ProgressBar from "../../../../components/progressbar";
import FoodModalContent from "./FoodModalContent";

Icon.loadFont()
// Any meal log selected (e.g Create, Recent or Favourites)
// will be rendered to this page for confirmation before the submitting to database.

export default class CreateMealLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beverage: [],
            main: [],
            side: [],
            dessert: [],
            isFavourite: false,
            mealName: "",
            selected: null,
            modalOpen: false
        }
    }

    redirectToFoodSearchEngine = (type) => () => {
        this.props.navigation.push('FoodSearchEngine', {
            type: type,
            fullScreen: true
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.route.params?.item !== this.props.route.params?.item) {
            const { type, item } = this.props.route.params;
            const newState = {...this.state};
            newState[type].push(item);
            this.setState(newState, () => console.log(this.state));
        }
    }

    handleMealNameChange = (text) => {
        this.setState({
            mealName: text
        })
    }

    toggleFavouriteIcon = (event) => {
        const toggledBoolean = !this.state.isFavourite;
        this.setState({
            isFavourite: toggledBoolean
        })
    }

    handleDelete = (food, type) => {
        // Copy the previous state
        const newState = {...this.state};
        // Filter the food item / delete the corresponding food
        newState[type] = newState[type].filter(foodItem => foodItem !== food);
        this.setState(newState)
    }

    handleModalOpen = (food) => {
        this.setState({
            selected: food,
            modalOpen: true
        })
    }

    handleCloseModal = () => {
        this.setState({
            selected: null,
            modalOpen: false
        })
    }

    render() {
        const {navigation, route} = this.props;
        const {isFavourite, mealName, selected, modalOpen} = this.state;
        // DO NOT UNPACKAGE or DECOMPOSE beverage, main, side and dessert from state here because the render function
        // currently looks for the images beverage, main, side and dessert from imports.
        // Outside this render function, it is safe to unpackage / decompose the state fields.
        return (
            <ScrollView>
                <View contentContainerStyle={styles.root}>
                    <View style={styles.mealNameTextAndIcon}>
                        <TextInput
                            style={styles.mealNameTextInput}
                            placeholder="Enter Meal Name (optional)"
                            value={mealName}
                            onChangeText={this.handleMealNameChange}
                        />
                        <Icon name="star" size={40} color={isFavourite ? "#B3D14C" : "#e4e4e4"}
                              onPress={this.toggleFavouriteIcon}
                              style={styles.favouriteIcon}/>
                    </View>
                    <View>
                        <ScrollView horizontal={true} contentContainerStyle={styles.rowContent}>
                            <FoodTypeLabel
                                containerStyle={styles.foodItem}
                                imageStyle={styles.foodImage}
                                alignment='center'
                                value="Beverage" img={beverage}/>
                            {   // Render food list for cart items in beverage.
                                this.state.beverage.map((food, index) => <FoodItem item={food} handleDelete={() => {
                                    // Handle delete for this food item in the cart.
                                        this.handleDelete(food, "beverage");
                                    }
                                } onPress={() => this.handleModalOpen(food)} />)
                            }
                            <FoodItem type="create" onPress={this.redirectToFoodSearchEngine("beverage")} />
                        </ScrollView>
                        <ScrollView horizontal={true} contentContainerStyle={styles.rowContent}>
                            <FoodTypeLabel
                                containerStyle={styles.foodItem}
                                imageStyle={styles.foodImage}
                                alignment='center'
                                value="Main" img={main}/>
                            {   // Render food list for cart items in main.
                                this.state.main.map((food) => <FoodItem item={food} handleDelete={() => {
                                    // Handle delete for this food item in the cart.
                                        this.handleDelete(food, "main");
                                    }
                                } onPress={() => this.handleModalOpen(food)} />)
                            }
                            <FoodItem type="create" onPress={this.redirectToFoodSearchEngine("main")} />
                        </ScrollView>
                        <ScrollView horizontal={true} contentContainerStyle={styles.rowContent}>
                            <FoodTypeLabel
                                containerStyle={styles.foodItem}
                                imageStyle={styles.foodImage}
                                alignment='center'
                                value="Side" img={side}/>
                            {   // Render food list for cart items in side.
                                this.state.side.map((food) => <FoodItem item={food} handleDelete={() => {
                                    // Handle delete for this food item in the cart.
                                        this.handleDelete(food, "side");
                                    }
                                } onPress={() => this.handleModalOpen(food)} />)
                            }
                            <FoodItem type="create" onPress={this.redirectToFoodSearchEngine("side")} />
                        </ScrollView>
                        <ScrollView horizontal={true} contentContainerStyle={styles.rowContent}>
                            <FoodTypeLabel
                                containerStyle={styles.foodItem}
                                imageStyle={styles.foodImage}
                                alignment='center'
                                value="Dessert" img={dessert}/>
                            {   // Render food list for cart items in dessert.
                                this.state.dessert.map((food) => <FoodItem item={food} handleDelete={() => {
                                    // Handle delete for this food item in the cart.
                                        this.handleDelete(food, "dessert");
                                    }
                                } onPress={() => this.handleModalOpen(food)} />)
                            }
                            <FoodItem type="create" onPress={this.redirectToFoodSearchEngine("dessert")} />
                        </ScrollView>
                        <TouchableHighlight
                            style={styles.button}
                            underlayColor='#fff'>
                            <Text style={styles.buttonText}>Submit Log!</Text>
                        </TouchableHighlight>
                        <Modal visible={modalOpen} transparent={true}>
                            {selected &&
                            <FoodModalContent onClose={this.handleCloseModal} selected={selected}/>
                            }
                        </Modal>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

function EmptyButton({onPress}) {
    return (
        <TouchableHighlight
            style={styles.emptyButton}
            underlayColor='#fff'
            onPress={onPress}>
            <Text style={styles.buttonText}>+</Text>
        </TouchableHighlight>
    )
}

function FoodItem({onPress, item, type, handleDelete}) {
    // Item here refers to the food object.
    if (type === 'create' ) {
        return (
            <View style={styles.foodItem}>
                <EmptyButton onPress={onPress}/>
                <View style={styles.foodTextWrapper}>
                </View>
            </View>
        )
    } else {
        // render view for foodObj
        const adjustedFontSize = item["food-name"].length > 15 ? 10 : 15;
        return (
            <TouchableWithoutFeedback styles={styles.foodItem} onPress={onPress}>
                <View style={styles.foodItem}>
                    <ImageWithBadge
                        containerStyle={styles.foodImage}
                        imageProps={{source: {uri: item.imgUrl.url}}}
                        badgeIcon={<Icon name="times" size={12.5} onPress={handleDelete} color='#fff'/>}
                        badgeSize={12.5}
                        badgeColor="red"/>
                    <View style={styles.foodTextWrapper}>
                        <Text style={{fontSize: adjustedFontSize}}>{item["food-name"][0].toUpperCase() + item["food-name"].slice(1)}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

function FoodTypeLabel({img, containerStyle, imageStyle, textStyle, alignment, value}) {

    return (
        <View style={containerStyle}>
            <Image style={imageStyle} source={img}/>
            <View style={alignment === "center" ? styles.foodTextWrapper : null}>
                <Text style={textStyle}>{value}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        backgroundColor: '#ffffff'
    },
    mealNameTextAndIcon: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 45,
        alignItems: 'center'
    },
    mealNameTextInput: {
        height: 50,
        padding: 10,
        borderColor: '#4d4d4d',
        borderWidth: 1,
        borderRadius: 5,
        flex: 1
    },
    favouriteIcon: {
        paddingLeft: 20
    },
    rowContent: {
        display: 'flex',
        flexDirection: 'row',
        height: 150,
    },
    button:{
        marginRight:40,
        marginLeft:40,
        marginBottom:20,
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#aad326',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    emptyButton: {
        width: 80,
        height: 80,
        backgroundColor: '#e4e4e4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    foodImage: {
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText:{
        color:'#000',
        textAlign:'center',
        fontSize: 22,
        fontWeight: 'bold'
    },
    foodItem: {
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        alignItems: 'center',
    },
    foodTextWrapper: {
        display: 'flex',
        paddingTop: 8,
        alignItems: 'center',
        width: 80
    }
});