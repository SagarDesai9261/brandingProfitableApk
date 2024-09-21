import removeBg from '../removeBg';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity, Alert, ToastAndroid, Dimensions, TouchableHighlight, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
// import { Button } from '@rneui/base';
// import StackHome from '../Home/StackNavigatorHome';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImageCropPicker from 'react-native-image-crop-picker';
import SelectDropdown from 'react-native-select-dropdown';

const { width } = Dimensions.get(('window'))

const FullScreenProfile = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [businessOrPersonal, setBusinessOrPersonal] = useState('');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const [designation, setDesignation] = useState('');

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [dob, setDob] = useState('');

  const [fileUri, setFileUri] = useState('');


  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility
  const [designationWithOther, setDesignationWith] = useState('');

  const handleSelect = (selectedItem) => {
    setDesignation(selectedItem);
    setIsOpen(false); // Close the dropdown after selection
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // formate date
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is 0-based
    const year = date.getFullYear();

    // Add leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  const handleDateChange = (_, date) => {
    hideDatePicker();
    if (date) {
      const formattedDate = formatDate(date);
      setSelectedDate(date); // Make sure selectedDate is set to a valid Date object
      setDob(formattedDate);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const index = [...index, ...Array.from({ length: 50 }, (_, i) => i + 1)];

  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.brandingprofitable.com/business_type/get_business_type');
      const result = response.data.data;

      // Map the fetched data to the format expected by DropDownPicker
      const mappedItems = result.map(item => (item.businessTypeName));

      const finalData = [...mappedItems,
        "Other"
      ]
      setItems(finalData);
    } catch (error) {
      console.log('Error fetching data... edit profile:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
      setBusinessOrPersonal(businessOrPersonal);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const retrieveProfileData = async () => {
      try {
        const data = await AsyncStorage.getItem('profileData');
        if (data) {
          const parsedData = JSON.parse(data);
          setProfileData(parsedData);

          // Set the designation state based on Designation or businessType
          setDesignation(parsedData?.Designation || parsedData?.businessType);

          setDob(parsedData?.businessStartDate || parsedData?.dob)

          const date = parsedData?.dob || parsedData?.businessStartDate
          const splitDate = date.split('-');
          const [y, m, d] = splitDate;
          const newDate = `${d}-${m}-${y}`
          const dobDate = new Date(newDate)
          setSelectedDate(dobDate)
        }
      } catch (error) {
        console.log('Error retrieving profile data:', error);
      }
    };

    retrieveProfileData();
  }, []);

  const [imageLoad, setImageLoad] = useState(false);

  const handleImagePicker = () => {
    setImageLoad(true)
    ImageCropPicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      includeBase64: true, // Optional, set it to true if you want to get the image as base64-encoded string
    })
      .then((response) => {
        const dataArray = new FormData();
        const filereplacename = businessOrPersonal == 'personal' ? profileData.profileImage : profileData.businessLogo;

        dataArray.append('b_video', {
          uri: response.path,
          type: response.mime,
          name: response.path.split('/').pop(),
        });
        let url = 'https://cdn.brandingprofitable.com/image_upload.php';
        axios
          .post(url, dataArray, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            const imagePath = `https://cdn.brandingprofitable.com/${res?.data?.iamge_path}`; // Correct the key to "iamge_path"
            // if (businessOrPersonal == 'business') {
            //   setProfileData({ ...profileData, businessLogo: imagePath });
            // } else {
            //   setProfileData({ ...profileData, profileImage: imagePath });
            // }

            Alert.alert(
              'Remove BG',
              'Are you want to Remove a Background of Image?',
              [
                {
                  text: 'No',
                  onPress: () => {
                    if (businessOrPersonal == 'business') {
                      setProfileData({ ...profileData, businessLogo: imagePath });
                    } else {
                      setProfileData({ ...profileData, profileImage: imagePath });
                    }
                    setImageLoad(false)
                  }
                },
                {
                  text: 'Yes',
                  onPress: async () => {
                    // Navigate to the 'ProfileScreen' if the user confirms
                    const removedBg = await removeBg(imagePath)

                    console.log("removed image path:", removedBg)

                    if (businessOrPersonal == 'business') {
                      setProfileData({ ...profileData, businessLogo: removedBg });
                    } else {
                      setProfileData({ ...profileData, profileImage: removedBg });
                    }
                    setImageLoad(false)
                  },
                },
              ],
              { cancelable: false }
            );

          })
          .catch((err) => {
            setProfileData(response.path)
            console.log('Error uploading image:', err);
            setImageLoad(false)
          });
      })
      .catch((error) => {
        setImageLoad(false)
        console.log('ImagePicker Error:', error);
      });
  };

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };

  const [isloader, setisloader] = useState(false)


  if (!profileData || isloader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator color={'white'} />
      </View>
    );
  }

  const renderTextInput = (label, value, onChangeText) => (
    <View style={styles.infoContainer}>
      <View style={[styles.labelContainer, { marginTop: 20 }]}>
        <Text style={styles.label}>
          {label}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={label}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  // useEffect(()=>{
  //   const updatedProfileData = {
  //     ...profileData,
  //     dob: selectedDate, // Update the Designation field
  //   };
  // })

  const onUpdate = async () => {
    setisloader(true);
    console.log("called");
    try {
      // Include the updated designation in profileData
      const updatedProfileData = {
        ...profileData,
        Designation: designation == 'Other' ? designationWithOther : designation,
        dob: dob,
      };

      const response = await axios.put(
        `https://api.brandingprofitable.com/user/user_register/${profileData?._id}`,
        updatedProfileData,
      );


      const stringData = JSON.stringify(updatedProfileData);
      await AsyncStorage.setItem('profileData', stringData);
      showToastWithGravity('Your Profile Saved!');
      navigation.navigate('ProfileScreen');

      // ...rest of the function
    } catch (error) {
      console.log(error);
      Alert.alert('Your Profile Updated!');
      navigation.navigate('ProfileScreen');
      Alert.alert(
        'Something went Wrong!',
        'Please try again Later...',
        [{ text: 'ok' }],
        { cancelable: false }
      );
    }
    setisloader(false)
  };

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']}
      style={{ flex: 1, justifyContent: "space-between" }}>

      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 30 }} onPress={() => {
          // Show a confirmation alert
          Alert.alert(
            'Confirmation',
            'Are you sure you want to exit?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to the 'ProfileScreen' if the user confirms
                  navigation.navigate('ProfileScreen');
                },
              },
            ],
            { cancelable: false }
          );
        }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.navigate('ProfileScreen') }}>
          Edit Profile
        </Text>
        <TouchableOpacity style={{ width: 30 }} onPress={onUpdate}>
          <Icon name="check" size={30} color={"white"} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        {/* {businessOrPersonal === 'business' ? (
					<View style={styles.imageContainer}>
					Your FastImage component
					<FastImage
						source={
							profileData && profileData.businessLogo
								? { uri: profileData.businessLogo }
								: { uri: 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }
						}
						style={styles.profileImage}
					/>
					Add a button to pick an image
					<TouchableOpacity
						style={styles.pickImageButton}
						onPress={{}}
					>
						<Icon name="camera" size={20} color="white" />
					</TouchableOpacity>
					</View>
					) : (
						<FastImage
							source={
								profileData && profileData?.profileImage
									? { uri: profileData.profileImage }
									: { uri: 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }
							}
							style={styles.profileImage}
						/>
					)} */}
        <View>
          {
            imageLoad && <View style={{ width: 120, height: 120, borderRadius: 100, position: 'absolute', alignItems: 'center', justifyContent: 'center', zIndex: 10, marginLeft: 20 }}>
              <ActivityIndicator color={'white'} />
            </View>
          }
          <FastImage source={{ uri: profileData?.profileImage || profileData?.businessLogo || 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.pickImageButton}
            onPress={handleImagePicker}
          >
            <Icon name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { showToastWithGravity("You can not edit Username!") }}>
          <TextInput
            style={styles.title}
            value={profileData?.fullName}
            onChangeText={(text) => setProfileData({ ...profileData, fullName: text })}
            placeholder="Enter Full Name"
            placeholderTextColor="#999"
            editable={false}
          />
        </TouchableOpacity>
        {/* <Text
          style={styles.title}>
          {profileData?.fullName}
        </Text> */}
      </View>
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>

        <View style={styles.profileContainer}>

          {/* {renderTextInput(
						'Designation',
						businessOrPersonal === 'business' ? profileData?.businessType : profileData?.Designation,
						(text) =>
							setProfileData({
								...profileData,
								...(businessOrPersonal === 'business'
									? { businessType: text }
									: { Designation: text }),
							})
					)} */}
          {/* dropdown */}

          {businessOrPersonal == 'business' && renderTextInput('Business Name', profileData?.businessName, (text) => setProfileData({ ...profileData, businessName: text }))}

          {
            businessOrPersonal == 'business' ? (
              <>
                <View style={[styles.labelContainer, { marginTop: 20 }]}>
                  <Text style={styles.label}>
                    Enter {businessOrPersonal == 'business' ? ('Business Type') : ('Designation')}
                  </Text>
                </View>

                <View style={{ alignSelf: 'center', width: '80%', marginVertical: 15, marginBottom: 0 }}>
                  <TouchableOpacity onPress={toggleDropdown}>
                    <View style={inputStyles.inputContainer}>
                      <Text style={inputStyles.input}>
                        {designation || 'Select Business Type'}
                      </Text>
                      <Icon name={isOpen ? 'caret-up' : 'caret-down'} size={24} style={inputStyles.icon} />
                    </View>
                  </TouchableOpacity>
                  {isOpen && (
                    <SelectDropdown
                      data={items}
                      onSelect={handleSelect}
                      defaultButtonText="Select Designation" // Provide a default button text
                      dropdownStyle={{
                        maxHeight: 300,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                      }}
                      dropdownTextStyle={{
                        fontSize: 16,
                        fontFamily: 'Manrope-Regular',
                        color: 'black', // Text color
                      }}
                      buttonTextStyle={{
                        fontSize: 16,
                        fontFamily: 'Manrope-Bold', // You can use a different font for the button text,
                      }}
                      rowTextForSelection={(item, index) => item}
                    />

                  )}
                  {designation == 'Other' && (
                    <View style={[styles.inputContainer, { marginBottom: 0 }]}>
                      <TextInput
                        style={styles.input}
                        placeholderTextColor={'gray'}
                        placeholder="Your Designation"
                        value={designationWithOther}
                        // maxLength={12}
                        onChangeText={setDesignationWith}
                        autoCapitalize="sentences"
                      />
                    </View>
                  )}
                </View>
              </>
            ) : (
              renderTextInput('Designation', designation, (text) => setDesignation(text))
            )
          }


          {renderTextInput('Email', profileData?.email, (text) => setProfileData({ ...profileData, email: text }))}

          {renderTextInput('Address', profileData?.adress, (text) => setProfileData({ ...profileData, adress: text }))}
          {profileData.website != '' && profileData.website != ' ' && businessOrPersonal == 'business' &&
            renderTextInput('Website Link', profileData?.website, (text) => setProfileData({ ...profileData, website: text }))}

          {/* {renderTextInput(
            businessOrPersonal === 'business' ? 'Business Start Date' : 'Date of Birth',
            businessOrPersonal === 'business' ? profileData?.businessStartDate : profileData?.dob,
            (text) =>
              setProfileData({
                ...profileData,
                ...(businessOrPersonal === 'business'
                  ? { businessStartDate: text }
                  : { dob: text }),
              })
          )} */}

          {/* DOB */}
          <View style={[styles.labelContainer, { marginTop: 20 }]}>
            <Text style={styles.label}>
              Enter {businessOrPersonal === 'business' ? ('Buisness Start Date') : ('Date of Birth')}
            </Text>
          </View>
          {isDatePickerVisible && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                style={styles.input}
                placeholder={businessOrPersonal == 'business' ? ('Business Start Date') : ("Date of Birth")}
                value={dob}
                editable={false}
                placeholderTextColor={'gray'}
              />
            </TouchableOpacity>
          </View>
          <TouchableHighlight onPress={onUpdate} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "80%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, marginTop: 40 }} >
            <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
              Save
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 30,
    maxHeight: 500
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
    marginTop: 15
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%'
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
    width: 120,
  },
  info: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
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
    fontFamily: "Manrope-Bold",
    marginLeft: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333',
    fontFamily: 'Manrope-Regular',

  },
  inputContainer: {
    width: '80%',
    marginTop: 18,
  },
  labelContainer: {
    width: '80%',
    alignItems: 'flex-start'
  },
  label: {
    color: '#6B7285',
    fontFamily: 'Manrope-Regular',
    fontSize: 15
  },
  imageContainer: {
    position: 'relative', // Required for positioning the button absolutely
  },
  profileImage: {
    // Your existing styles for the image
    height: 130,
    width: 130,
    borderRadius: 100,
    marginLeft: 15,
    marginRight: 15,
  },
  pickImageButton: {
    position: 'absolute', // Position the button absolutely within the container
    bottom: 0, // Adjust this value to position the button as desired from the bottom
    right: 10, // Adjust this value to position the button as desired from the right
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the background color and opacity as needed
    padding: 10,
    borderRadius: 50,
  }
});

const inputStyles = StyleSheet.create({
  inputContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 16,
    fontFamily: 'Manrope-Regular',
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
});

export default FullScreenProfile;
