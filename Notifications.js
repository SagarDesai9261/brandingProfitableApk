import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(notifications)

  // [{"android": {}, "body": "Kuber", "title": "Branding Profitable"}, {"android": {}, "body": "Kuber", "title": "Branding Profitable"}]

  const getNoti = async () => {
    try {
      AsyncStorage.getItem('myArrayKey')
        .then(value => {
          if (value !== null) {
            // Parse the JSON string back into an array
            const parsedArray = JSON.parse(value);
            setNotifications(parsedArray.reverse())
            setLoading(false)
          } else {
            console.log('No array data found in AsyncStorage.');
            setLoading(false)
          }
        })
        .catch(error => {
          console.error('Error retrieving array data: ', error);
        });
    } catch (error) {
      console.log("getting error on get noties:", error)
    }
  }

  useEffect(() => {
    getNoti();
  }, []);

  useEffect(() => {
    // Add a BackHandler event listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('mjgohel');
      AsyncStorage.removeItem('myArrayKey')
      AsyncStorage.setItem('notiCount', '0')
      navigation.goBack();
      return true; // Return true to indicate that the event has been handled
    });

    // Remove the event listener when the component unmounts
    return () => {
      backHandler.remove();
    };
  }, []);

  const renderItem = ({ item }) => {
    const sentTime = item?.sentTime;
    const formattedTime = new Date(sentTime).toLocaleString();

    return (
      <View style={{ padding: 20, backgroundColor: '#050505', margin: 20, marginTop: 10, marginBottom: 5, borderRadius: 10, flexDirection: 'row', elevation: 5 }}>
        <Text>
          <MaterialCommunityIcons name="message-text" size={25} color={'white'} />
        </Text>
        <View style={{ marginLeft: 20, width: '100%' }}>
          <Text style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 17, marginBottom: 4 }}>
            {item?.title || 'Title'}
          </Text>
          <Text style={{ color: 'gray', fontFamily: 'Inter-Bold', fontSize: 13 }}>
            {item?.body || 'notification body'}
          </Text>
          {/* <View style={{ marginTop: 10 }}>
            <Text style={{ color: 'gray', fontFamily: 'Inter-Bold', fontSize: 10, }}>
              {formattedTime || 'notification Time'}
            </Text>
          </View> */}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Text style={{ color: 'white', padding: 10 }} onPress={() => {
            navigation.goBack();

            AsyncStorage.removeItem('myArrayKey')
            AsyncStorage.setItem('notiCount', '0')
          }} >
            <Icon name="angle-left" size={30} color={'white'} />
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Manrope-Bold',
              marginLeft: 15,
            }}>
            {' '}
            Notifications{' '}
          </Text>
        </View>
      </View>

      {notifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {
            loading ? <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>
              ...
            </Text> : <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>
              Notifications not Found!
            </Text>
          }
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </LinearGradient>
  );
};

export default Notifications;
