import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, ToastAndroid, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { ScrollView, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from '@rneui/base';
import ImageCropPicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window')

// divider
const DividerWithText = ({ value }) => {
    return (
        <View style={styles.containerDivider}>
            <View style={styles.divider} />
            <Text style={[styles.label, { marginHorizontal: 10 }]}>{value}</Text>
            <View style={styles.divider} />
        </View>
    );
};

const KycVerfication = ({ navigation, route }) => {
    const [adharcardNumber, setAdharcardNumber] = useState('')
    const [pancardNumber, setPancardNumber] = useState('')
    const [pancard, setPancard] = useState('')
    const [adharcard, setAdharcard] = useState('');
    const [adharcard2, setAdharcard2] = useState('');

    const [imageLoader, setImageLoader] = useState(false)

    // get user token 

    const prevScrData = route.params.data.fetchedDataAfterReject;
    const isReject = route.params.data.isReject;
    const rejectStatus = route.params.data.rejectStatus;
    console.log(rejectStatus, "prevScrData")

    // 401 - reupload aadhar
    // 402 - reupload pan card
    // 403 - re enter pan card number
    // 405 = invalid aadhar number

    useEffect(() => {
        if (isReject) {
            rejectStatus != 405 && setAdharcardNumber(prevScrData?.adharcardNumber.toString())
            rejectStatus != 403 && setPancardNumber(prevScrData?.pancardNumber)
            rejectStatus != 402 && setPancard(prevScrData?.pancard.toString())
            rejectStatus != 401 && setAdharcard(prevScrData?.adharcard)
        }

    }, [])

    const [userToken, setUserToken] = useState()
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        retrieveProfileData()
    }, [retrieveProfileData])

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

    // handle submit

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    };
    const [isLoader, setIsLoader] = useState(false);
    const [isLoaderPan, setIsLoaderPan] = useState(false);
    const [isLoaderAadhar2, setIsLoaderAadhar2] = useState(false);

    const handleSubmit = async () => {

        if (adharcardNumber==''||pancardNumber==''||adharcard==''||pancardNumber==''||adharcard2=='') {
            showToastWithGravity("Please Fill All Details")
            return;
        }

        setIsLoader(true);
        const apiUrl = isReject ? `https://api.brandingprofitable.com/kyc/re_kyc/${profileData?.mobileNumber}` : 'https://api.brandingprofitable.com/kyc/kyc';

        const requestData = isReject ? {
            
            fullName: profileData.fullName,
            mobileNumber: profileData.mobileNumber,
            email: profileData.email,
            adharcardNumber,
            pancardNumber,
            pancard,
            adharcard,
            adharcard2,
            "status": [
                "ReKyc"
            ]
        } : {
            fullName: profileData.fullName,
            mobileNumber: profileData.mobileNumber,
            email: profileData.email,
            adharcardNumber,
            pancardNumber,
            pancard,
            adharcard,
            adharcard2,
            "status": [
                "Pending"
            ]
        };

        try {
            const response =

                isReject ?

                    await axios.put(apiUrl, requestData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`,
                        },

                    })

                    :

                    await axios.post(apiUrl, requestData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`,
                        },

                    })

            console.log(response.data)

            if (response.data.statusCode === 200) {
                showToastWithGravity("Request Sent Successfully!")
                navigation.goBack();
            } else {
                showToastWithGravity("Troubleshooting to Send Request!")
            }
        } catch (error) {
            showToastWithGravity("Troubleshooting to Send Request!")
        } finally {
            setIsLoader(false);
        }
    }

    // send data to api 

    // https://api.brandingprofitable.com/withdrawal/withdrawal
    //   adharcardNumber: { type: String },
    //   withdrawalAmount: { type: Number },
    //   pancardNumber: { type: String },
    //   pancard: { type: Number },
    //   adharcard: { type: String },
    //   ifsc: { type: String },

    const handleImagePicker = (value) => {
        value == 'pancard' ? setIsLoaderPan : setImageLoader(true)
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
                        console.log(imagePath, "imagePath")
                        if (value == 'pancard') {
                            setPancard(imagePath)
                        } else {
                            setAdharcard(imagePath);
                        }
                    })
                    .catch((err) => {
                        console.log('Error uploading image:', err);
                        value == 'pancard' ? setIsLoaderPan(false) : setImageLoader(false)
                    });
                value == 'pancard' ? setIsLoaderPan(false) : setImageLoader(false)
            })
            .catch((error) => {
                console.log('ImagePicker Error:', error);
                value == 'pancard' ? setIsLoaderPan(false) : setImageLoader(false)
            });
        value == 'pancard' ? setIsLoaderPan(false) : setImageLoader(false)

    };

    const handleImagePicker2 = (value) => {
        setIsLoaderAadhar2(true)
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
                        // console.log(imagePath, "imagePath")
                        setAdharcard2(imagePath)
                    })
                    .catch((err) => {
                        console.log('Error uploading image:', err);
                        setIsLoaderAadhar2(false)
                    });
                setIsLoaderAadhar2(false)
            })
            .catch((error) => {
                console.log('ImagePicker Error:', error);
                setIsLoaderAadhar2(false)
            });
        setIsLoaderAadhar2(false)

    };

    if (isLoader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']}
            style={{ flex: 1, justifyContent: "space-between" }}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    KYC Verify
                </Text>
            </View>

            <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                <View style={styles.profileContainer}>
                    {/* divider */}
                    <View style={[styles.labelContainer, { marginVertical: 5, marginTop: 10 }]}>
                        <DividerWithText value={"Aadhar Details"} />
                    </View>

                    {/* Payment Amount Input */}
                    {/* UPI Id Input */}
                    <View style={[styles.labelContainer, { marginTop: 10 }]}>
                        <Text style={styles.label}>Aadhar Number*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Aadhar Number"
                            value={adharcardNumber}
                            onChangeText={(value) => setAdharcardNumber(value)}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                            maxLength={12}
                        />
                    </View>

                    <View style={[styles.labelContainer, { marginTop: 10 }]}>
                        <Text style={styles.label}>Aadhar Photo* </Text>
                        <Text style={[styles.label, {
                            color: "red", fontSize: 10
                        }]}>please upload both back and front image of aadhar card*</Text>
                    </View>
                    <View style={{ width: '80%', marginTop: 10, flexDirection:'row', gap:20 }}>
                        <TouchableOpacity style={{ height: 80, width: 80, borderRadius: 15, borderWidth: 1, alignSelf: 'flex-start', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }} onPress={handleImagePicker}>
                            {
                                imageLoader ? (
                                    <ActivityIndicator color='black' />
                                ) :
                                    adharcard != "" ? (
                                        <Image source={{ uri: adharcard }} style={{ width: 80, height: 80 }} />
                                    ) : (
                                        <Icon name="plus" size={20} color={"black"} />
                                    )
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 80, width: 80, borderRadius: 15, borderWidth: 1, alignSelf: 'flex-start', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }} onPress={handleImagePicker2}>
                            {
                                isLoaderAadhar2 ? (
                                    <ActivityIndicator color='black' />
                                ) :
                                    adharcard2 != "" ? (
                                        <Image source={{ uri: adharcard2 }} style={{ width: 80, height: 80 }} />
                                    ) : (
                                        <Icon name="plus" size={20} color={"black"} />
                                    )
                            }
                        </TouchableOpacity>
                    </View>

                    {/* divider */}
                    <View style={[styles.labelContainer, { marginVertical: 5, marginTop: 10 }]}>
                        <DividerWithText value={"Pan Card Details"} />
                    </View>

                    <>
                        {/* Bank Name Input */}
                        <View style={[styles.labelContainer, { marginTop: 10 }]}>
                            <Text style={styles.label}>Pan Card Number*</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Pan Card Number"
                                value={pancardNumber}
                                onChangeText={(value) => setPancardNumber(value)}
                                autoCapitalize="none"
                            />
                        </View>

                    </>

                    <View style={[styles.labelContainer, { marginTop: 10 }]}>
                        <Text style={styles.label}>PAN Photo*</Text>
                    </View>
                    <View style={{ width: '80%', marginTop: 10 }}>
                        <TouchableOpacity style={{ height: 80, width: 80, borderRadius: 15, borderWidth: 1, alignSelf: 'flex-start', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }} onPress={() => { handleImagePicker('pancard') }}>
                            {
                                isLoaderPan ? (
                                    <ActivityIndicator color='black' />
                                ) :
                                    pancard != "" ? (
                                        <Image source={{ uri: pancard }} style={{ width: 80, height: 80 }} />
                                    ) : (
                                        <Icon name="plus" size={20} color={"black"} />
                                    )
                            }
                        </TouchableOpacity>
                    </View>

                    <TouchableHighlight onPress={handleSubmit} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "80%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, marginTop: 30 }} >
                        <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                            Submit KYC Details
                        </Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: 30,
        maxHeight: height
    },
    containerDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        width: '100%'
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginRight: 8,
        width: 120,
    },
    info: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
    },
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontFamily: "Manrope-Bold",
        marginLeft: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        fontSize: 15,
        color: '#333',
        fontFamily: 'Manrope-Regular',

    },
    inputContainer: {
        width: '80%',
        marginTop: 18,
    },
    labelContainer: {
        width: '80%',
        alignItems: 'flex-start',
        marginTop: 20,
        justifyContent: 'center'
    },
    label: {
        color: '#6B7285',
        fontFamily: 'Manrope-Regular',
        fontSize: 15,
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    imageContainer: {
        position: 'relative', // Required for positioning the button absolutely
    },
    profileImage: {
        // Your existing styles for the image
        height: 130,
        width: 130,
        borderRadius: 100,
        marginLeft: 15,
        marginRight: 15,
    },
    pickImageButton: {
        position: 'absolute', // Position the button absolutely within the container
        bottom: 0, // Adjust this value to position the button as desired from the bottom
        right: 10, // Adjust this value to position the button as desired from the right
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the background color and opacity as needed
        padding: 10,
        borderRadius: 50,
    },
});

export default KycVerfication

