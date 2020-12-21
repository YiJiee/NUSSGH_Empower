import React from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
// Functions
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
// Components
import RenderMealItem from './RenderMealItem';
// Others
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import FoodRow from './FoodRow';
import logStyles from '../../../styles/logStyles';
import Modal from 'react-native-modal';

// Props description
// onSelectMeal is a callback function when a meal is selected
// meals is a list of the user's meals, already filtered by record date or favourites.
// options is an object:
//      keys            value description
//      buttons         List<Object> A list of button properties. Example usage:
//                      [
//                          {
//                              icon: {
//                                         name: <String>: Icon name
//                                         color: <String>: Color of icon
//                                     },
//                              onPress: Function<Meal>: Callback when this button for a meal is clicked. E.g. (meal) => alert(meal.mealName)
//                              buttonStyle: <Styles to override button, can specify background color, width and height here>
//                           },
//                           {
//                               text: <String>: Text in button,
//                           }
//                      ]
//
//       header        Function<Meal>: Function that takes in a Meal Object and returns a string to render in the Meal header.
export default function MealList({filterQuery, meals, options, onMealAdd}) {
    const [selectedMeal, setSelectedMeal] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);

    const onMealItemClick = (meal) => {
        setSelectedMeal(meal);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedMeal(null);
        setOpenModal(false);
    }

    const handleAddMeal = (meal) => {
        setSelectedMeal(null);
        setOpenModal(false);
        onMealAdd(meal);
    }

    const filtered = meals.filter(x => x.mealName.toLowerCase().indexOf(filterQuery.trim().toLowerCase()) !== -1);
    return (
        <React.Fragment>
            <FlatList data={filtered}
                      keyExtractor={meal => meal._id}
                      style={{flex: 1}}
                      contentContainerStyle={[styles.listContainer]} renderItem={({item}) =>
                (<RenderMealItem onSelectMeal={() => onMealItemClick(item)} item={item} options={options} />)}
            />
            {
                openModal &&
                <Modal style={{margin: 0, justifyContent: 'flex-end'}} onBackdropPress={handleCloseModal} isVisible={openModal} transparent>
                        <View style={{height: '65%', backgroundColor: '#F7F7FB'}}>
                            <ScrollView contentContainerStyle={[{flexGrow: 1}]}>
                                <View style={[logStyles.bodyPadding]}>
                                    <Icon onPress={handleCloseModal} style={logStyles.componentMargin} color='#4DAA50' name='chevron-down' size={34}/>
                                    <Text style={{fontSize: adjustSize(32), fontWeight: "bold"}}>Meal Info</Text>
                                    <Text style={{fontSize: adjustSize(24), fontWeight: "bold", paddingTop: '3%'}}>{selectedMeal.mealName}</Text>
                                    <Text style={{fontSize: adjustSize(24), fontWeight: "bold", color: '#7d7d7d', paddingTop: '3%'}}>Meal Includes</Text>
                                    {
                                        selectedMeal.foodItems.map(food => (
                                            <FoodRow key={food['food-name']} food={food} />
                                        ))
                                    }
                                </View>
                            </ScrollView>
                            <View style={[styles.buttonContainer, styles.shadow]}>
                                <TouchableHighlight
                                    style={styles.button}
                                    underlayColor="#fff"
                                    onPress={() => handleAddMeal(selectedMeal)}>
                                    <Text style={styles.buttonText}>Add</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                </Modal>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        borderColor: '#cfcfcf',
        flexGrow: 1,
        paddingTop: adjustSize(10)
    },
    button: {
        width: '90%',
        height: adjustSize(55),
        backgroundColor: '#aad326',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: adjustSize(10)
    },
    buttonText: {
        color: '#000',
        textAlign: 'center',
        fontSize: adjustSize(22),
        fontWeight: 'bold',
    },
    buttonContainer: {
        height: adjustSize(150),
        paddingTop: '5%',
        backgroundColor: '#fff'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -adjustSize(5),
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})
//edit flag
