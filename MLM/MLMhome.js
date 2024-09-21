import PagerView from 'react-native-pager-view';

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
import PlanCards from './PlanCards';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const MLMhome = ({ fetchData }) => {
    const navigation = useNavigation();
    const [businessOrPersonal, setBusinessOrPersonal] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [userToken, setUserToken] = useState();
    const [selectedIndex, setSelectedIndex] = useState(1);

    const [planIsMLM, setPlanIsMLM] = useState(true);
    const [planIdOfpurchasedPlan, setPlanIdOfpurchasedPlan] = useState(true);

    const [fakePlans, setFakePlans] = useState([])

    // const fakePlans = [
    //     {
    //         plan_id: "1",
    //         plan_name: "A",
    //         plan_price: 10,
    //         business_member: 1,
    //         visiting_card: 100,
    //         percentage: 10,
    //         default_frame: 1,
    //         custome_frame: 1,
    //         festival_image: true,
    //         festival_video: false,
    //         logo: true,
    //         category_image: true,
    //         category_video: false,
    //         business_image: true,
    //         custome_categories: false,
    //         trnding_image: true,
    //         a4_image_video: false,
    //         remove_bg: true,
    //         refer_and_earn: false,
    //         createdAt: "2023-10-21 14:21:40",
    //         updatedAt: "2023-10-21 14:21:40",
    //     },
    //     {
    //         plan_id: "2",
    //         plan_name: "B",
    //         plan_price: 20,
    //         business_member: 2,
    //         visiting_card: 200,
    //         percentage: 20,
    //         default_frame: 2,
    //         custome_frame: 2,
    //         festival_image: false,
    //         festival_video: true,
    //         logo: false,
    //         category_image: false,
    //         category_video: true,
    //         business_image: false,
    //         custome_categories: true,
    //         trnding_image: false,
    //         a4_image_video: true,
    //         remove_bg: false,
    //         refer_and_earn: true,
    //         createdAt: "2023-10-21 14:21:40",
    //         updatedAt: "2023-10-21 14:21:40",
    //     },
    //     {
    //         plan_id: "3",
    //         plan_name: "C",
    //         plan_price: 30,
    //         business_member: 3,
    //         visiting_card: 300,
    //         percentage: 30,
    //         default_frame: 3,
    //         custome_frame: 3,
    //         festival_image: true,
    //         festival_video: true,
    //         logo: true,
    //         category_image: true,
    //         category_video: true,
    //         business_image: true,
    //         custome_categories: true,
    //         trnding_image: true,
    //         a4_image_video: true,
    //         remove_bg: true,
    //         refer_and_earn: true,
    //         createdAt: "2023-10-21 14:21:40",
    //         updatedAt: "2023-10-21 14:21:40",
    //     },
    //     {
    //         plan_id: "4",
    //         plan_name: "D",
    //         plan_price: 40,
    //         business_member: 4,
    //         visiting_card: 400,
    //         percentage: 40,
    //         default_frame: 4,
    //         custome_frame: 4,
    //         festival_image: false,
    //         festival_video: false,
    //         logo: false,
    //         category_image: false,
    //         category_video: false,
    //         business_image: false,
    //         custome_categories: false,
    //         trnding_image: false,
    //         a4_image_video: false,
    //         remove_bg: false,
    //         refer_and_earn: false,
    //         createdAt: "2023-10-21 14:21:40",
    //         updatedAt: "2023-10-21 14:21:40",
    //     },
    // ];

    const getAllPlans = async () => {
        try {
            const response = await axios.get("https://api.brandingprofitable.com/plan/plan");
            // console.log(response.data.data)
            setFakePlans(response.data.data);
            setCheckPaymentLoader(false)
        } catch (error) {
            console.error("getting error in getting plans:", getAllPlans)
        }
    }

    useEffect(() => {
        getAllPlans()
    }, [])

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

    const [msg, setMsg] = useState('');
    const [treeId, setTreeId] = useState('')

    // left or right 

    const [side, setSide] = useState('left')
    const [haveReferalId, setHaveReferalId] = useState(false)

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

    // modal 

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalOfQr, setModalOfQr] = useState(false);
    const [isSecondModalVisible, setSecondModalVisible] = useState(false);
    const [isPaymentModelOpen, setisPaymentModelOpen] = useState(false);
    const [fileUri, setFileUri] = useState(null);


    const [errorModal, setErrorModal] = useState(false);

    // Toggle the first modal visibility
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Toggle the second modal visibility
    const toggleSecondModal = () => {
        setSecondModalVisible(!isSecondModalVisible);
    };

    const transactionImage = fileUri;
    const currentDate = new Date();
    const transactionDate = currentDate.toLocaleDateString();
    const transactionTime = currentDate.toLocaleTimeString();

    const joinNowButton = async () => {
        if (!fileUri) {
            Alert.alert('Please add payment screenshot!');
        } else {

            setModalVisible(false);
            setSecondModalVisible(true);

            try {
                const response = await axios.post(
                    'https://api.brandingprofitable.com/payment/payment',
                    {
                        transactionImage: fileUri,
                        transactionDate,
                        transactionTime,
                        fullName: profileData?.fullName,
                        mobileNumber: profileData?.mobileNumber,
                        email: profileData?.email,
                        adhaar: profileData?.adhaar
                    },
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${userToken}`,
                    //     },
                    // }
                );

            } catch (error) {
                console.error('Error sending payment data:', error);
            }
        }
    };

    const requestData = {
        mobileNumber: profileData?.mobileNumber,
        side: side,
        treeId: treeId,
        referredBy: referId,
        fullName: profileData?.fullName,
        image: fileUri
    }

    async function getAuthorization() {
        try {
            const phpApiUrl = "https://uat.kubertree.com/MLM/MLM/get_auth.php";
            const [phpApiResponse] = await Promise.all([
                axios.get(phpApiUrl),
            ]);

            if (phpApiResponse.status === 200) {
                const authorizationData = phpApiResponse.data.Authorization;
                return authorizationData[0].time;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    async function phpValidation(token) {
        try {
            const phpApiUrl = `https://uat.kubertree.com/MLM/MLM/validation.php?number=${requestData.mobileNumber}&reference=${requestData.treeId}&parent_id=${requestData.referredBy}&side=${requestData.side}&fullname=${requestData.fullName}`;
            const [phpApiResponse] = await Promise.all([
                axios.get(phpApiUrl, {
                    headers: {
                        Authorization: token,
                    },

                }),
            ]);

            console.log(phpApiResponse.data)

            return phpApiResponse.data;
        } catch (error) {
            console.error("Error while fetching Authorization:", error);
            return null;
        }
    }

    const [buttonLoader, setButtonLoader] = useState(false)

    // {
    //     "user_id": "654c878572f91a76bc5c099d",
    //     "payment_id": "1704525628812wf6joba5654010832",
    //     "transaction_id": "456",
    //     "status": "Done",
    //     "amount": 3999,
    //     "mobileNumber": 9106636362,
    //     "referredBy": "9106636361",
    //     "treeId": "9106636361",
    //     "side": "right",
    //     "fullName": "Shivam Shukla"
    //   }

    const submitRequestButton = async () => {

        if (treeId == "" && referId == "" && haveReferalId) {
            return showToastWithGravity("Please fill all details")
        }
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
            "amount": fakePlans[selectedIndex].plan_price,
            "mobileNumber": profileData?.mobileNumber,
            "referredBy": referId,
            "treeId": treeId,
            "side": side,
            "plan_id": planIdOfpurchasedPlan,
            "fullName": profileData?.fullName,
            is_direct_join: !haveReferalId
        }

        console.log(requestData, "requestData")

        // console.log(requestData)

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
        //             console.log('Network Error:', err.message);
        //         }
        //         setButtonLoader(false)
        //     });

        // showToastWithGravity("please proceed to payment")    
        // startPayment();

        // https://brandingprofitable-v2-6d42f87e2fd2.herokuapp.com

        const response = await axios.post("https://api.brandingprofitable.com/payments/test", requestData);

        console.log(response.data, "response data test purchase")

        setCheckPaymentLoader(true);
        // console.log("response of purchase api:", response.data, requestData)

        if (response.data.statusCode == 203) {
            showToastWithGravity("Enter valid referal id..!")
            setCheckPaymentLoader(false)

        } else if (response.data.statusCode == 200) {
            showToastWithGravity("Purchase subscription successfully!")
            // navigation.navigate('MlmScreenStack')

            // (() => {
            //     alert("payment success")
            //     fetchData();
            //     setCheckPaymentLoader(false)
            // }, 3000);

            fetchData();
            setTimeout(() => {
                setSecondModalVisible(false)
                setCheckPaymentLoader(false);
            }, 2000);
        } else {
            showToastWithGravity(response.data.message)
            setCheckPaymentLoader(false)
        }

        setBtnLoadingPayment(false)


        // } else {
        //     setButtonLoader(false)
        // }

        // }

    }

    const [imageLoader, setImageLoader] = useState(false)

    const handleImagePicker = () => {
        ImageCropPicker.openPicker({
            width: 800,
            height: 1400,
            cropping: true,
            includeBase64: true, // Optional, set it to true if you want to get the image as base64-encoded string
        })
            .then((response) => {
                setImageLoader(true);
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
                        setImageLoader(false)
                        // const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
                        const imagePath = `https://cdn.brandingprofitable.com/${res?.data?.iamge_path}`; // Correct the key to "iamge_path"
                        setFileUri(imagePath);
                    })
                    .catch((err) => {
                        setImageLoader(false)
                    });
            })
            .catch((error) => {
                setImageLoader(false)
            });
        setImageLoader(false)

    };

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
            console.log('Error fetching data... after subscribe:', error);
        }
    };

    useEffect(() => {
        // fetchDetails();
    }, [profileData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchDetails);

        return () => unsubscribe();
    }, [navigation]);

    const handleFakeSubmit = async () => {
        try {
            setModalVisible(false);
            await AsyncStorage.setItem("isPurchasedPlan", "true")
        } catch (error) {
            console.log("error in handleFakeSubmit in mlmhome", error)
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
            const uri = "https://cdn.brandingprofitable.com/upload/654bdd5da866eWhatsApp%20Image%202023-11-02%20at%2011.53.10%20AM.jpeg";
            let image_URL = uri;
            // Getting the extention of the file
            let ext = getExtention(image_URL);
            ext = '.' + ext[0];
            // Get config and fs from RNFetchBlob
            // config: To pass the downloading related options
            // fs: Directory path where we want our image to download
            const { config, fs } = RNFetchBlob;

            let date = new Date();

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
                    showToastWithGravity("Image Saved")
                });

        } catch (error) {
            showToastWithGravity("Something went Wrong!")

        }
    };

    // payment gateway integration


    const [openWebView, setOpenWebView] = useState(false);
    const [webUrl, setWebUrl] = useState("https://www.google.com");

    const [btnLoadingPayment, setBtnLoadingPayment] = useState(false)
    const [loadingPayment, setLoadingPayment] = useState(false)

    const [isModalVisiblePayment, setModalVisiblePayment] = useState(false);
    const [isFailer, setIsFailer] = useState(true);

    const showModal = () => {
        setModalVisiblePayment(true);
    };

    const closeModal = () => {
        setModalVisiblePayment(false);
    };

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
                "amount": fakePlans[selectedIndex].plan_price,
                "mobileNumber": profileData?.mobileNumber,
                "referredBy": referId,
                "treeId": treeId,
                "side": side,
                "fullName": profileData?.fullName,
                createdAt: TodayTimeDate,
                payment_date: TodayTimeDate,
                "plan_id": fakePlans[selectedIndex].plan_id,
                data
            }
            const response = await axios.post("https://api.brandingprofitable.com/payments/v2", requestData);
            // console.log(response.data, requestData);

            if (status == 'Done') {
                setTimeout(() => {
                    fetchData();
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
                setError('');
                setIsFailer(false);
                setTimeout(() => {
                    setModalVisiblePayment(true);
                    setLoadingPayment(false);
                    setPaymentSuccess(true);

                    setTimeout(() => {
                        handlePayhere();
                    }, 3000);
                }, 500);
            } else {
                setIsFailer(true);
                setTimeout(() => {
                    setLoadingPayment(false);
                    setModalVisiblePayment(true);
                }, 500);
            }
        } catch (error) {
            setTimeout(() => {
                setError("error" + Date.now())
            }, 2000);
            setLoadingPayment(false)

            // You might want to handle this error differently, such as 
        }
    };

    useEffect(() => {
        if (error != '' && !paymentSuccess) {
            checkStatus(fakePlans[selectedIndex].plan_price)
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

    const amount = 3999;

    // useEffect(()=>{

    //     setTimeout(async () => {
    //         if (merchantId && appId) {   
    //             showToastWithGravity("function running...")
    //             const initial = await initialPayment()
    //             console.log(initial)
    //         }else{
    //             showToastWithGravity("function error...")
    //         }
    //     }, 3000);

    // }, [transactionId, appId, merchantId])

    const startPayment = async (plan) => {

        setBtnLoadingPayment(true)
        // MT78505900681881011
        const merchantTransactionId = "MT7850590068" + generateTransactionId()
        const merchantId = "BRANDINGONLINE"
        const data = {
            merchantId,
            merchantTransactionId: transactionId,
            merchantUserId: 'BRANDINGONLINE',
            amount: plan?.plan_price * 100,
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
                    //     console.log("status found with 417")
                    //     const errorData = await response.json();
                    //     setBtnLoadingPayment(false);
                    //     showToastWithGravity("please try again..")
                    //     const transaction = "MT" + Date.now()
                    //     setTransactionId(transaction);
                    // } else if (response.status == 401) {
                    //     console.log("status found with 401", data)
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
                        console.log("transaction id error", res)

                        if (res.error == "" || codeValue == "INVALID_TRANSACTION_ID") {
                            const transaction = "MT" + Date.now();
                            setTransactionId(transaction);
                            showToastWithGravity("Please try again...");
                        } else if (res.status == "SUCCESS") {
                            checkStatus(plan?.plan_price);
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
    // const startPayment = async () => {

    //     setBtnLoadingPayment(true)
    //     // MT78505900681881011
    //     const merchantTransactionId = "MT7850590068" + generateTransactionId()
    //     const merchantId = "BRANDINGONLINE"
    //     const data = {
    //         merchantId,
    //         merchantTransactionId: transactionId,
    //         merchantUserId: 'BRANDINGONLINE',
    //         amount: amount * 100,
    //         redirectUrl: 'https://webhook.site/redirect-url',
    //         redirectMode: 'REDIRECT',
    //         callbackUrl: 'https://webhook.site/callback-url',
    //         mobileNumber: '9999999999',
    //         paymentInstrument: {
    //             type: 'PAY_PAGE',
    //         },
    //     };

    //     const payload = JSON.stringify(data);
    //     const payloadMain = base64.encode(payload);
    //     const salt_key = '283787d8-5fc0-4f24-b01b-74c3ea6e1f36';

    //     const keyIndex = 1;
    //     const string = payloadMain + '/pg/v1/pay' + salt_key;
    //     setString(string)

    //     const checksum = sha256Text + '###' + keyIndex;

    //     const initial = await initialPayment()

    //     if (initial) {
    //         PhonePePaymentSDK.init('SANDBOX', merchantId, appId, true)
    //             .then(async (result) => {
    //                 setMessage('Message: SDK Initialisation ->' + JSON.stringify(result));

    //                 // start payment

    //                 const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
    //                 const headers = {
    //                     accept: 'application/json',
    //                     'Content-Type': 'application/json',
    //                     'X-VERIFY': checksum,
    //                 };

    //                 const response = await fetch(prod_URL, {
    //                     method: 'POST',
    //                     headers: headers,
    //                     body: JSON.stringify({ request: payloadMain }),
    //                 });

    //                 let intervalId;

    //                 if (response.ok) {
    //                     const responseData = await response.json();

    //                     if (responseData.data) {
    //                         setWebUrl(responseData.data.instrumentResponse.redirectInfo.url);
    //                         setBtnLoadingPayment(false);
    //                         setOpenWebView(true);
    //                     }
    //                 } else if (response.status == 417) {
    //                     console.log("status found with 417")
    //                     const errorData = await response.json();
    //                     setBtnLoadingPayment(false);
    //                     showToastWithGravity("please try again..")
    //                     const transaction = "MT" + Date.now()
    //                     setTransactionId(transaction);
    //                 } else if (response.status == 401) {
    //                     console.log("status found with 401", data)
    //                     setBtnLoadingPayment(false);
    //                     showToastWithGravity("please try again..")

    //                     // intervalId = setInterval(() => {
    //                     //     // Update the counter every second
    //                     //     startPayment();
    //                     // }, 1000);
    //                     // return () => clearInterval(intervalId);
    //                 }

    //             })
    //             .catch(error => {
    //                 setMessage('error:' + error.message);
    //                 Alert.alert("troubleshooting..", "please try again later.");
    //                 setBtnLoadingPayment(false)
    //             });
    //     }
    // }


    const permissionFunction = async () => {
        try {
            const apilevel = Platform.Version;

            if (apilevel >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );
                if (granted) {
                    downloadImage();
                } else {
                    showToastWithGravity("give permission to download")
                }
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                )
                if (granted) {
                    downloadImage() 
                } else {
                    showToastWithGravity("give permission to download")
                }
            }
        } catch (error) {
            console.log("error in permission funcion in download image:", error)
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

    const [checkPaymentLoader, setCheckPaymentLoader] = useState(true)
    const [isPaid, setIsPaid] = useState(true);

    const openPaymentModal = () => {
        setisPaymentModelOpen(true)
    }

    const handlePayhere = async (plan) => {
        try {
            setPaymentSuccess(false)
            setCheckPaymentLoader(true);

            const response = await axios.get(`https://api.brandingprofitable.com/payments/check_purchase/v2/${profileData?.mobileNumber}`);

            console.log(response.data, `https://api.brandingprofitable.com/payments/check_purchase/v2/${profileData?.mobileNumber}`)

            if (response.data.statusCode == 200) {
                setTimeout(() => {
                    setisPaymentModelOpen(false);
                    setSecondModalVisible(true);
                    setPlanIsMLM(response.data.is_mlm);
                    setPlanIdOfpurchasedPlan(response.data.plan_id)

                    const index = fakePlans.findIndex(plan => plan.plan_id === response.data.plan_id);
                    if (index != -1) {
                        setSelectedIndex(index)
                    }
                }, 300);

            } else {
                // showToastWithGravity("Please Purchase Plan...!");
                // // startPayment();
                // setisPaymentModelOpen(true)

                startPayment(plan)
            }

            setCheckPaymentLoader(false);


        } catch (error) {
            setCheckPaymentLoader(false);

            console.log("error in handle pay here functon:", error);
        }
    }

    const handleSelectPlan = (plan) => {
        // console.log(plan)
        startPayment(plan)
    }

    const Grids = ({ detailname, detail, isBool, boolValue }) => {
        return (
            <View style={[styles.gridItem, { display: boolValue || detail ? 'block' : 'none' }]}>
                <View style={{ width: 40, alignItems: 'flex-start' }}>
                    {
                        isBool == true ? <MaterialCommunityIcons name={!boolValue ? "close-circle" : "check"} size={20} color={!boolValue ? 'red' : 'black'} /> :
                            <View style={{ paddingLeft: 5, width: '100%' }}>
                                <Text style={[styles.gridItemText]}>
                                    {detail}
                                </Text>
                            </View>
                    }
                </View>
                <Text style={styles.gridItemText}>{detailname}</Text>
            </View>

        )
    }

    const Subscription = ({ plan }) => {
        return (
            <View style={styles.subscriptionContainer}>
                <ScrollView style={{ height: '90%', overflow: 'scroll' }} contentContainerStyle={{ paddingVertical: 10 }}>
                    <Text style={styles.planName}>{plan.plan_name}</Text>
                    <Text style={styles.planPrice}>₹ {plan.plan_price} <Text style={{ fontSize: 18, color: 'grey' }}>/year</Text></Text>
                    <View style={styles.gridContainer}>

                        <Grids detailname={'Festival Image'} detail={plan.festival_image} isBool={true} boolValue={plan.festival_image} />
                        <Grids detailname={'Festival Video'} detail={plan.festival_video} isBool={true} boolValue={plan.festival_video} />
                        <Grids detailname={'Category Image'} detail={plan.category_image} isBool={true} boolValue={plan.category_image} />
                        <Grids detailname={'Category Video'} detail={plan.category_video} isBool={true} boolValue={plan.category_video} />
                        <Grids detailname={'Business Image'} detail={plan.business_image} isBool={true} boolValue={plan.business_image} />
                        <Grids detailname={'Custom Categories'} detail={plan.custome_categories} isBool={true} boolValue={plan.custome_categories} />
                        <Grids detailname={'Trending Image'} detail={plan.trnding_image} isBool={true} boolValue={plan.trnding_image} />
                        <Grids detailname={'A4 Image Video'} detail={plan.a4_image_video} isBool={true} boolValue={plan.a4_image_video} />
                        <Grids detailname={'Logo'} detail={plan.logo} isBool={true} boolValue={plan.logo} />
                        <Grids detailname={'Remove Background'} detail={plan.remove_bg} isBool={true} boolValue={plan.remove_bg} />
                        <Grids detailname={'Refer and Earn'} detail={plan.refer_and_earn} isBool={true} boolValue={plan.refer_and_earn} />

                        {/* <Grids detailname={'Plan ID'} detail={plan.plan_id} /> */}
                        {/* <Grids detailname={'Plan Price'} detail={plan.plan_price} /> */}
                        {/* <Grids detailname={'Percentage'} detail={plan.percentage} /> */}

                    </View>

                    <View style={styles.gridContainer}>
                        <Grids detailname={'Business Members'} detail={plan.business_member} />
                        <Grids detailname={'Default Frames'} detail={plan.default_frame} />
                        <Grids detailname={'Custom Frames'} detail={plan.custome_frame} />
                        <Grids detailname={'Visiting Card Credits'} detail={plan.visiting_card} />
                    </View>
                </ScrollView>

                <TouchableOpacity style={{ backgroundColor: '#E31E25', borderRadius: 8, margin: 0, width: "100%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, alignSelf: 'flex-end', justifySelf: 'flex-end' }} onPress={() => { handleSelectPlan(plan) }}>

                    <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                        Select Plan
                    </Text>

                </TouchableOpacity>
            </View>
        )
    };


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

    const planData = [
        { name: 'Plan A', features: { businessFrame: 'Yes', customFrame: 'No' } },
        { name: 'Plan B', features: { businessFrame: 'Yes', customFrame: 'Yes' } },
        { name: 'Plan C', features: { businessFrame: 'No', customFrame: 'Yes' } },
    ];

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
        <LinearGradient colors={['#b30c12', '#000']} locations={[0.2, 1]} style={{ flex: 1, marginBottom: 50 }}>

            {/* header */}

            <Header name={'mjgohel'} />

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
                                    fakePlans.map((plan, index) => (
                                        <TouchableOpacity activeOpacity={0.7} style={{ width: 'auto', backgroundColor: index == selectedIndex ? 'white' : 'white', borderWidth: 1, borderColor: index == selectedIndex ? 'lightgrey' : 'lightgrey', paddingVertical: 0, opacity: index == selectedIndex ? 1 : 0.7, elevation: index == selectedIndex ? 15 : 0 }} key={index} onPress={() => { setSelectedIndex(index) }}>
                                            <Plan bgcolor={index == selectedIndex ? true : false} detailname={'Festival Image'} price={plan.plan_price} name={plan.festival_image} isBool={false} boolValue={plan.festival_image} header={plan.plan_name} />


                                            {/*  */}
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
                                        </TouchableOpacity>
                                    ))
                                }

                            </ScrollView>
                        </View>
                    </ScrollView>

                    {/* <ScrollView horizontal style={{ borderTopWidth: 1, borderColor: 'black', backgroundColor: 'white', width: '100%', height: '25%', }} contentContainerStyle={{ paddingHorizontal: 5 }} showsHorizontalScrollIndicator={false}>
                        {
                            fakePlans.map((plan, index) => (

                                <TouchableOpacity key={index} style={{ height: 100, width: 150, backgroundColor: 'white', borderRadius: 20, borderColor: index == selectedIndex ? 'black' : 'lightgrey', overflow: 'hidden', borderWidth: 1, marginVertical: 20, marginHorizontal: 10, padding: 20, justifyContent: 'center', elevation: 20, position: 'relative', opacity: selectedIndex == index ? 1 : 0.5 }} onPress={() => { setSelectedIndex(index) }}>

                                    <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 17 }}>
                                        {plan.plan_name}
                                    </Text>
                                    <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 30 }}>
                                        {plan.plan_price}₹<Text style={{ fontSize: 15 }}>/year</Text>
                                    </Text>

                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView> */}


                    <TouchableOpacity
                        onPress={() => {
                            handlePayhere(fakePlans[selectedIndex])
                            // handleSelectPlan(fakePlans[selectedIndex])
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
                                width: "100%",
                                height: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                
                                elevation: 5,
                                alignSelf: 'center',
                                justifySelf: 'flex-end',
                                marginBottom: 10
                            }}
                        >


                            <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 15 }}>
                                {"Subscribe Now"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

            {/* qr the modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalOfQr}
            >
                <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '100%', width: '100%' }}>
                    <TouchableOpacity onPress={() => { permissionFunction() }} style={{ position: 'absolute', zIndex: 12, top: 20, left: 20, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text><Icon name="download" size={27} color={'white'} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setModalOfQr(false); }} style={{ position: 'absolute', zIndex: 12, top: 20, right: 20, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text><Icon name="close" size={27} color={'white'} /></Text>
                    </TouchableOpacity>
                    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                        <Image style={{ height: 500, width: '100%', borderRadius: 10 }} source={require('../assets/paymentQR.jpg')} />
                    </View>
                </View>
            </Modal>

            {/* payment modal */}
            <CustomSuccessModal visible={isModalVisiblePayment} closeModal={closeModal} isFailer={isFailer} />

            {/* loading modal */}
            <PaymentLoadingModal visible={loadingPayment || checkPaymentLoader} content={loadingPayment ? 'Transaction Status checking...' : 'loading...'} />

            {/* Define the modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
            >

                <View style={[styles.modalContent, { height: '80%', }]}>

                    <View style={{ marginTop: 30, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                        <>
                            <TouchableOpacity style={{ borderRadius: 10, height: '60%', borderWidth: 1, width: '90%', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', borderColor: 'gray' }} onPress={handleImagePicker}>
                                {/* <View style={{ margin: 10, display: imageLoader ? 'none' : 'flex' }}>
                                    <Icon name="cloud-upload" size={27} color={'gray'} />
                                </View> */}
                                {fileUri ? (
                                    <View>
                                        <Image style={{ height: '100%', width: 160 }} source={{ uri: fileUri }} />
                                    </View>
                                ) : imageLoader ? (
                                    <View style={{ width: "100%", height: '10%', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator color={'gray'} />
                                    </View>
                                ) : (
                                    <Text style={{ width: '52%', textAlign: 'center' }}>
                                        Click to browse And Upload payment Screenshot
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </>

                        <TouchableOpacity style={{ backgroundColor: '#E31E25', borderRadius: 8, margin: 20, width: "90%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, }} onPress={joinNowButton}>
                            <Text disabled={imageLoader} style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                                Upload
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity onPress={() => { setModalVisible(false) }} style={styles.modalCloseButton}>
                        <Text><Icon name="close" size={27} color={'gray'} /></Text>
                    </TouchableOpacity>
                </View>
            </Modal>

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


                            <TouchableOpacity style={{ backgroundColor: '#E31E25', borderTopRightRadius: 8, borderTopLeftRadius: 9, margin: 20, width: "90%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, }} onPress={submitRequestButton}>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={isPaymentModelOpen}
                // visible={true}
                onRequestClose={() => { setisPaymentModelOpen(false) }}
            >
                <View style={[styles.modalContent, { height: '100%' }]} keyboardShouldPersistTaps={'always'}>

                    {/* <Swiper style={styles.wrapper} showsPagination={false}>
                        {fakePlans.map((plan) => (
                            <Subscription key={plan.plan_id} plan={plan} />
                        ))}
                    </Swiper> */}
                    <View style={{ height: 50, borderBottomColor: 'black', borderBottomWidth: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Manrope-Bold', paddingLeft: 20 }}>Subscribe Plan</Text>
                        <TouchableOpacity onPress={() => { setisPaymentModelOpen(false) }} style={styles.modalCloseButton}>
                            <Text><Icon name="close" size={27} color={'gray'} /></Text>
                        </TouchableOpacity>
                    </View>

                    {/* {
                        fakePlans.length != 0 ? (
                            <PagerView
                                onPageSelected={(event) => {
                                    setSelectedIndex(event.nativeEvent.position)
                                }}
                                style={{ flex: 1, marginVertical: 0, elevation: 20, }}
                                initialPage={selectedIndex}
                            >
                                {fakePlans.map((plan) => (
                                    <Subscription key={plan.plan_id} plan={plan} />
                                ))}
                            </PagerView>
                        ) : (
                            <ActivityIndicator color={'black'} />
                        )
                    } */}

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
                                    fakePlans.map((plan, index) => (
                                        <TouchableOpacity activeOpacity={0.7} style={{ width: 'auto', backgroundColor: index == selectedIndex ? 'white' : 'white', borderWidth: 1, borderColor: index == selectedIndex ? 'lightgrey' : 'lightgrey', paddingVertical: 0, opacity: index == selectedIndex ? 1 : 0.7, elevation: index == selectedIndex ? 15 : 0 }} key={index} onPress={() => { setSelectedIndex(index) }}>
                                            <Plan bgcolor={index == selectedIndex ? true : false} detailname={'Festival Image'} price={plan.plan_price} name={plan.festival_image} isBool={false} boolValue={plan.festival_image} header={plan.plan_name} />


                                            {/*  */}
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
                                        </TouchableOpacity>
                                    ))
                                }

                            </ScrollView>
                        </View>
                    </ScrollView>

                    {/* <ScrollView horizontal style={{ borderTopWidth: 1, borderColor: 'black', backgroundColor: 'white', width: '100%', height: '25%', }} contentContainerStyle={{ paddingHorizontal: 5 }} showsHorizontalScrollIndicator={false}>
                        {
                            fakePlans.map((plan, index) => (

                                <TouchableOpacity key={index} style={{ height: 100, width: 150, backgroundColor: 'white', borderRadius: 20, borderColor: index == selectedIndex ? 'black' : 'lightgrey', overflow: 'hidden', borderWidth: 1, marginVertical: 20, marginHorizontal: 10, padding: 20, justifyContent: 'center', elevation: 20, position: 'relative', opacity: selectedIndex == index ? 1 : 0.5 }} onPress={() => { setSelectedIndex(index) }}>

                                    <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 17 }}>
                                        {plan.plan_name}
                                    </Text>
                                    <Text style={{ color: 'black', fontFamily: 'Manrope-Bold', fontSize: 30 }}>
                                        {plan.plan_price}₹<Text style={{ fontSize: 15 }}>/year</Text>
                                    </Text>

                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView> */}


                    <TouchableOpacity
                        onPress={() => {
                            handleSelectPlan(fakePlans[selectedIndex])
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
            </Modal>

        </LinearGradient>
    );
}

// {
//     plan_id: "2",
//     plan_name: "Golden",
//     plan_price: 20,
//     business_member: 2,
//     visiting_card: 200,
//     percentage: 20,
//     default_frame: 2,
//     custome_frame: 2,
//     festival_image: false,
//     festival_video: true,
//     logo: false,
//     category_image: false,
//     category_video: true,
//     business_image: false,
//     custome_categories: true,
//     trnding_image: false,
//     a4_image_video: true,
//     remove_bg: false,
//     refer_and_earn: true,
//     createdAt: "2023-10-21 14:21:40",
//     updatedAt: "2023-10-21 14:21:40",
// },

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
        top: 5,
        right: 10,
        padding: 10

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
        fontSize: 14
    },
    gridItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    subscriptionContainer: {
        flex: 1,
        marginTop: 20,
        borderRadius: 14,
        backgroundColor: '#ffc4c4',
        marginHorizontal: 10,
        padding: 20,
        justifyContent: 'space-between',
        marginBottom: 10
    },
    planName: {
        fontSize: 25,
        fontFamily: 'Manrope-Bold',
        marginBottom: 5,
    },
    planPrice: {
        fontFamily: 'Manrope-Bold',
        fontSize: 45,
    },
    gridContainer: {
        marginTop: 20,
        paddingTop: 15,
        borderTopColor: 'grey',
        borderTopWidth: 1
    },
    gridItemText: {
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        padding: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    columnHeader: {
        textAlign: 'center',
    },
})

export default MLMhome;


