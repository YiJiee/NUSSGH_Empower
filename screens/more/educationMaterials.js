import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import LeftArrowBtn from '../../components/logs/leftArrowBtn';
import { ResourcesTab } from "../../components/education/ResourcesTab";
import { getArticles, getHypoCorrectionFoodArticles } from "../../netcalls/education/educationEndpoints";
import { EducationMediaRow } from "../../components/education/EducationMediaRow";
import { HypoCorrectionFoodRow } from "../../components/education/HypoCorrectionFoodRow";
import Modal from 'react-native-modal';
import FoodModalContent from "../../components/logs/meal/FoodModalContent";
import { adjustSize } from '../../commonFunctions/autoResizeFuncs';


const EducationMaterialsScreen = (props) => {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [educationalContent, setEducationalContent] = React.useState([]);
    const [hypocorrectionFoodContent, setHypocorrectionFoodContent] = React.useState([]);

    const [selectedFood, setSelectedFood] = React.useState(null);

    React.useEffect(() => {
        if (isLoading) {
            // Load data
            getArticles().then(articles => {
                setEducationalContent(articles.articles);
            });
            getHypoCorrectionFoodArticles().then(food => {
                setHypocorrectionFoodContent(food);
            });
            setIsLoading(false);
        }
    });

    const handleClose = () => {
        setSelectedFood(null);
    }

    return (
        <View style={{ ...globalStyles.pageContainer, ...props.style }}>
            <View style={globalStyles.menuBarContainer}>
                <LeftArrowBtn close={() => props.navigation.navigate('Home')} />
            </View>
            <Text style={globalStyles.pageHeader}>Resources</Text>
            <View style={[globalStyles.pageDetails, { flex: 1 }]}>
                <ResourcesTab currentTab={currentTabIndex} setTabCallback={setCurrentTabIndex} />
                {isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size='large' color='#aad326' />
                    </View> :
                    <FlatList data={currentTabIndex === 0 ? educationalContent : hypocorrectionFoodContent}
                        keyExtractor={content => {
                            return currentTabIndex === 0 ? `${content.title}` : `${content['food-name']}`
                        }}
                        style={{ flexGrow: 1 }}
                        contentContainerStyle={{ flexGrow: 1, paddingTop: '4%' }} renderItem={({ item }) =>
                            currentTabIndex === 0 ?
                                <EducationMediaRow title={item?.title}
                                    organization={item?.organization}
                                    videoUrl={item?.video_url}
                                    pictureUrl={item?.picture_url}
                                    url={item?.url}
                                /> :
                                <HypoCorrectionFoodRow onPress={() => setSelectedFood(item)} item={item} />
                        }
                    />
                }
            </View>
            {selectedFood && (
                <Modal
                    onBackdropPress={handleClose}
                    backdropOpacity={0.5}
                    onBackButtonPress={handleClose}
                    style={{ marginTop: '20%', marginBottom: '20%' }}
                    isVisible={selectedFood !== null}>
                    <FoodModalContent style={{ borderRadius: adjustSize(10), overflow: 'hidden' }} onClose={handleClose} selected={selectedFood}>
                        <View style={{ paddingBottom: adjustSize(40) }} />
                    </FoodModalContent>
                </Modal>
            )
            }
        </View>
    );
};

export default EducationMaterialsScreen;
