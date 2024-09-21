import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, StyleSheet } from 'react-native';

import CustomStack from '../custom/CustomStack';
import StackHome from '../Home/StackNavigatorHome';
import StackProfile from '../Profile/StackProfile';
// import MLMScreenStack from '../MLM/MlmScreenStack';
import StackMLM from '../MLM/StackMLM';
// import BusinessStack from '../Business/BusinessStack';
import FastImage from 'react-native-fast-image';
import StackBusiness from '../Business/StackBusiness';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../SplashScreen';
import axios from 'axios';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    elevation: 0,
    borderColor: 'black',
    height: 60,
    paddingTop: 5,

    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // Change this to the desired background color
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingBottom: 5
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {

    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 30,
    height: 35,
    backgroundColor: '#F5ACAE',
    marginTop: 10,
    alignSelf: 'center', // Align the active tab to the center
  },
  tabIcon: {
    height: 25,
    width: 25,
    marginTop: 10,
  },
  activeText: {
    color: '#FF0000',
    fontFamily: 'Poppins-Regular',
  },
});

const MyStack = () => {

  // for splash screen
  const [allDataisLoaded, setAllDataIsLoaded] = React.useState(false)

  const mj = "this is my app screen.";

  const [popUpScreenData, setPopUpScreenData] = React.useState('')

  const [businessOrPersonal, setBusinessOrPersonal] = React.useState('');
  const fetchData = async () => {
    const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
    console.log('main screen ma set krelo business or personal - ', businessOrPersonal)
    setBusinessOrPersonal(businessOrPersonal);
  };

  const dataisLoaded = () => {
    console.log("data is loaded in main app.js screen!")
    setAllDataIsLoaded(true)
  }

  React.useEffect(() => {
    fetchData()
  });

  const fetchPopUp = async () => {
    try {
      const response = await axios.get('https://api.brandingprofitable.com/popup_banner/popup_banner');

      setPopUpScreenData("https://cdn.brandingprofitable.com/" + response.data.data[0].popupBannerImage);

      setTimeout(() => {
        setAllDataIsLoaded(true)
        // dataisLoaded();
      }, 3000);
    } catch (e) {
      console.log("getting error in stack navigator screen", e)
    }
  }

  React.useEffect(() => {
    fetchPopUp();
  }, []);

  const dataToSendInHome = {
    popUpImg: popUpScreenData
  }

  if (!allDataisLoaded) {
    return (
      <SplashScreen />
    )
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabContainer,
      }}
    >
      {/* <Tab.Screen name="StackHomeScreen" component={StackHome} options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/home2.png')} style={{ height: 22, width: 22, }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                  {""}  Home
                </Text>
              </View>)
          } else {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/home.png')} style={{ height: 22, width: 22, }} />
                <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                  {""}  Home
                </Text>
              </View>)
          }
        },
      }} />
       */}

      {/* for splash screen */}
      <Tab.Screen
        name="StackHomeScreen"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                  <FastImage source={require('../assets/Icons/home2.png')} style={{ height: 22, width: 22, }} />
                  <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                    {""}  Home
                  </Text>
                </View>)
            } else {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                  <FastImage source={require('../assets/Icons/home.png')} style={{ height: 22, width: 22, }} />
                  <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                    {""}  Home
                  </Text>
                </View>)
            }
          },
        }}
      >
        {() => <StackHome dataisLoaded={dataisLoaded} dataToSendInHome={dataToSendInHome} />}
      </Tab.Screen>

      <Tab.Screen name="customstack" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/brush1.png')} style={{ height: 22, width: 22 }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', marginRight: 0, fontSize: 10, marginTop: 1 }}>
                  {" "}Custom
                </Text>
              </View>)
          } else {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/brush.png')} style={{ height: 22, width: 22 }} />
                <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', marginRight: 0, fontSize: 10, marginTop: 1 }}>
                  {" "}Custom
                </Text>
              </View>)
          }
        },
      }} component={CustomStack} />
      {/* 
      {businessOrPersonal == 'personal' ? (
        null
      ) : ( */}
      <Tab.Screen name="BusinessStack" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/bag1.png')} style={{ height: 22, width: 22, }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', marginRight: 6, fontSize: 10, marginTop: 1 }}>
                  {" "}Business
                </Text>
              </View>)
          } else {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/bag.png')} style={{ height: 22, width: 22, }} />
                <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', marginRight: 6, fontSize: 10, marginTop: 1 }}>
                  {" "}Business
                </Text>
              </View>)
          }
        },
      }} component={StackBusiness} />
      {/* // )} */}

      <Tab.Screen name="StackProfileScreen" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/user1.png')} style={{ height: 20, width: 20, }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                  {""} Profile
                </Text>
              </View>)
          } else {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/user.png')} style={{ height: 23, width: 23, }} />
                <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                  {""} Profile
                </Text>
              </View>)
          }
        },
      }} component={StackProfile} />

      <Tab.Screen name="MlmScreenStack" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/new.png')} style={{ height: 22, width: 22, marginLeft: 5 }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                  {""}  Refer & Earn

                </Text>
              </View>)
          } else {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, }}>
                <FastImage source={require('../assets/Icons/mlm.png')} style={{ height: 22, width: 22, marginLeft: 5 }} />
                <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 }}>
                  {""}  Refer & Earn

                </Text>
              </View>)
          }
        },
      }} component={StackMLM} />

    </Tab.Navigator>
  );
};

export default MyStack;


