// change the fontawesome 5 to fontawesome 6
import CryptoJS from "react-native-crypto-js";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Keyboard, TextInput, Modal, ScrollView, ToastAndroid, SectionListComponent } from 'react-native';
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Share from 'react-native-share';
import { PinchGestureHandler } from 'react-native-gesture-handler';

import Header from '../Header';
const { height, width } = Dimensions.get('window')

const AfterSubscribe = ({ profileData, userTeamDetails }) => {
    const [businessOrPersonal, setBusinessOrPersonal] = useState('');
    // const [isload, setisload] = useState(true);

    const [userTeamDetails1, setUserTeamDetails] = React.useState(userTeamDetails);

    const navigation = useNavigation();

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50
        );
    };

    // const handleCopyToClipboard = () => {
    //     const textToCopy = profileData?.mobileNumber; // Use profileData?.mobileNumber directly
    //     const stringText = JSON.stringify(textToCopy);
    //     Clipboard.setString(stringText);
    //     showToastWithGravity('Referral is Copied to ClipBoard');

    // };

    const [shareData, setShareData] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState(profileData?.mobileNumber.toString());
    const [selectedSide, setSelectedSide] = useState(["left", "right"])
    const [selectedSideByUser, setSelectedSideByUser] = useState("side")
    const [selectedTreeId, setSelectedTreeId] = useState("Refer Id")
    const [sponsor_referal, setsponsor_referal] = useState({});

    //     const fetchDetails = async () => {
    //     try {
    //       if (profileData?.mobileNumber) {
    //         const response = await axios.get(
    //           `https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`
    //         );
    //         const result = response.data;
    //         if (response.data.statusCode == 200) {
    //           // await AsyncStorage.setItem('splashData', JSON.stringify(result.role));
    //               await AsyncStorage.setItem('UserVipTag', `(${result?.details?.role})`);
    //           setisload(false); 
    //         }else {
    //           await AsyncStorage.removeItem('UserVipTag');
    //         }
    //         setUserTeamDetails1(result?.details);
    //       } else {
    //       }
    //     } catch (error) {
    //       console.log(error, "main mlm error");

    //       await AsyncStorage.removeItem('UserVipTag');
    //     }
    //   };

    const fetchData = async () => {
        try {
            const [shareData, userTeamDetails1, UplineDetails] = await Promise.all([
                axios.get(`https://api.brandingprofitable.com/mlm/findpair/${profileData?.mobileNumber}`),
                axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`),
                axios.get(`https://api.brandingprofitable.com/mlm/sponsor_parent/${profileData.mobileNumber}`),
            ]);
            setUserTeamDetails(userTeamDetails1.data?.details)

            const result = userTeamDetails1.data;

            await AsyncStorage.setItem('UserVipTag', `(${result?.details?.role})`);

            console.log("api called after subscribe...")
            setShareData(shareData.data.users);
            // setSelectedTreeId(shareData.data.users[0].mobileNumber);
            // setSelectedLanguage(shareData.data.users[0].mobileNumber);
            const sponsor_referal = { sponsor: UplineDetails.data.sponsor, referal: UplineDetails.data.parent }
            setsponsor_referal(sponsor_referal);
        } catch (error) {
            console.log('Error fetching data in api of mlm 2:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Add a listener to the focus event to reload the screen
        const unsubscribe = navigation.addListener('focus', fetchData);
        // Clean up the listener when the component unmounts
        return () => unsubscribe()
    }, [navigation])

    // show dropdown modal 
    const [isModalVisible5, setModalVisible5] = useState(false);

    const showAlert5 = () => {
        setModalVisible5(true);
    };

    const hideAlert5 = () => {
        setModalVisible5(false);
    };

    const renderDropdownIcon = ({ isOpen, selectedItem }) => {
        const icon = isOpen ? 'check' : 'angle-down';
        return <Icon name={icon} size={25} color="black" />

    };

    const handleShare = async () => {
        hideAlert5();

        console.log(selectedSideByUser)

        if (selectedLanguage == '' || selectedLanguage == ' ' || selectedTreeId == 'Refer Id' || selectedTreeId == '' || selectedTreeId == ' ' || selectedSideByUser == 'side' || selectedSideByUser == 'Side' || selectedSideByUser == '') {
            showToastWithGravity("fill all details")
            return;
        }

        try {
            const selectedTree = selectedTreeId.split('-');
            console.log(selectedTree)

            const message = `Sponser ID: ${selectedLanguage}\nRefer ID: ${selectedTree[1]}\nSide: ${selectedSideByUser}\nApp: https://play.google.com/store/apps/details?id=com.brandingprofitable_0`;

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
    };

    const [selected, setSelected] = React.useState([]);
    const [openLDropdown, setopenLDropdown] = useState(false)
    const [openLDropdownTree, setopenLDropdownTree] = useState(false)

    const [data, setData] = React.useState(['apple', "banana", "mit", 'shivam', 'sahil', 'hardik'])

    const [suggestion, setSuggestions] = React.useState([])
    const [suggestionTree, setSuggestionsTree] = React.useState([])

    // const fetchDetails = async () => {
    //     console.log(`https://api.brandingprofitable.com/wallet/paircount/${profileData?.mobileNumber}`)
    //   try {
    //     if (profileData?.mobileNumber) {
    //       console.log('Checking subscription status...aftersubscribe');
    //       const response = await axios.get(
    //         `https://api.brandingprofitable.com/wallet/paircount/${profileData?.mobileNumber}`
    //       );
    //       const result = response.data;
    //       if (response.data.statusCode == 200) {
    //         setisload(false);
    //       }
    //       console.log(result);
    //       setUserTeamDetails1(result);
    //     } else {
    //       console.log('Mobile number not available!');
    //     }
    //   } catch (error) {
    //     console.log('Error fetching data... after subscribe:', error);
    //   }
    // };

    // useEffect(() => {
    //   fetchDetails();
    // }, [profileData]);

    // if (isload) {
    //     return (
    //       <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //         <ActivityIndicator color={'white'} />
    //       </LinearGradient>
    //     )
    //   }

    console.log(userTeamDetails1)

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

    return (
        <LinearGradient colors={['#006a39', '#000']} locations={[0.2, 1]} style={{ flex: 1, marginBottom: 50 }}>

            <ScrollView style={{ flex: 1, minHeight: height }} keyboardShouldPersistTaps={'always'}>

                {/* confirmation modal of add frame or not */}
                <Modal
                    animationType="fade" // You can use "fade" or "none" for animation type
                    visible={isModalVisible5}
                    transparent={true}
                    onRequestClose={hideAlert5}
                    keyboardShouldPersistTaps={'always'}
                >
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
                    </View>
                </Modal>

                {/* 1 */}
                <View style={{ height: 220, backgroundColor: 'rgba(1, 1, 1, 0.3)', borderBottomRightRadius: 0, borderBottomLeftRadius: 0, justifyContent: 'space-between', overflow: "hidden" }}>

                    {/* header */}
                    {/* <View style={{borderColor:'black',borderWidth:1,borderBottomLeftRadius:10, borderBottomRightRadius:10, borderTopWidth:0, }}> */}
                    <Header />
                    {/* </View> */}

                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 0 }}>

                        <View>
                            <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                {userTeamDetails1?.totalEarnings || 0}
                            </Text>
                        </View>
                        <View>
                            <Text onPress={() => { navigation.navigate('WalletApp', { profileData: profileData }) }} style={{ color: 'lightgray', fontFamily: 'Manrope-Bold', fontSize: 15, textDecorationLine: 'underline', }}>
                                Total Earnings
                            </Text>
                        </View>
                    </View>

                    {/* main content */}

                    <View style={[styles.shadowProp, { height: '25%', backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'space-around', paddingHorizontal: 20, elevation: 3 }]}>

                        {/* 1 */}
                        <View style={{ height: 80, width: '100', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                                <Text style={{ color: 'red', paddingHorizontal: 10, }}>
                                    <FontAwesome6 name="sack-dollar" size={30} color="#E31E25" />
                                </Text>
                                <View>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#E31E25' }}>
                                        Pending Earnings
                                    </Text>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                                        ₹ {userTeamDetails1?.redWallet}/-
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'red', paddingHorizontal: 10, flexDirection: 'row' }}>
                                    <FontAwesome6 name="sack-dollar" size={30} color="#42FF00" />
                                </Text>
                                <View>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#42FF00' }}>
                                        Current Earnings
                                    </Text>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                                        ₹ {userTeamDetails1?.greenWallet}/-
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>

                </View>

                {/* 2 */}

                {/* Up-Line */}
                {/* <View style={{ height: 100, justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', marginTop: 30, borderRadius: 10 }}>
                    <View>
                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                            {userTeamDetails1?.parentUserName} 
                        </Text>
                    </View>
                    <TouchableOpacity >
                        <Text style={{ color: '#00D3FF', fontFamily: 'Manrope-Bold', fontSize: 15, textDecorationLine: 'underline', }}>
                            Up-Line
                        </Text>
                    </TouchableOpacity>
                </View> */}


                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', marginTop: 30, borderRadius: 0 }}>
                    <View>

                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                            {userTeamDetails1?.totalTeam}
                        </Text>

                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate('MLMScreen2', { 'aadhar': profileData?.mobileNumber, 'id': profileData?._id, 'greenWallet': userTeamDetails1?.greenWallet }) }}>
                        <Text style={{ color: '#00D3FF', fontFamily: 'Manrope-Bold', fontSize: 15, textDecorationLine: 'underline', }}>
                            Total Team
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 3 */}

                <View style={{ height: 180, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 30, borderRadius: 0 }}>
                    <View style={{ borderRadius: 0, height: '100%', width: '45%', backgroundColor: 'rgba(255, 255, 255, 0.8)', overflow: 'hidden', alignItems: 'center', justifyContent: 'space-between' }}>

                        <View style={{ height: 40, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 17 }}>
                                Right Side
                            </Text>
                        </View>

                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '87%', gap: 5 }}>
                                {/* 1 */}
                                <View style={{ gap: 0, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'gray', fontFamily: 'Manrope-Bold', fontSize: 13, }}>
                                        Total Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails1?.rightSideTotalJoining}
                                        </Text>
                                    </View>
                                </View>
                                {/* 2 */}
                                <View style={{ gap: 0, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'gray', fontFamily: 'Manrope-Bold', fontSize: 13, }}>
                                        Today Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails1?.rightSideTodayJoining || 0}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                        </View>

                    </View>
                    {/* 2 */}
                    <View style={{ borderRadius: 0, height: '100%', width: '45%', backgroundColor: 'rgba(255, 255, 255, 0.8)', overflow: 'hidden', alignItems: 'center', justifyContent: 'space-between' }}>

                        <View style={{ height: 40, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 17 }}>
                                Left Side
                            </Text>
                        </View>

                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '87%', gap: 5 }}>
                                {/* 1 */}
                                <View style={{ gap: 0, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'gray', fontFamily: 'Manrope-Bold', fontSize: 13, }}>
                                        Total Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails1?.leftSideTotalJoining}
                                        </Text>
                                    </View>
                                </View>
                                {/* 2 */}
                                <View style={{ gap: 0, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'gray', fontFamily: 'Manrope-Bold', fontSize: 13, }}>
                                        Today Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails1?.leftSideTodayJoining || 0}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                        </View>

                    </View>
                </View>

                {/* 4 */}

                <View style={{ height: 60, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop: 30, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: 'white' }}>

                    <TouchableOpacity
                        style={{ backgroundColor: "white", height: '100%', width: '100%', alignItems: "center", justifyContent: 'center' }}
                        onPress={showAlert5} // Call the function on button press
                    >
                        <Text style={{ color: 'black', fontFamily: "Manrope-Bold", fontSize: 18 }}>
                            Refer & Earn
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 5 */}
                <View style={{ height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', marginTop: 50, borderRadius: 10, marginBottom: 80 }}>

                    {/* <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 10, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={()=>{navigation.navigate('PrivacyPolicy')}}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text >
                                    <MaterialIcons name="headset-mic" size={16} color="white" />
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                                Privacy Policy
                            </Text>
                        </View>

                        <Text>
                            <Icon name="angle-right" size={30} color="white" />
                        </Text>

                    </TouchableOpacity> */}

                    <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('Help') }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text >
                                    <MaterialIcons name="privacy-tip" size={16} color="#E31E25" />
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: '#E31E25', marginLeft: 10 }}>
                                Help
                            </Text>
                        </View>

                        <Text>
                            <Icon name="angle-right" size={30} color="#E31E25" />
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 10, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('WalletApp', { profileData: profileData }) }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text>
                                    <MaterialIcons name="wallet" size={16} color="white" />
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                                Wallet
                            </Text>
                        </View>

                        <Text>
                            <Icon name="angle-right" size={30} color="white" />
                        </Text>

                    </TouchableOpacity>

                    {/* <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 10, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('UplineDetails', { userTeamDetails1: sponsor_referal }) }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text>
                                    <MaterialIcons name="wallet" size={16} color="white" />
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                                Up-line
                            </Text>
                        </View>

                        <Text>
                            <Icon name="angle-right" size={30} color="white" />
                        </Text>

                    </TouchableOpacity> */}

                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default AfterSubscribe

const styles = StyleSheet.create({
    headerContainer: {
        height: 65,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 5
    },
    headerText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    buisnessTitle: {
        fontSize: 19,
        color: 'black',
        fontFamily: 'Manrope-Bold'
    },
    yourBuisness: {
        fontSize: 12,
        fontFamily: 'Manrope-Regular'
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
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
})


