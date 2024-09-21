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
// const screenWidth = Dimensions.get('window').width; // Get the screen width

const screenWidth = Dimensions.get('window').width;
  const aspectRatio = 375 / 300; // Aspect ratio of A4 size (height / width)

  // Calculate the image width based on the screen width and margins
  const imageWidth = (screenWidth - 65) / 3;

  // Calculate the image height to maintain aspect ratio
  const imageHeight = imageWidth * aspectRatio;

const DynamicSection = ({ route }) => {
  //  -----------------------------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  //  -----------------------------------------------------------------------------------

  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // const apiUrl = 'https://api.brandingprofitable.com/ds_item/ds_item';
    const apiUrl = 'https://api.brandingprofitable.com/a4category/get/category';

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
    
    AsyncStorage.getItem("dynamicDataa4")
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
    console.log("pressed image item", item)
    navigation.navigate('EditHomeDynamicA4', {
      // items: item.items,
      banneid: item.category_id,
      bannername: item.category_name,
      index: index ? index : '',
    });
  };

  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    retrieveProfileData();
  }, []);

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
        fetchSavedUserFrames(data?._id)
      }
    } catch (error) {
    } finally {
      setLoading(false); // Mark data retrieval as completed (whether successful or not)
    }
  };

  const fetchSavedUserFrames = async (id) => {
    try {
      const response = await axios.get(
        `https://api.brandingprofitable.com/savedframe/saved/frame/v2/${id}`
      );

      const result = response.data.data;

      await AsyncStorage.setItem('customFrames', JSON.stringify(result));

    } catch (error) {
      console.error("Error in fetch saved frames", error)
    }
  };

  const reloadScreen = () => {
    retrieveProfileData();
  }

  useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', reloadScreen);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigation]);

  const saveDataIntoLocal = async (data) => {
    try {
      await AsyncStorage.setItem("dynamicDataa4", JSON.stringify(data)); // Serialize the data to store it as a string
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
              uri: 'https://cdn.brandingprofitable.com/' + (item.category_image)
            }}
            style={[styles.image, { width: imageWidth, height: imageHeight }]} // Apply the calculated width and height
          />
          <Text style={styles.categoryText}>{item.category_name}</Text>
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
    margin: 8,
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
