
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const imageWidth = (width - 48) / 3; // Calculate the image width based on the number of columns and margins

const TodayBanner = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const BannerComponent = ({ bannerData }) => {
        const navigation = useNavigation();
        return (
            <View style={styles.bannerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {bannerData.slice(0, 10).map((item, index) => {
                        const categoryName = item?.categoryName || item?.trendingAndNews_CategoryName;
                        const truncatedCategoryName =
                            categoryName.length > 10 ? `${categoryName.substring(0, 10)}...` : categoryName;

                        return (
                            <View style={{ flexDirection: 'column', gap: 5 }} key={item.trendingAndNewsCategory_Id}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('EditHomeScreen', {
                                            bannername: truncatedCategoryName,
                                            bannerId: item._id,
                                            index: index,
                                            todayOrTrending: 'trending',
                                            is_a4_category: false
                                        });
                                    }}
                                    style={[
                                        styles.bannerItem,
                                        { marginLeft: index === 0 ? 15 : 0 }, // Apply different margin to the first item
                                    ]}
                                >
                                    <Image source={{ uri: "https://cdn.brandingprofitable.com/" + item.comp_iamge }} style={styles.bannerImage} />
                                </TouchableOpacity>
                                <Text style={styles.categoryText}>{truncatedCategoryName}</Text>
                            </View>
                        );
                    })}
                </ScrollView>

            </View>
        );
    };


    const saveDataIntoLocal = async (data, key) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data)); // Serialize the data to store it as a string
        } catch (error) {
            console.log(`Error storing data in local storage for ${key}`, error);
        }
    }

    useEffect(() => {
        const apiUrl = 'https://api.brandingprofitable.com/trending_category/trendingandnews_category';

        // Check if data exists in AsyncStorage
        AsyncStorage.getItem("trendingData")
            .then((storedData) => {
                if (storedData !== null) {
                    // Data found in AsyncStorage, parse it and set it to state
                    setData(JSON.parse(storedData));
                }

                // Make the API request regardless to update data
                axios
                    .get(apiUrl)
                    .then(response => {
                        setData(response.data.data);
                        // Save the data in AsyncStorage after displaying it on the screen
                        saveDataIntoLocal(response.data.data, "trendingData");
                    })
                    .catch(error => {
                        console.error('Error fetching data... trending banner:', error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .catch(error => {
                console.error('Error reading data from AsyncStorage:', error);
            });
    }, []);

    // if (loading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    // }

    return (
        data &&
        <View>
            <View style={styles.bannerHeader}>
                <Text style={styles.bannerHeaderText}>
                    Trending
                </Text>
                <Text style={[styles.bannerHeaderText, { width: 30, height: 30, textAlign: 'right', marginTop: 3 }]} onPress={() => { navigation.navigate('trending', { categories: data }) }}>
                    <Icon name="angle-right" size={26} color={"white"} />
                </Text>
            </View>
            <BannerComponent bannerData={data} />
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: -7
    },
    bannerItem: {
        width: imageWidth,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginRight: 10,
        overflow: 'hidden',
    },
    categoryText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Manrope-Bold',
        width: imageWidth,
        alignSelf: 'center',
        textAlign: 'center',
        color:'white'
    },
    bannerImage: {
        width: '100%',
        height: imageWidth,
    },
    bannerName: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    bannerHeader: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 0
    },
    bannerHeaderText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Manrope-Bold',
        marginBottom: 10,
    }
});

export default TodayBanner;
