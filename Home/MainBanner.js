import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, Image, TouchableHighlight, ScrollView, StyleSheet, Dimensions, Linking } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window')

const BannerComponent = ({ bannerData }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.bannerContainer}>
            <Swiper autoplayTimeout={5} loop={true} index={0} showsPagination={true} autoplay={true} dot={<View style={{ backgroundColor: 'white', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -10, }} />} activeDot={<View style={{ backgroundColor: '#FF0000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -10, }} />}>
                {bannerData.map((item, index) => (
                    <TouchableHighlight
                    
                        key={item._id}
                        style={[
                            styles.bannerItem,
                            { marginLeft: 15 }, // Apply different margin to the first item
                        ]}
                        onPress={() => {
                            // Open the link in the browser when the image is clicked
                            try {
                                Linking.openURL(item.bannerLink);
                            } catch (e) {
                            }
                        }}
                    >
                        <Image
                            source={{ uri: "https://cdn.brandingprofitable.com/" + item.bannerImage, priority: FastImage.priority.normal, }}
                            style={styles.bannerImage}
                            
                        />
                    </TouchableHighlight>
                ))}
            </Swiper>
        </View>
    );
};

const MyComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    // save data in local 
    const saveDataIntoLocal = async (data, key) => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(data)); // Serialize the data to store it as a string
        } catch (error) {
        }
      }

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://api.brandingprofitable.com/mainbanner/mainbanner';

        AsyncStorage.getItem("mainBannerData")
          .then((storedData) => {
            if (storedData !== null) {
              // Data found in AsyncStorage, parse it and set it to state
              setData(JSON.parse(storedData));
              setLoading(false);

            }
      
            // Make the API request regardless to update data
            axios
              .get(apiUrl)
              .then(response => {
                setData(response.data.data);
                // Save the data in AsyncStorage after displaying it on the screen
                saveDataIntoLocal(response.data.data, "mainBannerData");
              })
              .catch(error => {
              })
              .finally(() => {
                setLoading(false);
              });
          })
          .catch(error => {
          });
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <View>
            <BannerComponent bannerData={data} />
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        height: 200
    },
    bannerItem: {
        width: width - 30,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden'
    },
    bannerImage: {
        width: '100%',
        height: 160,
    },
    bannerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyComponent;
