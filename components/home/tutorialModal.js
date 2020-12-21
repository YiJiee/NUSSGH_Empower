import React from 'react';
import {Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import InProgress from '../inProgress';
import CrossBtn from '../crossBtn';
import {BackAndForwardButton} from '../BackAndForwardButtons';
import {Pagination} from '../common/Pagination';
import {adjustSize} from '../../commonFunctions/autoResizeFuncs';


const pages = [
    {name: "Logging"},
    {name: "Reports"},
    {name: "Diary"},
]

const TutorialModal = (props) => {
  const [paginateIndex, setPaginateIndex] = React.useState(0);
  const {visible, closeModal, wip, fullScreen} = props;

  const incrementPageIndex = () => {
      if (paginateIndex < pages.length - 1) {
          setPaginateIndex(paginateIndex + 1);
      } else {
          closeModal();
          setPaginateIndex(0);
      }
  }

  const decrementPageIndex = () => {
      if (paginateIndex > 0) {
          setPaginateIndex(paginateIndex - 1);
      }
  }
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={!fullScreen && 0.4}
      onBackButtonPress={() => closeModal()}
      onBackdropPress={closeModal}
      style={fullScreen ? {margin: 0} : {marginTop:adjustSize(50), marginBottom: adjustSize(50)}}
    >
        <View
            style={{
                backgroundColor: Colors.backgroundColor,
                borderRadius: adjustSize(20),
                flex: 1,
                paddingBottom: adjustSize(20),
            }}>
            <View style={[globalStyles.menuBarContainer, {height: adjustSize(80)}]}>
                <CrossBtn close={closeModal} />
            </View>
            {
                wip && <InProgress/>
            }
            {   !wip &&
            (
                <View style={[{paddingTop: adjustSize(20)}]}>
                    <Text style={globalStyles.pageDetails}>{pages[paginateIndex].name}</Text>
                </View>
            )
            }
            <View style={{flex: 1}} />
            <View style={{alignItems: 'center'}}>
                <Pagination numOfPages={3} width={adjustSize(120)} currentPageIndex={paginateIndex} size={adjustSize(10)} />
            </View>
            <BackAndForwardButton onPressForward={incrementPageIndex}
                                  onPressBack={decrementPageIndex}
                                  hideBackButton={paginateIndex === 0}
                                  overrideForwardTitle={paginateIndex === pages.length - 1 ? "Close" : false}
                                  enableForward={()=>true} />
        </View>
    </Modal>
  );
};

export default TutorialModal;
