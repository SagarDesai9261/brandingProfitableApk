import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions, // Import Dimensions from react-native
  ActivityIndicator,
  Image

} from 'react-native';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get('window').width; // Get the screen width

const imageWidth = (screenWidth - 47) / 3; // Calculate the image width based on the number of columns and margins
const imageHeight = imageWidth; // Set the image height to maintain aspect ratio

const DynamicSection = ({ route }) => {
  //  -----------------------------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  //  -----------------------------------------------------------------------------------

  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // const apiUrl = 'https://api.brandingprofitable.com/ds_item/ds_item';
    const apiUrl = 'https://api.brandingprofitable.com/ds_title/dynamic/category';

    // axios
    //   .get(apiUrl)
    //   .then((response) => {
    //     setData(response.data.data);
    //     saveDataIntoLocal(response.data.data)
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching data...dynamic section:', error);
    //     setLoading(false);
    //   });
    
    AsyncStorage.getItem("dynamicData")
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
            console.error('Error fetching data... dynamic:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error reading data from AsyncStorage in dynamic section:', error);
      });
  }, []);

  const handleImagePress = (item, index) => {
    navigation.navigate('EditHomeDynamic', {
      // items: item.items,
      bannername: item.ds_category,
      index: index ? index : '',
    });
  };

  const saveDataIntoLocal = async (data) => {
    try {
      await AsyncStorage.setItem("dynamicData", JSON.stringify(data)); // Serialize the data to store it as a string
      // console.log("Stored data: ", data);
    } catch (error) {
      console.log("Error storing data in local storage for dynamic section", error);
    }
  }

  const renderCategoryItem = ({ item }) => {
    // console.log(item.ds_category, '- https://cdn.brandingprofitable.com/' + (item.items[0].comp_iamge || item.items[0].imageUrl))
    // console.log(item.ds_category, '- https://cdn.brandingprofitable.com/' + (item.ds_image))
    return (
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <View style={styles.gridItem}>
          <FastImage
            source={{
              uri: 'https://cdn.brandingprofitable.com/' + (item.ds_image)
            }}
            style={[styles.image, { width: imageWidth, height: imageHeight }]} // Apply the calculated width and height
          />
          <Text style={styles.categoryText}>{item.ds_category}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.bannerHeader}>
        <Text style={styles.bannerHeaderText}>
          Categories
        </Text>
        <Text style={[styles.bannerHeaderText, { width: 30, height: 30, textAlign: 'right' }]} onPress={() => { navigation.navigate('category', { categories: data }) }}>
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.ds_category}
          numColumns={3} // Set the number of columns here
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  gridItem: {
    alignItems: 'center',
    margin: 5,
  },
  image: {
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Manrope-Bold',
    width: imageWidth,
    alignSelf: 'center',
    textAlign: 'center'
  },

  bannerHeader: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: -20,
    width: '100%'
  },
  bannerHeaderText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Manrope-Bold',
  }
});

export default DynamicSection;
