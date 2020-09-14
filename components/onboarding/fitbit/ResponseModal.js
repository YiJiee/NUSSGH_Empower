import React from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from "../../../styles/colors";
import {STATUS} from "./Status";
import Ionicon from "react-native-vector-icons/Ionicons";

export default function ResponseModal(props) {
    const {visible, status, closeModal} = props;

    React.useEffect(()=> {
        // automatic close when dialogue is done.
        if (status === STATUS.FINISHED_SUCCESSFULLY || status === STATUS.CANCELLED || status === STATUS.ERROR) {
            setTimeout(closeModal, 1000);
        }
    }, [status]);
    return (
        <Modal isVisible={visible} style={{alignItems: 'center'}}>
            <View style={styles.messageBox}>
                {
                    status === STATUS.IN_PROGRESS ?
                        <Text style={styles.messageText}>Setting up your account</Text>
                        : status === STATUS.CANCELLED ?
                        <Text style={styles.messageText}>Cancelled</Text>
                        : status === STATUS.FINISHED_SUCCESSFULLY ?
                            <Text style={styles.messageText}>Successfully Linked!</Text>
                            : status === STATUS.ERROR ?
                                <React.Fragment>
                                    <Text style={styles.messageText}>Network error.</Text>
                                    <Text style={styles.messageSubText}>Please Try again later</Text>
                                </React.Fragment>
                                : null
                }
                {
                    status === STATUS.IN_PROGRESS ?
                        <ActivityIndicator size='large' color={Colors.backArrowColor} />
                        : status === STATUS.CANCELLED || status == STATUS.ERROR ?
                        <Ionicon name='close-circle-outline' size={60} color={Colors.alertColor}/>
                        : status === STATUS.FINISHED_SUCCESSFULLY ?
                            <Ionicon
                                name="checkmark-circle-outline"
                                color={Colors.backArrowColor}
                                size={60}
                            />
                            : null

                }
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    messageText: {
        fontSize: 20,
        paddingBottom: 10
    },
    messageSubText: {
        fontSize: 16,
        paddingBottom: 10
    },
    messageBox: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});