import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import CardsCarousal from './CardsCarousal';
import axios from 'axios';

const VisitingScreen = ({ navigation }) => {
    const [counts, setCounts] = useState([]);
    const [loader, setLoader] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get("https://api.brandingprofitable.com/visiting/visiting");
            const data = response.data.data ? response.data.data : [];
            setCounts(data);
            if (response.data.data.length === 0) {
                showToastWithGravity("something went wrong...");
                navigation.goBack();
            }
            setLoader(false);
        } catch (error) {
            setLoader(false);
            console.error("error in fetch data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePress = (frame) => {
        navigation.navigate('CardsForm', { dataHTML: frame.visiting_data });
    };

    const showToastWithGravity = (data) => {
      ToastAndroid.showWithGravityAndOffset(
        data,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        50,
      );
    };

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText}>E Visiting Card</Text>
            </View>
            <View style={styles.contentContainer}>
                {loader ? (
                    <ActivityIndicator color={'white'} />
                ) : (
                    <CardsCarousal counts={counts} handlePress={handlePress} />
                )}
            </View>
        </LinearGradient>
    );
};

// visiting screen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Manrope-Bold',
        marginLeft: 20,
    },
    contentContainer: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
});

export default VisitingScreen;


// import React, { useRef } from 'react';
// import { View, Image, StyleSheet, Animated, PanResponder } from 'react-native';
// import Gestures from "react-native-easy-gestures";

// const TwoOverlayImages = () => {
//     const firstImagePan = useRef(new Animated.ValueXY()).current;
//     const firstImageScale = useRef(new Animated.Value(1)).current;
//     const secondImagePan = useRef(new Animated.ValueXY()).current;
//     const secondImageScale = useRef(new Animated.Value(1)).current;

//     const firstImagePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onPanResponderMove: (event, gestureState) => {
//                 Animated.event(
//                     [null, { dx: firstImagePan.x, dy: firstImagePan.y }],
//                     { useNativeDriver: false }
//                 )(event, gestureState);
//             },
//             onPanResponderRelease: () => {
//                 firstImagePan.flattenOffset();
//             }
//         })
//     ).current;

//     const secondImagePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onPanResponderMove: (event, gestureState) => {
//                 Animated.event(
//                     [null, { dx: secondImagePan.x, dy: secondImagePan.y }],
//                     { useNativeDriver: false }
//                 )(event, gestureState);
//             },
//             onPanResponderRelease: () => {
//                 secondImagePan.flattenOffset();
//             }
//         })
//     ).current;

//     return (
//         <View style={styles.container}>
//             {/* First image */}
//             <Gestures
//                 scalable={{ min: -1, max: 3 }}
//                 rotatable={true}
//                 key={1}
//                 style={[styles.image, styles.firstImage]}
//                 onEnd={(event, styles) => {
//                     const newTop = styles.top;
//                     const newLeft = styles.left;
//                 }}
//             >
//                 <Animated.Image
//                     source={{ uri: 'https://via.placeholder.com/200x150' }}
//                     style={[
//                         styles.image,
//                         styles.firstImage,
//                         { transform: [{ translateX: firstImagePan.x }, { translateY: firstImagePan.y }] }
//                     ]}
//                     resizeMode="contain"
//                 />
//             </Gestures>

//             {/* Second image */}
//             <Gestures
//                 scalable={{ min: -1, max: 3 }}
//                 rotatable={true}
//                 key={2}
//                 style={[styles.image, styles.secondImage]}
//                 {...secondImagePanResponder.panHandlers}
//                 onEnd={(event, styles) => {
//                     const newTop = styles.top;
//                     const newLeft = styles.left;
//                 }}
//             >
//                 <Image
//                     source={require('../assets/B_Profitable_Logo.png')}
//                     style={styles.image}
//                     resizeMode="cover"
//                 />
//             </Gestures>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     image: {
//         position: 'absolute',
//     },
//     firstImage: {
//         width: 200,
//         height: 150,
//         zIndex: 1,
//     },
//     secondImage: {
//         width: 400,
//         height: 300,
//         zIndex: 2,
//     },
// });

// export default TwoOverlayImages;
