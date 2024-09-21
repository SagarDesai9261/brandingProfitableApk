import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import data from '../apiData/CustomFrames';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const itemWidth = width / 2.3; // Adjust the number of columns as needed

const SavedFrames = ({ navigation }) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        setRefreshing(true);
        try {
            const dataString = await AsyncStorage.getItem('profileData');
            const data = JSON.parse(dataString);

            // const response = await axios.get('https://api.brandingprofitable.com/frame/frameimage/v2/'+data?.mobileNumber);
            const response = await axios.get('https://api.brandingprofitable.com/frame/frameimage/v2/'+data?.mobileNumber);
            const result = response.data;
            // console.log(result)
            setData(result.data); // Assuming 'data' property contains the array of images
        } catch (error) {
            console.log('Error fetching data... custom frame:', error);
        } finally {
            setload(false)
        }
        setRefreshing(false); // Make sure to set refreshing to false even if there's an error
    };

    const handleSelect = (item) => {
        navigation.navigate('CustomFrameFormProfile', { 'itemId': item._id, isA4: 'no' });
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => handleSelect(item)}
            >
                <View style={{ backgroundColor: 'white', borderRadius: 10, overflow: 'hidden' }}>
                    <Image source={{ uri: "https://cdn.brandingprofitable.com/" + item.image }} style={styles.image} />
                    {/* <ProgressiveFastImage
                        source={{uri: "https://cdn.brandingprofitable.com/" + item.image}}
                        style={styles.image}
                        thumbnailSource={require("../assets/Vector.png")}
                    /> */}
                </View>
            </TouchableOpacity>
        );
    };


    // data 

    const [load, setload] = useState(true)

    const [refreshing, setRefreshing] = useState(false);

    if (load) {
        return (
            <View style={{ backgroundColor: 'black', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={'white'} />
            </View>
        )
    }

    return (
        <>
            <LinearGradient
                colors={['#20AE5C', 'black']}
                style={styles.container}
                locations={[0.1, 1]}
            >
                <FlatList
                    data={data}
                    numColumns={2} // Adjust the number of columns as needed
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    shouldComponentUpdate={() => false}
                    removeClippedSubviews
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={10}
                    refreshing={refreshing}
                    onRefresh={fetchData}
                />
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    flatListContainer: {
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 80
    },
    imageContainer: {
        alignItems: 'center',
        margin: 7,
        borderColor: "white",
        borderWidth: 0.5,
        borderRadius: 10
    },
    image: {
        height: itemWidth,
        width: itemWidth,
    },
    name: {
        marginTop: 5,
        textAlign: 'center',
        color: 'white',
        borderTopWidth: 1
    },
    mainImage: {
        height: 300,
        width: 300,
        borderRadius: 10,
    },
    mainImageContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10
    },
    headerContainer: {
        height: 60,
        width: width,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        color: "white"
    },
    iconText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'DMSans_18pt-Bold'
    }
});

export default SavedFrames;
