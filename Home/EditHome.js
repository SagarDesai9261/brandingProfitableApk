import PagerView from 'react-native-pager-view';
// import RNImageResizer from 'react-native-image-resizer';
import ImageResizer from 'react-native-image-resizer';
// import ImageSize from 'react-native-image-size';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Button, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Modal, ToastAndroid, Alert, PermissionsAndroid, Platform } from 'react-native';
// import imageData from '../apiData/200x200';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import ViewShot from "react-native-view-shot";
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image'
import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { RNFFmpeg } from 'react-native-ffmpeg';
import SwiperFlatList from 'react-native-swiper-flatlist';
import SelectDropdown from 'react-native-select-dropdown';
import { uploadImageWithOverlay } from '../DownloadImage';
import PaymentLoadingModal from './PaymentLoading';

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

  const [displayedVideos, setDisplayedVideos] = useState([]);

  const [loaderShare, setLoaderShare] = useState(true);
  const [lastVideoLoaded, setLastVideoLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const videosPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Simulate fetching the initial set of videos
    fetchVideos(currentPage);
  }, []);

  const fetchVideos = (page) => {
    // Simulate an API call to fetch videos based on the page
    const startIdx = (page - 1) * videosPerPage;
    const endIdx = startIdx + videosPerPage;
    const newVideos = videos.slice(startIdx, endIdx);

    setDisplayedVideos((prevVideos) => [...prevVideos, ...newVideos]);
    setCurrentPage(page + 1);
    setLoading(false);
  };

  const handleLoadMore = () => {
    setLoading(true);
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

  const [isMLMPurchased, setIsMLMPurchased] = useState();
  const [userPurchasedPlan, setUserPurchased] = useState({})

  // http://localhost:4002/payments/benefits/8140767676

  const getAllPlans = async () => {
    try {
      const response = await axios.get("https://api.brandingprofitable.com/payments/benefits/" + profileData.mobileNumber);
      console.log("https://api.brandingprofitable.com/payments/benefits/" + profileData.mobileNumber);
      const data = response.data.data;

      const stringifyData = JSON.stringify(data);

      await AsyncStorage.setItem("abcdplans", stringifyData);

      return data;
    } catch (error) {
      console.error("getting error in getting plans:", error);
    }
  }

  const checkWhichPlanUserPurchased = async (userPlanId) => {
    // alert("call")
    if (!isMLMPurchased) {
      try {
        // const response = await axios.get("")

        // console.log(userPlanId, "this plan id passed in function")

        // const getPlansFromStore = await AsyncStorage.getItem("abcdplans");

        // if (getPlansFromStore) {
        //   const parsedData = JSON.parse(getPlansFromStore)
        //   const userPlan = parsedData.filter((plan) => plan.plan_id == userPlanId)
        //   setUserPurchased(userPlan[0])
        // } else {
        const allPlans = await getAllPlans();
        // const userPlan = allPlans.filter((plan) => plan.plan_id == userPlanId)

        console.warn("allPlans",allPlans, profileData.mobileNumber)
        setUserPurchased(allPlans[0])
        // }

        setLoaderShare(false)

      } catch (error) {
        console.error("gettting error in check purchased plan", error)
      }
    }else{
      setLoaderShare(false)
    }
  }

  const { bannerId, index, todayOrTrending } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = todayOrTrending === 'today'
          ? `https://api.brandingprofitable.com/todayandtomorrow/todaytrending/today/${bannerId}`
          : `https://api.brandingprofitable.com/todayandtomorrow/todaytrending/trending/${bannerId}`;

        const response = await axios.get(apiUrl);
        console.log(response.data.data[0].items)

        if (response.data.data.length === 0 || response.data.data[0].items.length === 0) {
          showToastWithGravity('Images not found!!');
        } else {
          setItems(response.data.data[0].items);
          // Filter and set the first 6 videos directly
          const videos = response.data.data[0].items.filter((item) => item.isVideo === true).slice(0, 6);

          // setDisplayedVideos(videos.slice(0, 6));
          // setCurrentIndex(6)

          setItem(`https://cdn.brandingprofitable.com/${response.data.data[0].items[0].todayAndTomorrowImageOrVideo || response.data.data[0].items[0].imageUrl}`);
          const filteredImages = (response.data.data[0].items).filter((item) => item.isVideo === false);

          // setItem(filteredImages[0].imageUrl || filteredImages[0].todayAndTomorrowImageOrVideo)

          setTimeout(() => {

            setIsLoader(false);
          }, 1000);
        }
      } catch (error) {
        setIsLoader(false);
      }
    };

    fetchData();
  }, [todayOrTrending, bannerId]);
  const [isLoader, setIsLoader] = useState(true)
  const [items, setItems] = useState([]);


  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);


  useEffect(() => {
    const filteredVideos = items.filter((item) => item.isVideo === true);
    const filteredImages = items.filter((item) => item.isVideo === false);
    setVideos(filteredVideos);
    setImages(filteredImages);
  }, [items]);

  const [i, seti] = useState(0);

  const [item, setItem] = useState("");

  const [currentFrame, setCurrentFrame] = useState(0);

  const [customFrames, setCustomFrames] = useState([]);
  const viewShotRef = useRef(null);

  const [displayImage, setdisplayImage] = useState(false);

  // languages
  const [userToken, setUserToken] = useState()
  const [profileData, setProfileData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [languages, setLanguages] = useState([
    { languageName: 'All' },
    { languageName: 'English' },
    { languageName: 'ગુજરાતી' },
    { languageName: 'हिन्दी' }
  ])

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
    }
  };

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

  const handleImagePress = (item) => {
    setItem(item);
  };

  const handleImagePressV = (item) => {
    if ("https://cdn.brandingprofitable.com/" + item?.todayAndTomorrowImageOrVideo !== selectedVideo) {
      setMainVideoLoader(true);
    }
    setSelectedVideo("https://cdn.brandingprofitable.com/" + item?.todayAndTomorrowImageOrVideo);
  };

  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([]);

  const [subscritionExp, setSubscriptionExp] = useState(false);

  // all users details 
  const [hasFetched, setHasFetched] = useState(false);

  const fetchDetails = async () => {
    try {
      if (profileData) {

        const response = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData.mobileNumber}`);
        const result = response.data;

        if (response.data.statusCode == 200) {
          console.log("purchased...");
          setUserTeamDetails('Purchase');


          // check expiry
          // const date = '2023-10-29';
          const date = result.details?.register_date;

          const originalDateStr = date;

          console.log(originalDate, "original date user purchased")

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
            console.log("oh no! subscition expires")
            setSubscriptionExp(true)
          }

          setHasFetched(true);

        } else {
          console.log("user not data aavto nathi athava purchase request ma che ");
        }
      } else {
        console.log('profile no data malto nathi...! edithome screen ma ---')
      }
    } catch (error) {
      console.log('Error fetching data... edit home dynamic:', error);
    }
  }

  useEffect(() => {
    if (!hasFetched && profileData) {
      fetchDetails(); // Call the function only if it hasn't been called before
    }
  }, [hasFetched, profileData]);

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
              // captureAndShareImage();
              captureAndShareImageServerSide(customFrames[currentFrame].image)
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = todayOrTrending === 'today'
          ? `https://api.brandingprofitable.com/todayandtomorrow/todaytrending/today/${bannerId}`
          : `https://api.brandingprofitable.com/todayandtomorrow/todaytrending/trending/${bannerId}`;

        const response = await axios.get(apiUrl);
        console.log(response.data)

        if (response.data.data.length === 0 || response.data.data[0].items.length === 0) {
          showToastWithGravity('Images not found!!');
        } else {
          setItems(response.data.data[0].items);

          const filteredImages = response.data.data[0].items.filter((item) => item.isVideo === false);

          setItem(`https://cdn.brandingprofitable.com/${filteredImages[0].todayAndTomorrowImageOrVideo || filteredImages[0].imageUrl}`);

          setIsLoader(false);
        }

        // mlm purcase or not 
        const response2 = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`);
        const result = response2.data;

        if (response2.data.statusCode == 200) {
          setIsMLMPurchased(result.is_mlm)
          checkWhichPlanUserPurchased(result.plan_id)

          setUserTeamDetails('Purchase');

          // check expiry
          // const date = '2023-10-29';
          const date = result.details?.register_date;
          console.log(date, "date")
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
          } else {
            console.log("oh no! subscition expires")
            setSubscriptionExp(true)
          }

          setHasFetched(true);

        } else {
          if (profileData?.mobileNumber) {
            setLoaderShare(false)
          }
          console.log("user not data aavto nathi athava purchase request ma che ");
        }


      } catch (error) {
        // setIsLoader(false);
        console.log("getting error", error)
      }
    };

    fetchData();
  }, [profileData, todayOrTrending, bannerId]);

  // capture and share image with high quality
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
      showToastWithGravity("Subscribe to share/download Video");
      navigation.navigate('MlmScreenStack');
    }

  };

  const captureAndShareImageServerSide = async (img) => {
    try {

      if (userTeamDetails === 'Purchase' && !subscritionExp) {


        console.log(userPurchasedPlan, "userPurchasedPlan")

        if (todayOrTrending === 'today' && !userPurchasedPlan.festival_image) {
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
        } else if (todayOrTrending === 'trending' && !userPurchasedPlan.trnding_image) {
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
          console.log("res", res);
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

  //     try {

  //       const apilevel = Platform.Version;

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
      const imageBase64 = uri;

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


  // async function downloadImageBase64(base64Data, fileName) {
  //   try {

  //     // console.log(base64Data)
  //     const dirs = RNFetchBlob.fs.dirs;
  //     const path = `${dirs.DCIMDir}/Branding Profitable/${fileName}.jpg`;

  //     // Convert base64 to binary
  //     // const imageBinary = RNFetchBlob.base64.encode(base64Data);

  //     // Write binary data to a file
  //     await RNFetchBlob.fs.writeFile(path, base64Data, 'base64');

  //     console.log('Image downloaded successfully:', path);
  //   } catch (error) {
  //     console.error('Error downloading image:', error);
  //     throw error;
  //   }
  // }

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

    const selectedImage = item
    // console.log(selectedImage, "selected image")
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
      // const videoResponse = await RNFetchBlob.config({
      //   fileCache: true,
      //   path: `${RNFetchBlob.fs.dirs.CacheDir}/${videoFileName}`,
      // }).fetch('GET', videoURL);

      // const videoPath = videoResponse.path();

      // ------------------------------------------ 


      // main image diresct get from url withuout compression

      const videoResponse = await RNFetchBlob.config({
        fileCache: true,
        path: `${RNFetchBlob.fs.dirs.CacheDir}/${videoFileName}`,
      }).fetch('GET', videoURL, {
        'Content-Type': 'image/jpeg'
      });

      const videoPath = videoResponse.path();


      //  ----------------------------------------------

      const imageResolution = await getImageHeightWidth(item);
      console.log('Image resolution:', imageResolution, item);

      // Download the image to a temporary directory with a unique name
      const imageResponse = await RNFetchBlob.config({
        fileCache: true,
        path: `${RNFetchBlob.fs.dirs.CacheDir}/${imageFileName}`,
      }).fetch('GET', imageSource);

      const imagePath = imageResponse.path();

      //       ImageSize.getSize(`file://${imagePath}`)
      // .then(({ width, height }) => {
      //   console.log(`Image Width: ${width}, Height: ${height}`);
      // })`
      // .catch((error) => {
      //   console.error('Error getting image dimensions:', error);
      // });

      // Increase video resolution and bitrate  
      const resizedVideoPath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedVideo.jpg`;
      // const resizeVideoCommand = `-i ${videoPath} -vf "scale=810:810" -b:v 3M -c:a copy ${resizedVideoPath}`

      const resizeVideoCommand = `-i ${videoPath} -vf "scale=${imageResolution.width}:${imageResolution.height}:force_original_aspect_ratio=decrease" -b:v 2M -c:a copy ${resizedVideoPath}`;

      await RNFFmpeg.execute(resizeVideoCommand);

      // Increase image resolution
      const resizedImagePath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedImage.png`;
      // const resizeImageCommand = `-i ${imagePath} -vf "scale=810:810" ${resizedImagePath}`;
      const resizeImageCommand = `-i ${imagePath} -vf "scale=${imageResolution.width}:${imageResolution.height}:force_original_aspect_ratio=decrease" ${resizedImagePath}`;

      await RNFFmpeg.execute(resizeImageCommand);

      // Combine resized video and image using FFmpeg with proper overlay positioning
      const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/${outputFileName}`;
      const ffmpegCommand = `-i ${videoPath} -i ${resizedImagePath} -filter_complex "[0:v][1:v]overlay=0:0" -b:v 3M -c:a copy ${outputPath}`;

      await RNFFmpeg.execute(ffmpegCommand);

      //       const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/${outputFileName}`;
      // const ffmpegCommand = `-i ${resizedVideoPath} -i ${resizedImagePath} -filter_complex "[0:v][1:v]overlay=0:0:enable='between(t,0,5)'[out]" -map "[out]" -map 0:a -b:v 3M -c:a copy ${outputPath}`;

      // await RNFFmpeg.execute(ffmpegCommand);

      console.log(`file://${outputPath}`, "--------------------------------------------------------------");

      const imageBase64 = await RNFS.readFile(`file://${outputPath}`, 'base64');

      // console.log(imageBase64)

      const fileNameWithSplit = outputPath.split('/')
      const fileName = fileNameWithSplit[fileNameWithSplit.length - 1];
      // console.log(imageResolution)
      try {
        const newResizedImage = await resize(imageBase64, imageResolution.width, imageResolution.height);
        // console.log(newResizedImage);

        try {


          // const dirPath = `${RNFS.DownloadDirectoryPath}/Branding Profitable`;
          // RNFS.exists(dirPath)
          // .then(exists => {
          //   if (!exists) {
          //     // Directory does not exist, create it
          //     return RNFS.mkdir(dirPath);
          //   }
          //   // Directory exists, proceed with resizing
          //   // ...
          // })
          // .catch(error => {
          //   console.log('Error checking directory existence:', error);
          // });

          // // const newFilePath = `${RNFS.DownloadDirectoryPath}/Braning Profitable/${filename}`;
          // const newFilePath = `${dirPath}/${fileName}`;
          // // await RNFS.moveFile(filePath, newFilePath);

          // console.log(newFilePath, "newfilpath")

          // let resizeImg = '';

          // const localImg = require('../assets/paymentQR.jpg')

          // ImageResizer.createResizedImage(`data:image/jpeg;base64,${imageBase64}`, 1024, 1024, 'JPEG', 100)
          // then((resized) => readFileAsBase64(resized.path)).
          // then((final) => `data:image/jpeg;base64,${final}`)
          //   .catch(err => {
          //     // Oops, something went wrong. Check that the filename is correct and
          //     // inspect err to get more details.
          //     console.log(err, "------------------------------- error")

          //   });

          setIsProcessing(false);

          // Share the video
          const shareOptions = {
            title: 'Share Video with Branding Profitable!',
            url: `file://${outputPath}`,
            type: 'image/jpg',
            failOnCancel: false,
          };


          // await RNImageResizer.createResizedImage(
          //   `file://${resizedImagePath}`, // Use the original resized image path
          //   1024,
          //   1024,
          //   'JPEG',
          //   100,
          //   0,
          //   resizedImagePath
          // );

          // console.log(resizedImagePath, "-----------------------------------------------")

          // await Share.open(shareOptions);
          // downloadImageHighQuality(outputPath)

          const timeName = new Date();
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

        } catch (error) {
          console.error('Error during image resizing:', error);
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
      setIsProcessing(false);
      // navigation.goBack();
    } catch (error) {
      showToastWithGravity("Troubleshooting, Please try again later");
      setIsProcessing(false);
      console.log("error in capture and save image function:", error)
    }

    setIsProcessing(false);
    // } else {
    //   showToastWithGravity('Video not found!');
    // }

    // } else {
    //   showToastWithGravity("Subscribe to share/download Video");
    //   navigation.navigate('MlmScreenStack');
    // }


    // const { config, fs } = RNFetchBlob;

    // let date = new Date();

    // let ext = getExtention(item);
    //       ext = '.' + ext[0];

    // let PictureDir = fs.dirs.PictureDir;
    //       let options = {
    //         fileCache: true,
    //         addAndroidDownloads: {
    //           // Related to the Android only
    //           useDownloadManager: true,
    //           notification: true,
    //           path:
    //             PictureDir +
    //             '/Branding Profitable/' +
    //             Math.floor(date.getTime() + date.getSeconds() / 2) +
    //             ext,
    //           description: 'Image',
    //         },
    //       };

    // config(options)
    //         .fetch('GET', item)
    //         .then(res => {
    //           console.log("res", res);
    //           console.log('res -> ', JSON.stringify(res));
    //           showToastWithGravity("Image Saved")
    //         });
  }

  const captureAndSaveImageServerSide = async (img) => {
    try {


      if (userTeamDetails === 'Purchase' && !subscritionExp) {

        
      if (todayOrTrending === 'today' && !userPurchasedPlan.festival_image) {
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
      } else if (todayOrTrending === 'trending' && !userPurchasedPlan.trnding_image) {
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

        const downloadImageResult = await uploadImageWithOverlay(item, img, 'download');
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
      console.log("getting error in captureAndSaveImageServerSide function", error)
    }
  }

  const videoRef = useRef();
  const frameRef = useRef();

  // -----------------------------------------------------------------------------------------------------

  const convertFileToBase64 = async (fileUri) => {
    const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return response;
  };

  // now cahnge the code

  const [isProcessing, setIsProcessing] = useState(false);

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

  // download video
  const captureAndDownloadVideoWithOverlay = async (imageSource, selectedVideo) => {


    if (userTeamDetails === 'Purchase' && !subscritionExp) {

      
    if (todayOrTrending === 'today' && !userPurchasedPlan.festival_video) {
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
    } else if (!userPurchasedPlan.trnding_image && todayOrTrending === 'trending') {
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

  const captureAndShareVideoWithOverlay = async (imageSource, selectedVideo) => {
    // if (userTeamDetails === 'Purchase') {


    if (userTeamDetails === 'Purchase' && !subscritionExp) {

      
    if (todayOrTrending === 'today' && !userPurchasedPlan.festival_video) {
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
    } else if (!userPurchasedPlan.trnding_image && todayOrTrending == 'trending') {
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
          const resizeVideoCommand = `-i ${videoPath} -vf "scale=1024:1024" -b:v 2M -c:a copy ${resizedVideoPath}`;
          await RNFFmpeg.execute(resizeVideoCommand);

          // Increase image resolution
          const resizedImagePath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedImage.png`;
          const resizeImageCommand = `-i ${imagePath} -vf "scale=1024:1024" ${resizedImagePath}`;
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
      showToastWithGravity("Subscribe to share/download Video");
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
    }
  };

  const [isLoad, setIsLoad] = useState(true)
  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true)

  const renderItem = useCallback(({ item }) => {
    const imageSource = item.comp_iamge || item.todayAndTomorrowImageOrVideo || item.imageUrl;

    return (
      <TouchableOpacity onPress={() => handleImagePress("https://cdn.brandingprofitable.com/" + item.todayAndTomorrowImageOrVideo)}>
        <FastImage
          source={{ uri: "https://cdn.brandingprofitable.com/" + imageSource, priority: FastImage.priority.high }}
          style={styles.image}
          onLoadEnd={() => Image.prefetch("https://cdn.brandingprofitable.com/" + imageSource)}
        />
      </TouchableOpacity>
    );
  }, []);

  const renderItemV = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePressV(item)}>
      <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1, }}>
        <Icon name="play-circle" size={30} color={"white"} />
      </View>
      <Video
        source={"https://cdn.brandingprofitable.com/" + item?.todayAndTomorrowImageOrVideo ? { uri: "https://cdn.brandingprofitable.com/" + item?.todayAndTomorrowImageOrVideo } : { uri: "https://cdn.brandingprofitable.com/" + item.imageUrl }}
        repeat={false}
        paused={false}
        style={styles.image}
        resizeMode="cover"
        onLoad={() => setVideoPause(false)}
        muted={true}
      />
    </TouchableOpacity>
  ), []);

  setTimeout(() => {
    setFlatlistIsLoad(false);
  }, 6000);


  const [videoPause, setVideoPause] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [mainVideoLoader, setMainVideoLoader] = useState(false);

  const [j, setj] = useState(0)
  useEffect(() => {
    if (videos.length > 0 && j < 2) {
      setSelectedVideo("https://cdn.brandingprofitable.com/" + videos[0]?.todayAndTomorrowImageOrVideo)
      setj(j + 1)
    }
  })

  const [k, setk] = useState(0)
  const [l, setl] = useState(0)

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
    fetchData();
  }, [userToken])

  const [callLanguageFunc, setCallLanguageFunc] = useState(true)

  useEffect(() => {
    setInterval(() => {
      if (k > 5) {
        setk(k + 1)
        if (callLanguageFunc) {
          setCallLanguageFunc(false)
        }
      }
    }, 10000);
  })

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
    navigation.goBack()
  };

  // filter of languages 

  const handlePageChange = (event) => {
    const { position } = event.nativeEvent;
    console.log('Page changed:', position);
    setCurrentFrame(position);
  };

  const onChangeIndex = ({ index, prevIndex }) => {
    if (index != currentFrame) {
      console.log(index);
      setCurrentFrame(index + 1);
    }
  };

  const filteredItems = items.filter((item) => (item.languageName == selectedLanguage));
  const filteredItemsV = videos.filter((item) => (item.languageName == selectedLanguage));

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
                  navigation.navigate('Frames');
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
            <Icon name="angle-left" size={30} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
            {bannername.length > 30 ? bannername.slice(0, 30) + '...' : bannername}
          </Text>
        </View>
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
            {/* <Icon name="download" size={20} color={"white"} /> */}
            <Entypo name="download" size={20} color={"white"} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* main image */}
        {!displayImage ? (
          // <ViewShot style={{ height: width - 30, width: width - 30, marginVertical: 10, marginBottom: 20, elevation: 10 }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
          //   <SwiperFlatList
          //     data={customFrames} // Use 'customFrames' as your data source
          //     index={0}
          //     pagination={false} // To hide pagination, as 'showsPagination' is equivalent to 'pagination'
          //     onChangeIndex={onChangeIndex}

          //     renderItem={({ item: frame }) => (
          //       <View>
          //         <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
          //         <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
          //       </View>
          //     )}
          //   />

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
            <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10, position: 'absolute', marginVertical: 0 }]} />

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
        ) : (
          <View style={{ height: width - 50, width: width - 50, marginVertical: 10, marginBottom: 20, elevation: 10 }} >
            {videoPause ? (
              <View style={{ justifyContent: 'center', alignItems: "center" }}>
                <ActivityIndicator />
              </View>
            )
              : (
                // <View style={{ flex: 1 }}>
                //   {/* Video component */}
                //   {selectedVideo == null ? (
                //     <View style={{ position: 'absolute', top: 100, left: 100, zIndex: 1 }}>
                //       <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>
                // {/* No Video Found! */}
                //       </Text>
                //     </View>
                //   ) : (
                //     <Video
                //       source={{ uri: selectedVideo }}
                //       repeat={true}
                //       style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                //       resizeMode="cover"
                //       onLoad={() => setVideoPause(false)}
                //     />
                //   )}

                //   {/* Swiper component for overlay images */}
                //   <Swiper loop={false} index={currentFrame} showsPagination={false} onIndexChanged={(index) => setCurrentFrame(index)}>
                //     {customFrames.map((frame, index) => (
                //       <View key={index}>
                //         <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                //       </View>
                //     ))}
                //   </Swiper>


                // </View>


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
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }}
                        resizeMode="cover"
                        onLoad={() => setMainVideoLoader(false)}
                      />
                    </>
                  )}

                  {/* <SwiperFlatList
                    data={customFrames}
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
                    onIndexChange={({ index }) => setCurrentFrame(index)}
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
            {mainVideoLoader && (
              <View style={{ position: 'absolute', alignSelf: 'center', height: width - 30, justifyContent: 'center', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.5)', width: width - 30 }}>
                <ActivityIndicator style={{ alignSelf: 'center' }} size={'large'} color={'red'} />
              </View>
            )}
          </View>
        )}

        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', flex: 1, width: '92%', gap: 10, marginBottom: 40, height: 60 }}>
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
            {/* 1 */}
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
          </View>


        </View>
        <View>
          {!displayImage ? (
            selectedLanguage == 'All' || filteredItems.length > 0 ? (
              <FlatList
                data={selectedLanguage == 'All' || selectedLanguage == [] ? images : filteredItems}
                numColumns={3} // Adjust the number of columns as needed
                keyExtractor={(item) => item._id.toString()}
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
                <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>No Images Found!</Text>
              </View>
            )
          ) : (
            videos.length != 0 ? (
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
    opacity: 1,
    height: width - 50,
    width: width - 50,
    zIndex: 1,
    top: 0,
    borderRadius: 10
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
    paddingBottom: 450,
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
    fontSize: 14,
    color: 'white',
    fontFamily: 'Manrope-Bold',
    textAlign: 'center'
  }
});

export default EditHome;


