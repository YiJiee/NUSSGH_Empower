import {requestNutrientConsumption} from "../mealEndpoints/requestMealLog";
import {
    getActivityLogs,
    getActivitySummaries,
    getBloodGlucoseLogs,
    getMedicationLogs,
    getWeightLogs
} from "../requestsLog";
import Moment from 'moment';
import RNFetchBlob from "rn-fetch-blob";
import {exportReportEndpoint} from "../urls";
import {getLastMinuteFromTodayDate} from "../../commonFunctions/common";
import {replaceActivitySummary} from "../../commonFunctions/reportDataFormatter";
import {getPlan} from "../requestsMedPlan";
import {getEntry4Day} from "../requestsDiary";
import {getToken} from "../../storage/asyncStorageFunctions";

let dirs = RNFetchBlob.fs.dirs;

async function getReportsDataForCsv(reportTypes, startDate, endDate) {
    const datestringFormatForLogs = 'YYYY-MM-DD';
    const datestringFormatForNutritionLog = 'DD/MM/YYYY HH:mm:ss';
    let reportsList = {};

    for (const reportType of reportTypes) {
        let data = [];
        if (reportType === 'Blood Glucose') {
            data = (await getBloodGlucoseLogs(Moment(startDate).format(datestringFormatForLogs),
                Moment(endDate).format(datestringFormatForLogs))).logs;
        } else if (reportType === 'Food Intake') {
            data = (await requestNutrientConsumption(Moment(startDate).format(datestringFormatForNutritionLog),
                Moment(endDate).format(datestringFormatForNutritionLog))).data;
        } else if (reportType === 'Medication') {
            data = (await getMedicationLogs(Moment(startDate).format(datestringFormatForLogs),
                Moment(endDate).format(datestringFormatForLogs))).logs;
        } else if (reportType === 'Weight') {
            data = (await getWeightLogs(Moment(startDate).format(datestringFormatForLogs),
                Moment(endDate).format(datestringFormatForLogs))).logs;
        } else if (reportType === 'Activity') {
            data = (await getActivitySummaries(Moment(startDate).format(datestringFormatForLogs),
                Moment(endDate).format(datestringFormatForLogs))).summaries;
        }
        reportsList[reportType] = data;
    }
    return reportsList;
}

// startDate and endDate are moment objects
async function getReportsDataForGraphs(startDate, endDate) {
    //load data
    const foodData = (
        await requestNutrientConsumption(
            startDate.format('DD/MM/YYYY HH:mm:ss'),
            getLastMinuteFromTodayDate(),
        )
    ).data;
    const weightData = (
        await getWeightLogs(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'),
        )
    ).logs;
    const medData = (
        await getMedicationLogs(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'),
        )
    ).logs;
    const bglData = (
        await getBloodGlucoseLogs(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'),
        )
    ).logs;
    const activityData = replaceActivitySummary(
        (
            await getActivitySummaries(
                startDate.format('YYYY-MM-DD'),
                endDate.format('YYYY-MM-DD'),
            )
        ).summaries,
    );
    const medPlan = await getPlan(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
    );

    let result = {
        foodData,
        medData,
        bglData,
        activityData,
        weightData,
        medPlan
    };

    return result;
}

async function exportToPdfRequest(payload) {
    console.log('Exporting pdf... please wait');
    try {
        let resp = await RNFetchBlob.config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            fileCache : true,
            path : dirs.DocumentDir + `/${payload.profile.name}.pdf`
            //appendExt : 'pdf'
        })
            .fetch('POST', exportReportEndpoint, {
                //some headers ..
                'Content-Type' : 'application/json',
                Accept: 'application/pdf',
                Authorization: `Bearer ${await getToken()}`
            }, JSON.stringify(payload));

        console.log(`Successfully exported pdf to ${resp.path()}!`);
        return resp;
    } catch (e) {
        console.log('Error occurred while exporting pdf: ', e);
        return false;
    }

}

export {getReportsDataForCsv, getReportsDataForGraphs, exportToPdfRequest};
