import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Linking } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const BannerComponent = ({ bannerData }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.bannerContainer}>
            <Swiper showsPagination={false} autoplay={true}>
                {bannerData.map((item, index) => (
                    <TouchableOpacity
                    activeOpacity={1}
                        key={item._id}
                        onPress={() => {
                            // Open the link in the browser when the image is clicked
                            try {
                                Linking.openURL(item?.advertiseLink);
                            } catch (e) {
                                console.log(e, "getting error in main banner linking url.")
                            }
                        }}
                        style={styles.bannerItem}>
                        <FastImage
                            source={{ uri: "https://cdn.brandingprofitable.com/" + item.businessBanner }}
                            style={styles.bannerImage}
                        />
                    </TouchableOpacity>
                ))}
            </Swiper>
        </View>
    );
};

const MyComponent = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://api.brandingprofitable.com/business_banner/business_banner';

        // Make the GET request using Axios
        axios
            .get(apiUrl)
            .then(response => {
                // Handle the successful response
                setData(response.data.data); // Use response.data.data instead of response.data
            })
            .catch(error => {
                // Handle errors
                console.error('Error fetching data... main banner:', error);
                setError(error);
            });
    }, []);

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error loading data</Text>
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
        height: 115,
        marginTop:10,
        alignItems:'center',
        width:'100%'
    },
    bannerItem: {
        width: width - 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginLeft: 20,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: 110,
    },
    bannerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyComponent;
