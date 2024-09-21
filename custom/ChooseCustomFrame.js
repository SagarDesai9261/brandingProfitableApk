import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image, ToastAndroid, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';


const { width } = Dimensions.get('window')

const ChooseCustomFrame = ({ navigation, route }) => {
  const viewShotRef = useRef(null);

  const { capturedImage, isShare } = route.params;

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };

  const [isOpenFrame, setIsOpenFrame] = useState(true)

  const handleFrame = () => {
    setIsOpenFrame(!isOpenFrame)
  }

  // custom frames & overlay image 
  const [customFrames, setCustomFrames] = useState([]);


  useEffect(() => {
    loadCustomFrames();
  }, []);

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      const frames = JSON.parse(framesData);
      const filterCustomFrames = frames?.filter(item => item.is_a4frame !== true);
      if (filterCustomFrames) {
  
          setCustomFrames(filterCustomFrames);
        setOverlayImage(filterCustomFrames[0].image)
      }
    } catch (error) {
      console.error('Error loading custom frames:', error);
    }
  };

  const [overLayImage, setOverlayImage] = useState('')

  
  const [isLoader, setIsLoader] = useState(true)
  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  const [profileData, setProfileData] = useState(null);

  // setInterval(() => {
  //   retrieveProfileData()
  // }, 3000);

  React.useEffect(() => {
    retrieveProfileData()
  }, [retrieveProfileData])

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  };

  // 
  const [subscritionExp, setSubscriptionExp] = useState(false)

  const fetchDetails = async () => {
    try {
      if (profileData) {

        const response = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`);
        const result = response.data;

        if (response.data.statusCode == 200) {
          setUserTeamDetails('Purchase');
          const date = result.details?.register_date;
            console.log("purchased...")
            // const parts = (result?.registrationDate).split(' ')

            const originalDateStr = date;

            // console.log(parts, "parts === ")
            const originalDate = new Date(originalDateStr);

            // Calculate the next year's date
            originalDate.setFullYear(originalDate.getFullYear() + 1);

            // Get today's date
            const today = new Date();

            // Compare the dates
            if (today <= originalDate) {
              console.log("Awesome! subscition not expires");
              setSubscriptionExp(false)
            } else {
              console.log("oh no! subscition expires")
              setSubscriptionExp(true)
            }  
        } else {
          console.log("user not data aavto nathi athava purchase request ma che ")
        }
      } else {
        console.log('details malti nathi!')
      }
    } catch (error) {
      console.log('Error fetching data... choose custom frame:', error);
    } finally {
      setTimeout(() => {
        setIsLoader(false)
      }, 1000);
    }
  }

  React.useEffect(() => {
    fetchDetails();
  },[profileData])

  async function shareImage() {

    const uri = await viewShotRef.current.capture();

    const fileName = 'sharedImage.jpg';
    const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

    await RNFS.copyFile(uri, destPath);

    const shareOptions = {
      type: 'image/jpeg',
      url: `file://${destPath}`,
    };

    await Share.open(shareOptions);

  }

  const convertFileToBase64 = async (fileUri) => {
    alert(fileUri)
    const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return response;
  };

  const { config, fs } = RNFetchBlob;

  async function downloadImage() {
    const uri = await viewShotRef.current.capture();

    // Convert the file to base64
    const base64Image = await convertFileToBase64(uri);

    // upload image to cdn url 

    const apiUrl = "https://cdn.brandingprofitable.com/base64.php";
    const requestData = {
      base64_content: base64Image, // Use the updated base64 image data here
    };


    // Upload the canvas image to the CDN
    axios
      .post(apiUrl, requestData)
      .then(async (response) => {
        const { status, message, image_url } = response.data;

        if (status === "success") {
          console.log("https://cdn.brandingprofitable.com/" + image_url);

          const item = "https://cdn.brandingprofitable.com/" + image_url;


          const getExtension = (filename) => {
            // To get the file extension
            return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
          };

          let date = new Date();
          let ext = getExtension(item);
          ext = '.' + ext[0];

          let PictureDir = fs.dirs.DCIMDir;
          let options = {
            fileCache: true,
            addAndroidDownloads: {
              // Related to Android only
              useDownloadManager: true,
              notification: true,
              path:
                PictureDir +
                '/Branding Profitable/' +
                Math.floor(date.getTime() + date.getSeconds() / 2) +
                ext,
              description: 'Image',
            },
          };


          const downloadResult = await config(options)
            .fetch('GET', item)
            .then((res) => {
              console.log('Download success -> ', JSON.stringify(res));
              showToastWithGravity("Saved Successfully")
            })
            .catch((error) => {
              console.log('Download failed -> ', error);
              showToastWithGravity("Download Failed")
            });
          console.log(downloadResult, "download result")
        } else {
        }
      })

  }

    // capture viewshot 

    const captureAndShareImage = async () => {

      if (!isShare) {
        Alert.alert(
          'Please Upgrade a Plan..!',
          'Upgrade your plan to share images/videos',
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

      // if (userTeamDetails === 'Purchase' ) {
      if (userTeamDetails === 'Purchase' && !subscritionExp) {
        try {
          Alert.alert(
            'Share or Download',
            'You want to share or download image?',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'Share',
                onPress: () => {
                  shareImage()
                }
              },
              {
                text: 'Download',
                onPress: () => {
                  downloadImage()
                }
              },
            ],
            { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
          );
        } catch (error) {
          console.error('Error sharing image:', error);
        }
  
      } else {
        showToastWithGravity("Subscribe to share/download");
        navigation.navigate('MlmScreenStack');
      }
    };

  if (isLoader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'space-between' }}>

      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          Choose Frame
        </Text>
        <TouchableOpacity onPress={captureAndShareImage}>
          <Text style={{ height: 30, width: 30 }}>
            <MaterialCommunityIcons name="share-variant" size={30} color={"white"} />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <ViewShot
          ref={viewShotRef}
          style={{
            width: 300,
            height: 300,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            overflow: 'hidden',
            elevation: 5,
            borderRadius: 10
          }}
        >

          <TouchableOpacity
            activeOpacity={1}
            style={{ height: '100%', width: '100%' }}
          >
            <FastImage source={{ uri: capturedImage }} style={styles.overlayImage} />
            <FastImage source={{ uri: overLayImage }} style={styles.overlayImage} />
          </TouchableOpacity>
        </ViewShot>
      </View>

      <View>


        {/* all frames */}
        {
          isOpenFrame &&
          <View style={{ height: 70, backgroundColor: 'white', width, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity activeOpacity={1} style={{ borderWidth: 1, borderRadius: 10, overflow: 'hidden', width: 50, height: 50, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}
              onPress={() => {
                setOverlayImage(null)
              }}
            >
              <Image source={require('../assets/NoneImage.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            {/* Frames list */}
            <FlatList
              data={customFrames}
              horizontal
              keyExtractor={(item) => item.image}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginRight: 5,
                  }}
                  onPress={() => {
                    setOverlayImage(item.image);
                  }}>
                  <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingHorizontal: 10,
                alignItems: 'center', // Center all children vertically
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }

        {/* bottom */}
        <View style={{ height: 90, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

          <TouchableOpacity activeOpacity={1} style={{ height: 60, width: 50, backgroundColor: 'white', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }} onPress={handleFrame}>

            <View style={{ width: '100%' }}>
              <Text style={{ color: 'black', textAlign: 'center' }}><FontAwesome6 name="expand" size={32} color={"black"} /></Text>
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>Frame</Text>
            </View>

          </TouchableOpacity>

        </View>

      </View>


    </LinearGradient>
  )
}

export default ChooseCustomFrame


const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontFamily: "Manrope-Bold",
  },
  overlayImage: {
    position: 'absolute',
    opacity: 1,
    height: 300,
    width: 300,
    top: 0,
    borderRadius: 10
  },
})

