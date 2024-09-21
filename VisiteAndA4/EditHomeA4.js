import PagerView from 'react-native-pager-view';
import Entypo from 'react-native-vector-icons/Entypo';
import { createThumbnail } from 'react-native-create-thumbnail';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Button, Modal, ToastAndroid, PermissionsAndroid, Platform, Alert } from 'react-native';
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
import Feather from 'react-native-vector-icons/Feather'
import DropDownPicker from 'react-native-dropdown-picker';
import SelectDropdown from 'react-native-select-dropdown';
// import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { RNFFmpeg } from 'react-native-ffmpeg';
import ImageResizer from 'react-native-image-resizer';
import { uploadImageWithOverlay } from '../DownloadImage';
import PaymentLoadingModal from '../Home/PaymentLoading';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5;

const a4AspectRatio = 375 / 300;

// Calculate image height to maintain the A4 size aspect ratio
const imageHeight = itemWidth * a4AspectRatio;

const EditHomeA4 = ({ route, navigation }) => {

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };

  const { bannerId, bannername } = route.params;


  // const [newVideos, setNewVideos] = useState([])

  // const { items, index } = route.params;

  const [items, setItems] = useState([]);
  const [loadImagesData, setLoadImagesData] = useState(true);
  const [item, setItem] = useState("");

  console.log(item, "item id ")

  const [dataNotFound, setDataNotFound] = useState(false);

  const [loadingData, setLoadingData] = useState(true)

  const fetchDataForImages = async () => {
    try {
    //   const apiUrl = `https://api.brandingprofitable.com/a4data/a4data/${bannerId}`;
//   alert(bannerId.toString())

      const apiUrl = `https://api.brandingprofitable.com/a4/todaytomorrow/data/${bannerId}`;
      const response = await axios.get(apiUrl);

      console.log(apiUrl, "apiUrl ---")

      // Convert the reversed entries back to an object
      const reversedData = response.data.data.reverse();

      const data = response.data;

      // Assuming 'items' is a state variable and you have a function like 'setItems' to update it
      // console.log(data.data)
      setItems(data.data);

      const items = data.data
      // const items = data.data.filter((item) => item.isVideo === false);


      if (data.data.length === 0) {
        setDataNotFound(true);
      }

      // Filter and set the first 6 videos directly
      const videos = data.data.filter((item) => item.isVideo === true).slice(0, 6);

      if (videos.length === 0) {
        setMainVideoLoader(false);
      } else {
        setSelectedVideo('https://cdn.brandingprofitable.com/' + videos[0].todayAndTomorrowImageOrVideo);
      }

      setDisplayedVideos(videos.slice(0, 6));
      setCurrentIndex(6);

      // // console.log(videos);
      // setNewVideos(videos);

      if (items.length !== 0) {
        setItem("https://cdn.brandingprofitable.com/" + items[0].todayAndTomorrowImageOrVideo);
        // setLoadingData(false)
        setTimeout(() => {
          setLoadImagesData(false);
          setLoadingData(false);
        }, 1000);
      } else {
        setItem("https://cdn.brandingprofitable.com/upload/6561f0b11c4abimage-not-found.png");
        setTimeout(() => {
          setLoadImagesData(false);
          setLoadingData(false);
        }, 1000);
      }


    } catch (error) {
      setDataNotFound(true);

      console.error("Error fetching data:", error);
    }
  };


  // Call the function to fetch data
  useEffect(() => {
    fetchDataForImages();
  }, [])


  const videos = useMemo(() => items?.filter((item) => item.isVideo === true));
  const [lastVideoLoaded, setLastVideoLoaded] = useState(false);

  // devided videos
  // Function to chunk an array into smaller arrays

  // Assuming 'videos' is your array of video objects
  // const videos = useMemo(() => items.filter((item) => item.isVideo === true));

  // Chunk the 'videos' array into arrays of 10 videos each

  const [indexOfChunckedSet, setIndexOfChunckedSet] = useState(0);

  // const [newVideos, setNewVideos] = useState([])

  const chunkedVideos = chunkArray(videos, 6);

  function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  // console.log(newVideos)

  // Example usage of VideosFunction
  function VideosFunction(result, index) {
    if (result.length >= index) {
      // Assuming newVideos is a state variable updated using setNewVideos
      // setNewVideos((prevVideos) => [...prevVideos, result[index]]); 
    }
  };

  const [newVideos, setNewVideos] = useState([]);
  // let newVideos = [];


  // const allVideos = Array.from({ length: 36 }, (_, index) => `Video ${index + 1}`);
  // const [videos, setVideos] = useState([...]); // Replace [...] with your array of videos
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaderShare, setLoaderShare] = useState(true);

  const [loading, setLoading] = useState(true);
  const videosPerPage = 6;

  // useEffect(() => {
  //   // Simulate fetching the initial set of videos
  //   fetchVideos(currentPage);
  // }, []);

  const [runningLoadMore, setRunningLoadMore] = useState(true)
  const [videoLoadedCompleted, setVideoLoadedCompleted] = useState(false)

  const fetchVideos = (page) => {
    // Simulate an API call to fetch videos based on the page
    const startIdx = (page - 1) * videosPerPage;
    const endIdx = startIdx + videosPerPage;
    const newVideos = videos.slice(startIdx, endIdx);

    setDisplayedVideos((prevVideos) => [...prevVideos, ...newVideos]);
    setCurrentPage(page + 1);
    setLoading(false);
    // if (displayedVideos.length == videos.length) {
    //   setVideoLoadedCompleted(true)
    // }
    setRunningLoadMore(true)
  };

  const handleLoadMore = () => {
    if (displayedVideos.length == videos.length) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    setRunningLoadMore(false)
    if (runningLoadMore) {
      setTimeout(() => {
        fetchVideos(currentPage);
      }, 3000);
    }
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

  // useEffect(() => {
  //   let currentIndex = 0;

  //   const intervalId = setInterval(() => {
  //     const start = currentIndex;
  //     const end = start + videosPerPage;
  //     const currentVideos = allVideos.slice(start, end);

  //     if (currentVideos.length === 0) {
  //       clearInterval(intervalId); // Stop the interval when all videos are displayed
  //     } else {
  //       setNewVideos((prevVideos) => [...prevVideos, currentVideos]); 
  //       setVisibleVideos(currentVideos);
  //       currentIndex += videosPerPage;
  //     }
  //   }, intervalTime);

  //   return () => {
  //     clearInterval(intervalId); // Cleanup the interval on component unmount
  //   };
  // }, []);


  // useEffect(() => {
  //   // Set up an interval to call VideosFunction every 4 seconds
  //   const intervalId = setInterval(() => {
  //     // Check if the current video is the last one
  //     if (indexOfChunckedSet === chunkedVideos.length) {
  //       setLastVideoLoaded(true);
  //     }
  //     console.log("first")
  //     // Set the index of the next video
  //     setIndexOfChunckedSet(indexOfChunckedSet + 1);

  //     VideosFunction(chunkedVideos, indexOfChunckedSet); // Call your function here
  //   }, 5000);

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []); // The empty dependency array ensures that the effect runs only once on mount



  // useEffect(() => {

  // }, [])


  const images = useMemo(() => items?.filter((item) => item.isVideo === false));

  const [userToken, setUserToken] = useState();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    retrieveProfileData()
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

  const [i, seti] = useState(0);

  // useEffect(() => {
  //   if (i < 2) {
  //     if (items.length > 0) {
  //       const todayAndTomorrowImageOrVideo = items[0].todayAndTomorrowImageOrVideo == undefined ? "https://static.vecteezy.com/system/resources/previews/023/914/428/non_2x/no-document-or-data-found-ui-illustration-design-free-vector.jpg" : "https://cdn.brandingprofitable.com/" + items[0].todayAndTomorrowImageOrVideo
  //       setItem(todayAndTomorrowImageOrVideo)
  //       seti(i)
  //     }
  //   } else {
  //     console.log("i is bigger")
  //   }
  // }, [i, items])

  const [currentFrame, setCurrentFrame] = useState(0);
  const [customFrames, setCustomFrames] = useState([]);
  const viewShotRef = useRef(null);

  const [displayImage, setdisplayImage] = useState(false);

  useEffect(() => {
    loadCustomFrames();
  }, []);

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');

      console.log(framesData, "---")
      const frames = JSON.parse(framesData);
      const filterCustomFrames = frames?.filter(item => item.is_a4frame == true);
      console.log(filterCustomFrames, "mmm")
      if (filterCustomFrames.length != 0) {
        setCustomFrames(filterCustomFrames);
      } else {
        showAlert()
      }
    } catch (error) {
      console.log('Error loading custom frames:', error);
    }
  };

  const handleImagePress = (item) => {
    setItem(item);
  };

  const handleImagePressV = (item) => {
    setMainVideoLoader(true)
    setSelectedVideo("https://cdn.brandingprofitable.com/" + item.todayAndTomorrowImageOrVideo);
  };

  const [isLoader, setIsLoader] = useState(true)
  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  // const fetchDetails = async () => {
  //   try {
  //     if (profileData) {

  //       const response = await axios.get(`https://api.brandingprofitable.com/mlm/premium/${profileData?.mobileNumber}`);
  //       const result = response.data;

  //       if (response.data.statusCode == 200) {
  //         console.log("user e purchase krelu che..");
  //         setUserTeamDetails('Purchase');
  //       } else {
  //         console.log("user not data aavto nathi athava purchase request ma che ");
  //       }
  //     } else {
  //       console.log('details malti nathi!')
  //     }
  //   } catch (error) {
  //     console.log('Error fetching data... edit home dynamic:', error);
  //   } finally {
  //     setTimeout(() => {
  //       setIsLoader(false)
  //     }, 1000);
  //   }
  // }

  const [subscritionExp, setSubscriptionExp] = useState(false);

  const fetchDetails = async () => {
    try {
      if (profileData) {

        const response = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData.mobileNumber}`);
        const result = response.data;

        if (response.data.statusCode == 200) {
          setUserTeamDetails('Purchase');
          checkWhichPlanUserPurchased(result.plan_id)

          // setLoaderShare(false)
          // check expiry
          // const date = '2023-10-29';
          const date = result.details?.register_date;

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
          } else {
            console.log("oh no! subscition expires");
            setSubscriptionExp(true)
          }

          // setHasFetched(true);

        } else {
          if (profileData?.mobileNumber) {
            setLoaderShare(false)
          }
          console.log("user not data aavto nathi athava purchase request ma che ");
        }
      } else {
        console.log('profile no data malto nathi...! edithome screen ma ---')
      }
      // setLoaderShare(false)
    } catch (error) {
      console.log('Error fetching data... edit home dynamic:', error);
      // setLoaderShare(false)
    }
  }

  useEffect(() => {
    if (profileData) {
      fetchDetails();
    }
  }, [profileData])

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const showAlertShareDownload = () => {
    Alert.alert(
      'Share or Download',
      'You want to share or download image?',
      [
        {
          text: 'cancel',
          style: 'cancel'
        },
        {
          text: 'Share',
          onPress: !displayImage ? () => { captureAndShareImageServerSide(customFrames[currentFrame].image) } : () => { captureAndShareVideoWithOverlay(customFrames[currentFrame].image, selectedVideo) }
        },
        {
          text: 'Download',
          onPress: !displayImage ? () => { captureAndSaveImageServerSide(customFrames[currentFrame].image) } : () => { captureAndDownloadVideoWithOverlay(customFrames[currentFrame].image, selectedVideo) }
        },

      ],
      { cancelable: true } // Set to false if
    );
  };

  // const captureAndShareImage = async () => {
  //   if (userTeamDetails === 'Purchase' && !subscritionExp) {
  //     // if (userTeamDetails === 'Purchase') {
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
  //     }
  //   } else {
  //     showToastWithGravity("Purchase MLM to share/download");
  //     navigation.navigate('MlmScreenStack');
  //   }

  // };

  // capture and share image 
  const captureAndShareImage = async (imageSource) => {
    // if (userTeamDetails === 'Purchase') {

    const selectedImage = item
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
      showToastWithGravity("Purchase MLM to share/download Video");
      navigation.navigate('MlmScreenStack');
    }

  };


  const [isMLMPurchased, setIsMLMPurchased] = useState();
  const [userPurchasedPlan, setUserPurchased] = useState({});

  console.log(userPurchasedPlan, "userPurchasedPlan")

  const getAllPlans = async () => {
    try {
      const response = await axios.get("https://api.brandingprofitable.com/payments/benefits/" + profileData.mobileNumber);
      const data = response.data.data;

      const stringifyData = JSON.stringify(data);

      await AsyncStorage.setItem("abcdplans", stringifyData);

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


  const captureAndShareImageServerSide = async (img) => {
    try {

      if (userTeamDetails === 'Purchase' && !subscritionExp) {

        if (!userPurchasedPlan.a4_image_video) {
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
        showToastWithGravity("Purchase MLM to share/download Video");
        navigation.navigate('MlmScreenStack');
      }
    } catch (error) {
      console.log("getting error in captureAndSaveImageServerSide function", error)
    }
  }

  // download image in user's gallery 

  const getExtention = (filename) => {
    // To get the file extension
    return /[.]/.exec(filename) ?
      /[^.]+$/.exec(filename) : undefined;
  };

  // cdn 

  // permission for android 13 version device

  const downloadImage = async () => {
    // Main function to download the image
    try {
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
    }
  };

  // const captureAndSaveImage = async (photo) => {
  //   if (userTeamDetails === 'Purchase' && !subscritionExp) {
  //     // if (userTeamDetails === 'Purchase') {
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

  // try {
  //   const apilevel = Platform.Version;

  //   if (apilevel >= 33) {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
  //     );
  //     if (granted) {
  //       downloadImage()
  //     } else {
  //       showToastWithGravity("give permission to download")
  //     }
  //   } else {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  //     )
  //     if (granted) {
  //       downloadImage()
  //     } else {
  //       showToastWithGravity("give permission to download")
  //     }
  //   }
  // } catch (err) {
  //   // To handle permission related exception
  //   console.warn(err);
  // }
  //   } else {
  //     showToastWithGravity("Purchase MLM to share/download");
  //     navigation.navigate('MlmScreenStack');
  //   }
  // };

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
            message: 'App needs access to your storage to download items.',
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

            console.log('Image downloaded successfully:', path);
            showToastWithGravity("image saved")

          }).catch((e) => {
            console.log("error in writefile:", e);
            showToastWithGravity("Something went wrong")
          })

      } else {
        console.log('Storage permission denied');
        showToastWithGravity('Please grant storage permission to download items');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      showToastWithGravity('Error downloading image');
      throw error;
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
        showToastWithGravity('Please grant storage permission to download items');
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
          console.log(item, "image name  ")
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

    const selectedImage = item;
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
        const resizeVideoCommand = `-i ${videoPath} -vf "scale=${imageResolution.width * 2}:${imageResolution.height * 2}" -b:v 10M -c:a copy ${resizedVideoPath}`;
        await RNFFmpeg.execute(resizeVideoCommand);

        // Increase image resolution
        const resizedImagePath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedImage.png`;
        const resizeImageCommand = `-i ${imagePath} -vf "scale=${imageResolution.width * 2}:${imageResolution.height * 2}" ${resizedImagePath}`;
        await RNFFmpeg.execute(resizeImageCommand);

        // Combine resized video and image using FFmpeg with proper overlay positioning
        const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/${outputFileName}`;
        const ffmpegCommand = `-i ${resizedVideoPath} -i ${resizedImagePath} -filter_complex "[0:v][1:v]overlay=0:0" -b:v 10M -c:a copy ${outputPath}`;
        await RNFFmpeg.execute(ffmpegCommand);


        // const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/${outputFileName}`;
        // const ffmpegCommand = `-i ${resizedVideoPath} -i ${resizedImagePath} -filter_complex "[0:v][1:v]overlay=0:0:enable='between(t,0,5)'[out]" -map "[out]" -map 0:a -b:v 3M -c:a copy ${outputPath}`;

        // await RNFFmpeg.execute(ffmpegCommand);

        setIsProcessing(false);

        // Share the video
        const shareOptions = {
          title: 'Share Video with Branding Profitable!',
          url: `file://${outputPath}`,
          type: 'image/jpg',
          failOnCancel: false,
        };

        const imageBase64 = await RNFS.readFile(`file://${outputPath}`, 'base64');
        const newResizedImage = await resize(imageBase64, imageResolution.width, imageResolution.height);

        // await Share.open(shareOptions);
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
      showToastWithGravity("Purchase MLM to share/download Video");
      navigation.navigate('MlmScreenStack');
    }
  }

  const captureAndSaveImageServerSide = async (img) => {
    try {
      if (userTeamDetails === 'Purchase' && !subscritionExp) {

        if (!userPurchasedPlan.a4_image_video) {
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

        const downloadImageResult = await uploadImageWithOverlay(item, img);
        showToastWithGravity(downloadImageResult);

        if (downloadImageResult != undefined) {
          setIsProcessing(false)
        }

      }
      else {
        showToastWithGravity("Purchase MLM to share/download Video");
        navigation.navigate('MlmScreenStack');
      }

    } catch (error) {
      console.log("getting error in captureAndSaveImageServerSide function", error)
    }
  }

  const videoRef = useRef();
  const frameRef = useRef();

  const captureAndShareVideo = async () => {
    showToastWithGravity("Video Share is in Development!")






























    // try {
    //   const videoURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

    //   // Download the video to a temporary directory
    //   const response = await RNFetchBlob.config({
    //     fileCache: true,
    //     path: `${RNFetchBlob.fs.dirs.CacheDir}/sharedVideo.mp4`,
    //   }).fetch('GET', videoURL);

    //   const tempPath = response.path();

    //   const shareOptions = {
    //     title: 'Share Video',
    //     url: `file://${tempPath}`,
    //     social: Share.Social.WHATSAPP, // Change to other social media if needed
    //     failOnCancel: false,
    //   };

    //   // Share the video
    //   Share.open(shareOptions)
    //     .then((res) => console.log('Shared successfully'))
    //     .catch((err) => console.log('Error sharing:', err));
    // } catch (error) {
    //   console.log('Error during video sharing:', error);
    // }
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const downloadVideoHighQuality = async (image) => {
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

  const captureAndShareVideoWithOverlay = async (imageSource, selectedVideo) => {

    if (userTeamDetails === 'Purchase' && !subscritionExp) {
      if (!userPurchasedPlan.a4_image_video) {
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

  // download video
  const captureAndDownloadVideoWithOverlay = async (imageSource, selectedVideo) => {

    if (userTeamDetails === 'Purchase' && !subscritionExp) {

      if (!userPurchasedPlan.a4_image_video) {
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

  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress("https://cdn.brandingprofitable.com/" + item.todayAndTomorrowImageOrVideo)}>
      <FastImage source={{ uri: "https://cdn.brandingprofitable.com/" + (item.comp_iamge || item.todayAndTomorrowImageOrVideo) }} style={styles.image} onLoadEnd={() => Image.prefetch("https://cdn.brandingprofitable.com/" + (item.comp_iamge || item.todayAndTomorrowImageOrVideo))} />
    </TouchableOpacity>
  ), []);

  // const renderItemV = useCallback(({ item }) => {
  //   return (
  //     <TouchableOpacity onPress={() => handleImagePressV(item)}>
  //       <FastImage source={{ uri: "https://cdn.brandingprofitable.com/" + item.todayAndTomorrowImageOrVideo }} style={styles.image} onLoadEnd={() => Image.prefetch("https://cdn.brandingprofitable.com/" + item.todayAndTomorrowImageOrVideo)} />
  //       <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1, }}>
  //         <Icon name="play-circle" size={30} color={"white"} />
  //       </View>
  //     </TouchableOpacity>
  //   )
  // }, []);

  // const renderItemV = ({ item }) => {
  //   return (
  //     <TouchableOpacity onPress={() => handleImagePressV(item)}>
  //       <FastImage source={{ uri: "https://cdn.brandingprofitable.com/"+item.todayAndTomorrowImageOrVideo, priority: FastImage.priority.high, cache: FastImage.cacheControl.cacheOnly}} resizeMode={FastImage.resizeMode.contain} style={styles.image} />
  //       <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1 }}>
  //         <Icon name="play-circle" size={30} color={"white"} />
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  // const renderItemV = useCallback(({ item }) => (
  //   <TouchableOpacity onPress={() => handleImagePressV(item)}>
  //     <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1, }}>
  //       <Icon name="play-circle" size={30} color={"white"} />
  //     </View>
  //     <Video
  //       source={{ uri: "https://cdn.brandingprofitable.com/" + item.todayAndTomorrowImageOrVideo }}
  //       repeat={false}
  //       paused={false}
  //       style={styles.image}
  //       resizeMode="cover"
  //       onLoad={() => setVideoPause(false)}
  //       muted={true}
  //     />
  //   </TouchableOpacity>
  // ), []);

  const player = useRef(null)

  const renderItemV = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity onPress={() => handleImagePressV(item)}>
          <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1 }}>
            <Icon name="play-circle" size={30} color={'white'} />
          </View>
          <Video
            source={{ uri: 'https://cdn.brandingprofitable.com/' + item.todayAndTomorrowImageOrVideo }}
            repeat={false}
            paused={false}
            style={styles.image}
            resizeMode="cover"
            ref={player}
            // onLoad={() => setLastVideoLoaded(false)}
            // onEnd={() => {
            //   // Check if the current video is the last one
            //   if (indexOfChunckedSet === chunkedVideos.length) {
            //     setLastVideoLoaded(true);
            //   }
            //   console.log("first")
            //   // Set the index of the next video
            //   setIndexOfChunckedSet(indexOfChunckedSet + 1);
            // }}
            onLoad={() => {
              player.current.seek(2)
            }}
            muted={true}
          />
        </TouchableOpacity>
      )
    },
    [chunkedVideos, indexOfChunckedSet]
  );

  setTimeout(() => {
    setFlatlistIsLoad(false);
  }, 6000)

  const [videoPause, setVideoPause] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [mainVideoLoader, setMainVideoLoader] = useState(true);

  const [j, setj] = useState(0)
  // useEffect(() => {
  //   if (videos.length > 0 && j < 2) {
  //     setSelectedVideo("https://cdn.brandingprofitable.com/" + videos[0].todayAndTomorrowImageOrVideo);
  //     setj(j + 1);
  //   }
  // }, [videos, j]); // Add dependency array

  const [load, setisload] = useState(true)

  setTimeout(() => {
    setisload(false)
  }, 2000);

  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [open, setOpen] = useState(false);

  // fetch languages 

  const [languages, setLanguages] = useState([
    { languageName: 'All' },
    { languageName: 'English' },
    { languageName: 'हिन्दी' }
  ])

  let [apiRun, setApiRun] = useState(true)
  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.brandingprofitable.com/language/languages',
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = [
        { "languageName": 'All' }, ...response.data.data
      ];
      setApiRun(false)

      setLanguages(result);

      setSelectedLanguage('All');

      setIsLoader(false)
    } catch (error) {
      console.log('Error fetching data... edit home:', error);
      setIsLoader(false);

    }

  };

  useEffect(() => {
    if (apiRun) {
      fetchData();
    }
  }, [fetchData])

  const [callLanguageFunc, setCallLanguageFunc] = useState(true)

  useEffect(() => {
    if (callLanguageFunc) {
      setCallLanguageFunc(false)
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(2);

  const handlePageChange = (event) => {
    const { position } = event.nativeEvent;
    setCurrentFrame(position);
  };
  const filteredItems = items.filter((item) => (item.languageName == selectedLanguage));
  const filteredItemsV = videos.filter((item) => (item.languageName == selectedLanguage));



  if (loadingData) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} size={'small'} />
      </LinearGradient >
    )
  }

  if (isProcessing) {
    return (
      <LinearGradient colors={['white', 'white']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ height: width - 30, width: width - 30 }} source={require('../assets/Loading2.gif')} />
      </LinearGradient >
    )
  }

  if (isLoader && loadImagesData) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  if (dataNotFound) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>

        <PaymentLoadingModal visible={loaderShare} closeModal={() => { navigation.goBack(); }} content={'loading...'} />

        <View style={styles.headerContainer}>
          <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
            <Icon name="angle-left" size={30} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
            {bannername}
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
              {/* <Icon name="download" size={25} color={"white"} /> */}
              <Entypo name="download" size={20} color={"white"} />

            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>
          No Data Found!
        </Text>
        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>
          {/* No Data Found! */}
        </Text>
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>

      <Modal
        animationType="fade" // You can use "fade" or "none" for animation type
        visible={isModalVisible}
        transparent={true}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',

        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            height: "40%",
            height: 230,
            width: width - 30,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* icon */}
            <TouchableOpacity onPress={hideAlert} style={{
              backgroundColor: 'red',
              padding: 8,
              borderRadius: 8,
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
              }}><Feather name="log-out" size={25} color="white" /></Text>
            </TouchableOpacity>
            {/* title */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 10,
              color: 'red'
            }}>Let's Create Awesome Frames!</Text>
            {/* caption */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 5,
              color: 'lightgray',
              textAlign: 'center'
            }}>Now don't have any frames let's create!</Text>
            {/* another */}
            <View style={{ width: '80%', marginTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  hideAlert()
                  navigation.navigate('Frames', {a4_have: true});
                }}
                style={{
                  backgroundColor: 'red',
                  width: 70,
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: "center",
                  borderRadius: 8,
                }}>
                <Text style={{
                  color: 'white',
                  fontFamily: "Manrope-Bold"
                }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          {bannername}
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
            {/* <Icon name="download" size={25} color={"white"} /> */}
            <Entypo name="download" size={20} color={"white"} />

          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* main image */}
        {!displayImage ? (
          load ? (<View style={{
            height: width - 30, width: width - 30, marginVertical: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator />
          </View>) :

            (
              // <ViewShot style={{ height: width - 30, width: width - 30, marginVertical: 10, marginBottom: 20, elevation: 20, borderWidth: 1, borderColor: 'white', borderRadius: 10, overflow: 'hidden' }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
              //   <SwiperFlatList
              //     data={customFrames} // Use 'customFrames' as your data source
              //     onChangeIndex={onChangeIndex}
              //     index={currentFrame}
              //     pagination={false} // To hide pagination, as 'showsPagination' is equivalent to 'pagination'
              //     renderItem={({ item: frame }) => (
              //       <View>
              //         <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
              //         <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
              //       </View>
              //     )}
              //   />
              // </ViewShot>
              <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
                {/* <SwiperFlatList
                data={customFrames} // Use 'customFrames' as your data source
                onChangeIndex={onChangeIndex}
                pagination={false} // To hide pagination, as 'showsPagination' is equivalent to 'pagination'
                renderItem={({ item: frame }) => (
                  <View>
                    <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
                    <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                  </View>
                )}
              /> */}

                {/* {{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} */}

                <FastImage source={{ uri: item || "https://static.vecteezy.com/system/resources/previews/023/914/428/non_2x/no-document-or-data-found-ui-illustration-design-free-vector.jpg" }} style={[styles.mainImage, { borderRadius: 10, position: 'absolute', marginVertical: 20 }]} />

                <PagerView
                  onPageSelected={handlePageChange}
                  style={{ width: 300, height: 375, marginVertical: 20, elevation: 20, }}
                  initialPage={0}
                >
                  {customFrames.map((frame, index) => {
                    return (
                      <View key={index}>
                        <Image source={{ uri: items.length != 0 ? frame.image : null }} style={styles.overlayImage} />
                      </View>
                    )
                  })}
                </PagerView>
              </ViewShot>
            )

        ) : (
          <View style={{ width: 300, height: 375, marginVertical: 10, marginBottom: 20, elevation: 10 }} >
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

                    videos.length != 0 ? (
                      <Video
                        source={{ uri: selectedVideo }}
                        repeat={false}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        resizeMode="cover"
                        onLoad={() => setMainVideoLoader(false)}
                      />
                    ) : (
                      <Image
                        style={[styles.mainImage, { borderRadius: 10, position: 'absolute' }]}
                        source={{ uri: "https://static.vecteezy.com/system/resources/previews/023/914/428/non_2x/no-document-or-data-found-ui-illustration-design-free-vector.jpg" }}
                      />
                    )

                  )}

                  <PagerView
                    onPageSelected={handlePageChange}
                    style={{ width: 300, height: 375, elevation: 20, }}
                    initialPage={0}
                  >

                    {customFrames.map((frame, index) => (
                      <View key={index}>
                        {/* Check if the item is an image or a video frame */}
                        {frame.isVideoFrame ? (
                          <Video
                            source={{ uri: videos.length != 0 ? frame.image : null }} // Assuming 'frame.image' contains the video frame URL
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
            {mainVideoLoader && (
              <View style={{ position: 'absolute', alignSelf: 'center', height: width - 50, justifyContent: 'center', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.5)', width: width - 50 }}>
                <ActivityIndicator style={{ alignSelf: 'center' }} size={'large'} color={'red'} />
              </View>
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



        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', flex: 1, width: '92%', gap: 10, marginBottom: 40, height: 60, paddingHorizontal: 10 }}>
          {/* 2 */}

          <View style={{ width: 120, zIndex: 1, alignSelf: 'flex-end', height: '100%' }}>
            <SelectDropdown
              data={languages.map((language) => language.languageName)} // Use the language names
              onSelect={(selectedItem, index) => {
                setSelectedLanguage(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{ backgroundColor: 'red', height: 25, borderRadius: 100, width: 120, }}
              rowTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 12, color: "black" }}
              buttonTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 12, color: "white" }}
              defaultButtonText='Select Language'
              dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
            />
          </View>


          <View style={{ flexDirection: 'row', gap: 10 }}>
            {
              items.length != 0 &&
              <TouchableOpacity onPress={() => {
                setdisplayImage(false)
              }}
                style={{ height: 25, width: 70, backgroundColor: displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                <Text style={{ color: displayImage ? 'gray' : 'white', fontFamily: 'Manrope-Regular' }}>
                  items
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
          </View>

        </View>

        {!displayImage ? (
          selectedLanguage == 'All' || filteredItems.length > 0 ? (
            <FlatList
              data={selectedLanguage == 'All' || selectedLanguage == [] ? items : filteredItems}
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
            <View style={{ height: "25%" }}>
              <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>No items Found!</Text>
            </View>
          )
        ) : (
          FlatlistisLoad ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
              <ActivityIndicator />
            </View>
          ) :
            displayedVideos.length != 0 ? (
              <>
                <FlatList
                  // data={videos}
                  data={selectedLanguage == 'All' || selectedLanguage == [] ? displayedVideos : filteredItemsV}
                  numColumns={3}
                  renderItem={renderItemV}
                  contentContainerStyle={styles.flatListContainer}
                  shouldComponentUpdate={() => false}
                  removeClippedSubviews
                  initialNumToRender={30}
                  maxToRenderPerBatch={30}
                  windowSize={10}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.1}
                  ListFooterComponent={loading && <ActivityIndicator />}
                />
                {/* 
                {videos.length && !lastVideoLoaded && displayImage && (
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <ActivityIndicator color={'white'} />
                  </View>
                )} */}
              </>
            ) : (
              <View style={{ height: "25%" }}>
                <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>No videos Found!</Text>
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
    alignItems: 'center'
  },
  overlayImage: {
    position: 'absolute',
    opacity: 1,
    width: 300, height: 375,
    zIndex: 1,
    top: 0,
    borderRadius: 10,
  },
  mainImage: {
    width: 300, height: 375,
    zIndex: -1
  },
  image: {
    height: imageHeight,
    width: itemWidth,
    borderRadius: 10,
    margin: 5,
  },
  flatListContainer: {
    paddingBottom: 20,
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
    fontSize: 18,
    color: 'white',
    marginLeft: 20,
    fontFamily: 'Manrope-Bold'
  },
});

export default EditHomeA4;

