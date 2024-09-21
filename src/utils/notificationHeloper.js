import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';

function GetFCMToken() {
  let fcmToken = AsyncStorage.getItem("fcmtoken");
}

export async function requestUserPermission() {
  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      50
    )
  }

  GetFCMToken();
  let fcmtoken;
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    if (!fcmtoken) {
      try {
        fcmtoken = await messaging().getToken();
        if (fcmtoken) {
          console.log('new fcmToken:', fcmtoken);
          await AsyncStorage.setItem('fcmtoken', fcmtoken);
        }
      } catch (error) {
        console.log('error in Notification:', error);
      }
    }
  }

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // Handle the notification here
    handleNotification(remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    showToastWithGravity("New Notification!");
    // Handle the notification here
    handleNotification(remoteMessage);
  });

  messaging()
    .getInitialNotification() 
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // Handle the notification here
        handleNotification(remoteMessage);
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log("notification on foreground state......", remoteMessage);
    showToastWithGravity("New Notification!");
    // Handle the notification hereccccccccccc
    handleNotification(remoteMessage);
  });
}

// Function to handle notifications
async function handleNotification(remoteMessage) {

  AsyncStorage.getItem('myArrayKey')
    .then(value => {
      if (value !== null) {
        const parsedArray = JSON.parse(value);
        console.log(remoteMessage.notification)
        parsedArray.push(remoteMessage.notification)
        // Convert the array to a JSON string

        const noticount = parsedArray.length

        console.log("notification count:", noticount)

        // 
        AsyncStorage.setItem('notiCount', noticount.toString())

        const jsonValue = JSON.stringify(parsedArray);

        // 
        AsyncStorage.setItem('myArrayKey', jsonValue)
          .then(() => {
            console.log('Array data stored in AsyncStorage.');
          })
          .catch(error => {
            console.error('Error storing array data: ', error);
          });
      } else {
        const parsedArray = [];
        parsedArray.push(remoteMessage.notification)
        const noticount = parsedArray.length

        console.log("notification count:", noticount)

        AsyncStorage.setItem('notiCount', noticount.toString())

        // Convert the array to a JSON string
        const jsonValue = JSON.stringify(parsedArray);

        // 
        AsyncStorage.setItem('myArrayKey', jsonValue)
          .then(() => {
            console.log('Array data stored in AsyncStorage.');
          })
          .catch(error => {
            console.error('Error storing array data: ', error);
          });
      }
    })
    .catch(error => {
      console.error('Error retrieving array data: ', error);
    });
}
