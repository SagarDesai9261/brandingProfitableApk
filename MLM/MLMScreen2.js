import { View, Text, StyleSheet, Button, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Linking, TextInput, Keyboard } from 'react-native'
import CryptoJS from "react-native-crypto-js";
import React, { useState, useEffect, useLayoutEffect } from 'react'
import WebViewScreen from './Webview'
// import WebViewScreen from './MLM/Webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Share from 'react-native-share';

const { height } = Dimensions.get('window');

const MLMScreen2 = ({ navigation, route }) => {

  const { aadhar, id, greenWallet } = route.params;

  // const aadhar = 1;
  // const greenWallet = 1

  const [isLeft, setIsLeft] = React.useState(true);
  const [isRight, setIsRight] = React.useState(true);
  const [isDirect, setIsDirect] = React.useState(false);

  const [treeData, setTreeData] = React.useState([]);
  const [DirectSponser, setDirectSponser] = React.useState([]);
  const [isload, setisload] = useState(true);

  const [shareData, setShareData] = useState([{ "name": "Meghji Chavda", "referralId": "9904128113", "side": ["right", "left"], "treeId": 41553 }, { "name": "Vaibhav Goti", "referralId": "9409354326", "side": ["left"], "treeId": 43913 }])
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSide, setSelectedSide] = useState(["left", "right"]);
  const [selectedSideByUser, setSelectedSideByUser] = useState("side");
  const [selectedTreeId, setSelectedTreeId] = useState("Referal Id");

  const handleLeftClick = (variable) => {
    setIsLeft(variable === 'right');
    // setIsLeft(variable === 'left');
    setIsRight(variable === 'right');
    setIsDirect(variable === 'direct');
  };

  const fetchData = async () => {
    try {
      const [directResponse, treeViewResponse, shareData] = await Promise.all([
        axios.get(`https://api.brandingprofitable.com/user/directresponce/${aadhar}`),
        // axios.get(`https://api.brandingprofitable.com/user/directresponce/${aadhar}`),
        axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${aadhar}`),
        axios.get(`https://api.brandingprofitable.com/mlm/findpair/${aadhar}`),
      ]);

      setisload(false);
      setDirectSponser(directResponse.data);
      setTreeData(treeViewResponse.data.details);
      //   setTreeData(treeViewResponse.data.details);

      setShareData(shareData.data.users)
      // setSelectedTreeId(shareData.data.users[0].mobileNumber)
      setSelectedLanguage(aadhar.toString())
    } catch (error) {
      setisload(false);
      console.log('Error fetching data in api of mlm 2: in fetch data in mlm screen 2', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const countUsersInNode = node => {
    if (!node) {
      return 0;
    }

    let count = 1; // Count the current node

    if (node.children) {
      node.children.forEach(child => {
        count += countUsersInNode(child);
      });
    }

    return count;
  };

  const findFirstChildBySide = (node, side) => {
    if (!node || !node.children) {
      return null;
    }

    for (const child of node.children) {
      if (child.side === side) {
        return child;
      }
    }

    return null;
  };

  const firstChildWithRightSide = findFirstChildBySide(treeData, 'right');
  const firstChildWithLeftSide = findFirstChildBySide(treeData, 'left');

  const numberOfChildren = DirectSponser.children ? DirectSponser.children.length : 0

  // Count users under the first child with side 'right'
  //   const userCountRight = firstChildWithRightSide
  //     ? countUsersInNode(firstChildWithRightSide)
  //     : 0;
  //   const userCountLeft = firstChildWithLeftSide
  //     ? countUsersInNode(firstChildWithLeftSide)
  //     : 0;
  const userCountRight = parseInt(treeData?.rightSideTotalJoining);
  const userCountLeft = parseInt(treeData?.leftSideTotalJoining);

  console.log(userCountLeft, userCountRight)

  const userCountAll = parseInt(userCountLeft) + parseInt(userCountRight)

  // show dropdown modal 
  const [isModalVisible5, setModalVisible5] = useState(false);

  const showAlert5 = () => {
    setModalVisible5(true);
  };

  const hideAlert5 = () => {
    setModalVisible5(false);
  };

  const handleShare = async () => {
    hideAlert5();

    if (selectedLanguage == '' || selectedLanguage == ' ' || selectedTreeId == 'Refer Id' || selectedTreeId == '' || selectedTreeId == ' ' || selectedSideByUser == 'side' || selectedSideByUser == 'Side' || selectedSideByUser == '') {
      showToastWithGravity("fill all details")
      return;
    }

    try {
      const message = `Sponser ID: ${selectedLanguage}\nRefer ID: ${selectedTreeId}\nSide: ${selectedSideByUser}\nApp: https://play.google.com/store/apps/details?id=com.brandingprofitable_0`;

      const appScheme = 'http://brandingprofitable.com'; // Your custom URL scheme
      const fallbackUrl = 'https://www.example.com/download-app'; // Your download page URL

      const options = {
        title: 'Share Details',
        message: message,
      };

      const result = await Share.open(options);

      if (result.app) {
        console.log(`Shared via ${result.app}`);
      } else {
        // If the app is not installed, open the fallback URL to download the app
        Linking.openURL(fallbackUrl).catch((err) => {
          console.error('Error opening fallback URL:', err);
        });
      }

      setSelectedLanguage('');
      setSelectedTreeId('');
      setSelectedSideByUser('Side');
    } catch (error) {
      console.error('Error sharing details:', error);
    }
  };

  const [openLDropdown, setopenLDropdown] = useState(false)

  const [suggestion, setSuggestions] = React.useState([])

  const handleTextChange = (inputText) => {
    // Filter your suggestions based on the input text
    // if (inputText) {
    const filteredSuggestions = shareData.filter((suggestion) =>
      suggestion.mobileNumber.includes(inputText.toLowerCase())
    );
    // }

    // Update the suggestions state
    setSuggestions(filteredSuggestions);
    setopenLDropdown(true)

    // Update the text state
    setSelectedLanguage(inputText);
  };

  const renderDropdownIcon = ({ isOpen, selectedItem }) => {
    const icon = isOpen ? 'check' : 'angle-down';
    return <Icon name={icon} size={25} color="black" />

  };

  const handleInputFocus = () => {
    setopenLDropdown(true);
  };

  const handleInputBlur = () => {
    // Handle the input when it loses focus
    setopenLDropdown(false);
  };

  if (isload) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#20AE5C', '#000']} locations={[0.3, 1]} style={{ flex: 1, }}>

      <ScrollView style={{ flex: 1, paddingBottom: 20 }}>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, { width: 30 }]} onPress={() => { navigation.goBack() }}>
            <Icon name="angle-left" size={30} />
          </Text>
          <Text style={styles.headerText}>
            Team
          </Text>
          <TouchableOpacity onPress={showAlert5}>
            <Text style={{ height: 30, width: 30 }}>
              <MaterialCommunityIcons name="share-variant" size={30} color={"white"} />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 130, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 20 }}>
          <Text style={{ color: '#00D3FF', fontSize: 17, fontFamily: 'Manrope-Regular' }}>Total Team:  <Text style={{ fontSize: 20, color: 'white' }}>{userCountAll}</Text></Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
            {/* 1 */}
            {/* <TouchableOpacity onPress={()=>{handleLeftClick('right')}} style={{ height: 30, borderRadius: 50, backgroundColor: isLeft ? '#E31E25' : 'white', paddingHorizontal: 5, justifyContent: 'center', flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 5 }}>
              <View style={{ backgroundColor: isLeft ? 'black' : 'lightgray', borderRadius: 100, height: 22, alignItems: 'center', justifyContent: 'center', minWidth: 22 }}><Text style={{ color: isLeft ? '#E31E25' : 'white', fontSize: 10, fontFamily: 'DMSans_18pt-Bold', paddingHorizontal: 4 }}>{userCountLeft}</Text></View>
              <View style={{ marginRight: 3 }}>
                <Text style={{ color: isLeft ? 'white' : 'lightgray', fontFamily: 'DMSans_18pt-Bold' }}>
                  Left Team
                </Text>
              </View>
            </TouchableOpacity> */}
            {/* 1 */}
            <TouchableOpacity onPress={() => { handleLeftClick('right') }} style={{ height: 30, borderRadius: 50, backgroundColor: isRight ? '#E31E25' : 'white', paddingHorizontal: 5, justifyContent: 'center', flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 5 }}>
              <View style={{ backgroundColor: isRight ? 'black' : 'lightgray', borderRadius: 100, height: 22, alignItems: 'center', justifyContent: 'center', minWidth: 22 }}><Text style={{ color: isRight ? '#E31E25' : 'white', fontSize: 10, fontFamily: 'DMSans_18pt-Bold', paddingHorizontal: 4 }}>{parseInt(userCountRight) + parseInt(userCountLeft)}</Text></View>
              <View style={{ marginRight: 3 }}>
                <Text style={{ color: isRight ? 'white' : 'lightgray', fontFamily: 'DMSans_18pt-Bold' }}>
                  Complete Team
                </Text>
              </View>
            </TouchableOpacity>
            {/* 1 */}
            <TouchableOpacity onPress={() => { handleLeftClick('direct') }} style={{ height: 30, borderRadius: 50, backgroundColor: isDirect ? '#E31E25' : 'white', paddingHorizontal: 5, justifyContent: 'center', flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 5 }}>
              <View style={{ backgroundColor: isDirect ? 'black' : 'lightgray', borderRadius: 100, height: 22, alignItems: 'center', justifyContent: 'center', minWidth: 22 }}><Text style={{ color: isDirect ? '#E31E25' : 'white', fontSize: 10, fontFamily: 'DMSans_18pt-Bold', paddingHorizontal: 4 }}>{numberOfChildren}</Text></View>
              <View style={{ marginRight: 3 }}>
                <Text style={{ color: isDirect ? 'white' : 'lightgray', fontFamily: 'DMSans_18pt-Bold' }}>
                  Direct Sponser
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
        <LinearGradient colors={['#20AE5C', '#000']} locations={[0.3, 1]} style={{ height: height - 140 - 100 }}>

          <View style={{ height: height - 300 }}>

            <WebViewScreen
              isLeft={isLeft}
              isRight={isRight}
              isDirect={isDirect}
              treeData={isDirect ? DirectSponser : treeData}
              number={aadhar}
            />

          </View>
          <TouchableHighlight style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: "#20AE5C", height: 60, borderRadius: 20, marginTop: -30 }} onPress={() => { navigation.navigate('WithdrawWallet', { greenWallet: greenWallet }) }}>

            <Text style={{ fontFamily: 'DMSans_18pt-Bold', fontSize: 18, color: 'white' }}>
              Withdraw Green Wallet
            </Text>
          </TouchableHighlight>
        </LinearGradient>

      </ScrollView>

      {/* confirmation modal of add frame or not */}
      <Modal
        animationType="fade" // You can use "fade" or "none" for animation type
        visible={isModalVisible5}
        transparent={true}
        onRequestClose={hideAlert5}
        keyboardShouldPersistTaps={'always'}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <TouchableOpacity onPress={hideAlert5} style={{
            position: 'absolute', top: 10, right: 20, backgroundColor: 'black', borderRadius: 10

          }}>
            <Text style={{ fontSize: 30, color: 'white' }}>
              <MaterialCommunityIcons name="close" size={34} color={"white"} />
            </Text>
          </TouchableOpacity>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            width: 300,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40
          }}>
            {/* icon */}
            <TouchableOpacity onPress={hideAlert5} style={{
              backgroundColor: 'red',
              padding: 8,
              borderRadius: 8,
            }}>
              <Text style={{
                color: 'white',

              }}><MaterialCommunityIcons name="family-tree" size={25} color="white" /></Text>
            </TouchableOpacity>
            {/* title */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 10,
              color: 'red'
            }}>Share Details of Refer & Earn</Text>
            {/* another */}

            <View style={{ gap: 0 }}>

              <TextInput
                style={styles.input}
                value={selectedLanguage}
                onChangeText={(text) => handleTextChange(text)}
                placeholder="Sponsor Id"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />

              {openLDropdown &&
                <View style={{ backgroundColor: 'white', borderRadius: 10, width: '100%', position: 'absolute', marginTop: 70, zIndex: 10 }}>
                  {selectedLanguage == '' ? (
                    shareData?.slice(0, 5).map((suggestion, index) => (
                      <TouchableOpacity key={index} onPress={() => {
                        setopenLDropdown(false);
                        setSelectedLanguage(suggestion.mobileNumber);
                        Keyboard.dismiss();
                      }
                      } style={{ width: '100%', padding: 10, alignItems: 'center' }}>
                        <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (suggestion?.slice(0, 5).map((suggestion, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                      setopenLDropdown(false);
                      setSelectedLanguage(suggestion.mobileNumber);
                      Keyboard.dismiss();
                    }
                    } style={{ width: '100%', padding: 10, alignItems: 'center' }}>
                      <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                    </TouchableOpacity>
                  )))}
                </View>
              }

              {/* <TextInput
                                    style={styles.input}
                                    value={selectedTreeId}
                                    onChangeText={(text) => handleTextChangeTree(text)}
                                    placeholder="Referal Id"
                                    onFocus={handleInputFocusTree}
                                    onBlur={handleInputBlurTree}
                                />

                                {openLDropdownTree &&
                                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: '85%', position: 'absolute', marginTop: 150, zIndex: 10 }}>
                                        {
                                            selectedTreeId == '' ? (
                                                shareData?.slice(0, 5).map((suggestion, index) => (
                                                    <TouchableOpacity key={index} onPress={() => {
                                                        setopenLDropdownTree(false)
                                                        setSelectedTreeId(suggestion.mobileNumber);
                                                        Keyboard.dismiss();
                                                    }
                                                    } style={{ width: '100%', padding: 10 }}>
                                                        <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            ) : (
                                                suggestionTree?.slice(0, 5).map((suggestion, index) => (
                                                    <TouchableOpacity key={index} onPress={() => {
                                                        setopenLDropdownTree(false)
                                                        setSelectedTreeId(suggestion.mobileNumber);
                                                        Keyboard.dismiss();
                                                    }
                                                    } style={{ width: '100%', padding: 10 }}>
                                                        <Text>{suggestion.mobileNumber}{` (${suggestion.fullName})`}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            )


                                        }
                                    </View>
                                } */}

              <SelectDropdown

                data={shareData.map((item, index) => {
                  return (
                    `${index} - ${item.fullName} - ******${item?.mobileNumber?.substring(6, 10)}`)
                }
                )
                }

                onSelect={(selectedItem, index) => {
                  // Split the selectedItem to extract the mobileNumber
                  const selectedItemParts = selectedItem.split(' - ');
                  const selectedMobileNumber = selectedItemParts[0];

                  // Find the selected item's object by matching the mobileNumber
                  const selectedObject = shareData[selectedMobileNumber]
                  //   const selectedObject = shareData.find((item) => item.fullName === selectedMobileNumber);

                  // Check if the selected object exists and has a "side" property
                  if (selectedObject && selectedObject.side) {
                    const storetovar = selectedObject.mobileNumber;
                    const encryted = CryptoJS.AES.encrypt(storetovar, 'mjgohel').toString();
                    setSelectedTreeId(`${selectedObject.fullName}-${encryted}`);
                    setSelectedSide(selectedObject.side); // Set the selected side
                  } else {
                    showToastWithGravity('Something went wrong');
                  }
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedTreeId; // Set the selectedTreeId as the displayed text
                }}

                rowTextForSelection={(item, index) => {
                  // Find the corresponding object for the current treeId
                  const selectedObject = shareData.find((obj) => obj.mobileNumber === item);

                  // Check if the object exists and has a "name" property
                  if (selectedObject && selectedObject.name) {
                    return `${selectedObject.mobileNumber} (${selectedObject.name})`;
                  }

                  // If no object or "name" property is found, display only the tree ID
                  return item;
                }}
                buttonStyle={{
                  width: 250,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginTop: 15,
                  borderColor: 'lightgray',
                  borderWidth: 1,
                  height: 40,
                  backgroundColor: 'white',
                }}
                rowTextStyle={{ fontFamily: 'Manrope-Regular', fontSize: 15, color: 'black' }}
                buttonTextStyle={{ fontFamily: 'Manrope-Regular', fontSize: 15, color: 'gray' }}
                defaultButtonText={selectedTreeId} // Set the defaultButtonText
                dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
                renderDropdownIcon={renderDropdownIcon}
              />
              {/* 
<TextInput
                                style={[styles.input,{marginTop:15}]}
                                value={selectedTreeId}
                                onChangeText={(text) => setSelectedTreeId(text)}
                                placeholder="Referal Id"
                            /> */}


              <SelectDropdown
                data={selectedSide.map((item) => item)} // Use the language names
                onSelect={(selectedItem, index) => {
                  setSelectedSideByUser(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={{
                  width: 250,
                  alignItems: 'center',
                  justifyContent: "flex-start",
                  borderRadius: 8,
                  marginTop: 25,
                  borderColor: 'lightgray',
                  borderWidth: 1,
                  height: 40,
                  backgroundColor: 'white',
                }}
                rowTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 15, color: "black" }}
                buttonTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 15, color: "gray" }}
                defaultButtonText='Side'
                renderDropdownIcon={renderDropdownIcon}
                dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
              />

              <TouchableOpacity onPress={handleShare} style={{
                backgroundColor: 'red',
                width: 70,
                paddingVertical: 5,
                alignItems: 'center',
                justifyContent: "center",
                borderRadius: 8,
                alignSelf: 'center',
                marginTop: 30
              }}>
                <Text style={{
                  color: 'white',
                  fontFamily: 'Manrope-Bold'
                }}>Share</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </LinearGradient>
  )
}

export default MLMScreen2

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Manrope-Bold'
  },
  input: {
    width: 250,
    height: 40,
    borderRadius: 8,
    marginTop: 30,
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: 'black',
    paddingRight: 20,
    textAlign: 'center'
  },
})