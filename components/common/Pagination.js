import React from 'react';
import {StyleSheet, View} from 'react-native';

// Just a very simple pagination ui.
function Pagination(props) {
    const {numOfPages, currentPageIndex, size, width} = props;
    const paginationSize = size || 10;

    const pages = makePagination(numOfPages);
    return (
        <View style={{width, height: paginationSize * 2, flexDirection: 'row', justifyContent: 'space-between'}}>
            {
                pages.map((page, index) => (
                    <View style={{backgroundColor: currentPageIndex === index ? "#aad326" : '#E1E7ED',
                        width: paginationSize * 2,
                        height: paginationSize * 2,
                        borderRadius: paginationSize}} />
                ))
            }
        </View>
   );
}

function makePagination(numOfPages) {
    let result = [];
    for (let i = 0; i < numOfPages; i++) {
        result.push(i);
    }
    return result;
}

const styles = StyleSheet.create({

});

export {Pagination};
