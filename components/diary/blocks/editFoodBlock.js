import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//third party libr
import Modal from 'react-native-modal';
import moment from 'moment';
//styles
import {Colors} from '../../../styles/colors';
import globalStyles from '../../../styles/globalStyles';
import logStyles from '../../../styles/logStyles';
import diaryStyles from '../../../styles/diaryStyles';
//component
import LeftArrowBtn from '../../logs/leftArrowBtn';
import RemoveModal from '../removeModal';
import StepCounter from '../../stepCounter';
//function
import {food_key} from '../../../commonFunctions/logFunctions';
import {editMealLog} from '../../../netcalls/requestsDiary';
import DeleteBin from '../../deleteBin';
import {adjustSize} from '../../../commonFunctions/autoResizeFuncs';

const from_delete = 'delete';
const from_edit = 'edit';

const EditFoodBlock = (props) => {
  const {visible, mealToEdit, initialDate, selectedFood} = props;
  const {closeModal, init} = props;
  const initalMeal = mealToEdit;
  const [quantity, setQuantity] = useState(selectedFood.quantity);
  const [foodItems, setFoodItems] = useState(mealToEdit.foodItems);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    checkChange();
    if (quantity === 0) {
      confirmDeleteItem();
      setChanged(false);
    }
  }, [foodItems, quantity]);

  const checkChange = () => {
    if (checkFoodItemsChange()) {
      setChanged(true);
      return;
    }
    setChanged(false);
    return;
  };

  const submit = (parent) => {
    let newMeal = initalMeal;
    let list = [];
    if (parent === from_delete) {
      list = foodItems.filter((food) => food !== selectedFood);
      console.log(list);
    } else {
      list = foodItems;
    }
    newMeal = {
      ...newMeal,
      foodItems: list,
      recordDate: moment(initialDate).format('DD/MM/YYYY HH:mm:ss'),
    };
    console.log(newMeal);
    editMealLog(newMeal).then((response) => {
      if (response != null) {
        if (parent === from_edit) {
          Alert.alert('Food item edited successfully!', '', [
            {
              text: 'Got It',
              onPress: () => {
                init();
                closeModal();
              },
            },
          ]);
        } else {
          init();
          closeModal();
        }
      }
    });
  };

  const editQuantity = (value) => {
    setQuantity(value);
    const elementIndex = foodItems.findIndex(
      (element) => element['food-name'] === selectedFood['food-name'],
    );
    let newArr = [...foodItems];
    newArr[elementIndex] = {
      ...newArr[elementIndex],
      quantity: value,
    };
    setFoodItems(newArr);
  };

  const deleteItem = () => {
    submit(from_delete);
    setDeleteItemModal(false);
  };

  const confirmDeleteItem = () => {
    console.log('calling delete');
    setDeleteItemModal(true);
  };

  const checkFoodItemsChange = () => {
    for (var x of foodItems) {
      for (var y of initalMeal.foodItems) {
        //check qty change
        if (x['food-name'] === y['food-name']) {
          if (x['quantity'] !== y['quantity']) {
            return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      backdropOpacity={1}
      onBackButtonPress={() => closeModal()}
      backdropColor={Colors.backgroundColor}
      style={{margin: 0}}>
      <View style={globalStyles.pageContainer}>
        <View style={globalStyles.menuBarContainer}>
          <LeftArrowBtn close={closeModal} />
        </View>
        <View style={[logStyles.bodyPadding, {flex: 1}]}>
          <Text style={logStyles.headerText}>Edit</Text>
          <Text style={logStyles.fieldName}>Record Date Time</Text>
          <Text style={logStyles.inputField}>
            {moment(initialDate).format('DD/MM/YYYY HH:mm a')}
          </Text>
          <Text style={logStyles.fieldName}>Number of Servings (s)</Text>
          {foodItem(selectedFood, editQuantity, quantity)}
          {quantity === 0 && (
            <Text style={{fontSize: adjustSize(18), color: 'red', marginTop: '2%'}}>
              *Invalid Quantity for Food
            </Text>
          )}
        </View>
      </View>
      <View style={[globalStyles.buttonContainer]}>
        <View style={{flexDirection: 'row'}}>
          <DeleteBin style={diaryStyles.binIcon} method={confirmDeleteItem} />
          {changed ? (
            <TouchableOpacity
              style={logStyles.enableEditButton}
              onPress={() => submit(from_edit)}>
              <Text style={globalStyles.actionButtonText}>Done</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={logStyles.disableEditButton}>
              <Text style={globalStyles.actionButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Delete a single food item */}
      {deleteItemModal ? (
        <RemoveModal
          visible={deleteItemModal}
          closeModal={() => setDeleteItemModal(false)}
          logType={food_key}
          itemToDeleteName={selectedFood['food-name']}
          deleteMethod={() => deleteItem()}
        />
      ) : null}
    </Modal>
  );
};

function foodItem(item, editQuantity, quantity) {
  let itemName = String(item['food-name']);
  if (String(itemName).length > 26) {
    itemName = itemName.slice(0, 26) + '...';
  }
  return (
    <View style={styles.foodContainer}>
      <Image source={{uri: item.imgUrl.url}} style={styles.foodStyle} />
      <View style={{flex: 1}}>
        <Text style={[diaryStyles.recordedText, styles.foodName]}>
          {itemName}
        </Text>
        <StepCounter
          count={quantity}
          setCount={(value) => editQuantity(value)}
          parameter={''}
          fieldName={''}
          enableInput={false}
          style={{width: '60%', padding: '1%'}}
          incrementValue={0.5}
        />
      </View>
    </View>
  );
}

export default EditFoodBlock;

const styles = StyleSheet.create({
  foodContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: '3%',
  },
  foodStyle: {
    width: adjustSize(90),
    height: adjustSize(90),
    borderRadius: adjustSize(20),
  },
  foodName: {
    flex: 1,
    marginStart: '12%',
  },
  counterStyle: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginStart: '1%',
  },
});
