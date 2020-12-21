import {mealAddLogRequest} from '../netcalls/requestsLog';
import {storeLastMealLog} from '../storage/asyncStorageFunctions';
import Moment from 'moment';

function getDefaultMealType(hours) {
    let defaultMealType = null;
    if (hours >= 12 && hours < 18) {
        defaultMealType = 'lunch';
    } else if (hours >= 18 && hours < 22) {
        defaultMealType = 'dinner'
    } else if (hours >= 22 || hours < 5) {
        defaultMealType = 'supper'
    } else {
        defaultMealType = 'breakfast'
    }
    return defaultMealType;
}

function isValidMeal(meal) {
    return meal.length !== 0;
}

async function handleSubmitMealLog(mealData) {
    const recordDate = mealData.recordDate;
    mealData.recordDate = Moment(recordDate).format("DD/MM/YYYY HH:mm:ss");
    if (isValidMeal(mealData)) {
        let resp = await mealAddLogRequest(mealData);
        if (resp) {
            let storeResp = await storeLastMealLog(
                {
                    value: {...mealData},
                    date: Moment(recordDate).format("YYYY/MM/DD"),
                    time: Moment(recordDate).format("h:mm a"),
                    hour: Moment(recordDate).format("HH:mm:ss")
                });
            return resp;
        }
    }
    return false;
}

export {getDefaultMealType, isValidMeal, handleSubmitMealLog}
//edit flag
