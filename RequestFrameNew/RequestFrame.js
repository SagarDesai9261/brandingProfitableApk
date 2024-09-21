import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, StyleSheet, ActivityIndicator, Dimensions, FlatList, TouchableOpacity, TextInput, Text, Modal, ToastAndroid, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather'
import ImageCropPicker from 'react-native-image-crop-picker';
import SelectDropdown from 'react-native-select-dropdown';
import { Image } from 'react-native';

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

function YourComponent({ navigation }) {
  const [customFrames, setCustomFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [requestModal, setRequestModal] = useState(false);
  const [frameRequestMessage, setframeRequestMessage] = useState('');
  const [image, setImage] = useState('');
  const [imageLoader, setImageLoader] = useState(false);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const [userToken, setUserToken] = useState('');
  const [requestLoad, setRequestLoad] = useState(false);
  const [defaultButtonText, setDefaultButtonText] = useState('Select Frame');

  const [requestCount, setRequestCount] = useState(0);
  const [requests, setRequests] = useState([])

  console.log(requests.length)

  const showAlert = (item) => {
    Alert.alert(
      'Delete Frame',
      'Are your sure you want to delete?',
      [
        { text: 'Delete', onPress: () => handleDeleteFrame(item) },
      ],
      { cancelable: true }
    );
  };

  const fetchData = async (userId, number) => {
    try {
      setLoading(true)
      const apiUrl1 = `https://api.brandingprofitable.com/framerequest/ownframe/${userId}`;
      const apiUrl2 = `https://api.brandingprofitable.com/Plan/credits/${number}`;
      const apiUrl3 = `https://api.brandingprofitable.com/framerequest/status/v2/${number}`;

      const [response1, response2, response3] = await Promise.all([
        axios.get(apiUrl1),
        axios.get(apiUrl2),
        axios.get(apiUrl3)
      ]);

      setCustomFrames(response1.data.data);

      // Process response2 if needed
      // custome_frame
      if (response2.data.data) {
        setRequestCount(response2.data.data.custome_frame);
      }else{
        setRequestCount(undefined)
      }

      if (response3.data.data?.length != 0) {
        setRequests(response3.data.data);
      }else{
        showToastWithGravity("Rquests not Found")
      }

      setLoading(false);

    } catch (error) {
      setRequestCount(undefined)
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };


  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString) {
        const profileData = JSON.parse(dataString);
        setProfileData(profileData);
        fetchData(profileData._id, profileData?.mobileNumber);
      }

      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setUserToken(userToken);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    retrieveProfileData();
  }, []);

  const handleDeleteFrame = async (item) => {
    try {
      const frameId = item._id;
      const apiUrl = `https://api.brandingprofitable.com/framerequest/ownframe_remove/${frameId}`;
      const response = await axios.delete(apiUrl);

      if (response.data.statusCode == 200) {
        showToastWithGravity('Frame deleted successfully!');
        fetchData(profileData?._id);
        // Handle any additional logic after a successful delete
      } else {
        console.error(`Failed to delete frame. Status code: ${response.status}`);
        showToastWithGravity("something went wrong...")
        // Handle errors or provide appropriate feedback
      }
    } catch (error) {
      console.error('Error deleting frame:', error.message);
      // Handle errors or provide appropriate feedback
      showToastWithGravity("please try again later")
    }
  }

  const handleSelect = (item) => {
    navigation.navigate('CustomFrameFormProfile', { 'itemId': item._id, isRequest: 'yes' });
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => handleSelect(item)}
        onLongPress={() => showAlert(item)}
      >
        <View style={styles.imageInnerContainer}>
          <FastImage source={{ uri: "https://cdn.brandingprofitable.com/" + item.savedFrame_user }} style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleImagePicker = () => {
    ImageCropPicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      includeBase64: true, // Optional, set it to true if you want to get the image as base64-encoded string
    })
      .then((response) => {
        const dataArray = new FormData();
        dataArray.append('b_video', {
          uri: response.path,
          type: response.mime,
          name: response.path.split('/').pop(),
        });
        setImageLoader(true)
        let url = 'https://cdn.brandingprofitable.com/image_upload.php/';
        axios
          .post(url, dataArray, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            // const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
            const imagePath = `https://cdn.brandingprofitable.com/${res?.data?.iamge_path}`; // Correct the key to "iamge_path"
            console.log(imagePath, "imagePath ---")
            setImage(imagePath)

            // setTimeout(() => {
            setImageLoader(false)
            // }, 2000);
          })
          .catch((err) => {
            console.log('Error uploading image:', err);
          });
      })
      .catch((error) => {
        console.log('ImagePicker Error:', error);
      });
  };

  const handleRequest = async () => {
    try {

      if (requestCount == undefined) {
        Alert.alert(
          'Please Purchase a Plan..!',
          'Purchase Plan To get more Request..!',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Purchase',
              onPress: () => {
                navigation.navigate('MlmScreenStack');
              }
            },
          ],
          { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
        );
        return;
      }
      if (requestCount == 0) {
        Alert.alert(
          'Please Upgrade a Plan..!',
          'Upgrade Plan To get more Request..!',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Upgrade',
              onPress: () => {
                navigation.navigate('MlmScreenStack');
              }
            },
          ],
          { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
        );
        return;
      }

      if (frameRequestMessage == '') {
        showToastWithGravity("please enter message!")
        return;
      }
      if (defaultButtonText == 'Select Frame') {
        showToastWithGravity("please select frame!")
        return;
      }
      setRequestLoad(true);

      if (image) {

        const apiUrl = 'https://api.brandingprofitable.com/framerequest/framerequest/v2';

        const requestData = {
          userId: profileData?._id,
          userName: profileData?.fullName,
          userMobileNumber: profileData?.mobileNumber,
          isFrameCreated: false,
          frameRequestDate: formattedDate,
          frameRequestImage: image,
          frameRequestMessage,
          is_a4_frame: defaultButtonText
        };


        const response = await axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.data.statusCode === 200) {
          showToastWithGravity('Request Sent Successfully!');
        const response2 = await axios.get(`https://api.brandingprofitable.com/Plan/custome_frame/${profileData?.mobileNumber}`);
        console.log(response2)

        }
        else if (response.data.statusCode == 400) {
          showToastWithGravity('Your one Request is already in pending!');
        }
        else {
          showToastWithGravity('Troubleshooting to Send Request!');
        }
      } else {
        showToastWithGravity("please select image")
      }


    } catch (error) {
      console.log(error);
      showToastWithGravity('Troubleshooting to Send Request');
    } finally {
      setRequestLoad(false);
      setRequestModal(false);
      fetchData(profileData?._id,profileData?.mobileNumber);
    }
  };

  const renderSquareFileUri = () => {
    if (image) {
      return <FastImage source={{ uri: image }} style={{ height: 110, width: 110 }} />
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={"black"} />
      </View>
    )
  }

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: "center", }}>

      {/* modal to submit request */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={requestModal}
        onRequestClose={() => { setRequestModal(false) }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>Submit Request</Text>

            <TouchableOpacity style={{ height: 80, width: 80, borderRadius: 15, borderWidth: 1, alignSelf: 'flex-start', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }} onPress={() => { handleImagePicker() }}>
              {renderSquareFileUri()}
              {
                imageLoader ? <ActivityIndicator color={'black'} size={'small'} /> : <Icon name="plus" size={20} color={"black"} />
              }
            </TouchableOpacity>

            <TextInput
              style={[styles.input, { marginBottom: 0 }]}
              value={frameRequestMessage}
              onChangeText={(text) => setframeRequestMessage(text)}
              placeholder="Enter Message"
              multiline={true}
              numberOfLines={4}
            />

            <SelectDropdown
              data={["A4 Frame", "Normal Frame"]} // Use the language names
              onSelect={(selectedItem, index) => {
                setDefaultButtonText("A4 Frame" == selectedItem)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={[styles.input, { height: 30, justifyContent: 'flex-start', }]} // Align button content to the left
              rowTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 12, color: "black", textAlign: 'left' }} // Align text to the left
              buttonTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 12, color: "black", textAlign: 'left' }} // Align text to the left
              defaultButtonText={defaultButtonText}
              dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
            />

            <TouchableOpacity onPress={handleRequest} style={styles.okButton}>
              {
                requestLoad ? <ActivityIndicator color={'white'} /> : <Text style={styles.okButtonText}>Submit</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => { setRequestModal(true) }}
        >
          <Feather name={'git-pull-request'} size={20} color="white" />
          <Text style={styles.buttonText}>{'Request'}</Text>
        </TouchableOpacity>
      </View>

      {
        requests.length !=0 &&
        <ScrollView style={{ width: '100%', height: '100%', }}>
          <View style={{ alignItems: 'center' }}>
            {
              requests.map((item, index) => {

                const status = item.isFrameCreated === true ? "Completed" : "Pending"
                return (
                  <View key={index} style={styles.transactionContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                      <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'center' }}>
                        {/* icon */}
                        <View style={styles.transactionHeader}>
                          <Image
                            style={{ width: 50, height: 50, borderRadius: 10 }}
                            source={{ uri: item.frameRequestImage }}
                          />
                        </View>

                        <View style={{width: 100}}>
                          <Text style={[styles.transactionText1, { fontSize: 15 }]}>{item.userName}</Text>
                          {item?.frameRequestMessage && <Text style={[styles.transactionText2, { color: 'lightgrey' }]}>{item.frameRequestMessage}</Text>}
                          <Text style={[styles.transactionText2, { fontSize: 15, color: status == 'Pending' ? 'red' : 'lightgreen' }]}>{status}</Text>
                        </View>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.transactionText1, { fontSize: 20 }]}>{item.is_a4frame ? "A4" : "Normal"}</Text>
                        <Text style={[styles.transactionText2]}>{""}</Text>
                        <Text style={[styles.transactionText2, { alignSelf: 'flex-end', fontSize: 13, opacity: 0.7 }]}>{item?.addDate?.split(' ')[0]} - {item?.addDate?.split(' ')[1]}</Text>
                      </View>

                    </View>

                    <View>

                    </View>
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
      }

    </View>
  );
}

export default YourComponent;

const styles = StyleSheet.create({
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 20
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'black',
    borderColor: 'white',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Manrope-Regular',
    marginLeft: 5,
  },
  input: {
    width: 250,
    height: 100,
    borderRadius: 8,
    marginTop: 15,
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: 'black',
    paddingRight: 20,
    marginBottom: 10,
    paddingLeft: 15,
    textAlignVertical: 'top'
  },
  container: {
    margin: 20,
  },
  transactionContainer: {
    marginBottom: 20,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    width: '90%',
    paddingHorizontal: 20
  },
  transactionHeader: {
    alignSelf: 'center',
    marginRight: 10
  },
  transactionHeaderText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
  transactionText1: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: 'white',
  },
  transactionText2: {
    fontSize: 13,
    color: 'white',
    fontFamily: 'Manrope-Bold',
    maxWidth: '100%'
  },
  loadingText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
  },
})