import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, ToastAndroid, ActivityIndicator, Modal, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { ScrollView, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-share';


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

const WithdrawWallet = ({ route }) => {
    const navigation = useNavigation();

    const userBalance = route.params.greenWallet;
    const { isMLMPurchased } = route.params;
    const [withdrawalAmount, setWithdrawalAmount] = useState('')
    const [UpiId, setUpiId] = useState('')
    const [bankName, setBankName] = useState('')
    const [acNumber, setAcHolder] = useState('')
    const [acName, setAcName] = useState('')
    const [ifsc, setIfsc] = useState('')
    const [otp, setotp] = useState('')
    const [businessOrPersonal, setBusinessOrPersonal] = useState('bank')

    const [otpModal, setOtpModal] = useState(false)

    // get user token 
    const [alreadySetBankDetail, setalreadySetBankDetail] = useState(false);

    const [userToken, setUserToken] = useState();
    const [profileData, setProfileData] = useState(null);
    let [checkKyc, setCheckKyc] = useState(false)

    useEffect(() => {
        retrieveProfileData()
    }, [retrieveProfileData])

    const retrieveProfileData = async () => {
        try {
            setIsLoader(true)

            const dataString = await AsyncStorage.getItem('profileData');
            const userToken = await AsyncStorage.getItem('userToken');

            const bankDetails = await AsyncStorage.getItem('bankDetails');

            if (bankDetails) {

                const withdrawalData = JSON.parse(bankDetails);
                if (!alreadySetBankDetail) {
                    setBankName(withdrawalData?.bankName)
                    setIfsc(withdrawalData?.ifsc)
                    setAcHolder(withdrawalData?.acNumber)
                    setAcName(withdrawalData?.acName)
                    setalreadySetBankDetail(true)
                }

            }
            setUserToken(userToken)
            if (dataString) {
                const data = JSON.parse(dataString);
                setProfileData(data);

                if (data) {
                    try {
                        const apiUrl = `https://api.brandingprofitable.com/kyc/kyccheck/8490803632`;
                        console.log(apiUrl);
                        const response = await axios.get(apiUrl);

                        if (response.data.statusCode === 202 || response.data.statusCode === 200) {
                            // The response data is accessible using response.data
                            // navigation.navigate('KycVerfication');
                            setCheckKyc(false);
                        }
                        else if (response.data.statusCode == 203) {
                            // 401 - reupload aadhar
                            // 402 - reupload pan card
                            // 403 - re enter pan card number
                            // 405 = invalid aadhar number

                            setRejectReason(response.data.message)
                            setRejectStatus(response.data.statusCode)
                            setFetchedDataAfterReject(response.data.data)
                            setCheckKyc(true);
                            setIsReject(true)
                        }
                        else {
                            setCheckKyc(true);
                        }

                    } catch (error) {
                        console.error('Error in the API request:', error);
                    }

                } else {
                    console.log("profile data not found ")
                }
            }
            setIsLoader(false)
        } catch (error) {
            console.error('Error retrieving profile data:', error);
            setIsLoader(false)
        }
    };

    useEffect(() => {
        // Add a listener to the focus event to reload the screen
        const unsubscribe = navigation.addListener('focus', retrieveProfileData);

        // Clean up the listener when the component unmounts
        return () => unsubscribe()
    }, [navigation])

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

    // this is mine new apk

    const [isLoader, setIsLoader] = useState(true);
    const [buttonisLoader, setButtonIsLoader] = useState(false);

    const verifyOtp = async () => {
        try {

            if (otp.length != 4) {
                showToastWithGravity("otp has 4 digit")
                return;
            }

            setButtonIsLoader(true);

            // const apiUrl = `https://api.brandingprofitable.com/user/verify`
            const apiUrl = `https://api.brandingprofitable.com/mlm/withrawal_otp/verify`
            // const requestData = {
            //     "mobileNumber": profileData.mobileNumber,
            //     "withdrawalOtp": otp
            // }

            const requestData = {
                mobileNumber: profileData.mobileNumber,
                "withdrawalOtp": otp
            };
            const response = await axios.post(apiUrl, requestData);

            console.log(response.data)

            if (response.data.statusCode == 200) {
                showToastWithGravity("otp verified succesfully..")
                setOtpModal(false)
                handleSubmit();
                setotp('')
            } else {
                showToastWithGravity("otp is not correct!");
                setotp('')
            }

            setButtonIsLoader(false)

        } catch (error) {
            console.log("error in verify otp:", error)
        }
    }

    const getUsers = async () => {
        try {
            const apiUrl = 'https://jsonplaceholder.typicode.com/users';
            const response = await axios.get(apiUrl);

            // Handle the response data as needed
            console.log('Users:', response.data);
            alert("api run successfully!")
            return response.data;
        } catch (error) {
            console.error('Error in getUsers:', error);
            alert("api run failed!")
            // Handle errors as needed
            throw error;
        }
    };


    // const sendOTP = async () => {
    //     // try {
    //     //     setIsLoader(true);

    //     //     if (parseInt(withdrawalAmount) > parseInt(userBalance)) {
    //     //         showToastWithGravity(`Your balance is low: ${userBalance}`);
    //     //         setIsLoader(true);
    //     //         return;
    //     //     }

    //     //     if (withdrawalAmount < 500) {
    //     //         showToastWithGravity(`Minimum Withdraw Limit is 500rs.`);
    //     //         setIsLoader(true);
    //     //         return;
    //     //     }

    //     //     if (withdrawalAmount > 200000) {
    //     //         showToastWithGravity(`Maximum Withdraw Limit is 200000rs`);
    //     //         setIsLoader(true);
    //     //         return;
    //     //     }

    //     //     if (bankName === '' || acName === '' || acNumber === '' || ifsc === '') {
    //     //         showToastWithGravity(`Please fill in all details`);
    //     //         setIsLoader(true);
    //     //         return;
    //     //     }

    //     //     const apiUrl = `http://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/withrawal/otp`;
    //     //     const requestData = {
    //     //         mobileNumber: profileData.mobileNumber,
    //     //     };
    //     //     const response = await axios.post(apiUrl, requestData);

    //     //     if (response.data.statusCode === 200) {
    //     //         showToastWithGravity('OTP sent successfully!');
    //     //         setOtpModal(true);
    //     //     } else {
    //     //         alert(response.data.statusCode.toString())
    //     //     }
    //     // } catch (error) {
    //     //     console.error('Error in sendOTP:', error);
    //     //     showToastWithGravity('An unexpected error occurred. Please try again.');
    //     //     alert(error.toString())
    //     // } finally {
    //     //     setIsLoader(false);
    //     // }
    //     getUsers();
    // };

    const sendOTP = () => {
        setIsLoader(true);

        console.log(userBalance, withdrawalAmount)

        if (parseInt(withdrawalAmount) > parseInt(userBalance)) {
            showToastWithGravity(`Your balance is low: ${userBalance}`);
            setIsLoader(false);
            return Promise.reject(`Your balance is low: ${userBalance}`);
        }

        if (withdrawalAmount < 500) {
            showToastWithGravity(`Minimum Withdraw Limit is 500rs.`);
            setIsLoader(false);
            return Promise.reject(`Minimum Withdraw Limit is 500rs.`);
        }

        if (withdrawalAmount > 200000) {
            showToastWithGravity(`Maximum Withdraw Limit is 200000rs`);
            setIsLoader(false);
            return Promise.reject(`Maximum Withdraw Limit is 200000rs`);
        }

        if (bankName === '' || acName === '' || acNumber === '' || ifsc === '') {
            showToastWithGravity(`Please fill in all details`);
            setIsLoader(false);
            return Promise.reject(`Please fill in all details`);
        }

        const apiUrl = `https://api.brandingprofitable.com/mlm/withrawal/otp/v2`;
        // const apiUrl = `https://api.brandingprofitable.com/user/sendotp`;
        // const apiUrl = `http://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/withrawal/otp`;
        const requestData = {
            mobileNumber: profileData.mobileNumber,
            amount: withdrawalAmount
        };

        return axios.post(apiUrl, requestData)
            .then(response => {
                if (response.data.statusCode === 200) {
                    showToastWithGravity('OTP sent successfully!');
                    setOtpModal(true);
                } else {
                    console.log(response.data)
                    alert(response.data.statusCode.toString());
                }
                return response.data; // You can modify this based on what you want to return
            })
            .catch(error => {
                console.error('Error in sendOTP:', error);
                showToastWithGravity('An unexpected error occurred. Please try again.');
                alert(error.toString());
                throw error; // Re-throw the error to be caught by the outer catch block if needed
            })
            .finally(() => {
                setIsLoader(false);
            });
    };

    const handleSubmit = async () => {
        setIsLoader(true);
        const apiUrl = isMLMPurchased?'https://api.brandingprofitable.com/mlm/withdrawal':'https://api.brandingprofitable.com/abcd_withdrawal';

        console.log(apiUrl, "apiUrl")

        const requestData = businessOrPersonal === 'upi'
            ? {
                UpiId,
                withdrawalAmount,
                acName,
            }
            : {
                mobileNumber: profileData?.mobileNumber,
                withdrawalAmount,
                bankName,
                acNumber,
                acName,
                ifsc,
            };

        try {
            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },

            });

            console.log(response.data)

            if (response.data.statusCode === 200) {
                showToastWithGravity("Request Sent Successfully!");

                navigation.goBack();
                const dataString = JSON.stringify(requestData);
                await AsyncStorage.setItem('bankDetails', dataString)

            } else {
                showToastWithGravity(response.data.message)
            }
        } catch (error) {
            showToastWithGravity("Troubleshooting to Send Request!")
            console.log("error in send request:", error)
        } finally {
            setIsLoader(false);
        }
    }

    // send data to api 

    // https://api.brandingprofitable.com/withdrawal/withdrawal
    //   UpiId: { type: String },
    //   withdrawalAmount: { type: Number },
    //   bankName: { type: String },
    //   acNumber: { type: Number },
    //   acName: { type: String },
    //   ifsc: { type: String },

    const [isReject, setIsReject] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectStatus, setRejectStatus] = useState('');
    const [fetchedDataAfterReject, setFetchedDataAfterReject] = useState([])

    const checkKycRemains = async () => {
        try {
            setIsLoader(true);
            if (profileData) {
                const apiUrl = `https://api.brandingprofitable.com/kyc/kyccheck/${profileData?.mobileNumber}`;
                const response = await axios.get(apiUrl);
                
                console.log(response.data.statusCode);
    
                if (response.data.statusCode === 202 || response.data.statusCode === 200) {
                    setCheckKyc(false);
                } else if (response.data.statusCode === 401 || response.data.statusCode === 402 || response.data.statusCode === 403 || response.data.statusCode === 405) {
                    // 401 - reupload aadhar
                    // 402 - reupload pan card
                    // 403 - reenter pan card number
                    // 405 - invalid aadhar number
                    setRejectReason(response.data.message);
                    setRejectStatus(response.data.statusCode);
                    setFetchedDataAfterReject(response.data.data);
                    setCheckKyc(true);
                    setIsReject(true);
                } else {
                    setCheckKyc(true);
                }
                setIsLoader(false);
            } else {
                setIsLoader(false);
                console.log("profile data not found ");
            }
        } catch (error) {
            console.log("error in check kyc remains function", error);
            // setIsLoader(false)
        }
    }
    

    useEffect(() => {
        if (profileData?.mobileNumber) {   
            checkKycRemains();
        }
    }, [profileData]);

    const deniedData = isReject ? {
        isReject,
        rejectStatus,
        rejectReason,
        fetchedDataAfterReject
    } : {
        isReject
    }

    useEffect(() => {
        if (otp.length >= 4) {
            verifyOtp();
        }
    }, [otp])

    if (isLoader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    if (checkKyc) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.headerText, { color: 'black', fontSize: 17 }]}>{isReject ? "Your KYC is Reject!" : "Your KYC has not done yet!"}   </Text>
                <Text style={[styles.headerText, { color: 'black', fontSize: 14 }]}>{isReject ? rejectReason : "Please Submit your KYC..."}   </Text>
                {/* <Text style={[styles.headerText,{color:'black',fontSize:15}]}>Click Bellow button to do KYC Now.</Text> */}
                <TouchableHighlight onPress={() => { checkKyc == 202 ? showToastWithGravity("your kyc is in pending...") : navigation.navigate('KycVerfication', { data: deniedData }) }} style={{ backgroundColor: '#FF0000', borderRadius: 8, width: "70%", height: 40, alignItems: 'center', justifyContent: 'center', elevation: 5, marginTop: 30 }} >
                    <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                        Submit KYC
                    </Text>
                </TouchableHighlight>
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
                    WithDraw
                </Text>
            </View>

            <Modal
                animationType="slide" // You can customize the animation type
                transparent={false}
                visible={otpModal}
                onRequestClose={() => {
                    setOtpModal(!otpModal);
                }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Enter OTP!</Text>
                    <Text style={[styles.modalText, { fontSize: 13 }]}>Verify OTP to Request of Withdrawal!</Text>
                    <View style={styles.inputContainer1}>
                        <TextInput
                            style={styles.input1}
                            placeholder={"Enter OTP here"}
                            value={otp}
                            onChangeText={(e) => {
                                setotp(e);
                            }}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                            placeholderTextColor={"gray"}
                            maxLength={4}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setOtpModal(!otpModal);
                            }}
                        >
                            <Text style={styles.closeButton}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={verifyOtp}
                        >

                            <Text style={styles.closeButton}>{buttonisLoader ? <ActivityIndicator style={{ paddingHorizontal: 30 }} /> : "Submit OTP"}</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                <View style={styles.profileContainer}>
                    {/* Payment Amount Input */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Enter Withdraw Amount *</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Amount"
                            value={withdrawalAmount}
                            onChangeText={(value) => setWithdrawalAmount(value)}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                        />
                    </View>

                    {/* divider */}
                    <View style={[styles.labelContainer, { marginVertical: 5, marginTop: 10 }]}>
                        <DividerWithText value={"Account Details"} />
                    </View>

                    {businessOrPersonal == 'upi' ? (
                        <>
                            {/* UPI Id Input */}
                            <View style={[styles.labelContainer, { marginTop: 10 }]}>
                                <Text style={styles.label}>UPI Id</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your UPI Id"
                                    value={UpiId}
                                    onChangeText={(value) => setUpiId(value)}
                                    autoCapitalize="none"
                                />
                            </View>
                            {/* Bank Name Input */}
                            <View style={[styles.labelContainer]}>
                                <Text style={styles.label}>Name of UPI Account Holder</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Name"
                                    value={acName}
                                    onChangeText={(value) => setAcName(value)}
                                    autoCapitalize="none"
                                />
                            </View>
                        </>
                    ) : (

                        <>
                            {/* Bank Name Input */}
                            <View style={[styles.labelContainer, { marginTop: 10 }]}>
                                <Text style={styles.label}>Bank Name *</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Bank Name"
                                    value={bankName}
                                    onChangeText={(value) => setBankName(value)}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Account Holder Input */}
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Account Number *</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Account Number"
                                    value={acNumber}
                                    onChangeText={(value) => setAcHolder(value)}
                                    autoCapitalize="none"
                                    keyboardType='number-pad'
                                />
                            </View>

                            {/* Account Name Input */}
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Account Name *</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Account Name"
                                    value={acName}
                                    onChangeText={(value) => setAcName(value)}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* IFSC Input */}
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>IFSC Code *</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter IFSC Code"
                                    value={ifsc}
                                    onChangeText={(value) => setIfsc(value)}
                                    autoCapitalize="none"
                                />
                            </View>
                        </>
                    )}

                    <TouchableHighlight onPress={sendOTP} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "80%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, marginTop: 30 }} >
                        <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                            Send Request
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
        marginTop: 20
    },
    label: {
        color: '#6B7285',
        fontFamily: 'Manrope-Regular',
        fontSize: 15
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
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    openButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 15,
        marginTop: -10,
        fontFamily: 'Manrope-Regular'
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        fontFamily: 'Manrope-Bold',
        color: 'white'
    },
    inputContainer1: {
        borderColor: 'gray',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        borderRadius: 8,
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
        width: '70%'
    },
    input1: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center', width: '100%',
        color: '#333',
    },
});

export default WithdrawWallet

