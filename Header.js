import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window')

const Header = ({ name }) => {
  const [businessOrPersonal, setBusinessOrPersonal] = useState('');
  const navigation = useNavigation();

  const [userVipRole, setUserVipRole] = useState('')

  const fetchUserRole = async () => {
    try {
      const userRole = await AsyncStorage.getItem('UserVipTag')
      // console.log("user role found from local storage:", userRole)
      if (userRole) {
        setUserVipRole(userRole)
      }
    } catch (error) {
      console.log("error to getting vip role: ", error)
    }
  }

  useEffect(() => {
    fetchUserRole();
  });

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
      setBusinessOrPersonal(businessOrPersonal);
    };

    fetchData();
  }, []);

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    retrieveProfileData();
  }, []);

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  };

  const [notificationCount, setNotificationCount] = useState(0);

  const getNotificationCounts = async () => {
    try {
      const notificationCount = await AsyncStorage.getItem('notiCount');

      if (notificationCount) {
        setNotificationCount(notificationCount)
      }

    } catch (error) {
      console.log('Error getting notification counts:', error);
    }
  }

  useEffect(() => {
    getNotificationCounts();
  }, []);

  const reloadScreen = () => {
    retrieveProfileData()
    getNotificationCounts()
  }

  const lengthOfName = width >= 360 ? 15 : width <= 359 && width >= 320 ? 12 : 10;

  useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', reloadScreen);

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [navigation])

  return (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
        <View
          style={{
            backgroundColor: '#dedede',
            borderRadius: 100,
            borderWidth: 1,
            borderColor: 'black',
            height: 45,
            width: 45,
            overflow: 'hidden',
          }}>
          <FastImage
            source={{ uri: profileData?.businessLogo || profileData?.profileImage }}
            style={{ height: 45, width: 45 }}
          />
        </View>

        <TouchableOpacity onPress={() => { navigation.navigate('StackProfileScreen') }}>
          <Text style={[styles.buisnessTitle, { elevation: 3 }]}>
            {profileData !== null &&

              profileData?.fullName.length < lengthOfName
              ? `${profileData?.fullName} `
              : `${profileData?.fullName.substring(0, lengthOfName)}..`

              || 'John Doe'}
          </Text> 
          <Text style={styles.yourBuisness}>
            {businessOrPersonal == 'business' ? 'Business' : 'Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, alignItems:'center' }}>
        <Text style={[styles.buisnessTitle, { elevation: 3 }]}>{userVipRole == 'Director' ? "(D)" : userVipRole}</Text>
        <TouchableOpacity onPress={() => { navigation.navigate('Notifications') }} style={{ position: 'relative' }}>
          <Icon name="bell" size={22} color={name != undefined ? 'white' : '#FF0000'} />
          {notificationCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                padding: 3,
                borderRadius: 100,
                backgroundColor: name != undefined ? 'white' : 'red',
                borderColor: 'white',
                borderWidth: 0.2,
                elevation: 2,
              }}>
              <Text
                style={{
                  color: name != undefined ? 'black' : 'white',
                  fontSize: 7,
                  fontFamily: 'Manrope-Bold',
                  textAlign: 'center',
                  minWidth: 10,
                }}>
                {notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>


    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: 65,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  buisnessTitle: {
    fontSize: 19,
    color: 'white',
    fontFamily: 'Manrope-Bold',
  },
  yourBuisness: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    color: 'white'
  },
});
