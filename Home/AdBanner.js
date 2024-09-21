// import React, { useEffect, useState } from 'react';
// import { View, Text, Alert, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Linking } from 'react-native';
// import axios from 'axios';
// import Swiper from 'react-native-swiper';
// import { useNavigation } from '@react-navigation/native';
// import FastImage from 'react-native-fast-image';

// const { width } = Dimensions.get('window');

// const BannerComponent = ({ bannerData }) => {
//     const navigation = useNavigation();

//     return (
//         <View style={styles.bannerContainer}>
//             <Swiper autoplay={false}  autoplayTimeout={5000} showsPagination={false}>
//                 {bannerData.map((item, index) => (
//                     <TouchableOpacity
//                         activeOpacity={1}
//                         key={item._id}
//                         onPress={() => {
//                             try {
//                                 Linking.openURL(item.advertiseLink);
//                             } catch (e) {
//                                 console.log(e, "getting error in main banner linking url.")
//                             }
//                         }}
//                         style={styles.bannerItem}>
//                         <Image
//                             source={{ uri: "https://cdn.brandingprofitable.com/" + item.advertiseImage }}
//                             style={styles.bannerImage}
//                         />
//                     </TouchableOpacity>
//                 ))}
//             </Swiper>
//         </View>
//     );
// };

// const MyComponent = () => {
//     const [data, setData] = useState([]);
//     const [error, setError] = useState(null);


//     useEffect(() => {
//         // Define the URL for the GET request
//         const apiUrl = 'https://api.brandingprofitable.com/advertise_banner/advertise_banner';

//         // Make the GET request using Axios
//         axios
//             .get(apiUrl)
//             .then(response => {
//                 // Handle the successful response
//                 setData(response.data.data); // Use response.data.data instead of response.data
//             })
//             .catch(error => {
//                 // Handle errors
//                 console.error('Error fetching data... main banner:', error);
//                 setError(error);
//             });
//     }, []);

//     if (error) {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 <Text>Error loading data</Text>
//             </View>
//         );
//     }

//     return (
//         <View>
//             <BannerComponent bannerData={data} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     bannerContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//         height: 115,
//         marginTop: 10,
//         alignItems: 'center'
//     },
//     bannerItem: {
//         width: width - 30,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 13,
//         alignItems: 'center',
//         marginLeft: 15,
//         overflow: 'hidden',
//     },
//     bannerImage: {
//         width: '100%',
//         height: 110,
//     },
//     bannerName: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default MyComponent;


import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ActivityIndicator, Image, TouchableHighlight, ScrollView, StyleSheet, Dimensions, Linking } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const BannerComponent = ({ bannerData }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.bannerContainer}>
            <Swiper autoplayTimeout={3} loop={true} index={0} showsPagination={true} autoplay={true} dot={<View style={{ backgroundColor: 'white', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -10, }} />} activeDot={<View style={{ backgroundColor: '#FF0000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -10, }} />}>
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
                                console.log(e, "getting error in main banner linking url.")
                            }
                        }}
                    >
                        <Image
                            source={{ uri: "https://cdn.brandingprofitable.com/" + item.bannerImage }}
                            style={styles.bannerImage}
                        />
                    </TouchableHighlight>
                ))}
            </Swiper>
        </View>
    );
};

const AdBanner = ({ bannerData }) => {
    const navigation = useNavigation();
    const swiperRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (swiperRef.current) {
                const currentIndex = swiperRef.current.state.index;
                const nextIndex = (currentIndex + 1) % bannerData.length;
                swiperRef.current.scrollBy(1);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [bannerData]);

    return (
        <View style={styles.bannerContainer}>
            <Swiper
                autoplay={false}
                showsPagination={false}
                ref={swiperRef}
            >
                {bannerData.map((item, index) => (
                    <TouchableHighlight
                        key={item._id}
                        style={styles.bannerItem}
                        onPress={() => {
                            try {
                                Linking.openURL(item.advertiseLink);
                            } catch (e) {
                                console.log(e, "getting error in ad banner linking url.")
                            }
                        }}
                    >
                        <Image
                            source={{ uri: "https://cdn.brandingprofitable.com/" + item.advertiseImage, priority: FastImage.priority.normal }}
                            style={styles.bannerImage}
                        />
                    </TouchableHighlight>
                ))}
            </Swiper>
        </View>
    );
};

const MyComponent = () => {
    const [adBannerData, setAdBannerData] = useState([]);
    const [loading, setLoading] = useState(true);

    const saveDataIntoLocal = async (data, key) => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(data)); // Serialize the data to store it as a string
        } catch (error) {
          console.log(`Error storing data in local storage for ${key}`, error);
        }
      }

    useEffect(() => {
        // Define the URL for the GET request for advertisement banners
        const apiUrl = 'https://api.brandingprofitable.com/advertise_banner/advertise_banner';

        AsyncStorage.getItem("adBannerData")
          .then((storedData) => {
            if (storedData !== null) {
              // Data found in AsyncStorage, parse it and set it to state
              setAdBannerData(JSON.parse(storedData));
            }
      
            // Make the API request regardless to update data
            axios
              .get(apiUrl)
              .then(response => {
                setAdBannerData(response.data.data);
                // Save the data in AsyncStorage after displaying it on the screen
                saveDataIntoLocal(response.data.data, "adBannerData");
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

    return (
        <ScrollView>
            {/* Render the AdBanner component and pass the adBannerData */}
            <AdBanner bannerData={adBannerData} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        height: 115,
        marginTop: 10,
        alignItems: 'center'
    },
    bannerItem: {
        width: width - 30,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginLeft: 15,
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
