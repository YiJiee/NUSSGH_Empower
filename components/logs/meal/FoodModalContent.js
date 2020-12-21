import React, {useEffect, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// Others
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import CircularProgress from '../../dashboard/todayOverview/CircularProgress';
import logStyles from '../../../styles/logStyles';
import {renderNutrientPercent} from '../../../commonFunctions/common';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const {height, width} = Dimensions.get('window');

const addButtonPadding = 0.18;
// Children prop is any react component passed to serve as a button at the bottom of the modal paper.
export default function FoodModalContent({onClose, selected, children}) {
  const [showImage, setShowImage] = React.useState(false);
  const [showFacts, setShowFacts] = React.useState(false);

  const toggleShowImage = () => {
    setShowImage(!showImage);
  };

  const toggleShowFacts = () => {
    setShowFacts(!showFacts);
  };

  return (
    <View style={logStyles.modalContainer}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={[logStyles.menuBarContainer]}>
          <Ionicon
            name="arrow-back-outline"
            color={'#4DAA50'}
            size={adjustSize(40)}
            onPress={onClose}
            style={{marginLeft: '2%'}}
          />
        </View>
        <View style={[logStyles.bodyPadding, {flex: 1}]}>
          <Text style={[logStyles.headersubText, {fontSize: adjustSize(24)}]}>
            {selected['food-name'][0].toUpperCase() +
              selected['food-name'].slice(1) +
              ' - ' +
              selected['household-measure']}
          </Text>
          <View style={logStyles.componentMargin}>
            <Text style={modalStyles.nutrientHeaderText}>
              Nutrition per serving
            </Text>
            <View
              style={{
                flexDirection: 'row',
                minHeight: adjustSize(100),
                justifyContent: 'space-between',
              }}>
              {renderNutritionCol(selected.nutrients['energy'], 'Cal')}
              {renderNutritionCol(selected.nutrients['carbohydrate'], 'Carb')}
              {renderNutritionCol(selected.nutrients['total-fat'], 'Fat')}
              {renderNutritionCol(selected.nutrients['protein'], 'Protein')}
            </View>
          </View>
          <TouchableOpacity
            style={[logStyles.componentMargin, modalStyles.foodInfoButton]}
            onPress={toggleShowImage}>
            <Text style={modalStyles.foodInfoButtonText}>
              Show Product Image
            </Text>
            <Icon
              name={showImage ? 'chevron-up' : 'chevron-down'}
              size={adjustSize(20)}
              color="#000"
            />
          </TouchableOpacity>
          {showImage && (
            <Image
              source={{uri: selected.imgUrl.url}}
              style={modalStyles.image}
            />
          )}
          <TouchableOpacity
            style={[
              logStyles.componentMargin,
              modalStyles.foodInfoButton,
              {marginTop: adjustSize(15)},
            ]}
            onPress={toggleShowFacts}>
            <Text style={modalStyles.foodInfoButtonText}>
              Show Nutrition Facts
            </Text>
            <Icon
              name={showFacts ? 'chevron-up' : 'chevron-down'}
              size={adjustSize(20)}
              color="#000"
            />
          </TouchableOpacity>
          {showFacts &&
            Object.keys(selected.nutrients).map((nutrient, index) => (
              <View key={nutrient} style={modalStyles.foodInfoRow}>
                <Text style={modalStyles.foodInfoRowNutrientText}>
                  {nutrient[0].toUpperCase() + nutrient.slice(1)}
                </Text>
                <Text style={modalStyles.foodInfoRowQuantityText}>
                  {selected.nutrients[nutrient].amount === 'N.A'
                    ? 'N.A'
                    : selected.nutrients[nutrient].amount +
                      ' ' +
                      selected.nutrients[nutrient].unit}
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>
      {children}
    </View>
  );
}

const colorMap = {
  Cal: '#84C395',
  Carb: '#4EA458',
  Protein: '#265A34',
  Fat: '#aad326',
};

function renderNutritionCol({amount, unit}, nutrient) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    renderNutrientPercent(amount, nutrient).then((value) => {
      if (value > 100) {
        setPercent(100 / 100);
      } else {
        setPercent(value / 100);
      }
    });
  }, []);
  // for now generate a random % and use that as the percentage for the progressbar.
  const color = colorMap[nutrient];

  return (
    <View style={modalStyles.nutrientCol}>
      {amount === 'N.A' ? (
        <React.Fragment>
          <Text style={{color: '#7d7d7d'}}>N.A</Text>
          <Text style={{fontWeight: 'bold'}}>{nutrient}</Text>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <CircularProgress
            color={color}
            percent={percent}
            key={nutrient}
            radius={adjustSize(30)}
            padding={adjustSize(5)}
            strokeWidth={adjustSize(5)}
            fontSize={adjustSize(15)}
          />
          <Text style={{fontWeight: 'bold'}}>{nutrient}</Text>
          <Text style={{color: '#7d7d7d'}}>{amount + ' ' + unit}</Text>
        </React.Fragment>
      )}
    </View>
  );
}

const modalStyles = StyleSheet.create({
  root: {
    backgroundColor: '#F7F7FB',
    flex: 1,
  },
  addButtonWrapper: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    paddingTop: adjustSize(20),
    paddingBottom: height * addButtonPadding,
  },
  foodInfoButtonsContainer: {
    paddingBottom: adjustSize(40),
  },
  foodInfoButton: {
    backgroundColor: '#E3E7EE',
    borderRadius: adjustSize(15),
    height: adjustSize(45),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  foodInfoButtonText: {
    fontWeight: 'bold',
    fontSize: adjustSize(18),
    paddingRight: '2%',
  },
  foodInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e4e4e4',
    marginLeft: adjustSize(20),
    marginRight: adjustSize(20),
  },
  foodInfoRowNutrientText: {
    fontSize: adjustSize(18),
    fontWeight: 'bold',
    paddingTop: '4%',
    paddingBottom: '4%',
  },
  foodInfoRowQuantityText: {
    fontSize: adjustSize(18),
    color: '#7d7d7d',
    paddingTop: '4%',
    paddingBottom: '4%',
  },
  image: {
    width: height * 0.35,
    height: height * 0.35,
    alignSelf: 'center',
    borderRadius: adjustSize(20),
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
  },
  header: {
    height: 0.11 * height,
    justifyContent: 'flex-end',
    marginStart: '4%',
  },
  nutrientCol: {
    width: (width * 0.92 - 40) / 4,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodNameText: {
    fontSize: adjustSize(26),
    fontWeight: 'bold',
    marginStart: '4%',
    marginEnd: '4%',
    paddingBottom: 10,
  },
  nutrientHeaderText: {
    fontSize: adjustSize(20),
    fontWeight: 'bold',
    color: '#8B8A8E',
  },
});
