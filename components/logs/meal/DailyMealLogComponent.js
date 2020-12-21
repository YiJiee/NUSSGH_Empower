import React from 'react';
import {StyleSheet, View} from 'react-native';
// Components
import DateSelectionBlock from '../dateSelectionBlock';
import MealTypeSelectionBlock from './MealTypeSelectionBlock';
import MealFinder from './MealFinder';
import RenderMealItem from './RenderMealItem';
// Others
import Entypo from 'react-native-vector-icons/Entypo';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

Entypo.loadFont();

// stateless component for daily meal log.
function DailyMealLogComponent(props) {
    const { recordDate, mealType, selectedMeal,
        navigation, route, onMealUpdateListener,
        onMealTypeUpdateListener, onDateTimeUpdateListener } = props;

    React.useEffect(() => {
        if (route.params?.meal && route.params.meal !== selectedMeal) {
            const newMeal = route.params.meal;
            onMealUpdateListener(newMeal);
        }
    })

    const handleSelectChange = (value) => {
        onMealTypeUpdateListener(value);
    }

    const handleDeleteMeal = () => {
        // Clear the parameters and then set selected meal to be null.
        navigation.setParams({meal: null});
        onMealUpdateListener(null);
    }

    const handleRecordDateChange = (date) => {
        onDateTimeUpdateListener(date);
    }

    const navigateToCreateMealLogPage = (selectedMeal) => {
        const meal = {...selectedMeal};

        navigation.navigate("CreateMealLog", {
            meal,
            parentScreen: 'DailyLog'
        });
    }

    return (
        <View style={styles.root}>
            <DateSelectionBlock date={recordDate}
                                setDate={handleRecordDateChange} />
            <MealTypeSelectionBlock onSelectChange={handleSelectChange}
                                    defaultValue={mealType} />
            {   // If meal is not selected, display options (create, recent or favourites) for
                // user to select a meal from (MealFinder).
                !selectedMeal ? (
                        <MealFinder navigation={navigation}
                                    parentScreen='DailyLog' />
                    ) : // Meal has been selected, render a preview of the meal for confirmation before submitting.
                    <View style={{width: '100%', flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <RenderMealItem item={selectedMeal}
                                            options={{
                                                buttons: [
                                                    {
                                                        text: 'Remove',
                                                        onPress: handleDeleteMeal,
                                                        buttonStyle: {
                                                            backgroundColor: 'red',
                                                            width: adjustSize(80)
                                                        }
                                                    },
                                                    {
                                                        text: 'Edit',
                                                        onPress: navigateToCreateMealLogPage
                                                    }
                                                ],
                                                header: (meal) => meal.mealName
                                            }}
                            />
                        </View>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: '100%'
    }
})

export default DailyMealLogComponent;
