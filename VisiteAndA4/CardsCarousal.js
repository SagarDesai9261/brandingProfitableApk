import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const CardsCarousal = ({ handlePress, counts }) => {
    const visitRef = useRef();
    const [activeSlide, setActiveSlide] = useState(0);

    const renderFrames = (frame) => {
        return (
            <TouchableOpacity onPress={() => { handlePress(frame.item) }} style={styles.carouselItem}>
                <Image
                    style={styles.image}
                    source={{ uri: "https://cdn.brandingprofitable.com/" + frame.item.visiting_preview }}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                ref={visitRef}
                data={counts}
                renderItem={renderFrames}
                sliderWidth={width}
                itemWidth={width - 70}
                onSnapToItem={(index) => setActiveSlide(index)}
            />
            <Pagination
                dotsLength={counts.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotStyle={[styles.activeDot, { width: counts.length > 10 ? 5 : 10, height: counts.length > 10 ? 5 : 10, marginHorizontal: counts.length > 10 ? 0 : 8 }]}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        </View>
    );
};

// card carousal

const styles = StyleSheet.create({
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.8,
        height: width * 0.8 * (506 / 350), // Maintain aspect ratio
        borderRadius: 10,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
    },
});

export default CardsCarousal;
