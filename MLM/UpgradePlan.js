import PagerView from 'react-native-pager-view';
import CalculationPlanUpgrade from '../Home/CalculationsPlanUpgrade';
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import CryptoJS from "react-native-crypto-js";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Dimensions, Image, ActivityIndicator, Modal, Alert, ScrollView, ToastAndroid, Keyboard, PermissionsAndroid, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import CustomSuccessModal from '../Home/CustomAlertModal';
import { sha256 } from 'react-native-sha256';
import base64 from 'react-native-base64';
import PaymentLoadingModal from '../Home/PaymentLoading';
import moment from 'moment';
import RNRestart from 'react-native-restart';

const { width, height } = Dimensions.get('window');

const UpgradePlan = () => {
    const navigation = useNavigation();
    const [businessOrPersonal, setBusinessOrPersonal] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [userToken, setUserToken] = useState();
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [isSecondModalVisible, setSecondModalVisible] = useState(false);

    const [planIsMLM, setPlanIsMLM] = useState(true);
    const [planIdOfpurchasedPlan, setPlanIdOfpurchasedPlan] = useState(true);
    const [haveReferalId, setHaveReferalId] = useState(false)

    const [fakePlans, setFakePlans] = useState([]);

    const [isMLMPurchased, setIsMLMPurchased] = useState();
    const [userPurchasedPlan, setUserPurchased] = useState({});

    const [isPlanCalcDisplay, setIsPlanCalcDisplay] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState({});

    const [isPaymentDone, setIsPaymentDone] = useState(false);
    const [msg, setMsg] = useState('');

    const checkPurchasePlan = async (plan) => {
        try {
            setPaymentSuccess(false)
            setCheckPaymentLoader(true);

            const response = await axios.get(`https://api.brandingprofitable.com/payments/upgrate_check_purchase/v2/${profileData?.mobileNumber}`);

            console.log(response.data, `https://api.brandingprofitable.com/payments/upgrate_check_purchase/v2/${profileData?.mobileNumber}`)

            if (response.data.statusCode == 200) {
                const currentPlan = fakePlans.find(plan => plan.plan_id === response.data.plan_id);
                setSelectedPlan(currentPlan)

                if (currentPlan.plan_id == userPurchasedPlan.plan_id) {
                handleSelectPlan(plan);
                    return;
                }

                setTimeout(() => {
                    // setisPaymentModelOpen(false);
                    setSecondModalVisible(true);
                    setPlanIsMLM(response.data.is_mlm);
                    setPlanIdOfpurchasedPlan(response.data.plan_id);

                    const index = fakePlans.findIndex(plan => plan.plan_id === response.data.plan_id);
                    if (index != -1) {
                        setSelectedIndex(index)
                    }
                }, 300);

                

            } else {
                // showToastWithGravity("Please Purchase Plan...!");
                // // startPayment();
                // setisPaymentModelOpen(true)

                // startPayment(plan)
                handleSelectPlan(plan);
            }

            setCheckPaymentLoader(false);


        } catch (error) {
            setCheckPaymentLoader(false);

            console.log("error in handle pay here functon:", error);
        }

    }

    const scanData = () => {
        // Use regular expressions to extract referral ID, tree ID, and side
        const referIdRegex = /Sponser ID:\s*(\d+)/;
        const treeIdRegex = /Refer ID:\s*([^\n]+)/;
        const sideRegex = /Side:\s*(\w+)/;

        const referIdMatch = msg.match(referIdRegex);
        const treeIdMatch = msg.match(treeIdRegex);
        const sideMatch = msg.match(sideRegex);

        if (referIdMatch) {
            setReferId(referIdMatch[1]);
        }

        if (treeIdMatch) {

            let bytes = CryptoJS.AES.decrypt(treeIdMatch[1].toString(), 'mjgohel');
            let originalText = bytes.toString(CryptoJS.enc.Utf8);

            setTreeId(originalText);
        }

        if (sideMatch) {
            setSide(sideMatch[1]);
        }
    }

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
                setFakePlans(allPlans)
                const userPlan = allPlans.filter((plan) => plan?.plan_id == userPlanId)
                setUserPurchased(userPlan[0])

                setCheckPaymentLoader(false)

            } catch (error) {
                setCheckPaymentLoader(false)

                console.error("gettting error in check purchased plan", error)
            }
        }
    }


    const fetchDetailsUserPlan = async () => {
        try {
            setCheckPaymentLoader(true)
            if (profileData) {

                const response = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData.mobileNumber}`);
                const result = response.data;

                if (result.statusCode === 200) {

                    setIsMLMPurchased(result.is_mlm)
                    checkWhichPlanUserPurchased(result?.plan_id)

                } else {
                    setCheckPaymentLoader(false)

                }
            } else {
            }
        } catch (error) {
            setCheckPaymentLoader(false)

        }
    };

    useEffect(() => {
        if (profileData?.fullName) {
            fetchDetailsUserPlan();
        }
    }, [profileData]);

    // toast

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    };

    // modal input 

    const [referId, setReferId] = useState('')

    const [treeId, setTreeId] = useState('')

    // left or right 

    const [side, setSide] = useState('left')

    useEffect(() => {
        const fetchData = async () => {
            const businessOrPersonal = await AsyncStorage.getItem(
                'BusinessOrPersonl',
            );
            setBusinessOrPersonal(businessOrPersonal);
        };

        fetchData();
    });

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

    // modal 

    const [isModalVisible, setModalVisible] = useState(false);

    const handlePurchase = async () => {

        try {
            
        
        if (treeId == "" && referId == "" && haveReferalId) {
            return showToastWithGravity("Please fill all details")
        }

        setIsPlanCalcDisplay(false);
        setModalVisible(false);
        Keyboard.dismiss();

        // const token = await getAuthorization();

        // if (token) {
        setBtnLoadingPayment(true)
        // const validaations = await phpValidation(token);

        // if (validaations.status != 200) {
        //     showToastWithGravity(validaations.message);
        //     setBtnLoadingPayment(false);
        // }

        const requestData = {
            "user_id": profileData?._id,
            "transaction_id": transactionId,
            "status": "Done",
            "amount": parseInt(selectedPlan?.plan_price) - parseInt(userPurchasedPlan?.plan_price),
            "mobileNumber": profileData?.mobileNumber,
            "referredBy": referId,
            "treeId": treeId,
            "side": side,
            "plan_id": selectedPlan?.plan_id,
            "fullName": profileData?.fullName,
            is_direct_join: !haveReferalId,
            old_plan_id: userPurchasedPlan.plan_id
        }

        console.log(requestData, "requestData")

        // if (validaations.status == 200) {

        // let url = 'https://api.brandingprofitable.com/mlm/mlm_register';
        // axios
        //     .post(url, requestData, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     })
        //     .then((res) => {

        //         if (res.data.statusCode === 200) {
        //             setSecondModalVisible(false)
        // showToastWithGravity("Request Sent Successfully!")
        // // navigation.navigate('MlmScreenStack')
        // setTimeout(() => {
        //     fetchData();
        // }, 2000);
        //         } else if (res.data.statusCode === 201) {
        //             showToastWithGravity("Left side is Already Full!")
        //         } else if (res.data.statusCode === 202) {
        //             showToastWithGravity("Right side is Already Full!")
        //         } else if (res.data.statusCode === 203 || res.data.statusCode === 204) {
        //             showToastWithGravity("Tree Id or Referal Id not Found!")
        //         } else if (res.data.statusCode === 402) {
        //             showToastWithGravity("Left & Right Both Full, Choose other Tree Id")
        //         } else if (res.data.statusCode === 203) {
        //             showToastWithGravity("Invalid Referal Id")
        //         }

        //         setButtonLoader(false)
        //         // Add more condition checks for other status codes if needed
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             // Axios received an error response from the server

        //             // showToastWithGravity(err.response.data.message||err.response.error)

        //             if (err.response.status == 406) {
        //                 showToastWithGravity(err.response.data.error)
        //             } else {
        //                 showToastWithGravity(err.response.data.message)
        //             }

        //         } else {
        //             // Axios didn't receive a response from the server
        //         }
        //         setButtonLoader(false)
        //     });

        // showToastWithGravity("please proceed to payment")    
        // startPayment();

        // 

        const response = await axios.post("https://api.brandingprofitable.com/payments/test/upgrate", requestData);

        console.log(response.data, "response of handle purchase function")

        setCheckPaymentLoader(true)
        if (response.data.statusCode == 200) {
            // showToastWithGravity("Purchase successfully!")
            // navigation.navigate('MlmScreenStack')

            (() => {
                // fetchData();
                showToastWithGravity("Plan Purchased Successfully...")
                setCheckPaymentLoader(false);
                if (selectedPlan?.plan_id == "1709551589146") {
                    navigation.goBack();
                    RNRestart.Restart()
                } else {
                    navigation.navigate('StackHomeScreen')
                }
            }, 3000);

            setTimeout(() => {
                // fetchData();
                showToastWithGravity("Plan Purchased Successfully...")
                setCheckPaymentLoader(false);
                if (selectedPlan?.plan_id == "1709551589146") {
                    navigation.goBack();
                    RNRestart.Restart()
                } else {
                    navigation.navigate('StackHomeScreen')
                }

            }, 3000);
        } else {
            showToastWithGravity(response.data.message)
            setCheckPaymentLoader(false)
        }

        setBtnLoadingPayment(false)


        // } else {
        //     setButtonLoader(false)
        // }

        // }

    } catch (error) {
     console.log(error, "error in pgrade plan")       
    }

    }

    const submitRequestButton = async () => {

        // api to add payment history or payment done
    }

    const fetchDetails = async () => {
        try {
            if (profileData?.mobileNumber) {
                const response = await axios.get(
                    `https://api.brandingprofitable.com/wallet/paircount/${profileData?.mobileNumber}`
                );
                const result = response.data;
                if (response.data.statusCode == 200) {
                    navigation.navigate('MLMhome');
                }
                setUserTeamDetails(result);
            } else {
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchDetails);

        return () => unsubscribe();
    }, [navigation]);

    // payment gateway integration


    const [openWebView, setOpenWebView] = useState(false);
    const [webUrl, setWebUrl] = useState("https://www.google.com");

    const [btnLoadingPayment, setBtnLoadingPayment] = useState(false)
    const [loadingPayment, setLoadingPayment] = useState(false)

    const [isModalVisiblePayment, setModalVisiblePayment] = useState(false);
    const [isFailer, setIsFailer] = useState(true);

    const [message, setMessage] = useState('');
    const appId = "";
    const [sha256Text, setSha56Text] = useState('');
    const [sha256TextStatus, setSha56TextStatus] = useState('');

    const [string, setString] = useState('')
    const [stringStatus, setStringStatus] = useState('')

    const convertSHA = (string) => {
        //Encode SHA256
        sha256(string).then(hash => {
            setSha56Text(hash);
        });
    };
    useEffect(() => {
        convertSHA(string);
    }, [string]);

    const convertSHAStatus = (string) => {
        //Encode SHA256
        sha256(string).then(hash => {
            setSha56TextStatus(hash);
        });
    };
    useEffect(() => {
        convertSHAStatus(stringStatus);
    }, [stringStatus]);

    function generateTransactionId() {
        const min = 10000;
        const max = 99999;

        const number = Math.floor(min + Math.random() * max);
        return number
    }

    const [transactionId, setTransactionId] = useState(null)
    const merchantId = "BRANDINGONLINE"
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    const generateTransaction = () => {
        const transaction = "MT" + Date.now()
        if (transactionId == null) {
            setTransactionId(transaction)
        }
    }

    useEffect(() => {
        generateTransaction();
    }, [transactionId]);

    const handleTransactions = async (data) => {
        try {

            const status = data.success == true && data.data.state != 'PENDING' ? 'Done' : 'Fail';
            const TodayTimeDate = moment().format("YYYY-MM-DD HH:mm:ss");
            const requestData = {
                "user_id": profileData?._id,
                "transaction_id": transactionId,
                "status": status,
                "amount": parseInt(selectedPlan?.plan_price) - parseInt(userPurchasedPlan?.plan_price),
                "mobileNumber": profileData?.mobileNumber,
                "referredBy": referId,
                "treeId": treeId,
                "side": side,
                "fullName": profileData?.fullName,
                createdAt: TodayTimeDate,
                payment_date: TodayTimeDate,
                "plan_id": selectedPlan?.plan_id,
                data,
                is_upgrate: true
            }
            const response = await axios.post("https://api.brandingprofitable.com/payments/", requestData);

            console.log(response.data, "response data of handle trasaction")

            if (status == 'Done') {
                setTimeout(() => {
                    showToastWithGravity("Payment Done Successfully...");

                }, 1000);
            }

        } catch (error) {

        }
    }

    const [error, setError] = useState('');

    const checkStatus = async (planprice) => {
        try {

            setLoadingPayment(true)
            const merchantTransactionId = transactionId;
            const keyIndex = 1;
            const salt_key = '283787d8-5fc0-4f24-b01b-74c3ea6e1f36';
            const stringStatus = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
            setStringStatus(stringStatus);

            const checksum = sha256TextStatus + '###' + keyIndex;

            const options = {
                method: 'GET',
                url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                    'X-MERCHANT-ID': `${merchantId}`,
                },
            };

            const response = await axios.request(options);

            handleTransactions(response.data)

            if (response.data.success === true && response.data.data.state) {
                setError('')
                setIsFailer(false);
                setIsPlanCalcDisplay(false)
                setTimeout(() => {
                    setModalVisiblePayment(true);
                    setLoadingPayment(false);
                    setPaymentSuccess(true);

                    setTimeout(() => {
                        // submitRequestButton();

                        // store payment add
                        checkPurchasePlan()
                    }, 3000);
                }, 500);
            } else {
                setIsFailer(true);
                setIsPlanCalcDisplay(false)
                setTimeout(() => {
                    setLoadingPayment(false);
                    setModalVisiblePayment(true);
                }, 500);
            }
        } catch (error) {
            setTimeout(() => {
                setError("error" + Date.now())
            }, 2000);
            setLoadingPayment(false);
            setIsPlanCalcDisplay(false)

            // You might want to handle this error differently, such as 
        }
    };

    useEffect(() => {
        if (error != '' && !paymentSuccess) {
            checkStatus(selectedPlan?.plan_price)
        }
    }, [error]);

    const initialPayment = async () => {
        try {
            const result = await PhonePePaymentSDK.init('PRODUCTION', merchantId, appId, true);
            setMessage('Message: SDK Initialization -> ' + JSON.stringify(result));
            return true;
        } catch (error) {
            setMessage('Error: ' + error.message);
            Alert.alert('Troubleshooting..', 'Please try again later.');
            return false;
        }
    };

    const startPayment = async (plan) => {

        setBtnLoadingPayment(true)
        // MT78505900681881011
        const merchantTransactionId = "MT7850590068" + generateTransactionId()
        const merchantId = "BRANDINGONLINE"
        const data = {
            merchantId,
            merchantTransactionId: transactionId,
            merchantUserId: 'BRANDINGONLINE',
            amount: (parseInt(plan?.plan_price) - parseInt(userPurchasedPlan?.plan_price)) * 100,
            // redirectUrl: 'https://webhook.site/redirect-url',
            // redirectMode: 'REDIRECT',
            callbackUrl: 'https://webhook.site/callback-url',
            mobileNumber: '9999999999',
            paymentInstrument: {
                type: 'PAY_PAGE',
            },
        };


        // {
        //     "merchantId": "MERCHANTUAT",
        //     "merchantTransactionId": "MT7850590068188104",
        //     "merchantUserId": "MUID123",
        //     "amount": 10000,
        //     "callbackUrl": "https://webhook.site/callback-url",
        //     "mobileNumber": "9999999999",
        //     "paymentInstrument": {
        //       "type": "PAY_PAGE"
        //     }
        //   }

        const appId = null;

        const payload = JSON.stringify(data);
        const payloadMain = base64.encode(payload);
        const salt_key = '283787d8-5fc0-4f24-b01b-74c3ea6e1f36';

        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        setString(string)

        const checksum = sha256Text + '###' + keyIndex;

        const packageName = "com.brandingprofitable_0";
        const appSchema = null

        const initial = await initialPayment()

        if (initial) {
            PhonePePaymentSDK.init('PRODUCTION', merchantId, appId, true)
                .then(async (result) => {
                    setMessage('Message: SDK Initialisation ->' + JSON.stringify(result));

                    // start payment

                    // const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
                    // const headers = {
                    //     accept: 'application/json',
                    //     'Content-Type': 'application/json',
                    //     'X-VERIFY': checksum,
                    // };

                    // const response = await fetch(prod_URL, {
                    //     method: 'POST',
                    //     headers: headers,
                    //     body: JSON.stringify({ request: payloadMain }),
                    // });

                    // let intervalId;

                    // if (response.ok) {
                    //     const responseData = await response.json();

                    //     if (responseData.data) {
                    //         setWebUrl(responseData.data.instrumentResponse.redirectInfo.url);
                    //         setBtnLoadingPayment(false);
                    //         setOpenWebView(true);
                    //     }
                    // } else if (response.status == 417) {
                    //     const errorData = await response.json();
                    //     setBtnLoadingPayment(false);
                    //     showToastWithGravity("please try again..")
                    //     const transaction = "MT" + Date.now()
                    //     setTransactionId(transaction);
                    // } else if (response.status == 401) {
                    //     setBtnLoadingPayment(false);
                    //     showToastWithGravity("please try again..")

                    //     // intervalId = setInterval(() => {
                    //     //     // Update the counter every second
                    //     //     startPayment();
                    //     // }, 1000);
                    //     // return () => clearInterval(intervalId);
                    // }

                    // app signature
                    if (Platform.OS === 'android') {
                        PhonePePaymentSDK.getPackageSignatureForAndroid().then(packageSignture => {
                            //    ToastAndroid.show(packageSignture,ToastAndroid.LONG
                        })
                    }

                    // start payment 
                    PhonePePaymentSDK.startTransaction(payloadMain, checksum, packageName, appSchema).then(a => {


                        const jsonString = a.error
                        const result = jsonString != "" ? jsonString?.split('"code":"') : null

                        const codeValue = result?.length == 2 ? result[1]?.split('"')[0] : null
                        const res = a;

                        if (res.error == "" || codeValue == "INVALID_TRANSACTION_ID") {

                            const transaction = "MT" + Date.now();
                            setTransactionId(transaction);
                            showToastWithGravity("Please try again...");

                        } else if (res.status == "SUCCESS") {
                            checkStatus((parseInt(plan?.plan_price) - parseInt(userPurchasedPlan?.plan_price)));
                        } else {
                            showToastWithGravity("Please try again...");
                        }
                    })
                    setBtnLoadingPayment(false)

                })
                .catch(error => {
                    setMessage('error:' + error.message);
                    Alert.alert("troubleshooting..", "please try again later.");
                    setBtnLoadingPayment(false);
                });
        }
    }

    const handleNavigationStateChange = (navState) => {
        setLoadingPayment(true)
        const currentUrl = navState.url;
        if (currentUrl === "https://webhook.site/redirect-url") {
            setOpenWebView(false);
            checkStatus();
            // setIsFailer(false);
            // setTimeout(() => {
            //   setModalVisiblePayment(true);
            // }, 500);
        } else if (currentUrl === "https://webhook.site/callback-url") {
            setOpenWebView(false);
            setIsFailer(true);
            setTimeout(() => {
                setModalVisiblePayment(true);
            }, 500);
        } else {
            setIsFailer(false);
        }
    };


    const handleSelectPlan = (plan) => {
        // startPayment(plan)

        // if (plan?.plan_price == 3999) {
        //     showToastWithGravity("You can not Upgrade to 3999 Plan")
        //     return;
        // }

        if (plan?.plan_id === userPurchasedPlan?.plan_id || plan?.plan_price < userPurchasedPlan?.plan_price) {
            showToastWithGravity(`You can not Upgrade Plan - ${plan.plan_name}`);
            setCheckPaymentLoader(false)
            return;
        }

        setIsPlanCalcDisplay(true)
        setSelectedPlan(plan)
    }

    const [checkPaymentLoader, setCheckPaymentLoader] = useState(true)

    const Plan = ({ detailname, name, isBool, boolValue, header, feature, price, odd, bgcolor }) => {
        return (
            <LinearGradient
                colors={[header ? 'black' : bgcolor ? "rgba(0, 0, 0, 0.1);" : !odd ? '#fff8f7' : 'white', header ? 'red' : bgcolor ? "rgba(0, 0, 0, 0.1);" : !odd ? '#fff8f7' : 'white']} // Replace bgcolor with the desired color or keep it as fallback
                start={{ x: 0, y: 0 }} // Start from the top
                end={{ x: 0.5, y: 2 }} // End at the bottom
                style={{
                    height: header ? 90 : 50,
                    alignItems: 'center',
                    paddingHorizontal: 22,
                    justifyContent: 'center',
                    width: feature ? 'auto' : 'auto',
                }}
            >
                {
                    header ? (
                        <View style={{ paddingLeft: 5, width: '100%' }}>
                            {
                                feature ?
                                    <Text style={[styles.gridItemText, { textAlign: feature ? 'left' : 'center', }]}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Features</Text>
                                    </Text>
                                    :
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>{header}</Text>
                                        <Text style={[styles.gridItemText, { textAlign: feature ? 'left' : 'center', color: 'white' }]}>
                                            ₹ <Text style={{ fontWeight: 'bold', fontSize: 25, }}>{price}.00</Text>
                                        </Text>
                                        <Text style={{ fontSize: 13, color: 'white' }}>per year</Text>
                                    </View>
                            }
                        </View>
                    ) :
                        isBool === true ? (
                            <View style={{ height: 20, width: 20, backgroundColor: boolValue ? "black" : "red", justifyContent: 'center', alignItems: 'center', borderRadius: 40 }}>
                                <MaterialCommunityIcons name={!boolValue ? "close" : "check"} size={16} color={'white'} />
                            </View>
                        ) :
                            (
                                <View style={{ paddingLeft: 5, width: '100%', }}>

                                    <Text style={[styles.gridItemText, { fontWeight: header ? 'bold' : 'normal', textAlign: feature ? 'left' : 'center' }]}>
                                        {header || name}
                                    </Text>
                                </View>
                            )
                }
            </LinearGradient>
        )
    }

    if (openWebView) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'white', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => {
                        setOpenWebView(false)
                        setLoadingPayment(false)
                        setIsFailer(true)

                    }} style={{ padding: 15 }}>
                        <Text><MaterialCommunityIcons name="close" size={20} color={'black'} /></Text>
                    </TouchableOpacity>
                </View>
                <WebView
                    style={{ height }}
                    onNavigationStateChange={handleNavigationStateChange}
                    source={{ uri: webUrl }}
                />
            </SafeAreaView>
        )
    }

    return (
        <View style={{ padding: 0, flex: 1, backgroundColor: '#dedede' }}>

            <CalculationPlanUpgrade visible={isPlanCalcDisplay} closeModal={() => { startPayment(selectedPlan) }} isFailer={isFailer} selectedPlan={selectedPlan} currentPlan={userPurchasedPlan} onlyCloseModal={() => { setIsPlanCalcDisplay(false); setCheckPaymentLoader(false) }} />
            <CustomSuccessModal visible={isModalVisiblePayment} closeModal={() => { setModalVisiblePayment(false) }} isFailer={isFailer} />
            <PaymentLoadingModal visible={loadingPayment || checkPaymentLoader} closeModal={() => { navigation.goBack(); }} content={loadingPayment ? 'Transaction Status checking...' : 'loading...'} />


            <View style={[styles.modalContent, { height: '100%' }]} keyboardShouldPersistTaps={'always'}>


                <ScrollView >
                    <View style={{ padding: 0, flexDirection: 'row' }}>

                        {/* plan features */}
                        <View style={{ width: 'auto', borderWidth: 1, borderColor: 'white', borderRightColor: 'lightgrey', paddingVertical: 0, backgroundColor: 'white', elevation: 15, zIndex: 2 }}>
                            <Plan name={'Business Members'} header={'Features'} feature={true} />


                            <Plan odd={false} name={'Festival Image'} feature={true} />
                            <Plan odd={true} name={'Festival Video'} feature={true} />
                            <Plan odd={false} name={'Category Image'} feature={true} />
                            <Plan odd={true} name={'Category Video'} feature={true} />
                            <Plan odd={false} name={'Business Image'} feature={true} />
                            <Plan odd={true} name={'Custom Categories'} feature={true} />
                            <Plan odd={false} name={'Trending Image'} feature={true} />
                            <Plan odd={true} name={'A4 Content'} feature={true} />

                            <Plan odd={false} name={'Logo'} feature={true} />
                            <Plan odd={true} name={'Remove Background'} feature={true} />
                            <Plan odd={false} name={'Refer and Earn'} feature={true} />

                            <Plan odd={true} name={'Business Member'} feature={true} />
                            <Plan odd={true} name={'Frames'} feature={true} />
                            <Plan odd={false} name={'Request Frames'} feature={true} />
                            <Plan odd={true} name={'E Visiting Card'} feature={true} />
                        </View>

                        <ScrollView horizontal={true} style={{ height: '100%', flexDirection: 'row', width: '100%' }}>

                            {
                                fakePlans.map((plan, index) => {

                                    return (

                                        <TouchableOpacity activeOpacity={1} style={{ width: 'auto', backgroundColor: index == selectedIndex ? 'white' : 'white', borderWidth: 1, borderColor: index == selectedIndex ? 'lightgrey' : 'lightgrey', paddingVertical: 0, opacity: index == selectedIndex || userPurchasedPlan.plan_price > plan.plan_price || userPurchasedPlan.plan_id == plan.plan_id ? 1 : 0.7, elevation: index == selectedIndex ? 15 : 0, position: 'relative', overflow: 'hidden' }} key={index} onPress={() => { setSelectedIndex(index) }}>

                                            <Plan bgcolor={index == selectedIndex ? true : false} detailname={'Festival Image'} price={plan.plan_price} name={plan.festival_image} isBool={false} boolValue={plan.festival_image} header={plan.plan_name} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Festival Image'} name={plan.festival_image} isBool={true} boolValue={plan.festival_image} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={false} detailname={'Festival Video'} name={plan.festival_video} isBool={true} boolValue={plan.festival_video} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Category Image'} name={plan.category_image} isBool={true} boolValue={plan.category_image} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={false} detailname={'Category Video'} name={plan.category_video} isBool={true} boolValue={plan.category_video} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Business Image'} name={plan.business_image} isBool={true} boolValue={plan.business_image} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={false} detailname={'Custom Categories'} name={plan.custome_categories} isBool={true} boolValue={plan.custome_categories} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Trending Image'} name={plan.trnding_image} isBool={true} boolValue={plan.trnding_image} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={false} detailname={'A4 Image Video'} name={plan.a4_image_video} isBool={true} boolValue={plan.a4_image_video} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Logo'} name={plan.logo} isBool={true} boolValue={plan.logo} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={false} detailname={'Remove Background'} name={plan.remove_bg} isBool={true} boolValue={plan.remove_bg} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Refer and Earn'} name={plan.refer_and_earn} isBool={true} boolValue={plan.refer_and_earn} />

                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={false} detailname={'Business Members'} name={plan.business_member} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Default Frames'} name={plan.default_frame} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={false} detailname={'Custom Frames'} name={plan.custome_frame} />
                                            <Plan bgcolor={index == selectedIndex ? true : false} odd={true} detailname={'Visiting Card Credits'} name={plan.visiting_card} />

                                            {
                                                userPurchasedPlan.plan_id == plan.plan_id &&
                                                <View style={{ paddingVertical: 4, paddingHorizontal: 10, elevation: 5, backgroundColor: 'red', borderWidth: 1, borderColor: 'black', position: 'absolute', transform: [{ rotate: '45deg' }], width: 100, alignItems: 'center', top: plan.plan_price.toString().length > 2 ? 10 : 5, right: plan.plan_price.toString().length > 2 ? -30 : -35, opacity: index == selectedIndex || userPurchasedPlan.plan_price < plan.plan_price || userPurchasedPlan.plan_id == plan.plan_id ? 1 : 0.7, zIndex: 10 }}>
                                                    <Text style={{ fontSize: plan.plan_price.toString().length > 2 ? 10 : 7, color: 'white' }}>
                                                        Current Plan
                                                    </Text>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }

                        </ScrollView>
                    </View>
                </ScrollView>

                {/* second modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isSecondModalVisible}
                >
                    <ScrollView style={[styles.modalContent, { height: planIsMLM && haveReferalId ? '90%' : !haveReferalId ? '50%' : '60%', borderRadius: 20 }]} keyboardShouldPersistTaps={'always'}>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: 'auto' }}>

                            <View style={{ marginTop: 30, marginBottom: 30, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "90%", marginTop: 15, marginBottom: 20 }}>


                                    {/* 2 */}
                                    <TouchableOpacity
                                        onPress={() => { setHaveReferalId(false) }}
                                        style={{
                                            width: '45%',
                                            height: 60,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: haveReferalId ? 1 : 0,
                                            borderColor: 'lightgray',
                                            backgroundColor: !haveReferalId ? 'red' : null,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: haveReferalId ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 14 }}>Direct Join</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* 1 */}
                                    <TouchableOpacity
                                        onPress={() => { setHaveReferalId(true) }}
                                        style={{
                                            width: '45%',
                                            height: 60,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: !haveReferalId ? 1 : 0,
                                            borderColor: 'lightgray',
                                            backgroundColor: haveReferalId ? 'red' : null,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: !haveReferalId ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 14 }}>Join with Sponser ID</Text>
                                        </View>
                                    </TouchableOpacity>


                                </View>

                                {
                                    planIsMLM && haveReferalId &&
                                    <>

                                        <View style={[styles.labelContainer,]}>
                                            <Text style={styles.label}>
                                                Paste Your Message
                                            </Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor={'gray'}
                                                placeholder="Message"
                                                value={msg}
                                                onChangeText={setMsg}
                                                autoCapitalize="none"
                                            />
                                        </View>


                                        <TouchableOpacity style={{ backgroundColor: '#E31E25', borderRadius: 8, margin: 20, width: "90%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, }} onPress={scanData}>
                                            <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                                                Verify Message
                                            </Text>
                                        </TouchableOpacity>

                                        <View style={[styles.labelContainer,]}>
                                            <Text style={styles.label}>
                                                Enter Sponser Id
                                            </Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor={'gray'}
                                                placeholder="Sponser Id"
                                                value={referId}
                                                onChangeText={setReferId}
                                                autoCapitalize="none"
                                            />
                                        </View>

                                        <View style={[styles.labelContainer,]}>
                                            <Text style={styles.label}>
                                                Enter Referal Id
                                            </Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor={'gray'}
                                                placeholder="Refer Id"
                                                value={treeId}
                                                onChangeText={setTreeId}
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </>
                                }

                                {haveReferalId && !planIsMLM && <>
                                    <View style={[styles.labelContainer,]}>
                                        <Text style={styles.label}>
                                            Enter Sponser Id
                                        </Text>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholderTextColor={'gray'}
                                            placeholder="Sponser Id"
                                            value={treeId}
                                            onChangeText={setTreeId}
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </>
                                }

                                {
                                    planIsMLM && haveReferalId &&
                                    <>
                                        <View style={[styles.labelContainer,]}>
                                            <Text style={styles.label}>
                                                Select Side
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "90%", marginTop: 15, marginBottom: 20 }}>
                                            {/* 1 */}
                                            <TouchableOpacity
                                                onPress={() => { setSide('left') }}
                                                style={{
                                                    width: '45%',
                                                    height: 60,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderWidth: side === 'right' ? 1 : 0,
                                                    borderColor: 'lightgray',
                                                    backgroundColor: side === 'left' ? 'red' : null,
                                                    borderRadius: 10,
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                                    <View style={{ width: 30, height: 30, borderRadius: 20, alignItems: "center", justifyContent: 'center', backgroundColor: side === 'right' ? 'gray' : 'white', }}>
                                                        <Text style={{ color: side !== 'right' ? 'red' : 'white', fontFamily: 'Manrope-Bold', fontSize: 19 }}>L</Text>
                                                    </View>
                                                    <Text style={{ color: side === 'right' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 14 }}>Left</Text>
                                                </View>
                                            </TouchableOpacity>

                                            {/* 2 */}
                                            <TouchableOpacity
                                                onPress={() => { setSide('right') }}
                                                style={{
                                                    width: '45%',
                                                    height: 60,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderWidth: side === 'left' ? 1 : 0,
                                                    borderColor: 'lightgray',
                                                    backgroundColor: side === 'right' ? 'red' : null,
                                                    borderRadius: 10,
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                                    <View style={{ width: 30, height: 30, borderRadius: 20, alignItems: "center", justifyContent: 'center', backgroundColor: side === 'left' ? 'red' : 'white', }}>
                                                        <Text style={{ color: side !== 'left' ? 'red' : 'white', fontFamily: 'Manrope-Bold', fontSize: 19 }}>R</Text>
                                                    </View>
                                                    <Text style={{ color: side === 'left' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 14 }}>Right</Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    </>
                                }


                                <TouchableOpacity style={{ backgroundColor: '#E31E25', borderTopRightRadius: 8, borderTopLeftRadius: 9, margin: 20, width: "90%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, }} onPress={handlePurchase}>
                                    {
                                        btnLoadingPayment ? (
                                            <ActivityIndicator color={'white'} size={'small'} />
                                        ) : (
                                            <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                                                Submit Request
                                            </Text>
                                        )
                                    }

                                </TouchableOpacity>

                            </View>

                            <TouchableOpacity onPress={() => { setSecondModalVisible(false) }} style={styles.modalCloseButton}>
                                <Text><Icon name="close" size={27} color={'gray'} /></Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>


                <TouchableOpacity
                    onPress={() => {
                        // handleSelectPlan(fakePlans[selectedIndex]);
                        checkPurchasePlan(fakePlans[selectedIndex]);
                    }}
                >
                    <LinearGradient
                        colors={['black', 'red']} // Replace bgcolor with the desired color or keep it as fallback
                        start={{ x: 0, y: 0 }} // Start from the top
                        end={{ x: 0.1, y: 3 }} // End at the bottom
                        style={{
                            backgroundColor: '#ed6861',
                            borderRadius: 8,
                            margin: 0,
                            width: "90%",
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 5,
                            alignSelf: 'center',
                            justifySelf: 'flex-end',
                            marginBottom: 20
                        }}
                    >


                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 15 }}>
                            {"Subscribe Now"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

        </View >
    )
}

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
    //modal
    // Style for the modal content
    modalContent: {
        backgroundColor: 'white',
        padding: 0,
        position: 'absolute',
        bottom: 0,
        width,
        borderRadius: 0
    },
    scrollView: {
        alignSelf: 'stretch',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 'auto',
        backgroundColor: 'white',
        zIndex: 100
    },
    modalContainer: {
        width: '100%',
        height: 'auto',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 10,
        right: 20

    },
    scrollViewContent: {
        padding: 10,
        marginTop: 40,
        marginBottom: 200,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        fontSize: 15,
        color: '#333',
        fontFamily: 'Manrope-Regular',

    },
    inputContainer: {
        width: '90%',
        marginTop: 20,
    },
    labelContainer: {
        width: '90%',
        alignItems: 'flex-start'
    },
    label: {
        color: '#6B7285',
        fontFamily: 'Manrope-Regular',
        fontSize: 15
    },
    gridItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    subscriptionContainer: {
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '90%',
        backgroundColor: 'white',
        height: '85%',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative'
    },
    planName: {
        fontSize: 30,
        fontFamily: 'Manrope-Bold',
        marginBottom: 5,
        color: 'white',
    },
    planPrice: {
        fontFamily: 'Manrope-Bold',
        fontSize: 45,
        alignSelf: 'center'
    },
    gridContainer: {
        marginTop: 20,
        paddingTop: 15,
        borderTopColor: 'grey',
        borderTopWidth: 1
    },
    gridItemText: {
        fontSize: 16,
        marginBottom: 10,
    },
})

export default UpgradePlan