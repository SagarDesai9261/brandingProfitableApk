
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window')

const SplashScreen = () => {

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const storeData = async () => {

        try {
            // Check if data exists in AsyncStorage
            console.log("Checking AsyncStorage for stored data");
            const storedData = await AsyncStorage.getItem('splashData');

            if (storedData !== null) {
                console.log("Data found in AsyncStorage");
                const parsedData = JSON.parse(storedData);
                setData(parsedData);
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error('Error reading data from AsyncStorage:', error);
            setIsLoading(false);

        }
    }

    const fetchData = async () => {
        console.log("fetchData function called");

        // Data not found in AsyncStorage, fetch it from the API
        try {
            await storeData();
            console.log("Fetching data from the API");
            const response = await axios.get(
                'https://api.brandingprofitable.com/splashscreen/splashscreen'
            );

            if (response.data && response.data.data && response.data.data.length > 0) {
                const fetchedData = response.data.data[0];

                // Store the fetched data in AsyncStorage
                await AsyncStorage.setItem('splashData', JSON.stringify(fetchedData));
                console.log('Data stored in AsyncStorage:', fetchedData);

                setData(fetchedData);
            } else {
                console.log('No data received from the API');
                await AsyncStorage.removeItem("splashData");
            }
        } catch (error) {
            console.error('Error fetching data from the API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("width:", width, "height:", height)

    if (isLoading) {
        return (
            <LinearGradient
                colors={['#050505', '#1A2A3D']}
                style={styles.container}>

            </LinearGradient>
        )
    }

    if (data) {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {data && (
                    <Image style={{ height: '100%', width: '100%', resizeMode:'stretch' }} source={{ uri: "https://cdn.brandingprofitable.com/" + data.splashScreenLogo }} />
                )}
            </View>
        )
    }

    return (
        <LinearGradient
            colors={['#050505', '#1A2A3D']}
            style={styles.container}>
            <View>

            </View>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.logoContainer}>
                    <FastImage source={require('./assets/B_Profitable_Logo.png')} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, { color: '#FF0000' }]} >
                        Branding
                        <Text style={styles.text}>
                            {" Profitable"}
                        </Text>
                    </Text>
                </View>
            </View>
            <View style={styles.belowTextContainer}>
                <Text style={styles.belowText}>
                    From
                </Text>
                <View>
                    <Image style={{ height: 40, width: 100 }} source={require('./assets/kuberLOGO.png')} />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1999
    },
    text: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 18
    },
    logoContainer: {
        height: 108,
        width: 108,
        backgroundColor: '#9FA2A6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 70,
        height: 78
    },
    textContainer: {
        paddingVertical: 10
    },
    belowText: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginTop: 20
    },
    belowTextContainer: {
        justifySelf: 'flex-end',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }

})

export default SplashScreen;
