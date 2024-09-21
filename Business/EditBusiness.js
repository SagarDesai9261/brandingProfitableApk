import PagerView from 'react-native-pager-view';
import Entypo from 'react-native-vector-icons/Entypo';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Button, ToastAndroid } from 'react-native';
// import imageData from '../apiData/200x200';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import ViewShot from "react-native-view-shot";
import Video from 'react-native-video';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import SwiperFlatList from 'react-native-swiper-flatlist';
import RNFetchBlob from 'rn-fetch-blob';
import { RNFFmpeg } from 'react-native-ffmpeg';
import { uploadImageWithOverlay } from '../DownloadImage';
import { Alert } from 'react-native';
import PaymentLoadingModal from '../Home/PaymentLoading';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const EditHome = ({ route, navigation }) => {

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };

  const { bannername } = route.params;

  const { items, index } = route.params;

  const [userTeamDetails, setUserTeamDetails] = useState('');
  const [subscritionExp, setSubscriptionExp] = useState(false);
  const [isLoader, setIsLoader] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isMLMPurchased, setIsMLMPurchased] = useState();
  const [userPurchasedPlan, setUserPurchased] = useState({})

  const [loaderShare, setLoaderShare] = useState(true);

  const getAllPlans = async () => {
    try {
      const response = await axios.get("https://api.brandingprofitable.com/payments/benefits/"+profileData.mobileNumber);
      const data = response.data.data;

      const stringifyData = JSON.stringify(data);

      await AsyncStorage.setItem("abcdplans", stringifyData)

      return data;
    } catch (error) {
      console.error("getting error in getting plans:", error)
    }
  }

  const checkWhichPlanUserPurchased = async (userPlanId) => {
    if (!isMLMPurchased) {
      try {

        // const response = await axios.get("")

        // const getPlansFromStore = await AsyncStorage.getItem("abcdplans");

        // if (getPlansFromStore) {
        //   const parsedData = JSON.parse(getPlansFromStore)
        //   const userPlan = parsedData.filter((plan) => plan.plan_id == userPlanId)
        //   setUserPurchased(userPlan[0])
        // } else {
          const allPlans = await getAllPlans();
          // const userPlan = allPlans.filter((plan) => plan.plan_id == userPlanId)
          setUserPurchased(allPlans[0])
        // }

        setLoaderShare(false)

      } catch (error) {
        console.error("gettting error in check purchased plan", error)
      }
    }
  }


  const fetchDetails = async () => {
    try {
      if (profileData) {
        const response = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData.mobileNumber}`);
        const result = response.data;

        if (result.statusCode === 200) {
          
          // setLoaderShare(false)
          setIsMLMPurchased(result.is_mlm)
          checkWhichPlanUserPurchased(result.plan_id)

          console.log("purchased...");
          setUserTeamDetails('Purchase');

          const date = result.details?.register_date;
          console.log(date, "date");

          if (date) {
            const originalDate = new Date(date);

            // Calculate the next year's date
            originalDate.setFullYear(originalDate.getFullYear() + 1);

            // Get today's date
            const today = new Date();

            // Compare the dates
            if (today <= originalDate) {
              console.log("Awesome! subscription not expired");
              setSubscriptionExp(false);
            } else {
              console.log("Oh no! subscription expires");
              setSubscriptionExp(true);
            }
          } else {
            console.log("Invalid date format");
          }
        } else {
          if (profileData.mobileNumber) {
            setLoaderShare(false)
          }
          console.log("User has no data or purchase request is not successful");
        }
      } else {
        console.log('Details not available!');
      }
      // setLoaderShare(false)
    } catch (error) {
      console.log('Error fetching data: ', error);
      // setLoaderShare(false)
    } finally {
      setTimeout(() => {
        setIsLoader(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [profileData]);

  const videos = useMemo(() => items.filter((item) => item.isVideo === true));
  const images = useMemo(() => items.filter((item) => item.isVideo === false));

  const [i, seti] = useState(0);


  const [userToken, setUserToken] = useState();

  useEffect(() => {
    retrieveProfileData();
  }, [])

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      const userToken = await AsyncStorage.getItem('userToken');
      setUserToken(userToken)
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  };

  useEffect(() => {
    if (i < 2) {
      if (items.length > 0) {
        setItem("https://cdn.brandingprofitable.com/" + items[index ? index : 0].imageUrl)
        seti(i + 1)
      }
    } else {
      console.log("i is bigger")
    }
  }, [i, index, items]);

  const [item, setItem] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [customFrames, setCustomFrames] = useState([]);
  const viewShotRef = useRef(null);

  const [displayImage, setdisplayImage] = useState(false)

  useEffect(() => {
    loadCustomFrames();
  }, []);

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      if (framesData) {
        const frames = JSON.parse(framesData);
        const filterCustomFrames = frames.filter(item => item.is_a4frame !== true);
  
          setCustomFrames(filterCustomFrames);
      }
    } catch (error) {
      console.error('Error loading custom frames:', error);
    }
  };

  const handleImagePress = (item) => {
    setItem(item);
  };

  const handleImagePressV = (item) => {
    setSelectedVideo(item.uri);
  };

  const onChangeIndex = ({ index, prevIndex }) => {
    if (index != currentFrame) {
      console.log(index);
      setCurrentFrame(index);
    }
  };

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": width-300, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  // const captureAndShareImage = async () => {
  //   // if (userTeamDetails === 'Purchase') {
  //   if (userTeamDetails === 'Purchase' && !subscritionExp) {
  //     try {
  //       const uri = await viewShotRef.current.capture();

  //       const fileName = 'sharedImage.jpg';
  //       const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  //       await RNFS.copyFile(uri, destPath);

  //       const shareOptions = {
  //         type: 'image/jpeg',
  //         url: `file://${destPath}`,
  //       };

  //       await Share.open(shareOptions);
  //     } catch (error) {
  //       console.error('Error sharing image:', error);
  //     } finally {
  //       setTimeout(() => {
  //         setIsLoader(false)
  //       }, 1000);
  //     }
  //   } else {
  //     showToastWithGravity("Purchase MLM to share/download");
  //     navigation.navigate('MlmScreenStack');
  //   }
  // };

  const clearCache = async () => {
    try {
      const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
      const files = await RNFetchBlob.fs.ls(cacheDir);

      // Delete all files in the cache directory
      for (const file of files) {
        await RNFetchBlob.fs.unlink(`${cacheDir}/${file}`);
      }

    } catch (error) {
      console.log("error in clear cache:", error);
    }
  };

  // capture and share image with high quality
  const captureAndShareImage = async (imageSource) => {
    // if (userTeamDetails === 'Purchase') {

    const selectedImage = item
    console.log(selectedImage, "selected image")
    // if (userTeamDetails === 'Purchase' && !subscritionExp) {

    // if (videos.length !== 0) {
    const videoURL = selectedImage;

    setIsProcessing(true);

    try {
      // Clear previous temporary files (if any)
      await clearCache();

      // Generate unique file names for the video, image, and output
      const videoFileName = `video_${Date.now()}.jpg`;
      const imageFileName = `image_${Date.now()}.png`;
      const outputFileName = `output_${Date.now()}.jpg`;

      // Download the video to a temporary directory with a unique name
      const videoResponse = await RNFetchBlob.config({
        fileCache: true,
        path: `${RNFetchBlob.fs.dirs.CacheDir}/${videoFileName}`,
      }).fetch('GET', videoURL);

      const videoPath = videoResponse.path();

      // Download the image to a temporary directory with a unique name
      const imageResponse = await RNFetchBlob.config({
        fileCache: true,
        path: `${RNFetchBlob.fs.dirs.CacheDir}/${imageFileName}`,
      }).fetch('GET', imageSource);

      const imagePath = imageResponse.path();

      // Increase video resolution and bitrate
      const resizedVideoPath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedVideo.jpg`;
      const resizeVideoCommand = `-i ${videoPath} -vf "scale=720:720" -b:v 2M -c:a copy ${resizedVideoPath}`;
      await RNFFmpeg.execute(resizeVideoCommand);

      // Increase image resolution
      const resizedImagePath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedImage.png`;
      const resizeImageCommand = `-i ${imagePath} -vf "scale=720:720" ${resizedImagePath}`;
      await RNFFmpeg.execute(resizeImageCommand);

      // Combine resized video and image using FFmpeg with proper overlay positioning
      const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/${outputFileName}`;
      const ffmpegCommand = `-i ${resizedVideoPath} -i ${resizedImagePath} -filter_complex "[0:v][1:v]overlay=0:0" -b:v 2M -c:a copy ${outputPath}`;
      await RNFFmpeg.execute(ffmpegCommand);

      setIsProcessing(false);

      // Share the video
      const shareOptions = {
        title: 'Share Image with Branding Profitable!',
        url: `file://${outputPath}`,
        type: 'image/jpg',
        failOnCancel: false,
      };

      await Share.open(shareOptions);
      //  downloadImageHighQuality(outputPath)
      setIsProcessing(false);
      // navigation.goBack();
    } catch (error) {
      showToastWithGravity("Troubleshooting, Please try again later");
      setIsProcessing(false);
      console.log("error in capture and save image function", error)
    }

    setIsProcessing(false);
    // } else {
    //   showToastWithGravity('Video not found!');
    // }

    // } else {
    //   showToastWithGravity("Purchase MLM to share/download Video");
    //   navigation.navigate('MlmScreenStack');
    // }

  };
console.log(userPurchasedPlan)
  const captureAndShareImageServerSide = async (img) => {
    try {

      if (userTeamDetails === 'Purchase' && !subscritionExp) {

        if (!userPurchasedPlan.business_image) {
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
          setIsProcessing(false)
    
          return;
        } 

        setIsProcessing(true)

        const downloadImageResult = await uploadImageWithOverlay(item, img, 'share');

        await clearCache();

        const imageFileName = `image_${Date.now()}.png`;

        const imageResponse = await RNFetchBlob.config({
          fileCache: true,
          path: `${RNFetchBlob.fs.dirs.CacheDir}/${imageFileName}`,
        }).fetch('GET', downloadImageResult);

        const imagePath = imageResponse.path();

        const shareOptions = {
          title: 'Share Image with Branding Profitable!',
          url: `file://${imagePath}`,
          type: 'image/jpg',
          failOnCancel: false,
        };
        setIsProcessing(false)

        await Share.open(shareOptions);
      }
      else {
        showToastWithGravity("Subscribe to share/download Video");
        navigation.navigate('MlmScreenStack');
      }
    } catch (error) {
      console.log("getting error in captureAndSaveImageServerSide function", error)
    }
  }

  const videoRef = useRef();
  const frameRef = useRef();

  const handlePageChange = (event) => {
    const { position } = event.nativeEvent;
    console.log('Page changed:', position);
    setCurrentFrame(position);
  };

  const captureAndShareVideo = async () => {
    console.log("share video clicked")
  };

  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true)

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress("https://cdn.brandingprofitable.com/" + item.imageUrl)}>
      <FastImage source={{ uri: "https://cdn.brandingprofitable.com/" + (item.comp_iamge || item.imageUrl) }} style={styles.image} onLoadEnd={() => Image.prefetch("https://cdn.brandingprofitable.com/" + (item.comp_iamge || item.imageUrl))} />
    </TouchableOpacity>
  ), []);

  const renderItemV = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePressV(item)}>
      <Video
        source={{ uri: "https://cdn.brandingprofitable.com/" + item.imageUrl }}   // Can be a URL or a local file.
        style={styles.image}
        paused={false}               // Pauses playback entirely.
        resizeMode="cover"            // Fill the whole screen at aspect ratio.
        muted={true}
        repeat={true}
      />
    </TouchableOpacity>
  ), []);

  setTimeout(() => {
    setFlatlistIsLoad(false);
  }, 6000);


  const [videoPause, setVideoPause] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const [j, setj] = useState(0)
  useEffect(() => {
    if (videos.length > 0 && j < 2) {
      setSelectedVideo(videos[0].imageUrl);
      setj(j + 1);
    }
  }, [videos, j]); // Add dependency array

  const [load, setisload] = useState(true)

  setTimeout(() => {
    setisload(false)
  }, 2000);

  if (isProcessing) {
    return (
      <LinearGradient colors={['white', 'white']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ height: width - 30, width: width - 30 }} source={require('../assets/Loading2.gif')} />
      </LinearGradient >
    )
  }

  if (isLoader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>

<PaymentLoadingModal visible={loaderShare} closeModal={() => { navigation.goBack(); }} content={'loading...'} />

      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 15 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={[styles.headerText,]} onPress={() => { navigation.navigate('HomeScreen') }}>
          {bannername}
        </Text>
        <TouchableOpacity style={{ padding: 4, backgroundColor: 'rgba(255, 0, 0, 0.5)', borderRadius: 100, marginLeft: 10 }} onPress={!displayImage ? () => { captureAndShareImageServerSide(customFrames[currentFrame].image) } : captureAndShareVideo}>
          <View style={{
            zIndex: 1,
            padding: 8,
            borderRadius: 100,
            elevation: 30,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* <Icon name="download" size={25} color={"white"} /> */}
            <Entypo name="share" size={20} color={"white"} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* main image */}
        {!displayImage ? (
          load ? (<View style={{
            height: width - 30, width: width - 30, marginVertical: 20, borderWidth: 0.5, borderColor: 'gray', borderRadius: 10, justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator />
          </View>) :

            (
              // <ViewShot style={{ height: width-30, width: width-30, marginVertical: 20, elevation: 20, borderWidth: 1, borderColor: 'white', borderRadius: 10, overflow: 'hidden' }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
              //   <SwiperFlatList
              //   data={customFrames} // Use 'customFrames' as your data source
              //   onChangeIndex={onChangeIndex}

              //   index={currentFrame}
              //   pagination={false} // To hide pagination, as 'showsPagination' is equivalent to 'pagination'
              //   renderItem={({ item: frame }) => (
              //     <View>
              //       <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
              //       <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
              //     </View>
              //   )}
              // />
              // </ViewShot>
              <ViewShot style={{ height: width - 50, width: width - 50, marginVertical: 20, elevation: 20 }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
                {/* <SwiperFlatList
                data={customFrames} // Use 'customFrames' as your data source
                onChangeIndex={onChangeIndex}

                index={currentFrame}
                pagination={false} // To hide pagination, as 'showsPagination' is equivalent to 'pagination'
                renderItem={({ item: frame }) => (
                  <View>
                    <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
                    <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                  </View>
                )}
              /> */}

                <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10, position: 'absolute' }]} />
                <PagerView
                  onPageSelected={handlePageChange}
                  style={{ height: width - 50, width: width - 50, marginVertical: 0, elevation: 20, }}
                  initialPage={0}
                >
                  {customFrames.map((frame, index) => (
                    <View key={index}>
                      <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                    </View>
                  ))}
                </PagerView>
              </ViewShot>
            )

        ) : (
          <View style={{ height: width - 30, width: width - 30, marginVertical: 20, elevation: selectedVideo == null ? 1 : 20, borderColor: 'white', borderWidth: selectedVideo == null ? 1 : 0, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} >
            {videoPause ? (
              <View style={{ justifyContent: 'center', alignItems: "center" }}>
                <ActivityIndicator />
              </View>
            )
              : (
                //   <SwiperFlatList
                //   data={customFrames}
                //   index={currentFrame}
                //   renderItem={({ item: frame }) => (
                //     <View>
                //       {frame.isVideoFrame ? (
                //         <Video
                //           source={{ uri: frame.image }} // Assuming 'frame.image' contains the video frame URL
                //           repeat={false}
                //           style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                //           resizeMode="cover"
                //         />
                //       ) : (
                //         <FastImage source={{ uri: frame.image }} style={[styles.mainImage, { borderRadius: 10 }]} />
                //       )}
                //     </View>
                //   )}
                //   horizontal
                //   showPagination={false}
                //   onIndexChange={({ index }) => setCurrentFrame(index)}
                // />
                <PagerView
                  onPageSelected={handlePageChange}
                  style={{ height: width - 50, width: width - 50, elevation: 20, }}
                  initialPage={0}
                >

                  {customFrames.map((frame, index) => (
                    <View key={index}>
                      {/* Check if the item is an image or a video frame */}
                      {frame.isVideoFrame ? (
                        <Video
                          source={{ uri: frame.image }} // Assuming 'frame.image' contains the video frame URL
                          repeat={false}
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <FastImage source={{ uri: frame.image }} style={[styles.mainImage, { borderRadius: 10 }]} />
                      )}
                    </View>
                  ))}

                </PagerView>
              )}
          </View>
        )}
        {/* <TouchableOpacity style={styles.ShareContainer} onPress={!displayImage ? captureAndShareImage : captureAndShareVideo}>
          <FastImage source={require('../assets/whatsapp2.png')} style={styles.whatsappImage} />
        </TouchableOpacity> */}



        {/* <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'flex-start',flex:1,width:'92%', gap:10, marginBottom:10}}>
          <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => {
            setdisplayImage(false)
          }}   >
            <Text style={{ color: !displayImage ? "white" : "gray", fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 20,  }}>
              Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => {
            setdisplayImage(true)
          }}>
            <Text style={{ color: !displayImage ? "gray" : "white", fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 20 }}>
              Video
            </Text>
          </TouchableOpacity>
        </View> */}



        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', flex: 1, width: '92%', gap: 10, marginBottom: 0 }}>
          {/* 1 */}
          {/* <TouchableOpacity onPress={() => {
            setdisplayImage(false)
          }}
            style={{ height: 30, width: 80, backgroundColor: displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <Text style={{ color: displayImage ? 'gray' : 'white', fontFamily: 'Manrope-Regular' }}>
              Images
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setdisplayImage(true)
          }} style={{ height: 30, width: 80, backgroundColor: !displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <Text style={{ color: !displayImage ? 'gray' : 'white', fontFamily: 'Manrope-Regular' }}>
              Videos
            </Text>
          </TouchableOpacity> */}
          {/* 2 */}
        </View>
        {!displayImage ? (
          items.length > 0 ? (
            <FlatList
              data={items}
              numColumns={3} // Adjust the number of columns as needed
              // keyExtractor={(item) => item._id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContainer}
              shouldComponentUpdate={() => false}
              removeClippedSubviews
              initialNumToRender={30}
              maxToRenderPerBatch={30}
              windowSize={10}
            />
          ) : (
            <FlatList
              data={items}
              numColumns={3} // Adjust the number of columns as needed
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContainer}
              shouldComponentUpdate={() => false}
              removeClippedSubviews
              initialNumToRender={30}
              maxToRenderPerBatch={30}
              windowSize={10}
            />
          )
        ) : (
          FlatlistisLoad ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
              <ActivityIndicator />
            </View>
          ) :
            videos.length > 0 ? (
              <FlatList
                data={videos}
                numColumns={3} // Adjust the number of columns as needed
                // keyExtractor={(item) => item.id.toString()}
                renderItem={renderItemV}
                contentContainerStyle={styles.flatListContainer}
                shouldComponentUpdate={() => false}
                removeClippedSubviews
                initialNumToRender={30}
                maxToRenderPerBatch={30}
                windowSize={10}
              />
            ) : (
              <View style={{ justifyContent: 'flex-start', flex: 1, marginTop: 30 }}>
                <Text style={{ color: 'white' }}>No videos Found!</Text>
              </View>
            )
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overlayImage: {
    position: 'absolute',
    height: width - 50,
    width: width - 50,
    zIndex: 1,
    top: 0,
    borderRadius: 10,
  },
  mainImage: {
    height: width - 50,
    width: width - 50,
    zIndex: -1
  },
  image: {
    height: itemWidth,
    width: itemWidth,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  flatListContainer: {
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
  headerContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
    fontFamily: 'Manrope-Bold'
  }
});

export default EditHome;

