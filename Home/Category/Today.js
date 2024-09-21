
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { month: 'short', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate;
    };

    const BannerComponent = ({ bannerData }) => {
        const navigation = useNavigation();

        return (
            <View style={styles.bannerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {bannerData.map((item, index) => (
                        <TouchableOpacity 
                            key={item._id}
                            onPress={() => {
                                navigation.navigate('EditHomeScreen', {
                                    // items: item,
                                    bannername: item.categoryName,
                                    bannerId: item._id,
                                    index: index,
                                    todayOrTrending: 'today',
                                    is_a4_category: false
                                });
                            }}
                            style={[
                                styles.bannerItem,
                                { marginLeft: index === 0 ? 15 : 0 }, // Apply different margin to the first item
                            ]}
                        >
                            <Image
                                source={{ uri: "https://cdn.brandingprofitable.com/" + (item?.comp_iamge == "false" ? item?.image : item?.comp_iamge), priority: FastImage.priority.high}}
                                style={styles.bannerImage}
                            />
                            <View style={{ position: 'absolute', backgroundColor: '#1E1E1E', paddingHorizontal: 10, top: 3, borderRadius: 30, alignItems: 'center', width: 70 }}>
                                <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Regular', fontSize: 12 }}>
                                    {formatDate(item.imageDate)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

const saveDataIntoLocal = async (data) => {
  try {
    await AsyncStorage.setItem("todayTomorrowData", JSON.stringify(data)); // Serialize the data to store it as a string
    // console.log("Stored data: ", data);
  } catch (error) {
    console.log("Error storing data in local storage for today", error);
  }
}

useEffect(() => {
  const apiUrl = 'https://api.brandingprofitable.com/today/category/today_category';

  // Check if data exists in AsyncStorage
  AsyncStorage.getItem("todayTomorrowData")
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
          // Save the data in AsyncStorage after displaying it on the home screen
          saveDataIntoLocal(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching data... today:', error);
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
                    Today & Tomorrow
                </Text>
                <Text style={[styles.bannerHeaderText, { width: 30, height: 30, textAlign: 'right' }]} onPress={() => { navigation.navigate('category', { categories: data }) }}>
                    <Icon name="angle-right" size={28} color={"white"} />
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
    },
    bannerItem: {
        width: imageWidth,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginRight: 10,
        overflow: 'hidden',
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
        marginTop: -20
    },
    bannerHeaderText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Manrope-Bold',
    }
});

export default TodayBanner;
