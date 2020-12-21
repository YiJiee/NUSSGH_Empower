import React, {useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableHighlight,
    ScrollView,
    Image,
    FlatList,
    Alert,
    Platform
} from 'react-native';
import globalStyles from "../../../styles/globalStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Modal from "react-native-modal";
import DatePicker from "react-native-date-picker";
import Moment from 'moment';
import {
    exportToPdfRequest,
    getReportsDataForCsv,
    getReportsDataForGraphs
} from "../../../netcalls/reports/exportReports";
import {getCsvHeader, toCsv} from "../../../commonFunctions/IOFunctions";
import {getLastWeightLog, getUsername} from "../../../storage/asyncStorageFunctions";
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
import {HorizontalSelector} from "../../common/HorizontalSelector";
import {getPatientProfile} from "../../../netcalls/requestsAccount";
import {processData} from "../../../commonFunctions/reportDataFormatter";
import {calculateAdherence, zipMedicationData} from "./MedicationTable";
import ResponseModal from "../../onboarding/fitbit/ResponseModal";
import {STATUS} from "../../onboarding/fitbit/Status";
import {COLOR_MAP, filterAndProcessData} from "./NutritionPie";
import {
    bglLowerBound,
    bglUpperBound, getHealthyCalorieUpperBound, getHealthyWeightRange,
    idealActivityDurationPerDayInMinutes,
    idealStepsPerDay
} from "../../../commonFunctions/common";
import RNFetchBlob from "rn-fetch-blob";
import {defaultRange} from "../../../screens/main/reports";


// fs library
const RNFS = require('react-native-fs');
const pathPrefix = RNFS.DocumentDirectoryPath + '/';

const {width, height} = Dimensions.get('window');

const reportTypes = [
    {name: 'Blood Glucose'},
    {name: 'Food Intake'},
    {name: 'Medication'},
    {name: 'Weight'},
    {name: 'Activity'}
]

const exportFormats = [
    {name: 'PDF'},
    {name: 'CSV'}
]

const defaultExportFormat = 'PDF';

function ExportReportsModal(props) {
    const {visible, setVisible, onSuccessExport} = props;
    const [startDate, setStartDate] = useState(Moment(new Date()).subtract(6, 'days').toDate());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedReportType, setSelectedReportTypes] = useState(reportTypes.map(type =>  {
        return {...type, selected: false};
    }));
    const [exportFormat, setExportFormat] = React.useState(defaultExportFormat);
    const [downloadProgress, setDownloadProgress] = React.useState(0);

    // Takes in report name that will be toggled.
    const updateReportSelected = (reportName) => {
        const newSelectedReports = selectedReportType.map((report, index) => {
           if (report.name === reportName) {
               return {
                   ...report,
                   selected: !report.selected
               }
           } else {
               return report;
           }
        });
        setSelectedReportTypes(newSelectedReports);
    }

    const handleDownloadDone = () => {
        setDownloadProgress(0);
    };

    const handleExport = async () => {
        const srt = selectedReportType.filter(type => type.selected).map(type => type.name);
        //console.log(Moment(endDate).add(1, 'day').clone().diff(Moment(startDate, 'days')));
        if (Moment(endDate).add(1, 'day').clone().diff(Moment(startDate), 'days') < 7) {
            Alert.alert('Export PDF report currently supports at least a difference of 7 days', 'Please make sure that the start and end date have a difference of 7 days.', [
                {
                    text: 'Got It',
                    onPress: () => {},
                },
            ]);
            return ;
        }

        if (srt.length === 0) {
            Alert.alert('Please select at least one report type.', '', [
                {
                    text: 'Got It',
                    onPress: () => {},
                },
            ]);
            return ;
        }

        setDownloadProgress(1);
        if (exportFormat === 'PDF') {
            console.log('EXPORT AS PDF');
            await exportAsPdf(srt);
        } else if (exportFormat === 'CSV') {
            console.log('EXPORT AS CSV');
            await exportAsCsv(srt);
        }
    }

    const exportAsCsv = async (srt) => {
        const reportData = await getReportsDataForCsv(srt, startDate, endDate);
        const startDateString = Moment(startDate).format('DD_MM_YYYY');
        const endDateString = Moment(endDate).format('DD_MM_YYYY');
        const username = await getUsername();
        const promises = [];
        for (const [reportType, data] of Object.entries(reportData)) {
            const filename = `${username}_${reportType}_From_${startDateString}_To_${endDateString}.csv`;
            const fp = pathPrefix + filename;
            const fileContent = toCsv(reportType, data);
            const fileHeader = getCsvHeader(reportType, data);
            const csvFile = fileHeader + '\n' + fileContent;
            // begin writing

            promises.push(
                new Promise((resolve, reject) => {
                    resolve(RNFS.writeFile(fp, csvFile, 'utf8').catch(err => {
                        console.log('Oh no it failed due to ' + err.message.toString());
                    }));
                }))
        }
        Promise.all(promises).then(outcome => {
            console.log(pathPrefix);
            setDownloadProgress(100);
        });
        /*
        const filename = 'MyReports.csv';
        const fp = pathPrefix + filename;
        const srt = selectedReportType.filter(type => type.selected).map(selectedType => selectedType.name).join(', ');
        const message = 'col1,col2,col3,col4\nnext1,next2,next3,next4';
        RNFS.writeFile(fp, message, 'utf8').then(success => {
            console.log(`Yay it worked, ${srt} file(s) saved at ${fp}`);
        }).catch(err => {
            console.log('Oh no it failed due to ' + err.message.toString());
        })
        */
    }

    const exportAsPdf = async (srt) => {

        const datetimeFormat = 'DD/MM/YYYY HH:mm:ss';

        // get full dataset from this range
        let fullDataset = await getReportsDataForGraphs(Moment(startDate), Moment(endDate).add(1, 'day'));

        // get profile information
        let profile = (await getPatientProfile()).patient;
        let weight = 'Not taken yet';
        let lastWeightLog = await getLastWeightLog();

        if (lastWeightLog) {
            weight = lastWeightLog.value;
        }

        // generate payload
        let payload = {
            "profile": {
                "name": profile.first_name,
                "age": profile.age,
                "weight": weight
            },
            "period": {
                "start": Moment(startDate).format(datetimeFormat),
                "end": Moment(endDate).format(datetimeFormat)
            },
            "graphs": {
                "datasets": []
            }
        };

        for (const reportType of srt) {
            if (reportType === 'Blood Glucose') {
                const plot = processData(null, fullDataset.bglData, d=>d.record_date,
                        d=>d.bg_reading, 'average', null);

                const dataset = {
                    "title": reportType,
                    "plots": [
                        {
                            "graph_name": "Average Readings - mmol/L",
                            "type": "line",
                            "x": plot.map(d => Moment(d.x).format(datetimeFormat)),
                            "y": plot.map(d => d.y),
                            "boundary_min": bglLowerBound,
                            "boundary_max": bglUpperBound,
                            "plot_type": "inter-day",
                            "options": {
                                "y_default_min": defaultRange.bglChart.min,
                                "y_default_max": defaultRange.bglChart.max
                            }
                        }
                    ]
                }

                payload.graphs.datasets.push(dataset);
            }

            if (reportType === 'Food Intake') {
                const plot = processData(null, fullDataset.foodData, d=>d.date,
                    d=>d.nutrients.energy.amount, 'sum', null);
                const pieData = filterAndProcessData(fullDataset.foodData, null, ['carbohydrate', 'total-fat', 'protein']);
                const totalSum = pieData.reduce((acc, curr, index) => acc + curr.value, 0);
                const sliceColors = pieData.map(d => COLOR_MAP[d.name]);
                const pieX = pieData.map(d => d.name);
                const pieY = pieData.map(d => totalSum > 0 ? (d.value / totalSum) : 0);

                const healthyCalorieUpBound = await getHealthyCalorieUpperBound();

                const dataset = {
                    "title": reportType,
                    "plots": [
                        {
                            "graph_name": "Total Calories Consumed - kcal",
                            "type": "bar",
                            "x": plot.map(d => Moment(d.x).format(datetimeFormat)),
                            "y": plot.map(d => d.y),
                            "boundary_max": healthyCalorieUpBound,
                            "plot_type": "inter-day",
                            "options": {
                                "y_default_min": defaultRange.calorieChart.min,
                                "y_default_max": defaultRange.calorieChart.max
                            }
                        },
                        {
                            "graph_name": "Nutrition Distribution",
                            "type": "pie-chart",
                            "x": [pieX],
                            "y": [pieY],
                            "y_background_color": [sliceColors]
                        }
                    ]
                }

                payload.graphs.datasets.push(dataset);
            }

            if (reportType === 'Medication') {
                const adherencePlot = calculateAdherence(zipMedicationData(fullDataset.medPlan, fullDataset.medData));
                const dataset = {
                    "title": reportType,
                    "plots": [
                        {
                            "graph_name": "Average Adherence - %",
                            "type": "progress-bar",
                            "x": adherencePlot.map(d=>d.name),
                            "y": adherencePlot.map(d=>d.adherence),
                            "plot_type": "inter-day"
                        }
                    ]
                }

                payload.graphs.datasets.push(dataset);
            }

            if (reportType === 'Weight') {
                const plot = processData(null, fullDataset.weightData, d=>d.record_date,
                    d=>d.weight, 'average', null);

                const healthyWeightRange = await getHealthyWeightRange();
                const dataset = {
                    "title": reportType,
                    "plots": [
                        {
                            "graph_name": "Average progress - kg",
                            "type": "bar",
                            "x": plot.map(d => Moment(d.x).format(datetimeFormat)),
                            "y": plot.map(d => d.y),
                            "plot_type": "inter-day",
                            "boundary_min": healthyWeightRange[0],
                            "boundary_max": healthyWeightRange[1],
                            "options": {
                                "y_default_min": defaultRange.weightChart.min,
                                "y_default_max": defaultRange.weightChart.max
                            }
                        }
                    ]
                }

                payload.graphs.datasets.push(dataset);
            }

            if (reportType === 'Activity') {
                const caloriePlot = processData(null, fullDataset.activityData, d=>d.date,
                    d=>d.calories, 'sum', null);
                const durationPlot = processData(null, fullDataset.activityData, d=>d.date,
                        d=>d.duration, 'sum', null);
                const stepsPlot = processData(null, fullDataset.activityData, d=>d.date,
                        d=>d.steps, 'sum', null);
                const dataset = {
                    "title": reportType,
                    "plots": [
                        {
                            "graph_name": "Total Calories Burnt - kcal",
                            "type": "bar",
                            "x": caloriePlot.map(d => Moment(d.x).format(datetimeFormat)),
                            "y": caloriePlot.map(d => d.y),
                            "plot_type": "inter-day",
                            "options": {
                                "y_default_min": defaultRange.activity.calorieBurntChart.min,
                                "y_default_max": defaultRange.activity.calorieBurntChart.max
                            }
                        },
                        {
                            "graph_name": "Duration - min",
                            "type": "bar",
                            "x": durationPlot.map(d => Moment(d.x).format(datetimeFormat)),
                            "y": durationPlot.map(d => d.y),
                            "plot_type": "inter-day",
                            "boundary_min": idealActivityDurationPerDayInMinutes,
                            "options": {
                                "y_default_min": defaultRange.activity.durationChart.min,
                                "y_default_max": defaultRange.activity.durationChart.max
                            }
                        },
                        {
                            "graph_name": "Steps Taken",
                            "type": "bar",
                            "x": stepsPlot.map(d => Moment(d.x).format(datetimeFormat)),
                            "y": stepsPlot.map(d => d.y),
                            "plot_type": "inter-day",
                            "boundary_min": idealStepsPerDay,
                            "options": {
                                "y_default_min": defaultRange.activity.stepsChart.min,
                                "y_default_max": defaultRange.activity.stepsChart.max
                            }
                        }
                    ]
                }

                payload.graphs.datasets.push(dataset);
            }
        }

        let resp = await exportToPdfRequest(payload);

        if (resp && resp.respInfo.status === 200) {
            setDownloadProgress(100);

            const outputFilePath = resp.path();
            await onSuccessExport(outputFilePath);
            return resp;
        } else {
            Alert.alert("Download error! Please try again later.", '', [
                {
                    text: 'Got It',
                    onPress: () => {},
                },
            ]);
            setDownloadProgress(-1);
            return resp;
        }

    }

    const status = downloadProgress === 0 ?
        STATUS.NOT_STARTED
        : downloadProgress === 100
            ? STATUS.FINISHED_SUCCESSFULLY
            : downloadProgress === -1 ? STATUS.ERROR : STATUS.IN_PROGRESS;

    return (
        <Modal isVisible={visible} style={{margin: 0}}>
            <View style={globalStyles.pageContainer}>
                <ScrollView>
                    <View style={globalStyles.menuBarContainer}>
                        <TouchableOpacity onPress={()=>setVisible(false)}>
                            <Icon name={'chevron-down'} size={adjustSize(34)} color='#16A850' />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '3%'}}>
                        <Text style={globalStyles.pageHeader}>Export</Text>
                        <HorizontalSelector choices={exportFormats}
                                            currentlySelected={exportFormat}
                                            setSelected={setExportFormat} />
                    </View>
                    <Text style={[globalStyles.pageDetails, {color: 'grey'}]}>Select report</Text>
                    <ReportTypeSelector style={globalStyles.pageDetails}
                                        reportTypes={selectedReportType}
                                        updateSelectionCallback={updateReportSelected} />
                    <View style={globalStyles.pageDetails}>
                        <CustomDatePicker date={startDate} label='From' setDate={setStartDate} />
                        <CustomDatePicker date={endDate} label='To' setDate={setEndDate} />
                    </View>
                </ScrollView>
                <View style={{flex: 1}} />
                <View style={globalStyles.buttonContainer}>
                    <TouchableHighlight
                        onPress={handleExport}
                        style={[globalStyles.submitButtonStyle, {backgroundColor: '#aad326'}]}
                        underlayColor='#fff'>
                        <Text style={[globalStyles.actionButtonText, {color: '#000'}]}>Export</Text>
                    </TouchableHighlight>
                </View>
            </View>
            {
                downloadProgress !== 0 && (<ResponseModal
                        visible={downloadProgress}
                        closeModal={handleDownloadDone}
                        status={status}
                        successMessage={'Download success!'}
                        inProgressMessage={'Downloading...'}
                        errorMessage={'Network Error.'}
                        timeoutDuration={2000}
                        disableBackdropPress={true}
                    />)
            }
        </Modal>
    );
}

function CustomDatePicker({date, setDate, label}) {
    const [visible, setVisible] = useState(false);
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const heightInterpolate = slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 225], //I don't know how to get the height of the datepicker but 225 seems to fit it just nice.
        extrapolate: 'clamp',
    });

    const handleOpenCloseWithAnimation = (currentVisibility) => {
        if (currentVisibility) {
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 300, // 300ms slide up animation when visible is set false.
                useNativeDriver: false,
            }).start(() => setVisible(false));
        } else {
            setVisible(true);
            Animated.timing(slideAnimation, {
                toValue: 1,
                duration: 300, // 300ms slide down animation when visible is set true.
                useNativeDriver: false,
            }).start();
        }
    };

    return (
        <View style={{width: '100%'}}>
            <TouchableOpacity onPress={()=>handleOpenCloseWithAnimation(visible)}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    paddingTop: adjustSize(10),
                    paddingBottom: adjustSize(10),
                    borderColor: '#e5e5e5'}}>
                    <Text style={{fontSize: adjustSize(18), fontWeight: 'bold', color: '#8d8d8d'}}>{label}</Text>
                    <Text style={{fontSize: adjustSize(18)}}>{Moment(date).format('DD MMM YYYY')}</Text>
                </View>
            </TouchableOpacity>
            {visible &&
                (<Animated.View
                    style={[
                        styles.slideAnimationWrapperForDatePicker,
                        {height: heightInterpolate},
                    ]}>
                    <DatePicker style={{width}} date={date}
                                onDateChange={setDate}
                                maximumDate={new Date()}
                                mode='date'/>
                </Animated.View>)
            }
        </View>
    )
}

function ReportTypeSelector(props) {
    const {updateSelectionCallback, style} = props;
    return (
        <FlatList data={props.reportTypes} style={style} keyExtractor={i => `report-type-${i.name}`}
                  numColumns={2}
                  renderItem={({item}) => (
                      <View style={{width: '50%', flexDirection: 'row', alignItems: 'center', paddingTop: adjustSize(5), paddingBottom: adjustSize(5)}}>
                          <TouchableOpacity onPress={()=>updateSelectionCallback(item.name)}>
                              {
                                  item.selected ?
                                      <Image style={{width: adjustSize(30), height: adjustSize(30)}}
                                             source={require('../../../resources/images/Patient-Icons/2x/icon-lightgreen-tick-2x.png')} />
                                    : <Image style={{width: adjustSize(30), height: adjustSize(30)}}
                                             source={require('../../../resources/images/Patient-Icons/2x/icon-lightgrey-tick-2x.png')} />
                              }
                          </TouchableOpacity>
                          <Text style={[globalStyles.pageDetails, {fontWeight: 'normal'}]}>{item.name}</Text>
                      </View>
                  )}
        />
    )
}

const styles = StyleSheet.create({
    slideAnimationWrapperForDatePicker: {
        overflow: 'hidden',
        marginStart: '4%',
        marginEnd: '4%',
    },
});

export {ExportReportsModal}
