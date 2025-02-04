import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import jwtDecode from 'jwt-decode';
const { width } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNRestart from 'react-native-restart';
import OTPInputView from '@twotalltotems/react-native-otp-input'

const OTPScreen = ({ route, navigation }) => {
    let otpInput = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [value, setValue] = useState('');

    const retrieveData = async () => {
        try {
            const data = await AsyncStorage.getItem('isLoggedIn');
            setIsLoggedIn(data === 'true');
        } catch (error) {
            console.log('Error retrieving login status:', error);
        }
    };

    retrieveData();

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate('StackMain')
        }
    })

    const { phone } = route.params
    const [isLoader, setIsLoader] = useState(false)

    console.log(isLoader, "isLoader")

    const [otp, setOTP] = useState(''); // An array to store OTP digits
    const [timer, setTimer] = useState(60); // Timer in seconds (30 minutes)
    const [showResend, setShowResend] = useState(false); // Whether to show the Resend button
    const otpInputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]; // Refs for OTP input fields

    // Function to handle OTP digit input
    const handleOTPDigitInput = (index, value) => {
        if (value.length === 1) {
            otp[index] = value;
            setOTP([...otp]);

            // Move to the next input field or submit OTP
            if (index < 3) {
                otpInputRefs[index + 1].current.focus();
            }
        } else if (value.length === 0) {
            // If the user deletes a digit, clear the value and move to the previous input field
            otp[index] = '';
            setOTP([...otp]);

            if (index > 0) {
                otpInputRefs[index - 1].current.focus();
            }
        } else if (value.length === 4) {
            // If the user pastes a 4-digit OTP, distribute it across input fields
            for (let i = 0; i < 4; i++) {
                otp[i] = value[i];
                if (otpInputRefs[i + 1] && otpInputRefs[i + 1].current) {
                    otpInputRefs[i + 1].current.focus();
                }
            }
            setOTP([...otp]);
        }
    };


    // fcm token 

    const [fcmToken, setFcmToken] = useState('')

    const getfcmToken = async () => {
        try {
            const data = await AsyncStorage.getItem('fcmtoken');
            setFcmToken(data);
        } catch (error) {
            console.log('Error retrieving fcmtoken:', error);
        }
    };

    useEffect(() => {
        getfcmToken();
    })

    const handleSuccessLogin = async (response) => {
        // Alert.alert("Login Successfully...");
        const dataAfterDecode = jwtDecode(response)

        showToastWithGravity("Login Success!")

        // console.log(dataAfterDecode)

        // fDSWWvV4StKVg9EUaNd88N:APA91bEGn6KBIqH5FlRrjKB7R3wFHxpiDwr5tjN0ha5OQVTAXbq4KuuxgEc0SyBsqHIi86MeBmfmc42sRvowIu5_U9jvlFklPEeo6MIcKv_oQXgTylyJj2GslPDg8tRzuPwlT8E3Fr--

        console.log(response)


        const apiUrl = `https://api.brandingprofitable.com/user/token/${dataAfterDecode._id}`
        const requestData = {
            token: fcmToken
        }

        try {
            const response = await axios.put(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }

        const saveProfiledatatoLocal = JSON.stringify(dataAfterDecode);
        if (dataAfterDecode.isPersonal) {
            await AsyncStorage.setItem('BusinessOrPersonl', 'personal')
        } else {
            await AsyncStorage.setItem('BusinessOrPersonl', 'business')
        }
        try {

            await AsyncStorage.setItem("isLoggedIn", "true");
            await AsyncStorage.setItem("profileData", saveProfiledatatoLocal);
            console.log("sacing this data into local storage..", saveProfiledatatoLocal)
            await AsyncStorage.setItem("userToken", response);

            RNRestart.Restart()
        } catch (error) {
            console.log('Error saving profile data:', error);
        }
    }

    const sendDatatoVerifyOtp = async () => {
        // if (otp.length === 4) {

            const apiUrl = 'https://api.brandingprofitable.com/user/sendotp';

            const requestData = {
                mobileNumber: phone,
            };

            try {
                const response = await axios.post(apiUrl, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.statusCode === 200) {
                    showToastWithGravity(response.data.message);
                    setOTP(['', '', '', ''])
                } else {
                    showToastWithGravity("OTP failed")
                }
            } catch (error) {
                console.error("error in sendDatatoVerifyOtp", error);
            } finally {
                setIsLoader(false);
            }

            console.log('Auto-Submitting OTP:', otp);
            // You can trigger the OTP submission logic here
        // }
        setTimer(60);
        setShowResend(false);
    }

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            0
        )
    }


    // Check if all OTP digits are filled, and submit OTP
    useEffect(() => {
        // const filledDigits = otp.filter((digit) => digit !== '');
        const sendDatatoVerifyOtpFromFunction = async () => {
            if (otp.length === 4) {

                setIsLoader(true)

                const enteredOTP = otp;

                const apiUrl = 'https://api.brandingprofitable.com/user/verify';

                const requestData = {
                    mobileNumber: phone,
                    "otp": enteredOTP
                };

                console.log({
                    mobileNumber: phone,
                    "otp": enteredOTP
                })

                try {
                    const response = await axios.post(apiUrl, requestData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log(response.data)

                    if (response.data.statusCode === 200) {
                        console.log(response.data)

                        handleSuccessLogin(response.data.token);
                        if (response.data.token) {
                            await AsyncStorage.setItem('userToken', response.data.token.toString())
                        }

                    } else {
                        showToastWithGravity("OTP failed")
                    }
                } catch (error) {
                    console.error("error in useeffect - ", error);
                } finally {
                    setIsLoader(false);
                }

                console.log('Auto-Submitting OTP:', enteredOTP);
                // You can trigger the OTP submission logic here
                setIsLoader(false)
            }
        }

        sendDatatoVerifyOtpFromFunction()
    }, [otp]);

    // Start the timer when the component mounts
    useEffect(() => {
        const countdownInterval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            } else {
                clearInterval(countdownInterval);
                setShowResend(true);
            }
        }, 1000);

        return () => {
            clearInterval(countdownInterval);
        };
    }, [timer]);

    if (isLoader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'space-between' }} >
            <View style={{ height: '60%', justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                <View>
                    <Image source={require('../assets/OTPimage.png')} style={{ height: width - 190, width: width - 190 }} />
                </View>

                <View style={{ marginVertical: 20 }}>
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 24, color: 'white' }}>
                        Verification
                    </Text>
                </View>

                <View style={{ width: '74%', }}>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 16, color: 'white', textAlign: 'center' }}>
                        Enter 4 digit number that sent to The number on your Mobile
                    </Text>
                </View>

            </View>
            <View style={{ backgroundColor: 'white', borderTopRightRadius: 20, borderTopLeftRadius: 20, height: '40%', }}>


                <View
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View>

                    </View>
                    <View style={styles.otpInputContainer}>
                        {/* {otp.map((digit, index) => (
                            <View key={index} style={styles.inputBox}>
                                <TextInput
                                    ref={otpInputRefs[index]}
                                    style={styles.otpInput}
                                    value={digit}
                                    onChangeText={(value) => handleOTPDigitInput(index, value)}
                                    keyboardType="numeric"
                                    onPaste={(event) => console.log(event)}
                                    maxLength={1}
                                    placeholderTextColor={'gray'}
                                />
                            </View>
                        ))} */}

                        <OTPInputView
                            style={{ width: '60%', height: 100, zIndex: 10 }}
                            pinCount={4}
                            // code={otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                            // onCodeChanged = {code => { setOTP(code)}}
                            // autoFocusOnLoad
                            autoFocusOnLoad={false}
                            codeInputFieldStyle={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10, height: 50, width: 50, color:'black' }}
                            codeInputHighlightStyle={{borderColor: 'black', borderWidth: 1, borderRadius: 10, height: 50, width: 50}}
                            onCodeFilled={(code => {
                                setOTP(code)
                                // console.log(code)
                            })}
                            editable
                            keyboardAppearance="default"
                            keyboardType="number-pad"
                        />

                    </View>
                    <Text onPress={() => { navigation.goBack(); }} style={[styles.timerText, { color: 'darkgray', fontFamily: 'Manrope-Bold' }]}>Edit Phone Number?</Text>
                    {showResend ? (
                        <TouchableOpacity style={styles.resendButton} onPress={sendDatatoVerifyOtp}>
                            <Text style={styles.resendButtonText}>Resend</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.timerText}>Resend code in {formatTimer(timer)}</Text>
                    )}
                    <View>

                    </View>
                </View>
            </View>

        </LinearGradient>
    );
};

// Function to format the timer as MM:SS
const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#E31E25',
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        backgroundColor: 'white',
        borderRadius: 5,
        width: 55,
        height: 55,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        borderColor: 'lightgray',
        borderWidth: 1,
        fontFamily: 'Manrope-Regular'

    },
    otpInput: {
        width: '100%',
        height: '110%',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Manrope-Regular',
        color: 'gray'
    },
    timerText: {
        fontSize: 14,
        color: '#E31E25',
        marginTop: 0,
        fontFamily: 'Manrope-Regular',
    },
    resendButton: {
        backgroundColor: '#E31E25',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    resendButtonText: {
        color: 'white',
        fontFamily: 'Manrope-Regular',
        fontSize: 16,
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
});

export default OTPScreen;
