// import React, { useEffect, useState, useRef } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { WebView } from 'react-native-webview';

// const WebViewScreen = () => {
//   // const { isLeft, isRight, treeData } = props;

//   const isLeft = true
//   const isRight = false;
//   const treeData = {
//     "fullName": "A100",
//     "number": "100",
//     "parent_id": "50",
//     "referral_id": "50",
//     "total_earn": "0",
//     "green_wallet": "1500",
//     "red_wallet": "0",
//     "total_member": "0",
//     "right_side": "1",
//     "left_side": "1",
//     "total_right_side": "1",
//     "total_left_side": "1",
//     "add_side": "left",
//     "user_leval": "B",
//     "leval_no": "6",
//     "last_paid_L_count": "0",
//     "last_paid_R_count": "0",
//     "today_right_side": "0",
//     "today_left_side": "0",
//     "last_paid_pair_today": "0",
//     "royalty_total_count_L": "0",
//     "royalty_total_count_R": "0",
//     "royalty_monthly_count_L": "0",
//     "royalty_monthly_count_R": "0",
//     "royalty_last_paid_L": "0",
//     "royalty_last_paid_R": "0",
//     "royalty_end_count_L": "0",
//     "royalty_end_count_R": "0",
//     "director_monthly_count_R": "0",
//     "director_monthly_count_L": "0",
//     "director_total_count_R": "0",
//     "director_total_count_L": "0",
//     "date": "2021-12-06 13:20:41",
//     "register_date": "2021-12-06",
//     "V1": "0",
//     "V2": "0",
//     "V3": "0",
//     "V4": "0",
//     "V5": "0",
//     "V6": "0",
//     "V7": "0",
//     "g_roylty_get_count": "0",
//     "director_date": "",
//     "children": [
//     {
//     "0": "A200",
//     "1": "200",
//     "2": "100",
//     "3": "100",
//     "4": "0",
//     "5": "0",
//     "6": "0",
//     "7": "0",
//     "8": "0",
//     "9": "0",
//     "10": "0",
//     "11": "0",
//     "12": "left",
//     "13": "B",
//     "14": "7",
//     "15": "0",
//     "16": "0",
//     "17": "0",
//     "18": "0",
//     "19": "0",
//     "20": "0",
//     "21": "0",
//     "22": "0",
//     "23": "0",
//     "24": "0",
//     "25": "0",
//     "26": "0",
//     "27": "0",
//     "28": "0",
//     "29": "0",
//     "30": "0",
//     "31": "0",
//     "32": "2021-12-20 13:21:27",
//     "33": "2021-12-20",
//     "34": "0",
//     "35": "0",
//     "36": "0",
//     "37": "0",
//     "38": "0",
//     "39": "0",
//     "40": "0",
//     "41": "0",
//     "42": "",
//     "fullName": "A200",
//     "number": "200",
//     "parent_id": "100",
//     "referral_id": "100",
//     "total_earn": "0",
//     "green_wallet": "0",
//     "red_wallet": "0",
//     "total_member": "0",
//     "right_side": "0",
//     "left_side": "0",
//     "total_right_side": "0",
//     "total_left_side": "0",
//     "add_side": "left",
//     "user_leval": "B",
//     "leval_no": "7",
//     "last_paid_L_count": "0",
//     "last_paid_R_count": "0",
//     "today_right_side": "0",
//     "today_left_side": "0",
//     "last_paid_pair_today": "0",
//     "royalty_total_count_L": "0",
//     "royalty_total_count_R": "0",
//     "royalty_monthly_count_L": "0",
//     "royalty_monthly_count_R": "0",
//     "royalty_last_paid_L": "0",
//     "royalty_last_paid_R": "0",
//     "royalty_end_count_L": "0",
//     "royalty_end_count_R": "0",
//     "director_monthly_count_R": "0",
//     "director_monthly_count_L": "0",
//     "director_total_count_R": "0",
//     "director_total_count_L": "0",
//     "date": "2021-12-20 13:21:27",
//     "register_date": "2021-12-20",
//     "V1": "0",
//     "V2": "0",
//     "V3": "0",
//     "V4": "0",
//     "V5": "0",
//     "V6": "0",
//     "V7": "0",
//     "g_roylty_get_count": "0",
//     "director_date": "",
//     "children": []
//     },
//     {
//     "0": "A201",
//     "1": "201",
//     "2": "100",
//     "3": "100",
//     "4": "0",
//     "5": "0",
//     "6": "0",
//     "7": "0",
//     "8": "0",
//     "9": "0",
//     "10": "0",
//     "11": "0",
//     "12": "right",
//     "13": "B",
//     "14": "7",
//     "15": "0",
//     "16": "0",
//     "17": "0",
//     "18": "0",
//     "19": "0",
//     "20": "0",
//     "21": "0",
//     "22": "0",
//     "23": "0",
//     "24": "0",
//     "25": "0",
//     "26": "0",
//     "27": "0",
//     "28": "0",
//     "29": "0",
//     "30": "0",
//     "31": "0",
//     "32": "2021-12-20 13:21:27",
//     "33": "2021-12-20",
//     "34": "0",
//     "35": "0",
//     "36": "0",
//     "37": "0",
//     "38": "0",
//     "39": "0",
//     "40": "0",
//     "41": "0",
//     "42": "",
//     "fullName": "A201",
//     "number": "201",
//     "parent_id": "100",
//     "referral_id": "100",
//     "total_earn": "0",
//     "green_wallet": "0",
//     "red_wallet": "0",
//     "total_member": "0",
//     "right_side": "0",
//     "left_side": "0",
//     "total_right_side": "0",
//     "total_left_side": "0",
//     "add_side": "right",
//     "user_leval": "B",
//     "leval_no": "7",
//     "last_paid_L_count": "0",
//     "last_paid_R_count": "0",
//     "today_right_side": "0",
//     "today_left_side": "0",
//     "last_paid_pair_today": "0",
//     "royalty_total_count_L": "0",
//     "royalty_total_count_R": "0",
//     "royalty_monthly_count_L": "0",
//     "royalty_monthly_count_R": "0",
//     "royalty_last_paid_L": "0",
//     "royalty_last_paid_R": "0",
//     "royalty_end_count_L": "0",
//     "royalty_end_count_R": "0",
//     "director_monthly_count_R": "0",
//     "director_monthly_count_L": "0",
//     "director_total_count_R": "0",
//     "director_total_count_L": "0",
//     "date": "2021-12-20 13:21:27",
//     "register_date": "2021-12-20",
//     "V1": "0",
//     "V2": "0",
//     "V3": "0",
//     "V4": "0",
//     "V5": "0",
//     "V6": "0",
//     "V7": "0",
//     "g_roylty_get_count": "0",
//     "director_date": "",
//     "children": []
//     }
//     ]
//     }
//   const webViewRef = useRef(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loaderTimeout = setTimeout(() => {
//       setLoading(false);
//     }, 3000);

//     return () => clearTimeout(loaderTimeout);
//   }, []);

//   const handleLoad = () => {
//     postTreeData();
//   };

//   const filterTreeData = (data) => {
//     if (data && data.children) {
//       if (isLeft) {
//         data.children = data.children.filter(child => child.side !== 'right');
//       }

//       if (isRight) {
//         data.children = data.children.filter(child => child.side !== 'left');
//       }
//     }

//     return data;
//   };

//   const postTreeData = () => {
//     if (treeData) { 
//       const dataToSend = filterTreeData({ ...treeData }); 
//       if (webViewRef.current) {
//         webViewRef.current.injectJavaScript(`
//         window.postMessage(JSON.stringify(${JSON.stringify(dataToSend)}), '*');
//         `);
//       }
//     }
//   };

//   useEffect(() => {
//     postTreeData();
//   }, [isLeft, isRight]);

//   const countUsers = (node) => {
//     if (!node) {
//       return 0;
//     }

//     let count = 1; // Count the current user

//     if (node.children && node.children.length > 0) {
//       for (const child of node.children) {
//         count += countUsers(child); // Recursively count users in children
//       }
//     }

//     return count;
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator color={'white'} />
//       </View>
//     );
//   }

//   return (
//     <WebView
//       ref={webViewRef}
//       source={{ uri: 'http://192.168.1.28:3000/dev/bt' }}
//       // source={{ uri: 'https://sparrowsofttech.in/dev/bt' }}
//       onLoad={handleLoad}
//       onMessage={(event) => {
//         try {
//           const receivedData = JSON.parse(event.nativeEvent.data);
//           if (receivedData.action === 'customNodeClicked') {
//             // Handle the message here
//             console.log('Custom node clicked with ID:', receivedData.number);
//           }
//         } catch (error) {
//           console.error('Error parsing received data:', error);
//         }
//       }}
//     />
//   );
// };

// export default WebViewScreen;


import React from 'react';
import { View, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

function WebViewComponent({ number, isDirect, treeData }) {
  const webViewRef = React.useRef(null);

  console.log(treeData)

  const navigation = useNavigation();

  React.useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', openWebView);

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [navigation])

  const openWebView = () => {
    // Use the ref to send a message to the WebView
    if (webViewRef.current) {
      const message = isDirect ? {
        isDirect,
        number
      } : {
        number
      };
      webViewRef.current.injectJavaScript(`window.postMessage(JSON.stringify(${JSON.stringify(message)}), '*');`);
    }
  };


  React.useEffect(() => {
    openWebView();
  }, [isDirect])

  openWebView();

  return (
    <View style={{ flex: 1 }}>

      <WebView
        ref={webViewRef}
        // source={{ uri: 'https://sparrowsofttech.in/dev/bttesting' }}
        source={{ uri: 'https://sparrowsofttech.in/dev/bt' }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          console.log('Received data from WebView:', data);
        }}
        onLoad={openWebView}
      />

    </View>
  );
}

export default WebViewComponent;
