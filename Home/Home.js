import SplashScreen from '../SplashScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SelectDropdown from 'react-native-select-dropdown'
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, BackHandler, Modal, TouchableOpacity, Image, ScrollView, Dimensions, Linking, TextInput, Keyboard, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Badge } from '@rneui/themed';
import Share from 'react-native-share';
import CryptoJS from "react-native-crypto-js";

import { useNavigation } from '@react-navigation/native';

import MainBanner from './MainBanner';
import AdBanner from './AdBanner';
import TrendingBanner from './Category/TrendingBanner';
import TodayBanner from './Category/Today';
import DynamicSection from './DynamicSection';
import VisitingA4Btn from './VisitingA4Btn';

import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather'
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const { height, width } = Dimensions.get('window')

const Home = ({ navigation, dataisLoaded, dataToSendInHome }) => {

  const { popUpImg } = dataToSendInHome;

  const [userVipRole, setUserVipRole] = useState('');
  const [allDataisLoaded, setAllDataIsLoaded] = useState(false)

  const [isMLMPurchased, setIsMLMPurchased] = useState();
  const [userPurchasedPlan, setUserPurchased] = useState({})

  let ciphertext = CryptoJS.AES.encrypt('my message', 'mjgohel').toString();
  let bytes = CryptoJS.AES.decrypt(ciphertext, 'mjgohel');
  let originalText = bytes.toString(CryptoJS.enc.Utf8);

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
      0,
      50,
    );
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const decoded = jwtDecode(token);

      // Get the expiration time in seconds (assuming the token contains an "exp" field)
      const expirationTime = decoded.exp;

      // Check if the token is expired (current time in seconds)
      const currentTime = Math.floor(Date.now() / 1000);
      console.log(currentTime, "currentTime")
      console.log(expirationTime, "expirationTime")
      if (expirationTime > currentTime) {
        // showToastWithGravity("Osm, Token Not Expire");
      } else {
        showToastWithGravity("Your Token Expired Please Login!");
        navigation.navigate('StackLogin');
        AsyncStorage.removeItem('UserVipTag');
        AsyncStorage.removeItem('isLoggedIn');
        AsyncStorage.removeItem('profileData');
        AsyncStorage.removeItem('businessOrPersonal');
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('customFrames');
        AsyncStorage.removeItem('bankDetails');
      }

    } catch (error) {
      console.log("error in getting token in home:", error)
    }
  }

  useEffect(() => {
    getToken();
  }, [profileData])

  const [businessOrPersonal, setBusinessOrPersonal] = useState('');
  const fetchData = async () => {
    const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
    setBusinessOrPersonal(businessOrPersonal);
  };

  const [displayPopUp, setDisplayPopUp] = useState(true)

  useEffect(() => {
    fetchData();
  }, []);

  const handleImagePress = (item) => {
    navigation.navigate('EditHomeScreen', { item: item });
  };

  // getting data for name

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
      }
    } catch (error) {
    } finally {
      setLoading(false); // Mark data retrieval as completed (whether successful or not)
    }
  };

  const [loading, setLoading] = useState(true);

  const lengthOfName = width >= 360 ? 15 : width <= 359 && width >= 320 ? 12 : 10;

  // user role updated apk.

  const renderProfileDetails = () => {
    if (loading) {
      return null;
    }

    if (profileData) {
      return (
        <>
          <Text style={[styles.buisnessTitle, { elevation: 3 }]}>
            {profileData !== null &&

              profileData.fullName.length < lengthOfName
              ? `${profileData.fullName} `
              : `${profileData.fullName.substring(0, lengthOfName)}..`

              || 'John Doe'}{' '}
          </Text>
        </>
      );
    }

    // Show a default value or placeholder if profileData is null (data not available)
    return (
      <>
        <Text style={styles.buisnessTitle}>
          John Doe
        </Text>
      </>
    );
  };

  // const [userTeamDetails, setUserTeamDetails] = useState([])
  const [isSubscribed, setIsSubscribed] = useState('');


  const fetchDetails = async () => {

    try {
      if (profileData) {
        const response = await axios.get(`https://api.brandingprofitable.com/premium/${profileData?.mobileNumber}`)

        const subscriptionResult = response.data.statusCode;

        setIsSubscribed(subscriptionResult);
      } else {
      }
    } catch (error) {
    }

  }

  // subscription expires or not
  const [subscritionExp, setSubscriptionExp] = useState(false);
  const [subscribeDate, setsubscribeDate] = useState("");

  const setsubscribeDate15 = (date) => {
    const originalDate = new Date(date);

    const before15days = new Date(originalDate);
    before15days.setDate(originalDate.getDate() - 15);

    return before15days;
  };

  const fetchDetailsWallet = async () => {
    try {
      if (!profileData?.mobileNumber) {
        return;
      }

      const response = await axios.get(
        `https://api.brandingprofitable.com/mlm/wallet/v2/${profileData.mobileNumber}`
      );

      if (response.data.statusCode !== 200) {
        return;
      }

      setIsSubscribed(200)

      const result = response.data.details;
      setsubscribeDate(result.register_date);

      const originalDateStr = result.registrationDate;
      const originalDate = new Date(originalDateStr);

      // Calculate the next year's date
      originalDate.setFullYear(originalDate.getFullYear() + 1);
      const before15days = setsubscribeDate15(originalDate);
      const today = new Date();

      // Compare the dates
      if (today <= originalDate) {
      } else {
      }

      if (today >= before15days && today <= originalDate) {
        setSubscriptionExp(true);
      }
    } catch (error) {
      console.log(error, "error in fetch details wallet")
    }
  };

  const fetchDetailsPairCount = async () => {
    try {
      if (!profileData?.mobileNumber) {
        return;
      };

      const response = await axios.get(
        `https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`
      );

      if (response.data.statusCode === 200) {
        setIsMLMPurchased(response.data.is_mlm)
        await AsyncStorage.setItem('UserVipTag', `(${response?.data?.details?.role})`);

        checkWhichPlanUserPurchased(response.data.plan_id);
      } else {
        await AsyncStorage.removeItem('UserVipTag');
      }
    } catch (error) {
      await AsyncStorage.removeItem('UserVipTag');
    }
  };

  const fetchSavedUserFrames = async () => {
    try {
      if (!profileData?._id) {
        return;
      }

      const response = await axios.get(
        `https://api.brandingprofitable.com/savedframe/saved/frame/v2/${profileData?._id}`
      );

      console.log(`https://api.brandingprofitable.com/savedframe/saved/frame/v2/${profileData?._id}`)
      const result = response.data.data

      await AsyncStorage.setItem('customFrames', JSON.stringify(result));
    } catch (error) {
    }
  };

  const fetchFindPair = async () => {
    try {
      const response = await axios.get(`https://api.brandingprofitable.com/mlm/findpair/${profileData.mobileNumber}`)
      if (response.data.users) {
        setShareData(response.data.users);
      } else {
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchDetailsWallet(),
        fetchDetailsPairCount(),
        fetchSavedUserFrames(),
        fetchFindPair()
      ]);
    };

    fetchData();
  }, [profileData]);

  const reloadScreen = () => {
    retrieveProfileData();
    fetchDetails();
    fetchDetailsPairCount();
    getNotificationCounts();
  };

  useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', reloadScreen);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigation]);


  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      const frames = JSON.parse(framesData);
      console.log(frames, frames.length, "frames")
      if (frames.length != 0) {
        console.log("done")
      } else {
        showAlert();
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadCustomFrames();
    }, 3000);
  }, [])

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
  };


  const renderDropdownIcon = ({ isOpen, selectedItem }) => {
    const icon = isOpen ? 'check' : 'angle-down';
    return <Icon name={icon} size={25} color="black" />
  };

  const [notificationCount, setNotificationCount] = useState(0)

  const getNotificationCounts = async () => {
    try {
      const notificationCount = await AsyncStorage.getItem('notiCount');

      if (notificationCount) {
        setNotificationCount(notificationCount)
      }

    } catch (error) {
    }
  }

  useEffect(() => {
    getNotificationCounts();
  }, []);

  const [popuUpImage, setPopUpImage] = useState('');

  const fetchPopUp = async () => {
    try {
      const response = await axios.get('https://api.brandingprofitable.com/popup_banner/popup_banner');

      setPopUpImage("https://cdn.brandingprofitable.com/" + response.data.data[0].popupBannerImage);

      setTimeout(() => {
        // setAllDataIsLoaded(true)
        dataisLoaded();
      }, 3000);
    } catch (e) {
    }
  }

  // useEffect(() => {
  //   fetchPopUp()
  // }, [])

  const [isModalVisibleFollow, setModalVisibleFollow] = useState(false);

  const showAlertFollow = () => {
    setModalVisibleFollow(true);
  };

  const hideAlertFollow = (item) => {
    let url = '';


    switch (item) {
      case 'what':
        const whatsappNumber = "+919904128113";
        url = `whatsapp://send?phone=${whatsappNumber}`;
        break;

      case 'twit':
        const twitterHandle = "brandingprofit";
        url = `https://twitter.com/${twitterHandle}`;
        break;

      case 'face':
        const facebookId = "brandingprofitable";
        url = `https://www.facebook.com/profile.php?id=61550341335347&mibextid=ZbWKwL`;
        break;

      case 'insta':
        const instagramId = "branding.profitable";
        url = `https://www.instagram.com/${instagramId}`;
        break;

      default:
        setModalVisibleFollow(false);
        return;
    }

    if (url != '') {
      Linking.openURL(url);
    }
    // Open the URL in the default browser or app
  };

  const handleClick = () => {
    const whatsappNumber = "+91 9904128113";
    Linking.openURL(`whatsapp://send?phone=${whatsappNumber}`);
  };

  const fetchUserRole = async () => {
    try {
      const userRole = await AsyncStorage.getItem('UserVipTag');
      if (userRole) {
        setUserVipRole(userRole)
      } else {
        setUserVipRole(null)
      }
    } catch (error) {
    }
  }


  const formatedDate = (date, withExpire) => {
    if (date) {

      const parts = date.split(' ');
      const onlyDate = parts[0];

      const partsDate = onlyDate.split('-');
      if (partsDate.length == 3) {
        const [y, m, d] = partsDate;

        const formatedDate = `${d}-${m}-${!withExpire ? y : parseInt(y, 10) + 1}`
        return formatedDate
      }

    } else {
    }

    return null;
  }

  const [shareData, setShareData] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSide, setSelectedSide] = useState(["left", "right"])
  const [selectedSideByUser, setSelectedSideByUser] = useState("side")
  const [selectedTreeId, setSelectedTreeId] = useState("Refer Id")
  const [sponsor_referal, setsponsor_referal] = useState({})

  useEffect(() => {
    setSelectedLanguage(profileData?.length != 0 ? profileData?.mobileNumber.toString() : null)
  }, [profileData])

  const handleShare = async () => {
    hideAlert5();

    if (selectedLanguage == '' || selectedLanguage == ' ' || selectedTreeId == 'Refer Id' || selectedTreeId == '' || selectedSideByUser == 'Side' || selectedTreeId == ' ' || selectedSideByUser == 'side' || selectedSideByUser == '') {
      showToastWithGravity("fill all details");
      return;
    }

    try {

      const selectedTree = selectedTreeId.split('-');
      const message = `Sponser ID: ${selectedLanguage}\nRefer ID: ${selectedTree[1]}\nSide: ${selectedSideByUser}\nApp: https://play.google.com/store/apps/details?id=com.brandingprofitable_0`;

      const appScheme = 'http://brandingprofitable.com'; // Your custom URL scheme
      const fallbackUrl = 'https://www.example.com/download-app'; // Your download page URL

      const options = {
        title: 'Share Details',
        message: message,
      };

      const result = await Share.open(options);

      if (result.app) {
      } else {
        Linking.openURL(fallbackUrl).catch((err) => {
        });
      }

      setSelectedLanguage('Referal Id');
      setSelectedTreeId('Tree Id');
      setSelectedSideByUser('Side');
    } catch (error) {
    }
  };

  const handleShareWithoutMLM = async () =>{
    try {
        const selectedTree = selectedTreeId.split('-');

        const message = `Referral Id: ${selectedLanguage}\nApp: https://play.google.com/store/apps/details?id=com.brandingprofitable_0`;

        const appScheme = 'http://brandingprofitable.com'; // Your custom URL scheme
        const fallbackUrl = 'https://www.example.com/download-app'; // Your download page URL

        const options = {
            title: 'Share Details',
            message: message,
        };

        const result = await Share.open(options);

        if (result.app) {
            console.log(`Shared via ${result.app}`);
        } else {
            Linking.openURL(fallbackUrl).catch((err) => {
                console.error('Error opening fallback URL:', err);
            });
        }

        setSelectedLanguage('Referal Id');
        setSelectedTreeId('Tree Id');
        setSelectedSideByUser('Side');
    } catch (error) {
        console.error('Error sharing details:', error);
    }
}

  const [selected, setSelected] = React.useState([]);
  const [openLDropdown, setopenLDropdown] = useState(false)
  const [openLDropdownTree, setopenLDropdownTree] = useState(false)

  const [data, setData] = React.useState(['apple', "banana", "mit", 'shivam', 'sahil', 'hardik'])

  const [suggestion, setSuggestions] = React.useState([])
  const [suggestionTree, setSuggestionsTree] = React.useState([])

  const [isModalVisible5, setModalVisible5] = useState(false);

  const showAlert5 = () => {
    setModalVisible5(true);
  };

  const hideAlert5 = () => {
    setModalVisible5(false);
  };

  useEffect(() => {
    fetchDetailsWallet();
    fetchUserRole();
  });


  const handleTextChange = (inputText) => {
    // Filter your suggestions based on the input text
    // if (inputText) {
    const filteredSuggestions = shareData.filter((suggestion) =>
      suggestion.mobileNumber.includes(inputText.toLowerCase())
    );
    // }

    // Update the suggestions state
    setSuggestions(filteredSuggestions);
    setopenLDropdown(true)

    // Update the text state
    setSelectedLanguage(inputText);
  };

  const handleTextChangeTree = (inputText) => {
    // Filter your suggestions based on the input text
    const filteredSuggestions = shareData.filter((suggestion) =>
      suggestion.mobileNumber.toLowerCase().includes(inputText.toLowerCase())
    );

    // Update the suggestions state
    setSuggestionsTree(filteredSuggestions);
    setopenLDropdownTree(true);

    // Update the text state
    setSelectedTreeId(inputText);
  };

  const handleInputFocus = () => {
    setopenLDropdown(true);
  };

  const handleInputBlur = () => {
    // Handle the input when it loses focus
    setopenLDropdown(false);
  };

  const handleInputFocusTree = () => {
    setopenLDropdownTree(true);
  };

  const handleInputBlurTree = () => {
    // Handle the input when it loses focus
    setopenLDropdownTree(false);
  };

  // if user purchase a abcd plan then which plan did puchased?

  const getAllPlans = async () => {
    try {
      const response = await axios.get("https://api.brandingprofitable.com/plan/plan");
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

          const allPlans = await getAllPlans();
          const userPlan = allPlans.filter((plan) => plan.plan_id == userPlanId)
          setUserPurchased(allPlans[0])

      } catch (error) {
        console.error("gettting error in check purchased plan", error)
      }
    }
  }

  // 

  // console.log(dataToSendInHome.popUpImg, "this is popupscreen data of app screen")

  // if (!allDataisLoaded) {
  //   return (
  //     <SplashScreen />
  //   )
  // }

  return (
    <View
      style={styles.container}>

      {
        popUpImg ? (

          <View style={[styles.modalContainer, { display: displayPopUp ? 'flex' : 'none' }]}>
            <View style={styles.modalBackground} />
            <View style={styles.modalContent}>
              <TouchableOpacity style={{ position: 'absolute', top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: 100, width: 25, height: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => { setDisplayPopUp(false) }}>
                <Icon name="close" size={18} />
              </TouchableOpacity>
              <Image
                source={{ uri: popUpImg || null }}
                style={styles.modalImage}
              />
            </View>
          </View>
        ) : (
          null
        )
      }

      {/* modal of share details */}
      {/* confirmation modal of add frame or not */}
      <Modal
                    animationType="fade" // You can use "fade" or "none" for animation type
                    visible={isModalVisible5}
                    transparent={true}
                    onRequestClose={hideAlert5}
                    keyboardShouldPersistTaps={'always'}
                >
                    {
                        isMLMPurchased ? 
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                        <TouchableOpacity onPress={hideAlert5} style={{
                            position: 'absolute', top: 10, right: 20, backgroundColor: 'black', borderRadius: 10

                        }}>
                            <Text style={{ fontSize: 30, color: 'white' }}>
                                <MaterialCommunityIcons name="close" size={34} color={"white"} />
                            </Text>
                        </TouchableOpacity>
                        <View style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 8,
                            width: 300,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 40
                        }}>
                            {/* icon */}
                            <TouchableOpacity onPress={hideAlert5} style={{
                                backgroundColor: 'red',
                                padding: 8,
                                borderRadius: 8,
                            }}>
                                <Text style={{
                                    color: 'white',

                                }}><MaterialCommunityIcons name="family-tree" size={25} color="white" /></Text>
                            </TouchableOpacity>
                            {/* title */}
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Manrope-Bold',
                                marginTop: 10,
                                color: 'red'
                            }}>Share Details of Refer & Earn</Text>
                            {/* another */}

                            <View style={{ gap: 0 }}>

                                <TextInput
                                    style={styles.input}
                                    value={selectedLanguage}
                                    onChangeText={(text) => handleTextChange(text)}
                                    placeholder="Sponsor Id"
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />

                                {openLDropdown &&
                                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: '100%', position: 'absolute', marginTop: 70, zIndex: 10 }}>
                                        {selectedLanguage == '' ? (
                                            shareData?.slice(0, 5).map((suggestion, index) => (
                                                <TouchableOpacity key={index} onPress={() => {
                                                    setopenLDropdown(false);
                                                    setSelectedLanguage(suggestion.mobileNumber);
                                                    Keyboard.dismiss();
                                                }
                                                } style={{ width: '100%', padding: 10, alignItems: 'center' }}>
                                                    <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                                                </TouchableOpacity>
                                            ))
                                        ) : (suggestion?.slice(0, 5).map((suggestion, index) => (
                                            <TouchableOpacity key={index} onPress={() => {
                                                setopenLDropdown(false);
                                                setSelectedLanguage(suggestion.mobileNumber);
                                                Keyboard.dismiss();
                                            }
                                            } style={{ width: '100%', padding: 10, alignItems: 'center' }}>
                                                <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                                            </TouchableOpacity>
                                        )))}
                                    </View>
                                }

                                {/* <TextInput
                                    style={styles.input}
                                    value={selectedTreeId}
                                    onChangeText={(text) => handleTextChangeTree(text)}
                                    placeholder="Referal Id"
                                    onFocus={handleInputFocusTree}
                                    onBlur={handleInputBlurTree}
                                />

                                {openLDropdownTree &&
                                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: '85%', position: 'absolute', marginTop: 150, zIndex: 10 }}>
                                        {
                                            selectedTreeId == '' ? (
                                                shareData?.slice(0, 5).map((suggestion, index) => (
                                                    <TouchableOpacity key={index} onPress={() => {
                                                        setopenLDropdownTree(false)
                                                        setSelectedTreeId(suggestion.mobileNumber);
                                                        Keyboard.dismiss();
                                                    }
                                                    } style={{ width: '100%', padding: 10 }}>
                                                        <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            ) : (
                                                suggestionTree?.slice(0, 5).map((suggestion, index) => (
                                                    <TouchableOpacity key={index} onPress={() => {
                                                        setopenLDropdownTree(false)
                                                        setSelectedTreeId(suggestion.mobileNumber);
                                                        Keyboard.dismiss();
                                                    }
                                                    } style={{ width: '100%', padding: 10 }}>
                                                        <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            )


                                        }
                                    </View>
                                } */}

                                <SelectDropdown

                                    // data={shareData.map((item) => item.mobileNumber)} // Use the tree IDs
                                    data={shareData.map((item, index) => {
                                        return (
                                            `${index} - ${item.fullName} - ******${item.mobileNumber.substring(6, 10)}`)
                                    }
                                    )
                                    }

                                    onSelect={(selectedItem, index) => {
                                        // Split the selectedItem to extract the mobileNumber
                                        const selectedItemParts = selectedItem.split(' - ');
                                        const selectedMobileNumber = selectedItemParts[0];

                                        // Find the selected item's object by matching the mobileNumber
                                        const selectedObject = shareData[selectedMobileNumber]
                                        //   const selectedObject = shareData.find((item) => item.fullName === selectedMobileNumber);

                                        // Check if the selected object exists and has a "side" property
                                        if (selectedObject && selectedObject.side) {
                                            const storetovar = selectedObject.mobileNumber;

                                            const encryted = CryptoJS.AES.encrypt(storetovar, 'mjgohel').toString();
                                            setSelectedTreeId(`${selectedObject.fullName}-${encryted}`);
                                            setSelectedSide(selectedObject.side); // Set the selected side
                                        } else {
                                            showToastWithGravity('Something went wrong');
                                        }
                                    }}

                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedTreeId; // Set the selectedTreeId as the displayed text
                                    }}

                                    rowTextForSelection={(item, index) => {
                                        // Find the corresponding object for the current treeId
                                        const selectedObject = shareData.find((obj) => obj.mobileNumber === item);

                                        // Check if the object exists and has a "name" property
                                        if (selectedObject && selectedObject.name) {
                                            return `${selectedObject.mobileNumber} (${selectedObject.name})`;
                                        }

                                        // If no object or "name" property is found, display only the tree ID
                                        return item;
                                    }}
                                    buttonStyle={{
                                        width: 250,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 8,
                                        marginTop: 15,
                                        borderColor: 'lightgray',
                                        borderWidth: 1,
                                        height: 40,
                                        backgroundColor: 'white',
                                    }}
                                    rowTextStyle={{ fontFamily: 'Manrope-Regular', fontSize: 15, color: 'black' }}
                                    buttonTextStyle={{ fontFamily: 'Manrope-Regular', fontSize: 15, color: 'gray' }}
                                    defaultButtonText={selectedTreeId} // Set the defaultButtonText
                                    dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
                                    renderDropdownIcon={renderDropdownIcon}
                                />
                                {/* 
<TextInput
                                style={[styles.input,{marginTop:15}]}
                                value={selectedTreeId}
                                onChangeText={(text) => setSelectedTreeId(text)}
                                placeholder="Referal Id"
                            /> */}


                                <SelectDropdown
                                    data={selectedSide.map((item) => item)} // Use the language names
                                    onSelect={(selectedItem, index) => {
                                        setSelectedSideByUser(selectedItem);
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item;
                                    }}
                                    buttonStyle={{
                                        width: 250,
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        borderRadius: 8,
                                        marginTop: 25,
                                        borderColor: 'lightgray',
                                        borderWidth: 1,
                                        height: 40,
                                        backgroundColor: 'white',
                                    }}
                                    rowTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 15, color: "black" }}
                                    buttonTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 15, color: "gray" }}
                                    defaultButtonText='Side'
                                    renderDropdownIcon={renderDropdownIcon}
                                    dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
                                />

                                <TouchableOpacity onPress={handleShare} style={{
                                    backgroundColor: 'red',
                                    width: 70,
                                    paddingVertical: 5,
                                    alignItems: 'center',
                                    justifyContent: "center",
                                    borderRadius: 8,
                                    alignSelf: 'center',
                                    marginTop: 30
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'Manrope-Bold'
                                    }}>Share</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>: <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                        <TouchableOpacity onPress={hideAlert5} style={{
                            position: 'absolute', top: 10, right: 20, backgroundColor: 'black', borderRadius: 10

                        }}>
                            <Text style={{ fontSize: 30, color: 'white' }}>
                                <MaterialCommunityIcons name="close" size={34} color={"white"} />
                            </Text>
                        </TouchableOpacity>
                        <View style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 8,
                            width: 300,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 40
                        }}>
                            {/* icon */}
                            <TouchableOpacity onPress={hideAlert5} style={{
                                backgroundColor: 'red',
                                padding: 8,
                                borderRadius: 8,
                            }}>
                                <Text style={{
                                    color: 'white',

                                }}><MaterialCommunityIcons name="family-tree" size={25} color="white" /></Text>
                            </TouchableOpacity>
                            {/* title */}
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Manrope-Bold',
                                marginTop: 10,
                                color: 'red'
                            }}>Share Details of Refer & Earn</Text>
                            {/* another */}

                            <View style={{ gap: 0 }}>

                                <TextInput
                                    style={styles.input}
                                    value={selectedLanguage}
                                    onChangeText={(text) => handleTextChange(text)}
                                    placeholder="Sponsor Id"
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />

                                <TouchableOpacity onPress={handleShareWithoutMLM} style={{
                                    backgroundColor: 'red',
                                    width: 70,
                                    paddingVertical: 5,
                                    alignItems: 'center',
                                    justifyContent: "center",
                                    borderRadius: 8,
                                    alignSelf: 'center',
                                    marginTop: 30
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'Manrope-Bold'
                                    }}>Share</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                    }
                </Modal>

      {/* popup for expiry package */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={subscritionExp}
        onRequestClose={() => { setSubscriptionExp(false) }}
      >
        <View style={styles.modalBackground2}>
          <View style={styles.modalContent2}>
            <Text style={styles.modalMessage}>Subscription Expire Soon...!</Text>
            <Text style={styles.modalMessage}>{formatedDate(subscribeDate, true)}</Text>
            <TouchableOpacity style={styles.okButton} onPress={() => { setSubscriptionExp(false) }}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <Image source={require('../assets/')} /> */}

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
            width: 300,
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

      <LinearGradient
        colors={['#050505', '#1A2A3D']} style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            if (isSubscribed !== 200) {
              navigation.navigate('MlmScreenStack');
            } else {
              handleClick();
            }
          }}
          style={{
            position: 'absolute',
            bottom: 70,
            right: isSubscribed ? 20 : 10,
            zIndex: 10,
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          {isSubscribed !== 200 ? (
            <Image
              source={require('../assets/giftBlack.gif')}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
          ) : (
            // <Image
            //   source={require('../assets/whatsapp2.png')}
            //   style={{ width: 40, height: 40, borderRadius: 0 }}
            // />
            <View></View>
          )}
        </TouchableOpacity>

        {/* header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => { navigation.navigate('StackProfileScreen') }} style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <View style={{ backgroundColor: '#dedede', borderRadius: 100, borderWidth: 1, borderColor: 'white', height: 45, width: 45, overflow: 'hidden' }}>
              <Image source={{ uri: profileData?.businessLogo || profileData?.profileImage }} style={{ height: 45, width: 45 }} />
            </View>
            <View>
              {renderProfileDetails()}
              <Text style={styles.yourBuisness}>
                {businessOrPersonal == 'business' ? 'Business' : 'Profile'}
              </Text>
              {/* Render the profile details conditionally */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { navigation.navigate('Notifications') }} style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View>
              {/* <Text style={[styles.buisnessTitle, { elevation: 3 }]}>(V)</Text> */}

              <Text style={[styles.buisnessTitle, { elevation: 3, fontSize: 21 }]} onPress={showAlert5}>{userVipRole == 'Director' ? "(D)" : userVipRole}</Text>
            </View>
            <TouchableOpacity onPress={showAlertFollow} style={{ zIndex: 10, padding: 5, }}>
              {/* <Image source={require('../assets/whatsapp2.png')} style={{ height: 30, width: 30 }} /> */}
              <Feather name="user-plus" size={23} color="white" />
            </TouchableOpacity>
            <Icon name="bell" size={22} color={'#FF0000'} />
            {notificationCount > 0 && (
              <View style={{
                position: 'absolute',
                top: 1,
                right: 4,
                padding: 3,
                borderRadius: 100,
                backgroundColor: 'red',
                borderColor: 'white',
                borderWidth: 0.2,
                elevation: 2,
                borderColor: 'white',
                borderWidth: 0.2
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 7,
                  fontFamily: 'Manrope-Bold',
                  textAlign: 'center',
                  minWidth: 10,
                }}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1, height: '100%', width: '100%', marginBottom: 50, paddingTop: 0, }} >

          <TouchableOpacity style={styles.searchContainer} onPress={() => { navigation.navigate('SearchScreen') }}>
            <Text style={[styles.searchText]}>
              <Icon name="search" size={20} />
            </Text>
            <Text style={[styles.searchText, { fontSize: 16, fontFamily: 'Manrope-Regular' }]}>
              Search
            </Text>
          </TouchableOpacity>

          <MainBanner />

          <TodayBanner />

          <VisitingA4Btn />

          <AdBanner />

          <TrendingBanner />

          <DynamicSection />
        </ScrollView>
      </LinearGradient>

      {/* modal */}

      <Modal
        animationType="fade" // You can use "fade" or "none" for animation type
        visible={isModalVisibleFollow}
        transparent={true}
        onRequestClose={hideAlertFollow}
      >
        <TouchableOpacity onPress={hideAlertFollow} style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 8,
            width: 80,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
            gap: 30,
            margin: 20
          }}>

            {/* another */}

            <TouchableOpacity onPress={() => { hideAlertFollow('insta') }} style={{
              borderColor: 'lightgray',
              paddingVertical: 5,
              paddingHorizontal: 5,
              alignItems: 'center',
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1
            }}>
              <Text style={{
                color: '#d62976',
                fontFamily: "Manrope-Bold",
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 14
              }}><Feather name="instagram" size={35} color="#d62976" /></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { hideAlertFollow('what') }} style={{
              borderColor: 'lightgray',
              paddingVertical: 5,
              paddingHorizontal: 5,
              alignItems: 'center',
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1
            }}>
              <Text style={{
                color: 'darkgreen',
                fontFamily: "Manrope-Bold",
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 14
              }}><Fontisto name="whatsapp" size={35} color="#25D366" /></Text>
            </TouchableOpacity>

            {/* another */}

            <TouchableOpacity onPress={() => { hideAlertFollow('face') }} style={{
              borderColor: 'lightgray',
              paddingVertical: 5,
              paddingHorizontal: 5,
              alignItems: 'center',
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1
            }}>
              <Text style={{
                color: '#3b5998',
                fontFamily: "Manrope-Bold",
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 14
              }}><Feather name="facebook" size={35} color="#4267B2" /></Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { hideAlertFollow('twit') }} style={{
              borderColor: 'lightgray',
              paddingVertical: 5,
              paddingHorizontal: 5,
              alignItems: 'center',
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1
            }}>
              <Image source={require('../assets/twitter-x-logo.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  buisnessTitle: {
    fontSize: 17,
    color: 'white',
    fontFamily: 'Manrope-Bold'
  },
  yourBuisness: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    color: 'white'
  },
  image: {
    height: 160,
    width: 330,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15
  },
  containerFlatList: {
    marginBottom: 15
  },
  headerContainer: {
    height: 65,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  searchText: {
    marginRight: 10,
    color: 'lightgray'
  },
  modalContainer: {
    height,
    width,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalBackground: {
    position: 'absolute',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    height: 400,
    width: 270,
    borderRadius: 10
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent2: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  okButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: 250,
    height: 40,
    borderRadius: 8,
    marginTop: 25,
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: 'black',
    paddingRight: 20,
    marginBottom: 10,
    paddingLeft: 15,
    textAlign: 'center'
  },
});

export default Home;



// import { View, Text, Button, SafeAreaView, Alert } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { WebView } from 'react-native-webview';
// import { sha256 } from 'react-native-sha256';
// import base64 from 'react-native-base64';
// import { v4 as uuidv4 } from 'uuid';
// import PhonePePaymentSDK from 'react-native-phonepe-pg';
// import CustomSuccessModal from './CustomAlertModal';
// import axios from 'axios';

// const PaymentMLM = () => {

//   // phone pay payment pg

//   const [openWebView, setOpenWebView] = useState(false);
//   const [webUrl, setWebUrl] = useState("https://www.google.com");

//   const [isModalVisible, setModalVisible] = useState(false);
//   const [isFailer, setIsFailer] = useState(true);

//   const showModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const [message, setMessage] = useState('');
//   const appId = "";
//   const [sha256Text, setSha56Text] = useState('');
//   const [sha256TextStatus, setSha56TextStatus] = useState('');

//   const [string, setString] = useState('')
//   const [stringStatus, setStringStatus] = useState('')

//   const convertSHA = (string) => {
//     //Encode SHA256
//     sha256(string).then(hash => {
//       setSha56Text(hash);
//     });
//   };
//   useEffect(() => {
//     convertSHA(string);
//   }, [string]);

//   const convertSHAStatus = (string) => {
//     //Encode SHA256
//     sha256(string).then(hash => {
//       setSha56TextStatus(hash);
//     });
//   };
//   useEffect(() => {
//     convertSHAStatus(stringStatus);
//   }, [stringStatus]);

//   function generateTransactionId() {
//     const min = 10000;
//     const max = 99999;

//     const number = Math.floor(min + Math.random() * max);
//     return number
//   }

//   const [transactionId, setTransactionId] = useState(null)
//   const merchantId = "BRANDINGONLINE"

//   console.log(transactionId)

//   const generateTransaction = () => {
//     const transaction = "MT" + Date.now()
//     if (transactionId == null) {
//       setTransactionId(transaction)
//     }
//   }

//   useEffect(() => {
//     generateTransaction();
//   }, [transactionId])

//   const [error, setError] = useState('');

//   console.log(error)

//   const startPayment = async () => {

//     // MT78505900681881011
//     const merchantTransactionId = "MT7850590068" + generateTransactionId()
//     const merchantId = "BRANDINGONLINE"
//     const data = {
//       merchantId,
//       merchantTransactionId: transactionId,
//       merchantUserId: 'BRANDINGONLINE',
//       amount: 100,
//       redirectUrl: 'https://webhook.site/redirect-url',
//       redirectMode: 'REDIRECT',
//       callbackUrl: 'https://webhook.site/callback-url',
//       mobileNumber: '9999999999',
//       paymentInstrument: {
//         type: 'PAY_PAGE',
//       },
//     };

//     const payload = JSON.stringify(data);
//     const payloadMain = base64.encode(payload);
//     const salt_key = '283787d8-5fc0-4f24-b01b-74c3ea6e1f36';

//     const keyIndex = 1;
//     const string = payloadMain + '/pg/v1/pay' + salt_key;
//     setString(string)

//     const checksum = sha256Text + '###' + keyIndex;

//     const initial = await initialPayment()

//     console.warn(initial)

//     if (initial) {
//       PhonePePaymentSDK.init('SANDBOX', merchantId, appId, true)
//         .then(async (result) => {
//           setMessage('Message: SDK Initialisation ->' + JSON.stringify(result));

//           // start payment

//           const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
//           const headers = {
//             accept: 'application/json',
//             'Content-Type': 'application/json',
//             'X-VERIFY': checksum,
//           };

//           const response = await fetch(prod_URL, {
//             method: 'POST',
//             headers: headers,
//             body: JSON.stringify({ request: payloadMain }),
//           });

//           if (response.ok) {
//             const responseData = await response.json();

//             if (responseData.data) {
//               setWebUrl(responseData.data.instrumentResponse.redirectInfo.url);
//               setOpenWebView(true);
//             }
//             // Assuming responseData.data.instrumentResponse.redirectInfo.url exists
//             // Replace this part based on the actual structure of your response
//             // const redirectURL = responseData.data.instrumentResponse.redirectInfo.url;

//             // Perform a redirect using JavaScript (in a browser environment)
//             // window.location.href = redirectURL;
//           } else if (response.status == 417){
//             const errorData = await response.json();
//             console.error(`Error: ${response.status} - ${errorData.message}`);
//             const transaction = "MT" + Date.now()
//             setTransactionId(transaction)
//           }

//         })
//         .catch(error => {
//           setMessage('error:' + error.message);
//           Alert.alert("troubleshooting..", "please try again later.")
//         });
//     }
//   }

//   const initialPayment = async () => {
//     try {
//       const result = await PhonePePaymentSDK.init('SANDBOX', merchantId, appId, true);
//       setMessage('Message: SDK Initialization -> ' + JSON.stringify(result));
//       return true;
//     } catch (error) {
//       setMessage('Error: ' + error.message);
//       Alert.alert('Troubleshooting..', 'Please try again later.');
//       return false;
//     }
//   };


//   const checkStatus = async () => {
//     try {
//       console.warn("transaction id:", transactionId);

//       const merchantTransactionId = transactionId;
//       const keyIndex = 1;
//       const salt_key = '283787d8-5fc0-4f24-b01b-74c3ea6e1f36';
//       const stringStatus = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
//       setStringStatus(stringStatus);

//       const checksum = sha256TextStatus + '###' + keyIndex;

//       const options = {
//         method: 'GET',
//         url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
//         headers: {
//           accept: 'application/json',
//           'Content-Type': 'application/json',
//           'X-VERIFY': checksum,
//           'X-MERCHANT-ID': `${merchantId}`,
//         },
//       };

//       const response = await axios.request(options);

//       if (response.data.success === true) {
//         console.log(response.data);
//         setError('')
//         setIsFailer(false);
//         setTimeout(() => {
//           setModalVisible(true);
//         }, 500);
//       } else {
//         console.log(response.data);
//         setIsFailer(true);
//         setTimeout(() => {
//           setModalVisible(true);
//         }, 500);
//       }
//     } catch (error) {
//       console.error("error", error)
//       setTimeout(() => {
//         setError("error"+Date.now())
//       }, 2000);
//       // You might want to handle this error differently, such as
//     }
//   };


//   useEffect(() => {
//     if (error != '') {
//       console.log("error msg in useefect", error)
//       checkStatus()
//     }
//   }, [error, ])

//   const handleNavigationStateChange = (navState) => {
//     const currentUrl = navState.url;
//     if (currentUrl === "https://webhook.site/redirect-url") {
//       setOpenWebView(false);
//         checkStatus();
//       console.warn(currentUrl)
//       // setIsFailer(false);
//       // setTimeout(() => {
//       //   setModalVisible(true);
//       // }, 500);
//     } else if (currentUrl === "https://webhook.site/callback-url") {
//       setOpenWebView(false);
//       setIsFailer(true);
//       setTimeout(() => {
//         setModalVisible(true);
//       }, 500);
//     } else {
//       console.log("Does not have the current URL of redirect or callback", currentUrl);
//       setIsFailer(false);
//     }
//   };


//   if (openWebView) {
//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         <WebView
//           style={{ height: '100%' }}
//           onNavigationStateChange={handleNavigationStateChange}
//           source={{ uri: webUrl }}
//         />
//       </SafeAreaView>
//     )
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
//       <Button onPress={initialPayment} title="initial payment" />
//       <Button onPress={startPayment} title="start payment" />
//       <Button onPress={checkStatus} title="status" />

//       <CustomSuccessModal visible={isModalVisible} closeModal={closeModal} isFailer={isFailer} />
//     </View>
//   )
// }

// export default PaymentMLM


// // ---
// import axios from 'axios';
// import React, { useRef, useState, useEffect } from 'react';
// import { View, StyleSheet, Image, PanResponder, Animated } from 'react-native';
// import Gestures from "react-native-easy-gestures";

// const App = () => {

//   const image1Ref = useRef(null);
//   const [pos, setPos] = useState({ top: 150, left: 230 });
//   const [scale, setScale] = useState(1);
//   const [top, setTop] = useState(150);
//   const [left, setLeft] = useState(230);
//   const [jsonData, setJsonData] = useState(null);
//   const [images, setImages] = useState([]);
//   const [brandingLogo, setBrandingLogo] = useState([]);
//   const [, setTextItems] = useState([]);
//   const [staticImage, setStaticImage] = useState([])

//   const api = 'https://api.brandingprofitable.com/cd_section/cds_data/6548e4cac7347dbea2fc1966'

//   // getting template data
//   useEffect(() => {
//     // Define the URL for the GET request
//     const apiUrl = api

//     // Make the GET request using Axios
//     axios
//       .get(apiUrl)
//       .then(response => {
//         const imageData = response.data.data.cds_template;
//         const data = {
//           data: imageData
//         };
//         console.log(data)
//         setJsonData(data);
//       })
//       .catch(error => {
//         console.error('Error fetching response.data.data:', error)
//       });

//   }, [])

//   useEffect(() => {
//     if (jsonData && jsonData.data && jsonData.data.scenes) {
//       setBrandingLogo(createBrandingLogoFromJson(jsonData))
//       setStaticImage(createStaticImageFromJson(jsonData))
//     }
//   }, [jsonData]);

//     // function to add image in canvas
//     const createItemsFromJson = (json) => {
//       const items = [];
//       if (json && json.data && json.data.scenes) {
//         const scenes = json.data.scenes;
//         let count = 0
//         scenes.forEach((scene) => {
//           const layers = scene.layers;
//           layers.forEach((layer) => {
  
//             if (layer.type === "StaticImage") {
//               const newItem = {
//                 id: layer.id,
//                 type: "image",
//                 src: layer.src,
//                 left: layer.left,
//                 top: layer.top,
//                 width: layer.width,
//                 height: layer.height,
//                 scaleX: layer.scaleX,
//                 scaleY: layer.scaleY,
//                 flipX: layer.flipX,
//                 flipY: layer.flipY,
//                 rotation: layer.rotate || 0,
//                 scale: 1,
//                 zIndex: 0
//               };
//               items.push(newItem);
//               count++;
//             }
//             // else if (layer.type === "StaticText") {
//             //   const newItem = {
//             //     id: layer.id,
//             //     type: "text",
//             //     text: layer.text,
//             //     left: layer.left,
//             //     top: layer.top,
//             //     width: layer.width,
//             //     height: layer.height,
//             //     fontFamily: layer.fontFamily,
//             //     fontSize: layer.fontSize,
//             //     fill: layer.fill,
//             //     textAlign: layer.textAlign,
//             //     scaleX: layer.scaleX,
//             //     scaleY: layer.scaleY
//             //   };
//             //   items.push(newItem);
//             // }
//           });
//         });
//       }
//       return items;
//     };

//     const createBrandingLogoFromJson = (json) => {
//       const items = [];
//       if (json && json.data && json.data.scenes) {
//         const scenes = json.data.scenes;
//         let count = 0
//         scenes.forEach((scene) => {
//           const layers = scene.layers;
//           layers.forEach((layer) => {
  
//             if (layer.src === "https://cdn.brandingprofitable.com/upload/6548e48a3ab87Profile.jpg") {
//               const newItem = {
//                 id: layer.id,
//                 type: "image",
//                 src: layer.src,
//                 left: layer.left,
//                 top: layer.top,
//                 width: layer.width,
//                 height: layer.height,
//                 scaleX: layer.scaleX,
//                 scaleY: layer.scaleY,
//                 flipX: layer.flipX,
//                 flipY: layer.flipY,
//                 rotation: layer.rotate || 0,
//                 scale: 1,
//                 zIndex: 0
//               };
//               items.push(newItem);
//               count++;
//             }
//             // else if (layer.type === "StaticText") {
//             //   const newItem = {
//             //     id: layer.id,
//             //     type: "text",
//             //     text: layer.text,
//             //     left: layer.left,
//             //     top: layer.top,
//             //     width: layer.width,
//             //     height: layer.height,
//             //     fontFamily: layer.fontFamily,
//             //     fontSize: layer.fontSize,
//             //     fill: layer.fill,
//             //     textAlign: layer.textAlign,
//             //     scaleX: layer.scaleX,
//             //     scaleY: layer.scaleY
//             //   };
//             //   items.push(newItem);
//             // }
//           });
//         });
//       }
//       return items;
//     };
//     const createStaticImageFromJson = (json) => {
//       const items = [];
//       if (json && json.data && json.data.scenes) {
//         const scenes = json.data.scenes;
//         let count = 0
//         scenes.forEach((scene) => {
//           const layers = scene.layers;
//           layers.forEach((layer) => {
  
//             if (layer.src !== "https://cdn.brandingprofitable.com/upload/6548e48a3ab87Profile.jpg" && layer.type == "StaticImage") {
//               const newItem = {
//                 id: layer.id,
//                 type: "image",
//                 src: layer.src,
//                 left: layer.left,
//                 top: layer.top,
//                 width: layer.width,
//                 height: layer.height,
//                 scaleX: layer.scaleX,
//                 scaleY: layer.scaleY,
//                 flipX: layer.flipX,
//                 flipY: layer.flipY,
//                 rotation: layer.rotate || 0,
//                 scale: 1,
//                 zIndex: 0
//               };
//               items.push(newItem);
//               count++;
//             }
//             // else if (layer.type === "StaticText") {
//             //   const newItem = {
//             //     id: layer.id,
//             //     type: "text",
//             //     text: layer.text,
//             //     left: layer.left,
//             //     top: layer.top,
//             //     width: layer.width,
//             //     height: layer.height,
//             //     fontFamily: layer.fontFamily,
//             //     fontSize: layer.fontSize,
//             //     fill: layer.fill,
//             //     textAlign: layer.textAlign,
//             //     scaleX: layer.scaleX,
//             //     scaleY: layer.scaleY
//             //   };
//             //   items.push(newItem);
//             // }
//           });
//         });
//       }
//       return items;
//     };
  
//     // function to add texts in canvas
//     const createTextItemsFromJson = (jsonData) => {
//       if (!jsonData || !jsonData.data || !jsonData.data.scenes) {
//         return []; // Return an empty array if jsonData or its properties are not available
//       }
  
//       const textItems = [];
//       const scenes = jsonData.data.scenes;
  
//       scenes.forEach((scene) => {
//         const layers = scene.layers;
//         layers.forEach((layer) => {
//           console.log(layer)
//           if (layer.type === "StaticText") {
//             const newItem = {
//               text: layer.text,
//               isSelected: false,
//               fontSize: layer.fontSize || 20,
//               color: layer.fill || 'black',
//               left: layer.left || 0,
//               top: layer.top || 0,
//               rotation: layer.angle || 0,
//               scaleX: layer.scaleX || 1,
//               scaleY: layer.scaleY || 1,
//               textAlign: layer.textAlign || 'center',
//               width: layer.width || 200,
//               height: layer.height || 40,
//               fontFamily: layer.fontFamily
//             };
//             textItems.push(newItem);
//           }
//         });
//       });
  
//       return textItems;
//     };

//   // {"left": 105.1213607788086, "top": 220.77779388427734, "transform": [{"scale": 0.9621902285909238}, {"rotate": "3.6735932105929123deg"}]}

//   const handleChange = (event, styles) => {
//     // const { top, left, transform } = styles;
//     // setPos({ top, left, transform });
//     // updateImageStyles({ top, left, transform });

//     if (styles?.transform.length != 0) {
//       const scale = styles?.transform[styles.transform.length - 1]?.scale;
//       // console.log(scale)
//       setScale(scale)
//     }
//     setPos(styles)
//     setTop(styles.top)
//     setLeft(styles.left)
//   };

//   return (
//     <View style={styles.container}>
//       {/* Image 1 */}
//       {/* <View style={[styles.borderImageContainer, pos]}>
//         <Image
//           source={{ uri: 'https://cdn.brandingprofitable.com/upload/653f4de790bdaBRANDING%20PROFIRTABLE.jpg' }}
//           style={[styles.image]}
//           resizeMode="cover"
//         />
//       </View> */}

//       <View
//         style={[styles.overlay, { height: 400, width: 400, opacity: 1 }]}
//       >

//         <View style={[pos, { height: 100, width: 100, position: 'absolute', top: top, left: left }]}>
//           <Image
//             source={{ uri: 'https://cdn.brandingprofitable.com/upload/653f4de790bdaBRANDING%20PROFIRTABLE.jpg' }}
//             style={[styles.image]}
//             resizeMode="cover"
//           />
//         </View>


//         {/* Image at the bottom */}
//         <Image
//           source={{ uri: 'https://cdn.brandingprofitable.com/upload/653f4de46f8f88.png' }}
//           style={[styles.image, styles.overlay, { height: 400, top: 0 }]}
//           resizeMode="cover"
//         />

//         <Gestures
//           scalable={{ min: 0.5, max: 3 }}
//           rotatable={true}
//           key={2}
//           onChange={handleChange}
//           onEnd={(event, styles) => {
//             setPos(styles)
//           }}
//           style={{top,left}}
//         >
//           <View style={[{ height: 2000, width: 2000, position: 'absolute', opacity: 0.5, marginTop: -1000, marginLeft: -1000, top, left }]}>
//             <Image
//               source={{ uri: 'https://cdn.brandingprofitable.com/upload/653f4de790bdaBRANDING%20PROFIRTABLE.jpg' }}
//               style={[{ opacity: 0, height: 100, width: 100 }]}
//               resizeMode="cover"
//             />
//           </View>
//         </Gestures>


//       </View>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     position: 'relative'
//   },
//   imageContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   borderImageContainer: {
//     // borderWidth: 1,
//     // borderColor: 'black',
//     height: 200,
//     width: 200,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 200,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     opacity: 0.5,
//   },
// });

// export default App;