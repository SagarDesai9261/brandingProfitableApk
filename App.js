// react-native-otp-textinput peer deps karelu che ema... check it outs

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Text, Alert } from 'react-native';
import SplashScreen from './SplashScreen';
// import { PaperProvider } from 'react-native-paper';

import StackNavigatorMain from './screensMain/StackNavigators';
import StackNavigatorLogin from './screensLogin/StackNavigators';
import StackSearch from './search/StackSearch';
import Notifications from './Notifications';
import EditHome from './Home/EditHome';
import EditHomeDynamic from './Home/EditHomeDynamic';
import EditHomeDynamicA4 from './VisiteAndA4/EditHomeDynamicA4';
import EditBusiness from './Business/EditBusiness';
import EditTempFromCustom from './custom/EditTemp';
import ChooseCustomFrame from './custom/ChooseCustomFrame';
import WithdrawWallet from './MLM/WithdrawWallet';
import UplineDetails from './MLM/UplineDetails';

import PDFExample from './VisiteAndA4/PdfViewer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EditCustomChoice from './custom/EditCustomChoice';

import BinaryIcome from './WalletHistory/BinaryIcome';
import History from './WalletHistory/History';
import TotalEarning from './WalletHistory/TotalEarning';
import SponserIncome from './WalletHistory/SponserIncome';
import Reward from './WalletHistory/Reward';
import Royalty from './WalletHistory/Royalty';
import G_Royalty from './WalletHistory/G_Royalty';
import WithdrawHistory from './WalletHistory/WithdrawHistory';
import WithdrawHistoryAbcd from './WalletHistory/WithdrawHistoryAbcd';

// profile
// import CustomFrame from './CustomFrame1';
import CustomFrame from './Profile/CustomFrame1';
// import SavedFrames from './SavedFrames';
// import CustomFrames from './CustomFrames';
// import CustomFramesRequest from './CustomFrameRequest';
// import fullScreenProfile from './fullScreenProfile';
import CustomFrame2 from './Profile/CustomFrame2';
import EditProfile from './Profile/EditProfile';
import Frames from './Profile/Frames';
import CustomFrameForm from './Profile/CustomFrame1';
import ViewProfile from './Profile/ViewProfile';
// import StackCustom from './RequestFrames/StackCustom';
import StackCustom from './RequestFrameNew/StackCustom';

import VisitingScreen from './VisiteAndA4/VisitingScreen';
import A4Screen from './VisiteAndA4/A4Screen';

import { requestUserPermission } from "./src/utils/notificationHeloper";

import NetInfo from "@react-native-community/netinfo";
import RNRestart from 'react-native-restart';

import PrivacyPolicy from './PrivacyPolicy';
import RefundPolicy from './ReturnPolicy';

// pin set
import MLMpinSetScr from './MLM/MpinSetScr';

import KycVerfication from './MLM/KycVerification';
import Help from "./MLM/Help"
import ReferralHistory from './WalletHistory/ReferalHistory';
import UpgradePlan from './MLM/UpgradePlan';
import CardsForm from './VisiteAndA4/CardsForm';
import EditHomeA4 from './VisiteAndA4/EditHomeA4';
import CategoriesA4Screen from './Home/SubCategoriesScreen/CategoryA4Screen';

// checking network connection

const Stack = createNativeStackNavigator();

const MyStack = () => {

  useEffect(() => {
    requestUserPermission()
  }, [])

  const [loader, setLoader] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const retrieveData = async () => {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(data === 'true');
    } catch (error) {
      console.log('Error retrieving login status:', error);
    }
  };

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == false) {
        Alert.alert(
          'No internet',
          'Please check your internet Connection!',
          [
            {
              text: 'Restart App',
              onPress: () => { RNRestart.Restart() }
            },
          ],
          { cancelable: false },
        );
      } else {
        null
      }
    });

    const initializeApp = async () => {
      await retrieveData();
      setTimeout(() => {

        // alert("loader set to false")
        setLoader(false);

      }, 4000);
    };

    initializeApp();
  }, []);

  return (
    <>
      {loader ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isLoggedIn ? ('StackMain') : ("StackLogin")}>
            <Stack.Screen
              name="StackMain"
              component={StackNavigatorMain}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SearchScreen"
              component={StackSearch}
              options={{
                headerShown: false,
                animation: 'slide_from_right',  
              }}
            />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="RefundPolicy" component={RefundPolicy} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="WithdrawWallet" component={WithdrawWallet} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="CardsForm" component={CardsForm} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="EditHomeScreen" component={EditHome} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="EditHomeScreenA4" component={EditHomeA4} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="EditHomeDynamic" component={EditHomeDynamic} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="EditHomeDynamicA4" component={EditHomeDynamicA4} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="EditBusiness" component={EditBusiness} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="EditTempFromCustom" component={EditTempFromCustom} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="EditCustomChoice" component={EditCustomChoice} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="ChooseCustomFrame" component={ChooseCustomFrame} options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen name="CategoriesA4Screen" component={CategoriesA4Screen} options={{ headerShown: false, animation: 'slide_from_right', }} />

            {/* profile screen */}
            <Stack.Screen name="Frames" component={Frames} options={{ headerShown: false, animation: 'slide_from_right' }} />
            {/* <Stack.Screen name="CustomFramesRequest" component={CustomFramesRequest} options={{headerShown:false}} /> */}
            <Stack.Screen name="CustomFrameFormProfile" component={CustomFrameForm} options={{ headerShown: false }} />
            <Stack.Screen name="CustomFrameScreen" component={CustomFrame} options={{ headerShown: false }} />
            <Stack.Screen name="CustomFrameScreen2" component={CustomFrame2} options={{ headerShown: false }} />
            {/* <Stack.Screen name="fullScreenProfile" component={fullScreenProfile} options={{ headerShown: false }} /> */}
            <Stack.Screen name="editprofile" component={EditProfile} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name="ViewProfile" component={ViewProfile} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name="StackCustom" component={StackCustom} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name="MLMpinSetScr" component={MLMpinSetScr} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name="KycVerfication" component={KycVerfication} options={{ headerShown: false }} />
            <Stack.Screen name="Help" component={Help} options={{ headerShown: false ,  animation: 'slide_from_right' }} />
            <Stack.Screen name="UplineDetails" component={UplineDetails} options={{ headerShown: false ,  animation: 'slide_from_right' }} />

            {/* pdf */}
            <Stack.Screen name="PDFExample" component={PDFExample} options={{ headerTitle: "Visiting Card" ,  animation: 'slide_from_right' }} />

            {/* user money history */}
            <Stack.Screen name="BinaryIcome" component={BinaryIcome} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="TotalEarning" component={TotalEarning} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="History" component={History} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="SponserIncome" component={SponserIncome} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="Reward" component={Reward} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="Royalty" component={Royalty} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="G_Royalty" component={G_Royalty} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="WithdrawHistory" component={WithdrawHistory} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="WithdrawHistoryAbcd" component={WithdrawHistoryAbcd} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="ReferralHistory" component={ReferralHistory} options={{ headerShown: false , animation: 'slide_from_right' }} />



            <Stack.Screen name="A4Screen" component={A4Screen} options={{ headerShown: false , animation: 'slide_from_right' }} />
            <Stack.Screen name="VisitingScreen" component={VisitingScreen} options={{ headerShown: false , animation: 'slide_from_right' }} />
            {/* upgrade plan */}
            <Stack.Screen name="UpgradePlan" component={UpgradePlan} options={{ animation: 'slide_from_right', }} />

            <Stack.Screen
              name="Notifications"
              component={Notifications}
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="StackLogin"
              component={StackNavigatorLogin}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MyStack;

// import React, { useEffect, useState } from 'react';
// import { View, Text, Image } from 'react-native';

// const YourComponent = () => {
//   const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     const imageUrl = 'https://cdn.brandingprofitable.com/upload/6564637942465astronomy-1867616_1280.jpg'; // Replace with the actual URL or path of your image

//     Image.getSize(
//       imageUrl,
//       (width, height) => {
//         setImageSize({ width, height });
//       },
//       (error) => {
//         console.error('Error getting image size:', error);
//       }
//     );
//   }, []);

//   return (
//     <View>
//       <Text>Image Width: {imageSize.width}</Text>
//       <Text>Image Height: {imageSize.height}</Text>
//     </View>
//   );
// };

// export default YourComponent;


// import React from 'react'

// import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Dimensions, Image, ActivityIndicator, Modal, Alert, ScrollView, ToastAndroid, Keyboard, PermissionsAndroid, Platform } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { WebView } from 'react-native-webview';

// const App = () => {
//   const { width, height } = Dimensions.get('window');
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
//       <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'white', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
//         <TouchableOpacity onPress={() => {}} style={{ padding: 15 }}>
//           <Text><MaterialCommunityIcons name="close" size={20} color={'black'} /></Text>
//         </TouchableOpacity>
//       </View>
//       <WebView
//         style={{ height }}
//         // onNavigationStateChange={handleNavigationStateChange}
//         source={{ uri: "http://192.168.1.9:3000/" }}
//       />
//     </SafeAreaView>
//   )
// }

// export default App