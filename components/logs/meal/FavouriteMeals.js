import React from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// Functions
import {requestFavouriteMealList, requestUnfavouriteMeal} from '../../../netcalls/mealEndpoints/requestMealLog';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
// Others
import MealList from './MealList';
// third party lib
import Modal from 'react-native-modal';

// The screen that contains a list of the user's favourite meals.
export default class FavouriteMealComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            favouriteMeals: [],

            // State var for handling unfavouriting
            showUnfavouriteConfirmation: false,
            targetMealToUnfavourite: null
        }
    }

    componentDidMount() {
        // Get user's favourite meal.
        requestFavouriteMealList().then(data => {
            // Create this temporary observer pattern to handle unfavouriting.
            this.setState({
                isLoading: false,
                favouriteMeals: data.data
            });
        }).catch(err => alert(err.message));
    }

    navigateToCreateMealLogPage = (selectedMeal) => {
        const meal = {...selectedMeal};
        this.props.addMealCallback(meal);
    }

    // confirm unfavourite
    unfavouriteMeal = () => {
        const meal = this.state.targetMealToUnfavourite;
        requestUnfavouriteMeal(meal.mealName)
            .then(data => {
                // unfavourite the item from local state.
                this.setState({
                    favouriteMeals: this.state.favouriteMeals.filter(m => m.mealName !== meal.mealName),
                    showUnfavouriteConfirmation: false
                })
            })
            .catch(err => Alert.alert("Error", err.message, [ { text: 'Ok' }]));
    }

    handleUnfavouriteMeal = (meal) => {
        // Show confirmation
        this.setState({
            showUnfavouriteConfirmation: true,
            targetMealToUnfavourite: meal
        });
    }

    abortUnfavouriteMeal = () => {
        this.setState({
            showUnfavouriteConfirmation: false,
            targetMealToUnfavourite: null
        })
    }

    render() {
        const {isLoading, favouriteMeals, showUnfavouriteConfirmation, targetMealToUnfavourite} = this.state;
        const {filterQuery} = this.props;
        return (
            isLoading ?
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#B3D14C" />
            </View> :
            <View style={styles.root}>
                {
                    <MealList meals={favouriteMeals} filterQuery={filterQuery}
                              onMealAdd={this.navigateToCreateMealLogPage}
                              options={{
                                    buttons: [
                                        {
                                            icon: {
                                                name: 'star',
                                                color: '#aad326'
                                            },
                                            onPress: this.handleUnfavouriteMeal,
                                            buttonStyle: {
                                                width: adjustSize(40)
                                            }
                                        }
                                    ],
                                    header: (meal) => meal.mealName,
                                }}
                          />
                }
                {   showUnfavouriteConfirmation &&
                    <Modal isVisible={showUnfavouriteConfirmation} onBackdropPress={this.abortUnfavouriteMeal}>
                        <View style={{backgroundColor: '#fff', padding: adjustSize(20), width: '85%',
                                        borderRadius: adjustSize(15), justifyContent: 'space-between',
                                        alignSelf: 'center'}}>
                            <Text style={{fontSize: adjustSize(20), paddingTop: '4%', fontFamily: 'SFProDisplay-Bold'}}>
                                Remove from favourites
                            </Text>
                            <Text style={{fontSize: adjustSize(20), paddingTop: '8%', paddingBottom: '8%', fontFamily: 'SFProDisplay-Regular'}}>
                                {targetMealToUnfavourite.mealName}
                            </Text>
                            <TouchableOpacity onPress={this.unfavouriteMeal} style={[styles.removeButton, {marginTop: '4%'}]}>
                                <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>
                                    Remove
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.abortUnfavouriteMeal} style={styles.cancelButton}>
                                <Text style={{fontWeight: 'bold', color: 'red', fontSize: 18}}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    root: {
        flexGrow: 1,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: adjustSize(15)
    },
    removeButton: {
        backgroundColor: 'red',
        borderRadius: adjustSize(10),
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: adjustSize(15)
    }
})
