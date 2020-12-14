import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, TouchableHighlight, ScrollView, Image, FlatList} from 'react-native';
import globalStyles from "../../../styles/globalStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Modal from "react-native-modal";
import DatePicker from "react-native-date-picker";
import Moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {getReportsData} from "../../../netcalls/reports/exportReports";
import {getCsvHeader, toCsv} from "../../../commonFunctions/IOFunctions";
import {getUsername} from "../../../storage/asyncStorageFunctions";
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';
import {HorizontalSelector} from "../../common/HorizontalSelector";


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
    const {visible, setVisible} = props;
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedReportType, setSelectedReportTypes] = useState(reportTypes.map(type =>  {
        return {...type, selected: false};
    }));
    const [exportFormat, setExportFormat] = React.useState(defaultExportFormat);

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

    const handleExport = async () => {
        if (exportFormat === 'PDF') {
            console.log('EXPORT AS PDF');
            await exportAsPdf();
        } else if (exportFormat === 'CSV') {
            console.log('EXPORT AS CSV');
        }
    }

    const exportAsCsv = async () => {
        const srt = selectedReportType.filter(type => type.selected).map(type => type.name);
        const reportData = await getReportsData(srt, startDate, endDate);
        const startDateString = Moment(startDate).format('DD_MM_YYYY');
        const endDateString = Moment(endDate).format('DD_MM_YYYY');
        const username = await getUsername();
        for (const [reportType, data] of Object.entries(reportData)) {
            const filename = `${username}_${reportType}_From_${startDateString}_To_${endDateString}.csv`;
            const fp = pathPrefix + filename;
            const fileContent = toCsv(reportType, data);
            const fileHeader = getCsvHeader(reportType, data);
            const csvFile = fileHeader + '\n' + fileContent;
            // begin writing

            RNFS.writeFile(fp, csvFile, 'utf8').then(success => {
                console.log(`Yay it worked, ${srt} file(s) saved at ${fp}`);
            }).catch(err => {
                console.log('Oh no it failed due to ' + err.message.toString());
            });
        }
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

    const exportAsPdf = async () => {
        let resp = await RNFetchBlob.config({
                // add this option that makes response data to be stored as a file,
                // this is much more performant.
                fileCache : true,
                appendExt : 'pdf'
            })
            .fetch('POST', 'http://localhost:8080/report-pdf-builder', {
                //some headers ..
                'Content-Type' : 'application/json',
                Accept: 'application/pdf'
            }, JSON.stringify({
                "profile": {
                    "name": "Jimmy",
                    "period": "14 Aug 2020 to 20 Aug 2020",
                    "age": 32,
                    "weight": 59
                },
                "graphs": {
                    "datasets": [
                        {
                            "title": "Blood Glucose",
                            "plots": [
                                {
                                    "graph_name": "Readings - mmol/L",
                                    "type": "line",
                                    "x": ["14/08/2020 00:00:00", "15/08/2020 00:00:00", "16/08/2020 00:00:00", "17/08/2020 00:00:00", "18/08/2020 00:00:00", "19/08/2020 00:00:00", "20/08/2020 00:00:00"],
                                    "y": [12, 19, 3, 5, 5, 3, 7],
                                    "boundary_min": 4.0,
                                    "boundary_max": 7.0,
                                    "plot_type": "inter-day"
                                },
                                {
                                    "graph_name": "Readings2 - mmol/L",
                                    "type": "line",
                                    "x": ["14/08/2020 00:00:00", "15/08/2020 00:00:00", "16/08/2020 00:00:00", "17/08/2020 00:00:00", "18/08/2020 00:00:00", "19/08/2020 00:00:00", "20/08/2020 00:00:00"],
                                    "y": [1, 1, 3, 5, 5, 3, 2],
                                    "boundary_min": 2.0,
                                    "boundary_max": 4.0,
                                    "plot_type": "inter-day"
                                },
                                {
                                    "graph_name": "Readings3 - mmol/L",
                                    "type": "line",
                                    "x": ["14/08/2020 00:00:00", "15/08/2020 00:00:00", "16/08/2020 00:00:00", "17/08/2020 00:00:00", "18/08/2020 00:00:00", "19/08/2020 00:00:00", "20/08/2020 00:00:00"],
                                    "y": [1, 1, 3, 5, 5, 3, 4],
                                    "boundary_min": 2.0,
                                    "boundary_max": 4.0,
                                    "plot_type": "inter-day"
                                }
                            ]
                        },
                        {
                            "title": "Food Intake",
                            "plots": [
                                {
                                    "graph_name": "Calories consumed - kcal",
                                    "type": "bar",
                                    "x": ["14/08/2020 00:00:00", "15/08/2020 00:00:00", "16/08/2020 00:00:00", "17/08/2020 00:00:00", "18/08/2020 00:00:00", "19/08/2020 00:00:00", "20/08/2020 00:00:00"],
                                    "y": [1800, 2400, 1900, 2200, 2100, 1950, 2040],
                                    "plot_type": "inter-day"
                                },
                                {
                                    "graph_name": "Fat consumed - grams",
                                    "type": "bar",
                                    "x": ["14/08/2020 00:00:00", "15/08/2020 00:00:00", "16/08/2020 00:00:00", "17/08/2020 00:00:00", "18/08/2020 00:00:00", "19/08/2020 00:00:00", "20/08/2020 00:00:00"],
                                    "y": [210, 165, 340, 540, 195, 425, 377],
                                    "plot_type": "inter-day"
                                }
                            ]
                        },
                        {
                            "title": "Medication",
                            "plots": [
                                {
                                    "graph_name": "Average adherence - %",
                                    "type": "progress-bar",
                                    "x": ["Metformin - 500mg", "Insulin - 1 bolus", "Metformin - 500mg", "Insulin - 1 bolus", "Metformin - 500mg", "Insulin - 1 bolus"],
                                    "y": [0.75, 0.8, 0.5, 0.6, 0.7, 0.4],
                                    "plot_type": "inter-day"
                                }
                            ]
                        }
                    ]
                }
            }));
        console.log(resp.path());
    }

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
