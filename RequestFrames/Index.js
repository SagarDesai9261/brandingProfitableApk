import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';

const { width } = Dimensions.get('window');
const itemWidth = width / 2.3;

const showToastWithGravity = (data) => {
  ToastAndroid.showWithGravityAndOffset(
    data,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    0,
    50
  );
};

const RequestFrame = ({ navigation }) => {
  const [requested, setRequested] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [profileData, setProfileData] = useState({});
  const [customFrames, setCustomFrames] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const retrieveProfileData = useCallback(async () => {
    try {
      const [dataString, userToken] = await AsyncStorage.multiGet([
        'profileData',
        'userToken',
      ]);
      setUserToken(userToken[1]);
      if (dataString) {
        const data = JSON.parse(dataString[1]);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  }, []);


  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const handleImagePicker = async () => {
    try {
      const response = await ImageCropPicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        includeBase64: true,
      });

      const dataArray = new FormData();
      dataArray.append('b_video', {
        uri: response.path,
        type: response.mime,
        name: response.path.split('/').pop(),
      });

      let url = 'https://cdn.brandingprofitable.com/image_upload.php';

      const res = await axios.post(url, dataArray, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRequested(true);
      setTimeout(() => {
        setRequested(false);
      }, 3000);
      const imagePath = `https://cdn.brandingprofitable.com/${res?.data?.iamge_path}`; // Correct the key to "iamge_path"
      return imagePath;
    } catch (error) {
      console.log('Error uploading image:', error);
      return null;
    }

  };

  const handleRequest = useCallback(async () => {

    try {
      const image = await handleImagePicker();

      if (image) {
        const apiUrl = 'https://api.brandingprofitable.com/framerequest/framerequest';

        const requestData = {
          userId: profileData?._id,
          userName: profileData?.fullName,
          userMobileNumber: profileData?.mobileNumber,
          isFrameCreated: false,
          frameRequestDate: formattedDate,
          frameRequestImage: image,
        };

        const response = await axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        });

        console.log("requestData", requestData)

        if (response.data.statusCode === 200) {
          showToastWithGravity('Request Sent Successfully!');
        } else {
          showToastWithGravity('Troubleshooting to Send Request!');
        }
      }
    } catch (error) {
      console.log(error);
      showToastWithGravity('Troubleshooting to Send Request!');
    }
  }, [profileData, userToken]);

  const gettingUserFrames = useCallback(async () => {
    if (profileData) {
      const userid = profileData._id;
      const apiUrl = `https://api.brandingprofitable.com/framerequest/ownframe/${profileData._id}`;
      try {
        const response = await axios.get(apiUrl);
        setCustomFrames(response.data.data);
        setLoader(false);
        setRefreshing(false); // Stop refreshing

      } catch (e) {
        setLoader(false);
        setRefreshing(false); // Stop refreshing  
        console.log('Error getting user saved frames... custom request frames', e);
      }
    }
  }, [profileData, userToken]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([retrieveProfileData(), gettingUserFrames()]);
    };

    fetchData();
  }, [retrieveProfileData, gettingUserFrames]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.imageInnerContainer}>
          <FastImage source={{ uri: "https://cdn.brandingprofitable.com/" + item.savedFrame_user }} style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleSelect = (item) => {
    navigation.navigate('RequestEdit', { itemId: item._id, isRequest: 'yes' });
  };

  if (loader) {
    return (
      <View style={{ backgroundColor: 'black', flex: 1, justifyContent: 'center', alignItems: "center" }}>
        <ActivityIndicator color={'white'} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#20AE5C', 'black']}
      style={styles.container}
      locations={[0.1, 1]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, requested && styles.requestedButton]}
          onPress={handleRequest}
          disabled={requested} // Disable button when requested is true
        >
          <Feather name={requested ? 'check-circle' : 'git-pull-request'} size={20} color="white" />
          <Text style={styles.buttonText}>{requested ? 'Requested' : 'Request'}</Text>
        </TouchableOpacity>
      </View>
      {customFrames.length !== 0 && (
        <FlatList
          data={customFrames}
          numColumns={2}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          windowSize={10}
          refreshing={refreshing}
          onRefresh={gettingUserFrames}
          refreshControl={ // Add RefreshControl to FlatList
            <RefreshControl
              refreshing={refreshing}
              onRefresh={gettingUserFrames}
              colors={['white']}
              tintColor={'white'}
            />
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '40%',
    padding: 10,
    paddingTop: 20
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 0.2,
    borderRadius: 10,
  },
  requestedButton: {
    backgroundColor: '#20AE5C',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Manrope-Regular',
    marginLeft: 5,
  },
  flatListContainer: {
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 80,
  },
  imageContainer: {
    alignItems: 'center',
    margin: 7,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageInnerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    height: itemWidth,
    width: itemWidth,
  },
};

export default RequestFrame;
