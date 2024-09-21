import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { Linking } from 'react-native';

const {width,height} = Dimensions.get('window')

const BannerComponent = ({ bannerData }) => {
    return (
        <View style={styles.bannerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {bannerData.map((item, index) => (
                    <TouchableOpacity
                    activeOpacity={1}
                        key={item._id}
                        onPress={() => {
                            // Open the link in the browser when the image is clicked
                            try {
                                Linking.openURL(item.cds_bannerLink);
                            } catch (e) {
                                console.log(e, "getting error in custom banner linking url.")
                            }
                          }}
                        style={[
                            styles.bannerItem,
                            { marginLeft: index === 0 ? 20 : 0 }, // Apply different margin to the first item
                        ]}
                    >
                        <Image
                            source={{ uri: "https://cdn.brandingprofitable.com/" + item.cds_bannerImage }}
                            style={styles.bannerImage}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const CustomBanner = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchBannerData()
        
    }, []);

    const fetchBannerData = () => {
        const apiUrl = 'https://api.brandingprofitable.com/cd_banner/banner/custome';

        // Make the GET request using Axios
        axios
            .get(apiUrl)
            .then(response => {
                // Handle the successful response
                setData(response.data.data); // Use response.data.data instead of response.data
                setLoading(false);
            })
            .catch(error => {
                // Handle errors
                console.error('Error fetching data...:', error);
                setLoading(false);
            });
    }

    // if (loading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" color="white" />
    //         </View>
    //     );
    // }

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
    },
    bannerItem: {
        width: width-30,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginRight:15,
        marginLeft:15,
        overflow:'hidden'
    },
    bannerImage: {
        width: '100%',
        height: 110
    },
    bannerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomBanner;
