import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

// screens
import MLMhome from './MLMhome'
import MlmUserInReview from './MlmUserInReview'
import MLMpinSetScr from './MpinSetScr'
import UpgradePlan from './UpgradePlan'

const MainMLMScreen = () => {

  const [profileData, setProfileData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState('');
  const [userTeamDetails, setUserTeamDetails] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [isMLMPurchased, setIsMLMPurchased] = useState();

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString && !dataFetched) {
        const data = JSON.parse(dataString);
        setProfileData(data);
        fetchDataAndDetails(data);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const fetchDataAndDetails = async (profileData) => {
    try {
      if (profileData) {
        const [response, subscriptionResponse] = await Promise.all([
          axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`),
          axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`),
        ]);

        const result = response.data;
        const subscriptionResult = subscriptionResponse.data.statusCode;

        if (response.data.statusCode === 200) {
          await AsyncStorage.setItem('UserVipTag', `(${result?.details?.role})`);
          setLoader(false);
        } else {
          await AsyncStorage.removeItem('UserVipTag');
        }

        setUserTeamDetails(result?.details);
        setIsMLMPurchased(result?.is_mlm)
        setIsSubscribed(subscriptionResult);
        console.log(subscriptionResult)
        setDataFetched(true)
      } else {
        console.log("Profile data not found");
      }
    } catch (error) {
      console.log("Error:", error);
      await AsyncStorage.removeItem('UserVipTag');
    } finally {
      if (profileData.length !== 0) {
        setLoader(false); // Set loader to false only when profileData is not available
      }
    }
  };
  const fetchDataAndDetailsFromScreen = async () => {
    try {
      if (profileData.length != 0) {
        const [response, subscriptionResponse] = await Promise.all([
          axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`),
          axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData?.mobileNumber}`),
        ]);
        const result = response.data;
        const subscriptionResult = subscriptionResponse.data.statusCode;

        if (response.data.statusCode === 200) {
          await AsyncStorage.setItem('UserVipTag', `(${result?.details?.role})`);
          setLoader(false);
        } else {
          await AsyncStorage.removeItem('UserVipTag');
        }

        setUserTeamDetails(result?.details);
        setIsMLMPurchased(result?.is_mlm)
        // setUserTeamDetails(result?.details);
        setIsSubscribed(subscriptionResult); 
        setDataFetched(true)
      } else {
        console.log("Profile data not found");
      }
    } catch (error) {
      console.log("Error:", error);
      await AsyncStorage.removeItem('UserVipTag');
    } finally {
      if (profileData.length !== 0) {
        setLoader(false); // Set loader to false only when profileData is not available
      }
    }
  };

  useEffect(() => {
    retrieveProfileData();
  }, []);

  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'black'} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {isSubscribed == 200 ? (
        // <MlmUserInReview fetchData={fetchDataAndDetailsFromScreen} />

        <MLMpinSetScr isMLMPurchased={isMLMPurchased} profileData={profileData} userTeamDetails={userTeamDetails} fetchMLMData={fetchDataAndDetailsFromScreen} />
      ) : isSubscribed == 202 ? (
        <MlmUserInReview fetchData={fetchDataAndDetailsFromScreen} />
      ) : (
        <MLMhome fetchData={fetchDataAndDetailsFromScreen} />
        // <UpgradePlan />
      )}
    </View>
  )
}

export default MainMLMScreen