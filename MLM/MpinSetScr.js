import Icon from "react-native-vector-icons/FontAwesome5"
import React, { useEffect, useRef, useState } from "react"
import { ImageBackground, View, TouchableOpacity, StyleSheet, Text, ToastAndroid, ActivityIndicator, Modal, TextInput } from "react-native"
import ReactNativePinView from "react-native-pin-view"
import LinearGradient from "react-native-linear-gradient"
import FastImage from "react-native-fast-image"
import { useFocusEffect } from '@react-navigation/native';
import AfterSubscribe from "./AfterSubscribe"
import axios from "axios"
import AfterSubscribeAbcd from "./AfterSubscribeAbcd"

const MLMpinSetScr = ({ navigation, profileData, userTeamDetails, isMLMPurchased, fetchMLMData }) => {
    const pinView = useRef(null)
    const [showRemoveButton, setShowRemoveButton] = useState(false)
    const [enteredPin, setEnteredPin] = useState("")
    const [showCompletedButton, setShowCompletedButton] = useState(false)

    const [isSetPin, setIssetPin] = useState(false)

    const [confirmPin, setConfirmPin] = useState("")

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    };

    const [loading, setLoading] = useState(true)

    const fetchMpinsetOrnot = async () => {
        try {
            const apiUrl = `https://api.brandingprofitable.com/mlm/mpincheck/v2/${profileData.mobileNumber}`
            const response = await axios.get(apiUrl)
            if (response.data.statusCode === 200) {
                setIssetPin(true)
            }
            setLoading(false)

        } catch (error) {
            showToastWithGravity("something went wrong...")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMpinsetOrnot();
    }, [])

    useEffect(() => {
        if (enteredPin.length > 0) {
            setShowRemoveButton(true)
        } else {
            setShowRemoveButton(false)
        }
        if (enteredPin.length === 4) {
            setShowCompletedButton(true)
        } else {
            setShowCompletedButton(false)
        }
    }, [enteredPin]);

    useEffect(() => {
        if (enteredPin.length == 4) {
            handlePin(enteredPin);
        }
    }, [enteredPin])

    const [isLoadPin, setIsLoadPin] = useState(false)

    const handlePin = async (pin) => {
        setIsLoadPin(true)
        if (isSetPin) {
            const apiUrl = `https://api.brandingprofitable.com/mlm/mpinmatch/${profileData.mobileNumber}/${pin}`;
            const response = await axios.get(apiUrl)
            if (response.data.statusCode == 200) {
                setIsCorrectPin(true);
            } else {
                showToastWithGravity("incorrect pin");
                pinView.current.clearAll();
            }
        } else {
            const apiUrl = `https://api.brandingprofitable.com/mlm/mpin/${profileData.mobileNumber}`;
            const response = await axios.put(apiUrl, {
                "mPin": pin
            })
            if (response.data.statusCode == 200) {
                showToastWithGravity("pin set successfully...")
                setIsCorrectPin(true)
            }
        }
        setIsLoadPin(false)
    }

    const handleChangePin = async () => {
        try {
            const requestData = {
                "oldMpin": parseInt(oldmpin,10),
                "newPin": parseInt(newmpin, 10)
            }
            const apiUrl = `https://api.brandingprofitable.com/mlm/mpinchange/${profileData.mobileNumber}`;

            const response = await axios.put(apiUrl, requestData);

            showToastWithGravity(response.data.message)
            if (response.data.statusCode == 200) {
                setForgotModal(false);
            }
            console.log(apiUrl, response.data, requestData)

        } catch (error) {
            console.log("error in handleChangePin:", error)
        }
    }

    const handleForgotPin = async () => {
        try {
            const requestData = {
                mobileNumber,
                "newPin": parseInt(newmpin,10)
            }
            // const apiUrl = `https://api.brandingprofitable.com/user/sendotp`;
            const apiUrl = `https://api.brandingprofitable.com/mlm/mpinreset/sendotp`;

            const response = await axios.post(apiUrl, requestData);

            showToastWithGravity(response.data.message);
            console.log(response.data);

            if (response.data.statusCode == 200) {
                setForgotModal2(false);
                setotpModal(true);
            }

        } catch (error) {
            console.log("error in handleChangePin:", error)
        }
    }

    const handleSendOTP = async () => {
        try {
            const requestData = {
                "mPinResetOTP": parseInt(otp,10),
                "newPin": parseInt(newmpin,10)
            }
            const apiUrl = `https://api.brandingprofitable.com/mlm/mpinreset/verifyotp/${userTeamDetails?.mobileNumber}`;

            const response = await axios.put(apiUrl, requestData);

            showToastWithGravity(response.data.message);

            if (response.data.statusCode == 200) {
                setotpModal(false)
            }else{
                setotp(null)
            }

        } catch (error) {
            console.log("error in handleChangePin:", error)
        }
    }

    // useEffect(()=>{
    //     console.log(otp.length)
    //     if (otp.length==4) {
    //         handleSendOTP();
    //     }
    // },[otp])

    const [isCorrectPin, setIsCorrectPin] = useState(false);
    const [forgotModal, setForgotModal] = useState(false)
    const [otpModal, setotpModal] = useState(false)
    const [oldmpin, setoldmpin] = useState(false)
    const [newmpin, setnewmpin] = useState(false)
    const [otp, setotp] = useState(false)
    const [mobileNumber, setmobileNumber] = useState("")

    useEffect(() => {
        setmobileNumber(profileData.mobileNumber)
    },[])

    const [forgotModal2, setForgotModal2] = useState(false)

    if (isCorrectPin && isMLMPurchased) {
        return (
            <AfterSubscribe profileData={profileData} userTeamDetails={userTeamDetails} fetchMLMData={fetchMLMData} />
        )
    }else if (isCorrectPin) {
        return (
            <AfterSubscribeAbcd profileData={profileData} userTeamDetails={userTeamDetails} fetchMLMData={fetchMLMData} />
        )
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <ActivityIndicator color={'white'} />
            </View>
        )
    }

    return (
        <LinearGradient
            colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* dropdown */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={forgotModal}
                onRequestClose={() => { setForgotModal(false) }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalMessage}>Change M-Pin</Text>

                        <TextInput
                            style={styles.input}
                            value={oldmpin}
                            onChangeText={(text) => setoldmpin(text)}
                            placeholder="Old M-pin"
                            keyboardType="number-pad"
                            maxLength={4}
                        />

                        <TextInput
                            style={styles.input}
                            value={newmpin}
                            onChangeText={(text) => setnewmpin(text)}
                            placeholder="New M-pin"
                            keyboardType="number-pad"
                            maxLength={4}
                        />

                        <TouchableOpacity style={styles.okButton} onPress={handleChangePin}>
                            <Text style={styles.okButtonText}>Change M-Pin</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* dropdown */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={forgotModal2}
                onRequestClose={() => { setForgotModal2(false) }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalMessage}>Forgot M-Pin</Text>

                        {/* <TextInput
                            style={styles.input}
                            value={mobileNumber}
                            placeholder="Mobile Number"
                            keyboardType="number-pad"
                            maxLength={10}
                        /> */}

                        <View style={[styles.input, { justifyContent: 'center' }]}>
                            <Text >{mobileNumber}</Text>
                        </View>

                        <TextInput
                            style={styles.input}
                            value={newmpin}
                            onChangeText={(text) => setnewmpin(text)}
                            placeholder="New M-pin"
                            keyboardType="number-pad"
                            maxLength={4}
                        />

                        <TouchableOpacity style={styles.okButton} onPress={handleForgotPin}>
                            <Text style={styles.okButtonText}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* dropdown */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={otpModal}
                onRequestClose={() => { setotpModal(false) }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalMessage}>Enter OTP for M-Pin</Text>

                        {/* <TextInput
                            style={styles.input}
                            value={mobileNumber}
                            placeholder="Mobile Number"
                            keyboardType="number-pad"
                            maxLength={10}
                        /> */}

                        <TextInput
                            style={styles.input}
                            value={otp}
                            placeholder="OTP"
                            keyboardType="number-pad"
                            onChangeText={(text) => setotp(text)}
                            maxLength={4}
                        />

                        <TouchableOpacity style={styles.okButton} onPress={handleSendOTP}>
                            <Text style={styles.okButtonText}>Submit OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.logoContainer}>
                    <FastImage source={require('../assets/B_Profitable_Logo.png')} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, { color: '#FF0000' }]} >
                        Branding
                        <Text style={styles.text}>
                            {" Profitable"}
                        </Text>
                    </Text>
                </View>
                <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
                    {
                        isSetPin ? (
                            <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center' }]}>
                                Enter Your M-Pin
                            </Text>
                        ) : (
                            <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center' }]}>
                                Create Your M-Pin
                            </Text>
                        )
                    }
                </View>
            </View>
            <ReactNativePinView
                inputSize={32}
                ref={pinView}
                pinLength={4}
                buttonSize={60}
                onValueChange={(value) => setEnteredPin(value)}
                buttonAreaStyle={{
                    marginTop: 24,
                }}
                inputAreaStyle={{
                    marginBottom: 24,
                }}
                inputViewEmptyStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#FFF",
                }}
                inputViewFilledStyle={{
                    backgroundColor: "#FFF",
                }}
                buttonViewStyle={{
                    borderWidth: 0,
                }}
                buttonTextStyle={{
                    color: "#FFF",
                    // Add custom text styles here
                }}
                onButtonPress={(key) => {
                    if (key === "custom_left") {
                        pinView.current.clear();
                    }
                    if (key === "custom_right") {
                        handlePin(enteredPin);
                    }
                }}
                customLeftButton={showRemoveButton ? <Icon name={"backspace"} size={36} color={"#FFF"} /> : undefined}
                customRightButton={showCompletedButton ? (isLoadPin?<ActivityIndicator color={'white'} size={'large'} />:<Icon name={"check"} size={36} color={"#FFF"} />) : undefined}
            />

            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 30, marginTop:-10 }}>
                <Text onPress={() => { setForgotModal(true) }} style={[styles.text, { fontSize: 16, marginTop: 20 }]}>Change M-pin?</Text>
                <Text onPress={() => { setForgotModal2(true) }} style={[styles.text, { fontSize: 16, marginTop: 20 }]}>Forgot M-pin?</Text>
            </View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 18
    },
    logoContainer: {
        height: 108,
        width: 108,
        backgroundColor: '#9FA2A6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 70,
        height: 78
    },
    textContainer: {
        paddingVertical: 10
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
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
        backgroundColor: '#FF0000',
        padding: 7,
        borderRadius: 5,
        marginTop: 20,
        paddingHorizontal: 20
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        width: 250,
        height: 40,
        borderRadius: 8,
        marginTop: 15,
        borderColor: 'lightgray',
        borderWidth: 1,
        backgroundColor: 'white',
        fontFamily: 'Manrope-Regular',
        fontSize: 15,
        color: 'black',
        paddingRight: 20,
        marginBottom: 10,
        paddingLeft: 15
    },
})

export default MLMpinSetScr

