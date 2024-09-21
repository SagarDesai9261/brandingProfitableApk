import { uploadImageWithOverlay } from '../DownloadImage';
import PagerView from 'react-native-pager-view';
import Entypo from 'react-native-vector-icons/Entypo';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Alert, ToastAndroid, Platform, PermissionsAndroid } from 'react-native';
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
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import SwiperFlatList from 'react-native-swiper-flatlist';
import RNFetchBlob from 'rn-fetch-blob';
import { RNFFmpeg } from 'react-native-ffmpeg';
import ImageResizer from 'react-native-image-resizer';
import PaymentLoadingModal from '../Home/PaymentLoading';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const EditItem = ({ route, navigation }) => {

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };
  let [selectedVideo, setSelectedVideo] = useState(null);
  console.log(selectedVideo)
  const [mainVideoLoader, setMainVideoLoader] = useState(false);

  const [oldImg, setOldImg] = useState(null)

  const handleImagePressV = (item) => {
    const newSelectedVideo = "https://cdn.brandingprofitable.com/" + item.image;
    console.log("new", newSelectedVideo)
    console.log("old", selectedVideo)

    // Only update selectedVideo if the new value is different
    if (newSelectedVideo !== selectedVideo) {
      setMainVideoLoader(true);
    }
    setSelectedVideo(newSelectedVideo);
  };

  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastVideoLoaded, setLastVideoLoaded] = useState(false);

  const [loadingFlatlist, setLoadingFlatlist] = useState(true);
  const videosPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);

  const fetchVideos = (page) => {
    // Simulate an API call to fetch videos based on the page
    const startIdx = (page - 1) * videosPerPage;
    const endIdx = startIdx + videosPerPage;
    const newVideos = videos.slice(startIdx, endIdx);

    setDisplayedVideos((prevVideos) => [...prevVideos, ...newVideos]);
    setCurrentPage(page + 1);
    setLoadingFlatlist(false);
  };

  const handleLoadMore = () => {
    setLoadingFlatlist(true);
    fetchVideos(currentPage);
  };


  // useEffect(() => {
  //   // setDisplayedVideos(videos.slice(0,6));
  //   // setCurrentIndex(6)
  //   const intervalId = setInterval(() => {
  //     if (currentIndex < videos.length) {
  //       // Display the next 6 videos
  //       setDisplayedVideos((prevVideos) => [
  //         ...prevVideos,
  //         ...videos.slice(currentIndex, currentIndex + 6),
  //       ]);

  //       setCurrentIndex((prevIndex) => prevIndex + 6);
  //     } else {
  //       // All videos displayed, stop the interval
  //       setLastVideoLoaded(true)
  //       clearInterval(intervalId);
  //     }
  //   }, 10000);

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, [currentIndex, videos]);


  const { categoryName, isVideo } = route.params;

  const [loading, setLoading] = useState(true)
  const [data, setdata] = useState([]);

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    retrieveProfileData();
  }, [])

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error)
    }
  };

  const videos = useMemo(() => data.filter((item) => item.isVideo === true));
  const images = useMemo(() => data.filter((item) => item.isVideo === false));
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.brandingprofitable.com/category/${categoryName}`);
      const result = response.data;
      if (result) {
        setdata(result);
        // Filter and set the first 6 videos directly
        const videos = result.filter((item) => item.isVideo === true).slice(0, 6);

        // setItem(videos[0].);
        // setCurrentIndex(6)

        const images = result.filter((item) => item.isVideo === false);
        // console.log(images.length)
        setTimeout(() => {

          if (images.length != 0) {
            console.log("https://cdn.brandingprofitable.com/" + images[0].image)
            setItem("https://cdn.brandingprofitable.com/" + images[0].image)
          } else {
            setItem("https://cdn.brandingprofitable.com/upload/6561f0b11c4abimage-not-found.png")
          }
        }, 200);

        if (videos.length == 0) {
          setMainVideoLoader(false)
        } else {
          setItem('https://cdn.brandingprofitable.com/' + videos[0].image)
        }

        // setTimeout(() => {
        //   setItem("https://cdn.brandingprofitable.com/" + result[0].image);
        // }, 100);
      }
    } catch (error) {
      console.log('Error fetching data... edit item search :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchData()
    }
  }, [categoryName]);

  // custom frame 
  const [currentFrame, setCurrentFrame] = useState(0);
  const [customFrames, setCustomFrames] = useState([]);
  const viewShotRef = useRef(null);

  const [displayImage, setdisplayImage] = useState(isVideo ? true : false)

  useEffect(() => {
    loadCustomFrames();
  }, []);

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      const frames = JSON.parse(framesData);
      const filterCustomFrames = frames?.filter(item => item.is_a4frame !== true);
      if (filterCustomFrames?.length !== 0 && filterCustomFrames) {
        setCustomFrames(filterCustomFrames);
      } else {
        showAlert()
      }
    } catch (error) {
    }
  };

  //item 
  const [item, setItem] = useState("");
  const [i, seti] = useState(0);

  // handle image or video press
  const handleImagePress = (item) => {
    setItem(item);
  };

  // const handleImagePressV = (item) => {
  //     setMainVideoLoader(true)
  //     setSelectedVideo("https://cdn.brandingprofitable.com/" + item.image);
  // };


  useEffect(() => {
    if (i < 2) {
      if (data.length > 0) {
        setItem(data[0].image)
        seti(i + 1)
      }
    } else {
      console.log("i is bigger")
    }
  }, [i, data])


  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  const [subscritionExp, setSubscriptionExp] = useState(false);

  const [isMLMPurchased, setIsMLMPurchased] = useState();
  const [userPurchasedPlan, setUserPurchased] = useState({});
  const [loaderShare, setLoaderShare] = useState(true);

  console.log(userPurchasedPlan, "user e purchase krelo plan")

  const getAllPlans = async () => {
    try {
      const response = await axios.get("https://api.brandingprofitable.com/payments/benefits/" + profileData.mobileNumber);
      const data = response.data.data;

      const stringifyData = JSON.stringify(data);

      await AsyncStorage.setItem("abcdplans", stringifyData)

      return data;
    } catch (error) {
      console.error("getting error in getting plans:", error)
    }
  }

  const checkWhichPlanUserPurchased = async (userPlanId) => {
    // if (!isMLMPurchased) {
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
        console.error("gettting error in check purchased plan", error);
        setLoaderShare(false)
      }
    // }
  }

  const fetchDetails = async () => {
    try {

      const userStatus = await AsyncStorage.getItem('userMLMStatus');

      if (userStatus=='Purchased') {
        console.log("purchased...");
        setUserTeamDetails('Purchase');
      }else if (userStatus=='Expired') {
        setSubscriptionExp(true)
        console.log("expired...");
      }else{
        console.log("data not get or not purchase")
      }

      const response = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`);
      if (response.data.statusCode == 200) {
        console.log("purchased...");
        setUserTeamDetails('Purchase');
      }
      const result = response.data;
      setIsMLMPurchased(result.is_mlm)
      checkWhichPlanUserPurchased(result.plan_id)

    } catch (error) {
      console.log('Error fetching data...edit item search :', error);
    } finally {
      setIsLoader(false)
    }
  }

  useEffect(() => {
    if (profileData) {
      fetchDetails();
    }
  }, [profileData])

  const [isLoader, setIsLoader] = useState(true)

  // loader 
  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true)

  // render items, image and video
  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress("https://cdn.brandingprofitable.com/" + item.image)}>
      <FastImage source={{ uri: "https://cdn.brandingprofitable.com/" + item.image || 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80' }} style={styles.image} />
    </TouchableOpacity>
  ), []);


  // const renderItemV = useCallback(({ item }) => (
  //   <TouchableOpacity onPress={() => {
  //     if (selectedVideo != "https://cdn.brandingprofitable.com/" + item.image ) {
  //       handleImagePressV(item)
  //       console.log(selectedVideo)
  //     }
  //   }}>
  //     <FastImage source={{ uri: "https://cdn.brandingprofitable.com/" + item.image }} style={styles.image}
  //       onLoadEnd={() => Image.prefetch("https://cdn.brandingprofitable.com/" + item.image)}
  //     />
  //     <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1, }}>
  //       <Icon name="play-circle" size={30} color={"white"} />
  //     </View>
  //   </TouchableOpacity>
  // ), []);

  const renderItemV = useCallback(({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleImagePressV(item)}>
        <Video
          source={{ uri: "https://cdn.brandingprofitable.com/" + item.image }}
          repeat={false}
          paused={false}
          style={styles.image}
          resizeMode="cover"
          muted={true}
        />
        <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1 }}>
          <Icon name="play-circle" size={30} color={"white"} />
        </View>
      </TouchableOpacity>
    )
  }, []);

  setTimeout(() => {
    setFlatlistIsLoad(false)
  }, 6000);

  // for video 

  const [videoPause, setVideoPause] = useState(false)


  const [j, setj] = useState(0)
  useEffect(() => {
    if (videos.length > 0 && j < 2) {
      setSelectedVideo("https://cdn.brandingprofitable.com/" + videos[0].image);
      setj(j + 1);
    }
  }, [videos, j]); // Add dependency array

  const [load, setisload] = useState(true)

  setTimeout(() => {
    setisload(false)
  }, 2000);

  // download
  const showAlertShareDownload = () => {
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
            if (!displayImage) {
              captureAndShareImageServerSide(customFrames[currentFrame].image);
            } else {
              captureAndShareVideoWithOverlay(customFrames[currentFrame].image, selectedVideo);
            }
          }
        },
        {
          text: 'Download',
          onPress: () => {
            if (!displayImage) {
              captureAndSaveImageServerSide(customFrames[currentFrame].image);
            } else {
              captureAndDownloadVideoWithOverlay(customFrames[currentFrame].image, selectedVideo);
            }
          }
        },
      ],
      { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
    );
  };


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
  //     }
  //   } else {
  //     showToastWithGravity("Subscribe to share/download")
  //     navigation.navigate('MlmScreenStack');
  //     console.log("userteamdetails:", userTeamDetails, "subscritionExp:", subscritionExp)
  //   }
  // };

  // capture and share image with high quality
  const captureAndShareImage = async (imageSource) => {
    // if (userTeamDetails === 'Purchase') {

    const selectedImage = item
    console.log(selectedImage, "selected image")
    if (userTeamDetails === 'Purchase' && !subscritionExp) {

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

    } else {
      showToastWithGravity("Subscribe to share/download Video");
      navigation.navigate('MlmScreenStack');
    }

  };

  const captureAndShareImageServerSide = async (img) => {
    try {

      // if (todayOrTrending === 'today' && !userPurchasedPlan.festival_image) {
      //   Alert.alert(
      //     'Please Upgrade a Plan..!',
      //     'Upgrade your plan to share images/videos',
      //     [
      //       {
      //         text: 'Cancel',
      //         style: 'cancel'
      //       },
      //       {
      //         text: 'Upgrade',
      //         onPress: () => {
      //           navigation.navigate('MlmScreenStack');
      //         }
      //       },
      //     ],
      //     { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
      //   );
      //   setIsProcessing(false)

      //   return;
      // } else if (todayOrTrending === 'trending' && !userPurchasedPlan.trnding_image) {
      //   Alert.alert(
      //     'Please Upgrade a Plan..!',
      //     'Upgrade your plan to share images/videos',
      //     [
      //       {
      //         text: 'Cancel',
      //         style: 'cancel'
      //       },
      //       {
      //         text: 'Upgrade',
      //         onPress: () => {
      //           navigation.navigate('MlmScreenStack');
      //         }
      //       },
      //     ],
      //     { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
      //   );
      //   setIsProcessing(false)

      //   return;
      // }

      if (userTeamDetails === 'Purchase' && !subscritionExp) {

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


  const getExtention = (filename) => {
    // To get the file extension
    return /[.]/.exec(filename) ?
      /[^.]+$/.exec(filename) : undefined;
  };

  const downloadImage = async () => {
    // Main function to download the image
    try {

      showToastWithGravity("download start")
      // showToastWithGravity("download image in development!")
      const uri = await viewShotRef.current.capture();
      const imageBase64 = await RNFS.readFile(uri, 'base64');

      const cdnUrl = 'https://cdn.brandingprofitable.com/base64.php';
      const requestData = {
        base64_content: imageBase64, // Use the updated base64 image data here
      };

      const response = await axios.post(cdnUrl, requestData);

      const finalImageUri = "https://cdn.brandingprofitable.com/" + response.data.image_url;

      let date = new Date();
      // Image URL which we want to download
      let image_URL = finalImageUri;
      // Getting the extention of the file
      let ext = getExtention(image_URL);
      ext = '.' + ext[0];
      // Get config and fs from RNFetchBlob
      // config: To pass the downloading related options
      // fs: Directory path where we want our image to download
      const { config, fs } = RNFetchBlob;

      let PictureDir = fs.dirs.DCIMDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          // Related to the Android only
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
      config(options)
        .fetch('GET', image_URL)
        .then(res => {
          // Showing alert after successful downloading
          console.log("res", res)
          console.log('res -> ', JSON.stringify(res));
          showToastWithGravity("Image Saved")
        });

    } catch (error) {
      console.log("getting error in download an image:", error)
      showToastWithGravity("Something went Wrong!")

    }
  };

  // const captureAndSaveImage = async (photo) => {
  //   if (userTeamDetails === 'Purchase' && !subscritionExp) {
  //   // if (userTeamDetails === 'Purchase') {
  //     const parts = photo.split('/');
  //     const photoName = parts[parts.length - 1];
  //     // try {

  //     //   // Capture the view containing the image
  //     //   const uri = await viewShotRef.current.capture();

  //     //   const dirs = RNFetchBlob.fs.dirs;

  //     //   var path = dirs.DCIMDir + photoName;

  //     //   // Define the destination path for saving the image
  //     //   const fileName = 'myImage.jpg';
  //     //   const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  //     //   // Move the captured image to the app's cache directory
  //     //   await RNFS.moveFile(uri, destPath);

  //     //   // Read the image file and convert it to base64
  //     //   const base64Image = await RNFS.readFile(destPath, 'base64');

  //     //   await RNFS.writeFile(path, base64Image, 'base64');
  //     //   console.log("image saved: ", path)
  //     //   showToastWithGravity("image saved to gallary")
  //     // } catch (error) {
  //     //   console.log('Error:', error);
  //     // }

  //     try {
  //       // const granted = await PermissionsAndroid.request(
  //       //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       //   {
  //       //     title: 'Storage Permission Required',
  //       //     message:
  //       //       'App needs access to your storage to download Photos',
  //       //   }
  //       // );

  //   const apilevel = Platform.Version;

  //       if (apilevel >= 33) {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
  //         );
  //         if (granted) {
  //           downloadImage()
  //         } else {
  //           showToastWithGravity("give permission to download")
  //         }
  //       } else {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  //         )
  //         if (granted) {
  //           downloadImage()
  //         } else {
  //           showToastWithGravity("give permission to download")
  //         }
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   } else {
  //     showToastWithGravity("Subscribe to share/download");
  //     navigation.navigate('MlmScreenStack');
  //   }
  // };



  // capture images in high quality
  const downloadImageHighQuality = async (image) => {
    // Main function to download the image
    try {

      showToastWithGravity("download start")
      // showToastWithGravity("download image in development!")
      const uri = image;
      const imageBase64 = await RNFS.readFile(uri, 'base64');

      const cdnUrl = 'https://cdn.brandingprofitable.com/base64.php';
      const requestData = {
        base64_content: imageBase64, // Use the updated base64 image data here
      };

      const response = await axios.post(cdnUrl, requestData);

      const finalImageUri = "https://cdn.brandingprofitable.com/" + response.data.image_url;

      let date = new Date();
      // Image URL which we want to download
      let image_URL = finalImageUri;
      // Getting the extention of the file
      let ext = getExtention(image_URL);
      ext = '.' + ext[0];
      // Get config and fs from RNFetchBlob
      // config: To pass the downloading related options
      // fs: Directory path where we want our image to download
      const { config, fs } = RNFetchBlob;

      let PictureDir = fs.dirs.DCIMDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          // Related to the Android only
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
      config(options)
        .fetch('GET', image_URL)
        .then(res => {
          console.log("res", res);
          console.log('res -> ', JSON.stringify(res));
          showToastWithGravity("Image Saved")
        });

    } catch (error) {
      console.log("getting error in download an image:", error)
      showToastWithGravity("Something went Wrong!")

    }
  };

  // 
  const onChangeIndex = ({ index, prevIndex }) => {
    if (index != currentFrame) {
      console.log(index);
      setCurrentFrame(index);
    }
  };

  // -------------------------------------------

  async function requestStoragePermission() {
    try {
      const apilevel = Platform.Version;

      if (apilevel >= 33) {

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );

        return granted == PermissionsAndroid.RESULTS.GRANTED;

      } else {
        const granted = await PermissionsAndroid.request(

          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to download images.',
            buttonPositive: 'OK',
          }
        )

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.log("error in download image", err);
      return false;
    }
  }

  async function downloadImageBase64(base64Data) {
    try {
      // const dirs = RNFetchBlob.fs.dirs;
      // const path = `${dirs.DCIMDir}/Branding Profitable/${fileName}.jpg`;

      // Check and request storage permission if needed
      if (await requestStoragePermission()) {
        // Write binary data to a file
        // await RNFetchBlob.fs.writeFile(path, base64Data, 'base64');

        const dirs = RNFetchBlob.fs.dirs;

        const time = new Date();
        const timeToString = time.getMilliseconds() + time.getSeconds() + time.getMinutes();
        console.log("timeToString", timeToString)

        var path = dirs.PictureDir + `/Branding Profitable/image_${timeToString}.png`;

        RNFetchBlob.fs.writeFile(path, base64Data, 'base64')
          .then((res) => {
            console.log("File : ", res)

            console.log('Image downloaded successfully:', path);
            showToastWithGravity("image saved")

          }).catch((e) => {
            console.log("error in writefile:", e);
            showToastWithGravity("Something went wrong")
          })

      } else {
        console.log('Storage permission denied');
        showToastWithGravity('Please grant storage permission to download images');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      showToastWithGravity('Error downloading image');
      throw error;
    }
  }

  async function readFileAsBase64(path) {
    try {
      return await RNFS.readFile(path, 'base64');
    } catch (error) {
      console.error('Error reading file as base64:', error);
      throw error; // Re-throw the error for handling at a higher level if needed
    }
  }

  async function resize(data, width, height) {
    try {
      const base64Image = `data:image/jpeg;base64,${data}`;
      const resized = await ImageResizer.createResizedImage(base64Image, width, height, 'JPEG', 80);
      return await readFileAsBase64(resized.path);
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error; // Re-throw the error for handling at a higher level if needed
    }
  }

  async function getImageHeightWidth(item) {
    return new Promise((resolve, reject) => {
      Image.getSize(
        item,
        (width, height) => {
          console.log(item,"image name  ")
          resolve({ width, height });
        },
        (error) => {
          console.error('Error getting image size:', error);
          reject(error);
        }
      );
    });
  }

  const captureAndSaveImage = async (imageSource) => {
    // if (userTeamDetails === 'Purchase') {

    const selectedImage = item
    console.log(selectedImage, "selected image")
    if (userTeamDetails === 'Purchase' && !subscritionExp) {

      // if (videos.length !== 0) {
      const videoURL = selectedImage;

      setIsProcessing(true);

      try {
        // Clear previous temporary files (if any)
        await clearCache();

        const imageResolution = await getImageHeightWidth(item);

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
        const resizeVideoCommand = `-i ${videoPath} -vf "scale=${imageResolution.width*2}:${imageResolution.height*2}" -b:v 2M -c:a copy ${resizedVideoPath}`;
        await RNFFmpeg.execute(resizeVideoCommand);

        // Increase image resolution
        const resizedImagePath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedImage.png`;
        const resizeImageCommand = `-i ${imagePath} -vf "scale=${imageResolution.width*2}:${imageResolution.height*2}" ${resizedImagePath}`;
        await RNFFmpeg.execute(resizeImageCommand);

        // Combine resized video and image using FFmpeg with proper overlay positioning
        const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/${outputFileName}`;
        const ffmpegCommand = `-i ${resizedVideoPath} -i ${resizedImagePath} -filter_complex "[0:v][1:v]overlay=0:0" -b:v 2M -c:a copy ${outputPath}`;
        await RNFFmpeg.execute(ffmpegCommand);

        setIsProcessing(false);

        // Share the video
        const shareOptions = {
          title: 'Share Video with Branding Profitable!',
          url: `file://${outputPath}`,
          type: 'image/jpg',
          failOnCancel: false,
        };

        // await Share.open(shareOptions);
        //  downloadImageHighQuality(outputPath)

        const imageBase64 = await RNFS.readFile(`file://${outputPath}`, 'base64');
        const newResizedImage = await resize(imageBase64, imageResolution.width, imageResolution.height);

        // try {
        //   const apilevel = Platform.Version;

        //   if (apilevel >= 33) {
        //     const granted = await PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        //     );
        //     if (granted) {
        //       downloadImageHighQuality(outputPath)

        //     } else {
        //       showToastWithGravity("give permission to download")
        //     }
        //   } else {
        //     const granted = await PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        //     )
        //     if (granted) {
        //       downloadImageHighQuality(outputPath)

        //     } else {
        //       showToastWithGravity("give permission to download")
        //     }
        //   }
        // } catch (err) {
        //   // To handle permission related exception
        //   console.warn(err);
        // }

        try {

          const apilevel = Platform.Version;

          if (apilevel >= 33) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            );
            if (granted) {
              await downloadImageBase64(newResizedImage);
            } else {
              showToastWithGravity("give permission to download")
            }
          } else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            )
            if (granted) {
              await downloadImageBase64(newResizedImage);
            } else {
              showToastWithGravity("give permission to download")
            }
          }

        } catch (error) {
          console.error('Error during image download:', error);
        }

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

    } else {
      showToastWithGravity("Subscribe to share/download Video");
      navigation.navigate('MlmScreenStack');
    }
  }

  const captureAndSaveImageServerSide = async (img) => {
    try {

      if (userTeamDetails === 'Purchase' && !subscritionExp) {

      setIsProcessing(true)

      const downloadImageResult = await uploadImageWithOverlay(item, img);
      showToastWithGravity(downloadImageResult);

      if (downloadImageResult != undefined) {
        setIsProcessing(false)
      }

    }
    else {
      showToastWithGravity("Subscribe to share/download Video");
      navigation.navigate('MlmScreenStack');
    }

    } catch (error) {
      setIsProcessing(false)

      console.log("getting error in captureAndSaveImageServerSide function", error)
    }
  }


  async function requestStoragePermission() {
    try {
      const apilevel = Platform.Version;

      if (apilevel >= 33) {

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );

        return granted == PermissionsAndroid.RESULTS.GRANTED;

      } else {
        const granted = await PermissionsAndroid.request(

          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to download images.',
            buttonPositive: 'OK',
          }
        )

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.log("error in download image", err);
      return false;
    }
  }

  async function downloadVideoBase64(base64Data) {
    try {
      // const dirs = RNFetchBlob.fs.dirs;
      // const path = `${dirs.DCIMDir}/Branding Profitable/${fileName}.jpg`;

      // Check and request storage permission if needed
      if (await requestStoragePermission()) {
        // Write binary data to a file
        // await RNFetchBlob.fs.writeFile(path, base64Data, 'base64');

        const dirs = RNFetchBlob.fs.dirs;

        const time = new Date();
        const timeToString = time.getMilliseconds() + time.getSeconds() + time.getMinutes();
        console.log("timeToString", timeToString)

        var path = dirs.DCIMDir + `/Branding Profitable/video_${timeToString}.mp4`;

        RNFetchBlob.fs.writeFile(path, base64Data, 'base64')
          .then((res) => {
            console.log("File : ", res)

            console.log('Image downloaded successfully:', path);
            showToastWithGravity("Video saved")

          }).catch((e) => {
            console.log("error in writefile:", e);
            showToastWithGravity("Something went wrong")
          })

      } else {
        console.log('Storage permission denied');
        showToastWithGravity('Please grant storage permission to download images');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      showToastWithGravity('Error downloading image');
      throw error;
    }
  }
  // now cahnge the code

  const [isProcessing, setIsProcessing] = useState(false);

  const captureAndShareVideoWithOverlay = async (imageSource, selectedVideo) => {
    // if (userTeamDetails === 'Purchase' ) {
    if (userTeamDetails === 'Purchase' && !subscritionExp) {

      if (videos.length !== 0) {
        const videoURL = selectedVideo;

        setIsProcessing(true);

        try {
          // Clear previous temporary files (if any)
          await clearCache();

          // Generate unique file names for the video, image, and output
          const videoFileName = `video_${Date.now()}.mp4`;
          const imageFileName = `image_${Date.now()}.png`;
          const outputFileName = `output_${Date.now()}.mp4`;

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
          const resizedVideoPath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedVideo.mp4`;
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
            title: 'Share Video with Branding Profitable!',
            url: `file://${outputPath}`,
            type: 'video/mp4',
            failOnCancel: false,
          };

          await Share.open(shareOptions);
          setIsProcessing(false);
          navigation.goBack();
        } catch (error) {
          showToastWithGravity("Troubleshooting, Please try again later");
          setIsProcessing(false);
        }

        setIsProcessing(false);
      } else {
        showToastWithGravity('Video not found!');
      }

    } else {
      showToastWithGravity("Subscribe to share/download Video")
      navigation.navigate('MlmScreenStack');
    }
  };

  // download video
  const captureAndDownloadVideoWithOverlay = async (imageSource, selectedVideo) => {

    if (userTeamDetails === 'Purchase' && !subscritionExp) {

      if (videos.length !== 0) {
        const videoURL = selectedVideo;

        setIsProcessing(true);

        try {
          // Clear previous temporary files (if any)
          await clearCache();

          // Generate unique file names for the video, image, and output
          const videoFileName = `video_${Date.now()}.mp4`;
          const imageFileName = `image_${Date.now()}.png`;
          const outputFileName = `output_${Date.now()}.mp4`;

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
          const resizedVideoPath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedVideo.mp4`;
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
            title: 'Share Video with Branding Profitable!',
            url: `file://${outputPath}`,
            type: 'video/mp4',
            failOnCancel: false,
          };

          // await Share.open(shareOptions);

          const apilevel = Platform.Version;
          const imageBase64 = await RNFS.readFile(`file://${outputPath}`, 'base64');

          // download
          if (apilevel >= 33) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            );
            if (granted) {
              downloadVideoBase64(imageBase64)
            } else {
              showToastWithGravity("give permission to download")
            }
          } else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            )
            if (granted) {
              downloadVideoBase64(imageBase64)
            } else {
              showToastWithGravity("give permission to download")
            }
          }

          setIsProcessing(false);
          // navigation.goBack();
        } catch (error) {
          showToastWithGravity("Troubleshooting, Please try again later");
          setIsProcessing(false);
          console.log(error)
        }

        setIsProcessing(false);
      } else {
        showToastWithGravity('Video not found!');
      }
    } else {
      showToastWithGravity("Purchase Subscription to Share/Download");
      navigation.navigate('MlmScreenStack');
    }
  };

  const handlePageChange = (event) => {
    const { position } = event.nativeEvent;
    console.log('Page changed:', position);
    setCurrentFrame(position);
  };


  const clearCache = async () => {
    try {
      const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
      const files = await RNFetchBlob.fs.ls(cacheDir);

      // Delete all files in the cache directory
      for (const file of files) {
        await RNFetchBlob.fs.unlink(`${cacheDir}/${file}`);
      }

    } catch (error) {
    }
  };

  if (isProcessing) {
    return (
      <LinearGradient colors={['white', 'white']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ height: width - 30, width: width - 30 }} source={require('../assets/Loading2.gif')} />
      </LinearGradient >
    )
  }

  // language
  if (isLoader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

<PaymentLoadingModal visible={loaderShare} closeModal={() => { navigation.goBack(); }} content={'loading...'} />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          {categoryName}
        </Text>
        <TouchableOpacity style={{ padding: 4, backgroundColor: 'rgba(255, 0, 0, 0.5)', borderRadius: 100, marginLeft: 10 }} onPress={showAlertShareDownload}>
          <View style={{
            zIndex: 1,
            padding: 8,
            borderRadius: 100,
            elevation: 30,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* <Text style={{ height: 20, width: 20 }}>
              <Icon name="download" size={25} color={"white"} />
            </Text> */}
            <Entypo name="download" size={20} color={"white"} />

          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* main image */}
        {!displayImage ? (
          load ? (<View style={{
            height: 300, width: 300, marginVertical: 20, borderWidth: 0.5, borderColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator />
          </View>) :

            (<ViewShot style={{ height: 300, width: 300, marginVertical: 20, elevation: 20 }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
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
              <FastImage source={{ uri: images.length != 0 ? item : "https://cdn.brandingprofitable.com/upload/6561f0b11c4abimage-not-found.png" }} style={[styles.mainImage, { borderRadius: 10, position: 'absolute', marginVertical: 0 }]} />
              <PagerView
                onPageSelected={handlePageChange}
                style={{ height: width - 50, width: width - 50, marginVertical: 0, elevation: 20, }}
                initialPage={0}
              >
                {customFrames.map((frame, index) => (
                  <View key={index}>
                    <FastImage source={{ uri: images.length != 0 ? frame.image : null }} style={styles.overlayImage} />
                  </View>
                ))}
              </PagerView>
            </ViewShot>)

        ) : (
          // <View style={{ height: 300, width: 300, marginVertical: 20, elevation: 20 }} >
          //   {videoPause ? (
          //     <View style={{ justifyContent: 'center', alignItems: "center" }}>
          //       <ActivityIndicator />
          //     </View>
          //   )
          //     : (
          //       <SwiperFlatList
          //         data={customFrames}
          //         index={currentFrame}
          //         renderItem={({ item: frame }) => (
          //           <View>
          //             {/* Check if the item is an image or a video frame */}
          //             {frame.isVideoFrame ? (
          //               <Video
          //                 source={{ uri: selectedVideo }} // Assuming 'frame.image' contains the video frame URL
          //                 repeat={false}
          //                 style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          //                 resizeMode="cover"
          //               />
          //             ) : (
          //               <FastImage source={{ uri: frame.image }} style={[styles.mainImage, { borderRadius: 10 }]} />
          //             )}
          //           </View>
          //         )}
          //         horizontal
          //         showPagination={false}
          //         onChangeIndex={onChangeIndex}

          //       />
          //     )}
          // </View>
          <View style={{ height: 300, width: 300, marginVertical: 20, elevation: 20 }} >
            {videoPause ? (
              <View style={{ justifyContent: 'center', alignItems: "center" }}>
                <ActivityIndicator />
              </View>
            )
              : (
                <View style={{ flex: 1 }}>
                  {/* Video component */}
                  {selectedVideo == null ? (
                    <Image
                      style={[styles.mainImage, { borderRadius: 10, position: 'absolute' }]}
                      source={{ uri: "https://cdn.brandingprofitable.com/upload/6561ef5bc1387404-video%20not%20found.jpg" }}
                    />
                  ) : (
                    <>
                      <Video
                        source={{ uri: selectedVideo }}
                        repeat={false}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        resizeMode="cover"
                        onLoad={() => setMainVideoLoader(false)}
                      />
                      {mainVideoLoader && (
                        <ActivityIndicator style={{ position: 'absolute', top: 140, left: 140, zIndex: 1 }} size={'small'} color={'red'} />
                      )}
                    </>
                  )}

                  {/* SwiperFlatList component for overlay images */}
                  {/* <SwiperFlatList
                    data={customFrames}
                    index={currentFrame}
                    onChangeIndex={onChangeIndex}
                    renderItem={({ item: frame }) => (
                      <View>
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
                    )}
                    horizontal
                    showPagination={false}
                    onIndexChange={({ index }) => console.log("index", index)}
                  /> */}
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
                          <FastImage source={{ uri: videos.length != 0 ? frame.image : null }} style={[styles.mainImage, { borderRadius: 10 }]} />
                        )}
                      </View>
                    ))}

                  </PagerView>
                </View>

              )}
          </View>
        )}


        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', flex: 1, width: '92%', gap: 10, marginTop: 10, marginBottom: 40 }}>
        {
              images.length != 0 &&
              <TouchableOpacity onPress={() => {
                setdisplayImage(false)
              }}
                style={{ height: 25, width: 70, backgroundColor: displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                <Text style={{ color: displayImage ? 'gray' : 'white', fontFamily: 'Manrope-Regular' }}>
                  Images
                </Text>
              </TouchableOpacity>
            }
            {
              videos.length != 0 && 
            <TouchableOpacity onPress={() => {
              setdisplayImage(true)
            }} style={{ height: 25, width: 70, backgroundColor: !displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
              <Text style={{ color: !displayImage ? 'gray' : 'white', fontFamily: 'Manrope-Regular' }}>
                Videos
              </Text>
            </TouchableOpacity>
            }
          {/* 2 */}
        </View>

        {!displayImage ? (
          images.length > 0 ? (
            <FlatList
              data={images}
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
            <View style={{ height: '50%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white' }}>No Images Found</Text>
            </View>
          )
        ) : (
          FlatlistisLoad ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
              <ActivityIndicator />
            </View>
          ) :
            videos.length > 0 ? (
              <>
                <FlatList
                  // data={videos}
                  data={displayedVideos}
                  numColumns={3} // Adjust the number of columns as needed]

                  // keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItemV}
                  contentContainerStyle={styles.flatListContainer}
                  shouldComponentUpdate={() => false}
                  removeClippedSubviews
                  initialNumToRender={30}
                  maxToRenderPerBatch={30}
                  windowSize={10}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.1}
                  ListFooterComponent={loadingFlatlist && <ActivityIndicator />}
                />
                {/* 
                {1 == 1 && (
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <ActivityIndicator color={'white'} />
                  </View>
                )} */}
              </>
            ) : (
              <View style={{ justifyContent: 'flex-start', height: 200 }}>
                <Text style={{ color: 'white' }}>No videos Found!</Text>
              </View>
            )
        )}
      </View>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overlayImage: {
    position: 'absolute',
    opacity: 1,
    height: 300,
    width: 300,
    zIndex: 1,
    top: 0,
    borderRadius: 10
  },
  mainImage: {
    height: 300,
    width: 300,
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
    paddingBottom: 20
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
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Manrope-Bold',
    marginLeft: 20
  }
});

export default EditItem
