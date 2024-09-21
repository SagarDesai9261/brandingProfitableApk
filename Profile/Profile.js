import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Avatar,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableHighlight,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather'
import Header from '../Header';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = ({ route }) => {

  const { userNotHaveFrame } = route.params || false;
  const navigation = useNavigation();

  const [businessOrPersonal, setBusinessOrPersonal] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [userTeamDetails, setUserTeamDetails] = useState([]);
  const [userTeamDetails11, setUserTeamDetails11] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loadPurchaseOrNot, setloadPurchaseOrNot] = useState(true)

  const [isMLMPurchased, setIsMLMPurchased] = useState(false)

  // {"Designation": "Software", "_id": "65180fdc5316bb5cc34b33da", "adress": "Nirmal Nagar, Bhavnagar, Gujarat 364001, India", "dob": "2023-09-03", "email": "shivamdshukla55@gmail.com", "exp": 1698014617, "fullName": "shivam shukla", "gender": null, "iat": 1697971417, "isPersonal": true, "mobileNumber": 9106636361, "profileImage": "https://lh3.googleusercontent.com/a/ACg8ocKVjG2Z7HwoWTAKCjWYRA7UrfkIWqtzqwx19c0dPfVTpCc"}

  const fetchData = async () => {
    const businessOrPersonalData = await AsyncStorage.getItem(
      'BusinessOrPersonl'
    );
    const profileDataString = await AsyncStorage.getItem('profileData');

    if (businessOrPersonalData) {
      setBusinessOrPersonal(businessOrPersonalData);
    }

    if (profileDataString) {
      const data = JSON.parse(profileDataString);
      setProfileData(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [subscritionExp, setSubscriptionExp] = useState(false);

  const fetchDetails = async () => {
    setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://api.brandingprofitable.com/mlm/wallet/v2/${profileData.mobileNumber}`
        );
        const result = response.data.details;
        console.log("result", response.data.statusCode)
        if (response.data.statusCode === 200) {

          if (response.data.is_mlm) {
            setIsMLMPurchased(true)
          }
          setUserTeamDetails11('Purchase');
          setUserTeamDetails(result);
          const originalDateStr = result.registrationDate || result.register_date;
          const originalDate = new Date(originalDateStr);

          // Calculate the next year's date
          originalDate.setFullYear(originalDate.getFullYear() + 1);

          const today = new Date();

          // Compare the dates
          if (today <= originalDate) {
            console.log("Awesome! subscition not expires");
            setSubscriptionExp(false);
          } else {
            setSubscriptionExp(true);
            console.log("oh no! subscition expires");
          }

        } else {
          setUserTeamDetails(result);
        }

        setLoader(false);
        setTimeout(() => {
          setloadPurchaseOrNot(false)
        }, 2000);
      } catch (error) {
        setLoader(false);
        setTimeout(() => {
          setloadPurchaseOrNot(false)
        }, 2000);
        console.log('error:', error);
      }
    }, 1000);

  };

  const [pdfLoad, setPdfLoad] = useState(false);
  const [count, setCount] = useState(1);

  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure two-digit day
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  const year = currentDate.getFullYear().toString();

  const date = `${day}-${month}-${year}`;

  const partyName = profileData?.fullName;
  const businessName = profileData?.businessName;
  const address = profileData?.adress;

  const businessRow = businessName
    ? `
<tr>
  <th colspan="8" style="text-align: left; font-size: 13px">Business Name: ${businessName}</th>
</tr>
`
    : '';

  const nameRow = partyName
    ? `
<tr>
  <th colspan="8" style="text-align: left; font-size: 13px">Party's Name: ${partyName}</th>
</tr>
`
    : '';

  const movePDFTodoDownloads = async (filePath, filename) => {
    try {
      const dirPath = `${RNFS.DownloadDirectoryPath}/Branding Profitable`;
      await RNFS.mkdir(dirPath);
      // const newFilePath = `${RNFS.DownloadDirectoryPath}/Braning Profitable/${filename}`;
      const newFilePath = `${dirPath}/${filename}.pdf`;
      await RNFS.moveFile(filePath, newFilePath);
      console.log('PDF moved to Downloads directory:', newFilePath);

      Alert.alert('Success', `Invoice saved to Your Download Folder!`);
    } catch (error) {
      console.error('Error moving PDF file:', error);
    }
  };

  const [jsonData, setJsonData] = useState([
    { description: 'Branding Profitable One Year Service Charger', qty: 1, rate: 3999, amount: 3999 },
    { description: 'Purchase A Plan', qty: 1, rate: 499, amount: 499 },
    { description: 'Purchase B Plan', qty: 1, rate: 1999, amount: 1999 },
    // Add more rows as needed
  ])

  const fetchDataPlans = async () => {
    try {
      const response = await axios.get("https://api.brandingprofitable.com/abcd/plan_purchase/"+profileData.mobileNumber)

      const data = response.data.data ? response.data.data : [];

      setJsonData(data)
    } catch (error) {
      console.error("error in fetchdata plans", error)
    }
  }

  useEffect(()=>{
    fetchDataPlans()
  },[profileData])

  const generatePDF = async () => {
    setPdfLoad(true);

    try {
      // Assuming jsonData is your JSON data containing rows


      let tableRows = '';
      let totalAmount = 0; // Initialize total amount

      jsonData.forEach(row => {
        tableRows += `
      <tr style="height: 20px">
          <th colspan="2" class="left-text" style="font-size: 13px">${row.description}</th>
          <th colspan="2" class="center-text" style="font-size: 13px">${row.qty}</th>
          <th colspan="2" class="center-text" style="font-size: 13px">${row.rate}</th>
          <th colspan="2" class="center-text" style="font-size: 13px">${row.amount}</th>
      </tr>
  `;
        totalAmount += row.amount; // Accumulate amount for total calculation
      });

      // Function to convert numeric amount to words
      function amountToWords(amount) {
        const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if (amount === 0) {
          return 'Zero';
        }

        function convertLessThanOneThousand(number) {
          let words;

          if (number % 100 < 10) {
            words = units[number % 10];
            number = Math.floor(number / 10);
          } else if (number % 100 < 20) {
            words = teens[number % 10];
            number = Math.floor(number / 100);
          } else {
            words = units[number % 10];
            number = Math.floor(number / 10);
            words = tens[number % 10] + ' ' + words;
            number = Math.floor(number / 10);
          }
          if (number === 0) return words;
          return units[number] + ' Hundred ' + words;
        }

        let words = '';
        let remainder;

        let num = Math.floor(amount);
        if (num >= 1000000000) {
          words += convertLessThanOneThousand(Math.floor(num / 1000000000)) + ' Billion ';
          num %= 1000000000;
        }
        if (num >= 1000000) {
          words += convertLessThanOneThousand(Math.floor(num / 1000000)) + ' Million ';
          num %= 1000000;
        }
        if (num >= 1000) {
          words += convertLessThanOneThousand(Math.floor(num / 1000)) + ' Thousand ';
          num %= 1000;
        }
        if (num > 0) {
          words += convertLessThanOneThousand(num);
        }

        const decimalPart = Math.round((amount % 1) * 100);
        if (decimalPart > 0) {
          words += ' And ' + convertLessThanOneThousand(decimalPart) + ' Paise';
        }

        return words + ' Only';
      }



      const totalAmountInWords = 'Three Thousend Nine Hundred Ninty Nine Only'; // You need to implement logic to convert amount to words

      const html = `<html>
  <head>
      <style>
          body {
              font-family: 'Helvetica';
              font-size: 12px;
              padding: 50px;
          }
          header, footer {
              height: 50px;
              background-color: #fff;
              color: #000;
              display: flex;
              justify-content: center;
              padding: 0 20px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              border: 1px solid #000;
              padding: 5px;
          }
          th {
              background-color: #ccc;
          }
          .center-text {
              text-align: center;
          }
          .left-text {
              text-align: left;
          }
      </style>
  </head>
  <body>
      <table>
          <tr>
              <th colspan="5" class="center-text" style="font-size: 22px; background-color: red; color: white;">TAX INVOICE </th>
              <th colspan="3" class="text" style="font-size: 15px; background-color: red; color: white;">Date: ${date}</th>
          </tr>
          <tr>
              <th colspan="8" class="center-text" style="font-size: 25px; color: black;">Kubertree Private Limited</th>
          </tr>
          <tr>
              <th colspan="8" class="center-text" style="font-size: 13px">Company Identity Number: U46499GJ2023PTC143819</th>
          </tr>
          <tr>
              <th colspan="8" class="center-text" style="font-size: 13px">PAN NO. AAKCK4430H</th>
          </tr>
          ${nameRow}
          ${businessRow}
          <tr>
              <th colspan="8" style="text-align: left; font-size: 13px">Address: ${address}</th>
          </tr>
          <tr>
              <th colspan="2" class="center-text" style="font-size: 15px">Description</th>
              <th colspan="2" class="center-text" style="font-size: 15px">Qty</th>
              <th colspan="2" class="center-text" style="font-size: 15px">Rate</th>
              <th colspan="2" class="center-text" style="font-size: 15px">Amount</th>
          </tr>
          ${tableRows}
          <tr>
              <th colspan="" class="left-text" style="font-size: 20px"></th>
              <th colspan="5" style="background-color: black; color: white; text-align: left; font-size: 13px;">Grand <br>Total</br></th>
              <th colspan="4" style="background-color: black; color: white; text-align: right; font-size: 13px;">${totalAmount}</th>
          </tr>
          <tr>
              <th colspan="8" style="text-align: left; font-size: 10; font-style: italic">Total Amount (-In Words): ${amountToWords(totalAmount)}</th>
          </tr>
          <tr>
              <th colspan="8" style="text-align: left; font-size: 10; font-style: italic">For: Kubertree Private Limited</th>
          </tr>
          <tr>
              <th colspan="8" style="text-align: left; font-size: 10; font-style: italic">Computer Generated Invoice No Need of Signature</th>
          </tr>
      </table>
  </body>
  </html>`;

      const options = {
        html,
        fileName: `branding_invoice_${count}`,
        directory: 'Invoices',
      };
      const file = await RNHTMLtoPDF.convert(options);

      console.log(file, "askdjfaklsdsdf file")

      const apilevel = Platform.Version;

      if (apilevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (granted) {
          await movePDFTodoDownloads(file.filePath, options.fileName);
        } else {
          showToastWithGravity("give permission to download");
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        if (granted) {
          await movePDFTodoDownloads(file.filePath, options.fileName);
        } else {
          showToastWithGravity("give permission to download");
        }
      }

      // Alert.alert('Success', `PDF saved to ${file.filePath}`);
      setCount(count + 1);
      setPdfLoad(false);
    } catch (error) {
      Alert.alert('Error', error.toString());
      setPdfLoad(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      fetchDetails();
    }
  }, [profileData]);

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
  };

  const reloadScreen = () => {
    fetchDetails();
    fetchData();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', reloadScreen);

    return () => unsubscribe();
  }, [navigation]);

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
      0,
      50,
    );
  };

  // 2023-10-23 14:47:25

  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleJoinDate = () => {
    setShowJoinModal(!showJoinModal)
  }

  const formatedDate = (date, withExpire) => {
    console.log("function called of formate")
    if (date) {
      console.log(date, "this is date for comes for formate")

      const parts = date.split(' ');
      const onlyDate = parts[0];

      const partsDate = onlyDate.split('-');
      if (partsDate.length == 3) {
        const [y, m, d] = partsDate;

        const formatedDate = `${d}-${m}-${!withExpire ? y : parseInt(y, 10) + 1}`
        return formatedDate
      }
    } else {
      console.log("date not found")
    }

    return null;
  }

  if (loader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom: 50 }}>
      {/* join date modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showJoinModal}
        onRequestClose={() => { setShowJoinModal(false) }}
      >
        <View style={styles.modalBackground}>
          {
            !subscritionExp ? (
              <View style={styles.modalContent}>
                <Text style={styles.modalMessage}>Join Date:   {formatedDate(userTeamDetails?.registrationDate || userTeamDetails?.register_date)}</Text>
                <Text style={styles.modalMessage}>Expiry Date:   {formatedDate(userTeamDetails?.registrationDate || userTeamDetails?.register_date, true)}</Text>
                <TouchableOpacity style={styles.okButton} onPress={() => { setShowJoinModal(false) }}>
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalContent}>
                <Text style={styles.modalMessage}>Your Subscription Has Been Expires</Text>
                <TouchableOpacity style={styles.okButton} onPress={() => { navigation.navigate('MlmScreenStack') }}>
                  <Text style={styles.okButtonText}>Renew</Text>
                </TouchableOpacity>
              </View>
            )
          }
        </View>
      </Modal>
      {/* main contianer */}
      <View style={{ justifyContent: 'space-between', flex: 1, }}>
        {/* 1 */}
        <View style={{ height: '45%', width: '100%', backgroundColor: '#2B353F', borderBottomRightRadius: 15, borderBottomLeftRadius: 15, justifyContent: 'space-between' }}>

          {/* 1 */}
          <View>

            {/* header */}
            <Header />

          </View>

          {/* 2 */}
          <View style={{ marginBottom: 20, height: '60%', width: '100%', alignItems: 'center', justifyContent: "center", }}>
            {/* {
                businessOrPersonal == 'business' ? (
                  <Image
                    style={{ height: 100, width: 100, borderRadius: 100 }}
                    rounded
                    source={profileData ? ({ uri: profileData.businessLogo }) : ({ uri: 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' })}
                  />

                ) : (
                  <Image
                    style={{ height: 100, width: 100, borderRadius: 100 }}
                    rounded
                    source={
                      profileData && profileData?.profileImage
                        ? { uri: profileData.profileImage }
                        : { uri: 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }
                    }
                  />
                )
              }  */}

            <FastImage source={{ uri: profileData?.businessLogo || profileData?.profileImage || 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }} style={{ height: 100, width: 100, borderRadius: 100 }} />

            <Text h4 style={styles.username}>
              {profileData?.fullName || 'John Doe'}
              {/* <Button title='hello' onPress={()=>{navigation.navigate('CustomFrames')}} /> */}
            </Text>
            <Text h4 style={styles.bio}>
              +91 {profileData?.mobileNumber || 'John Doe'}
            </Text>
            <Text h4 style={[styles.bio, { fontSize: 14 }]}>
              {profileData?.email || 'John Doe'}
            </Text>

            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { navigation.navigate('ViewProfile') }}>
              <Text style={{ height: 40, color: '#00D3FF', fontFamily: "Manrope-Regular", fontSize: 15 }}>
                View
              </Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* 2 */}
        <View style={{ height: '50%', width: '100%', backgroundColor: '#2B353F', borderTopRightRadius: 15, borderTopLeftRadius: 15, overflow: 'hidden' }}>
          {/* 1 */}
          {
            loadPurchaseOrNot ?
              <View style={{ height: 80, width: '100%', backgroundColor: '#414851', justifyContent: 'center', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white' }} onPress={() => { navigation.navigate('MlmScreenStack') }}>
                    ...
                  </Text>
                </View>
              </View> :
              userTeamDetails11 != 'Purchase' ? (
                // not purchased by user
                <View style={{ height: 80, width: '100%', backgroundColor: '#414851', justifyContent: 'center', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: '#E31E25' }} onPress={() => { navigation.navigate('MlmScreenStack') }}>
                      Subscribe Plan!
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ height: 80, width: '100%', backgroundColor: '#414851', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
                  {
                    isMLMPurchased &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: 'red', paddingHorizontal: 10, }}>
                        <FontAwesome6 name="sack-dollar" size={30} color="#E31E25" />
                      </Text>
                      <View>
                        <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#E31E25' }}>
                          Pending Wallet
                        </Text>
                        <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                          ₹ {userTeamDetails?.redWallet || 0}/-
                        </Text>
                      </View>
                    </View>
                  }

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'red', paddingHorizontal: 10, flexDirection: 'row' }}>
                      <FontAwesome6 name="sack-dollar" size={30} color="#42FF00" />
                    </Text>
                    <View>
                      <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#42FF00' }}>
                        Current Wallet
                      </Text>
                      <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                        ₹ {userTeamDetails?.greenWallet || userTeamDetails?.green_wallet || 0}/-
                      </Text>
                    </View>
                  </View>
                </View>
              )
          }

          {/* 2 */}
          <ScrollView style={{ height: '100%', width: '100%' }}>
            <View style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 35 }}>
              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center', display: userTeamDetails11 != 'Purchase' ? 'none' : 'flex' }} onPress={() => { navigation.navigate('WithdrawWallet', { greenWallet: userTeamDetails?.greenWallet || userTeamDetails?.green_wallet, isMLMPurchased: isMLMPurchased }) }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 100, height: 19, width: 19, justifyContent: 'center', alignItems: 'center' }}>
                      <Text >
                        <FontAwesome6 name="dollar-sign" size={13} color="#1E242D" />
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Withdrawal
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center', display: userTeamDetails11 != 'Purchase' ? 'none' : 'flex' }} onPress={handleJoinDate}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <MaterialIcons name="date-range" size={20} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Join & Renew Date
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('editprofile') }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <FontAwesome5 name="edit" size={16} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Edit profile
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                navigation.navigate('Frames')
              }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <Icon name="expand" size={20} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Frames
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                navigation.navigate('StackCustom')
              }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <Icon name="expand" size={20} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Request Frames
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>


              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center', display: userTeamDetails11 != 'Purchase' ? 'none' : 'flex' }} onPress={generatePDF}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <MaterialIcons name="download" size={20} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Download Invoice
                  </Text>
                </View>

                <Text>
                  {
                    pdfLoad ? <ActivityIndicator size={'small'} color={'white'} /> : <Icon name="angle-right" size={30} color="white" />
                  }
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('PrivacyPolicy') }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <MaterialIcons name="privacy-tip" size={16} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Privacy Policy
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('RefundPolicy') }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <MaterialIcons name="privacy-tip" size={16} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Refund Policy
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>
              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={showAlert}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text>
                      <Icon name="sign-out" size={20} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Log out
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>


              {/* modal */}

              <Modal
                animationType="fade" // You can use "fade" or "none" for animation type
                visible={isModalVisible}
                transparent={true}
                onRequestClose={hideAlert}
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
                    }}>Are You Sure?</Text>
                    {/* caption */}
                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'Manrope-Bold',
                      marginTop: 5,
                      color: 'lightgray',
                      textAlign: 'center'
                    }}>You want to Log out your Account ?</Text>
                    {/* another */}
                    <View style={{ width: '80%', marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>

                      <TouchableOpacity onPress={hideAlert} style={{
                        borderColor: 'lightgray',
                        width: 70,
                        paddingVertical: 5,
                        alignItems: 'center',
                        justifyContent: "center",
                        borderRadius: 8,
                        borderWidth: 1
                      }}>
                        <Text style={{
                          color: 'lightgray',
                          fontFamily: 'Manrope-Bold'
                        }}>No</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          hideAlert()
                          navigation.navigate('StackLogin');
                          AsyncStorage.removeItem('UserVipTag');
                          AsyncStorage.removeItem('isLoggedIn');
                          AsyncStorage.removeItem('profileData');
                          AsyncStorage.removeItem('businessOrPersonal');
                          AsyncStorage.removeItem('userToken');
                          AsyncStorage.removeItem('customFrames');
                          AsyncStorage.removeItem('bankDetails');
                          AsyncStorage.removeItem('carduserdata');
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
                        }}>Yes</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    // backgroundColor: 'white',
  },
  username: {
    marginTop: 10,
    color: 'white',
    fontFamily: 'Manrope-Bold',
    fontSize: 20
  },
  bio: {
    color: '#6B7285',
    fontFamily: 'Manrope-Bold',
    fontSize: 16
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 10,
  },
  editButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 20
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;


// {userTeamDetails11 != 'Purchase' ? (
//   <TouchableOpacity style={{ justifyContent: 'center', marginTop: -10, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, marginBottom: 10 }}
//     onPress={() => { showToastWithGravity("Purchase MLM Subscription!") }}
//   >

//     <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3, }}>
//       <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'red', marginLeft: 10 }}>
//         {/* subscrition date */}
//         Subscription Date
//       </Text>
//     </View>

//   </TouchableOpacity>
// ) : (
//   <TouchableOpacity style={{ justifyContent: 'center', marginTop: -10, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, marginBottom: 10 }}
//     onPress={handleJoinDate}
//   >

//     <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3, }}>
//       <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: subscritionExp ? "#fc4950" : 'white', marginLeft: 10 }}>
//         {/* subscrition date */}
//         {subscritionExp ? "Your Subscrition has been Expire" : formatedDate(userTeamDetails?.registrationDate)}
//       </Text>
//     </View>

//   </TouchableOpacity>
// )}


{/* <TouchableOpacity style={{ justifyContent: 'space-between',marginTop:20, width: '80%', flexDirection:'row',alignItems:'center' }}>

<View style={{flexDirection:'row',alignItems:'center', paddingVertical:7}}>
  <Text>
    <FontAwesome6 name="sack-dollar" size={30} color="gold" />

  </Text>
  <Text style={{fontFamily:'Manrope-Bold',fontSize:16,color:'white',marginLeft:10}}>
    meet gohel
  </Text>
</View>

<Text>
  <Icon name="angle-right" size={30} color="white" />
</Text>

</TouchableOpacity>
<TouchableOpacity style={{ justifyContent: 'space-between',marginTop:20, width: '80%', flexDirection:'row',alignItems:'center' }}>

<View style={{flexDirection:'row',alignItems:'center', paddingVertical:7}}>
  <Text>
    <FontAwesome6 name="sack-dollar" size={30} color="gold" />

  </Text>
  <Text style={{fontFamily:'Manrope-Bold',fontSize:16,color:'white',marginLeft:10}}>
    meet gohel
  </Text>
</View>

<Text>
  <Icon name="angle-right" size={30} color="white" />
</Text>

</TouchableOpacity>
<TouchableOpacity style={{ justifyContent: 'space-between',marginTop:20, width: '80%', flexDirection:'row',alignItems:'center' }}>

<View style={{flexDirection:'row',alignItems:'center', paddingVertical:7}}>
  <Text>
    <FontAwesome6 name="sack-dollar" size={30} color="gold" />

  </Text>
  <Text style={{fontFamily:'Manrope-Bold',fontSize:16,color:'white',marginLeft:10}}>
    meet gohel
  </Text>
</View>

<Text>
  <Icon name="angle-right" size={30} color="white" />
</Text>

</TouchableOpacity> */}







