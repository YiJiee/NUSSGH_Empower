import React from 'react';
import {StyleSheet, View} from 'react-native';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {style, children} = this.props;
        return (
            <View style={[styles.shadow, style]}>
                {children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})
