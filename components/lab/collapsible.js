import React, {useState, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Animated} from 'react-native';
//third party lib
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
//function
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';
import globalStyles from '../../styles/globalStyles';

const high = 'High';
const low = 'Low';

const Collapsible = (props) => {
  const {title, detailArr} = props;
  const [open, setOpen] = useState(true);
  const dropDownAnimation = useRef(new Animated.Value(1)).current;
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const heightInterpolation = dropDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, maxHeight],
  });

  const toggle = (visible) => {
    if (visible) {
      Animated.timing(dropDownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(dropDownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const openAndSetModalContent = (finalValue, item) => {
    item.results = finalValue?.result;
    item.reference = finalValue?.reference;
    setModalContent(item);
    setShowModal(true);
  };

  return (
    <View onLayout={(event) => setMaxHeight(event.nativeEvent.layout.height)}>
      <>
        <TouchableOpacity
          onPress={() => toggle(open)}
          style={[{flexDirection: 'row', padding: '3%'}]}>
          <Text style={styles.headerStyle}>{title}</Text>
          {open ? (
            <Feather name="chevron-up" size={30} color={'#8b8f9a'} />
          ) : (
            <Feather name="chevron-down" size={30} color={'#8b8f9a'} />
          )}
        </TouchableOpacity>
        <View style={styles.border} />
      </>
      {open ? (
        <Animated.View
          style={{
            maxHeight: heightInterpolation,
            paddingBottom: '2%',
          }}>
          {detailArr?.map((item, index) =>
            evaluateValue(item) === '' ? (
              <View style={[styles.border, styles.container]} key={index}>
                <Text style={styles.bold}>{item?.title}</Text>
                <Text style={styles.value}>
                  {item?.value} {item?.units}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.border, styles.container]}
                key={index}
                onPress={() =>
                  openAndSetModalContent(evaluateValue(item), item)
                }>
                <Text style={[styles.bold, {alignSelf: 'center'}]}>
                  {item?.title}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.value, styles.redValue]}>
                    {item?.value} {item?.units}
                  </Text>
                  <Ionicons
                    name="alert-circle-outline"
                    size={30}
                    color={'#ff0844'}
                  />
                </View>
              </TouchableOpacity>
            ),
          )}
        </Animated.View>
      ) : null}
      <MoreInfo
        visible={showModal}
        close={() => setShowModal(false)}
        modalContent={modalContent}
      />
    </View>
  );
};
export default Collapsible;

function evaluateValue(item) {
  if (item?.comparator === '<=') {
    if (item?.value > item?.target[0]) {
      return {
        result: high,
        reference:
          'less than or equals to ' + item?.target[0] + ' ' + item?.units,
      };
    }
  } else if (item?.comparator === '>=') {
    if (item?.value < item?.target[0]) {
      return {
        result: low,
        reference:
          'more than or equals to ' + item?.target[0] + ' ' + item?.units,
      };
    }
  } else if (item?.comparator === '>') {
    if (item?.value <= item?.target[0]) {
      return {
        result: low,
        reference: 'more than ' + item?.target[0] + ' ' + item?.units,
      };
    }
  } else if (item?.comparator === '<') {
    if (item?.value >= item?.target) {
      return {
        result: high,
        reference: 'less than ' + item?.target[0] + ' ' + item?.units,
      };
    }
  } else if (item?.comparator === '<>') {
    if (item?.value <= item?.target[0]) {
      return {
        result: low,
        reference:
          'between ' +
          item?.target[0] +
          '-' +
          item?.target[1] +
          ' ' +
          item?.units +
          ' exclusively',
      };
    }
    if (item?.value >= item?.target[1]) {
      return {
        result: high,
        reference:
          'between ' +
          item?.target[0] +
          '-' +
          item?.target[1] +
          ' ' +
          item?.units +
          ' exclusively',
      };
    }
  } else if (item?.comparator === '=<>=') {
    if (item?.value < item?.target[0]) {
      return {
        result: low,
        reference:
          'between ' +
          item?.target[0] +
          '-' +
          item?.target[1] +
          ' ' +
          item?.units +
          ' inclusively',
      };
    }
    if (item?.value > item?.target[1]) {
      return {
        result: high,
        reference:
          'between ' +
          item?.target[0] +
          '-' +
          item?.target[1] +
          ' ' +
          item?.units +
          ' inclusively',
      };
    }
  }
  return '';
}

class MoreInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {visible, close, modalContent} = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={() => close()}
        onBackdropPress={() => close()}>
        <View style={styles.modalStyle}>
          <Text style={styles.modalHeading}>{modalContent.title}</Text>
          <Text style={styles.text}>
            Your result ({modalContent.value} {modalContent?.units}) is{' '}
            <Text style={[styles.bold, {color: '#ff0844'}]}>
              {modalContent.results}
            </Text>
            , the reference range is {modalContent.reference}.
          </Text>

          <View style={{paddingBottom: '10%'}} />
          <TouchableOpacity
            onPress={() => close()}
            style={[globalStyles.deleteButton, {marginBottom: '3%'}]}>
            <Text style={globalStyles.deleteButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    borderBottomColor: '#e1e7ed',
    borderBottomWidth: 1,
    marginStart: '3%',
    marginEnd: '3%',
  },
  headerStyle: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(20),
    opacity: 0.6,
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    marginStart: '20%',
    padding: '3%',
    justifyContent: 'space-between',
  },
  bold: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: adjustSize(16),
  },
  value: {
    fontFamily: 'SFProDisplay-Regular',
    opacity: 0.6,
    fontSize: adjustSize(16),
  },
  redValue: {
    color: '#ff0844',
    opacity: 1,
    alignSelf: 'center',
    marginEnd: '2%',
  },
  modalStyle: {
    backgroundColor: 'white',
    padding: '3%',
    borderRadius: 15,
  },
  modalHeading: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Bold',
  },
  text: {
    fontSize: adjustSize(18),
    fontFamily: 'SFProDisplay-Regular',
    marginTop: '3%',
    marginBottom: '3%',
  },
});
