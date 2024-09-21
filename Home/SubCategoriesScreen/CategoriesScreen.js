import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Video from 'react-native-video'
import React, { useCallback, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const CategoriesScreen = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://api.brandingprofitable.com/todayandtomorrow/data/today_tomorrow';

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
                console.error('Error fetching data... categories screen:', error)
                setLoading(false);
            });

    }, []);

    const [data, setData] = useState([])

    // render images
    // onPress={() => { navigation.navigate('EditHomeScreen', { 'bannername': item.categoryName }) }} 

    const formatDate = (dateStr) => {
        const parts = dateStr.split('-'); // Split the date string by '-'
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}-${month}-${year}`;
        }
        return dateStr; // Return the original string if it couldn't be parsed
    };

    const renderItem = useCallback(({ item }) => (
        <View style={styles.BannerItem}>
            <View style={styles.bannerHeader}>
                <Text style={[styles.bannerHeaderText, { fontSize: 14, width: '70%', overflow: 'hidden' }]}>
                    {item.categoryName}
                </Text>
                <Text style={[styles.bannerHeaderText, { fontSize: 10 }]}>
                    {formatDate(item.imageDate)}
                </Text>

            </View>
            <FlatList
                data={item.items.slice(0, 10)}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: imageItem, index }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('EditHomeScreen', {
                                bannername: item.categoryName,
                                bannerId: item._id,
                                index: index,
                                todayOrTrending: 'today',
                                is_a4: false
                            });
                        }}
                    >
                        <View style={{ position: 'absolute', top: 45, left: index == 0 ? 55 : 40, zIndex: 1, display: imageItem.isVideo ? 'flex' : 'none' }}>
                            <Icon name="play-circle" size={30} color={"white"} />
                        </View>
                        <FastImage
                            source={{ uri: "https://cdn.brandingprofitable.com/" + imageItem.todayAndTomorrowImageOrVideo, priority: FastImage.priority.high }}
                            style={[styles.image, { marginLeft: index == 0 ? 20 : 0 }]}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    ), [navigation]);

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate('HomeScreen') }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.navigate('HomeScreen') }}>
                    Today & Tomorrow
                </Text>
            </View>
            {/* container */}
            {loading && <View style={styles.container}>
                <ActivityIndicator color='white' />
            </View>}
            <View style={styles.container}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.categoryName}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    shouldComponentUpdate={() => false}
                    removeClippedSubviews
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={10}
                />
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Manrope-Bold',
        marginLeft: 20
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
        paddingTop: 10
    },
    image: {
        borderRadius: 10,
        margin: 10,
        width: 100,
        height: 100,
        marginVertical: 7
    },
    BannerItem: {
        width: '100%'
    },
    bannerHeader: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20
    },
    bannerHeaderText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Manrope-Bold',
    },
    flatListContainer: {
        width: width,
        paddingBottom: 70
    },
    ShareContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 1,
        padding: 5,
        borderRadius: 10,
        elevation: 30,
    },
    whatsappImage: {
        height: 40,
        width: 40,
    },
})

export default CategoriesScreen