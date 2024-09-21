import { Slider } from '@rneui/base';
import SortableGridview from 'react-native-sortable-gridview'
import React, { useRef, useState, useEffect, useCallback, isValidElement } from 'react';
import { View, Button, Image, TouchableOpacity, Modal, TextInput, Alert, FlatList, Animated, Dimensions, ImageBackground, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Draggable from 'react-native-draggable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewShot from 'react-native-view-shot';
// import Slider from 'react-native-slider'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import ImageCropPicker from 'react-native-image-crop-picker';
import Gestures from "react-native-easy-gestures";
import { ToastAndroid } from 'react-native';
import { Text } from '@rneui/themed';
import RNFetchBlob from 'rn-fetch-blob';

// import PinchZoomView from 'react-native-pinch-zoom-view'; meet gohel

const { width } = Dimensions.get('window')

// display toast 
const showToastWithGravity = (data) => {
  ToastAndroid.showWithGravityAndOffset(
    data,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    0,
    50,
  );
};

const colors = [
  // Dark Red
  "#8B0000",
  "#800000",
  "#B22222",
  "#DC143C",
  "#FF0000",

  // Light Red
  "#FF6347",
  "#FF4500",
  "#FFA07A",
  "#FF7F50",
  "#FF8C00",

  // Yellow Shades
  "#FFFF00",
  "#FFD700",
  "#FFC0CB",
  "#FF69B4",
  "#FF1493",
  "#C71585",
  "#D2691E",
  "#8B4513",
  "#CD853F",
  "#FFA500",

  // Green Shades
  "#008000",
  "#00FF00",
  "#32CD32",
  "#228B22",
  "#006400",
  "#7FFF00",
  "#7CFC00",
  "#ADFF2F",
  "#556B2F",
  "#6B8E23",
  "#808000",
  "#2E8B57",
  "#3CB371",
  "#20B2AA",

  // Blue Shades
  "#0000FF",
  "#4169E1",
  "#0000CD",
  "#00008B",
  "#00BFFF",
  "#87CEEB",
  "#4682B4",
  "#5F9EA0",
  "#B0C4DE",
  "#1E90FF",
  "#6495ED",
  "#483D8B",
  "#8A2BE2",
  "#9370DB",
  "#9400D3",
  "#9932CC",
  "#800080",
  "#4B0082",

  // Additional Colors
  "#000000", // Black
  "#FFFFFF", // White
  "#808080", // Gray
  "#A9A9A9", // DarkGray
  "#D3D3D3", // LightGray

  // Shades of Pink
  "#FFB6C1",
  "#FF69B4",
  "#FF1493",
  "#DB7093",

  // Shades of Purple
  "#E6E6FA",
  "#D8BFD8",
  "#DDA0DD",
  "#DA70D6",
  "#BA55D3",
  "#8A2BE2",

  // Shades of Orange
  "#FFD700",
  "#FFA500",
  "#FF8C00",
  "#FF7F50",

  // Shades of Brown
  "#8B4513",
  "#A52A2A",
  "#D2691E",
  "#CD853F",

  // Shades of Green
  "#008000",
  "#228B22",
  "#32CD32",
  "#006400",
  "#ADFF2F",
  "#7FFF00",
  "#7CFC00",

  // Shades of Blue
  "#0000FF",
  "#4169E1",
  "#0000CD",
  "#00008B",
  "#00BFFF",
  "#87CEEB",
  "#4682B4",
  "#5F9EA0",
  "#B0C4DE",
  "#1E90FF",
  "#6495ED",
  "#483D8B",
  "#8A2BE2",
  "#9370DB",
  "#9400D3",
  "#9932CC",
  "#800080",
  "#4B0082",

  // Additional Colors
  "#008080", // Teal
  "#00FFFF", // Aqua
  "#20B2AA", // LightSeaGreen
  "#00CED1", // DarkTurquoise
  "#008B8B", // DarkCyan
  "#00FFFF", // Cyan
];


const App = ({ navigation, route }) => {
  const viewShotRef = useRef(null);
  const [images, setImages] = useState([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [isImageSelected, setIsImageSelected] = useState(false);

  const [textItems, setTextItems] = useState([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(-1);
  const [isTextSelected, setIsTextSelected] = useState(false);

  const [newTop, setTop] = useState(0);
  const [newLeft, setLeft] = useState(0);
  const [nweTransform, setTransform] = useState([{ "rotate": "0deg" }, { "scale": 1 }]);

  const [jsonData, setJsonData] = useState(null);
  const [rotationValue, setRotationValue] = useState(0);
  const animatedRotation = new Animated.Value(rotationValue);

  const [isload, setisload] = useState(true);

  const [isopenColor, setIsOpenColor] = useState(false)

  const [fileUri, setFileUri] = useState('https://img.freepik.com/premium-vector/white-texture-round-striped-surface-white-soft-cover_547648-928.jpg');

  const { imageId } = route.params;

  const [userTeamDetails, setUserTeamDetails] = useState([])

  // all users details 
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    retrieveProfileData()
  }, [retrieveProfileData])

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

  const [subscritionExp, setSubscriptionExp] = useState(false)

  const [isMLMPurchased, setIsMLMPurchased] = useState();
  const [userPurchasedPlan, setUserPurchased] = useState({});

  useEffect(() => {
    if (images.length > 1) {
      setTop(images[1]?.top)
      setLeft(images[1]?.left)

      const transForm = [{ "rotate": images[1]?.rotation + "deg" }, { "scale": images[1]?.scale }]
      setTransform(transForm)
    }
  }, [images[1]?.top])

  const getAllPlans = async () => {
    try {
      const response = await axios.get("https://api.brandingprofitable.com/payments/benefits/" + profileData.mobileNumber);
      const data = response.data.data;

      const stringifyData = JSON.stringify(data);

      await AsyncStorage.setItem("abcdplans", stringifyData)

      return data;
    } catch (error) {
      console.error("getting error in getting plans:", error)
    }
  }

  const checkWhichPlanUserPurchased = async (userPlanId) => {
    if (!isMLMPurchased) {
      try {
        const allPlans = await getAllPlans();
        // const userPlan = allPlans.find((plan) => plan.plan_id === userPlanId)
        setUserPurchased(allPlans[0] || null);
      } catch (error) {
        console.error("getting error in check purchased plan", error)
      }
    }
  }

  const fetchDetails = async () => {
    try {
      if (!profileData) return;

      const response = await axios.get(`https://api.brandingprofitable.com/mlm/wallet/v2/${profileData.mobileNumber}`);
      const result = response.data;

      if (response.data.statusCode === 200) {
        setIsMLMPurchased(result.is_mlm)
        checkWhichPlanUserPurchased(result.plan_id)

        setUserTeamDetails('Purchase');

        const date = result.details?.register_date;
        const originalDateStr = date;
        const originalDate = new Date(originalDateStr);

        originalDate.setFullYear(originalDate.getFullYear() + 1);
        const today = new Date();

        setSubscriptionExp(today > originalDate);
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [profileData])

  useEffect(() => {
    const apiUrl = `https://brandingprofitable-29d465d7c7b1.herokuapp.com/cd_section/cds_data/${imageId}`;

    axios
      .get(apiUrl)
      .then(response => {
        const imageData = response.data.data.cds_template;
        const data = {
          data: imageData
        };
        setJsonData(data);
        setisload(false);
      })
      .catch(error => {
        console.error('Error fetching response.data.data:', error)
      });
  }, []);

  useEffect(() => {
    if (jsonData && jsonData.data && jsonData.data.scenes) {
      const images = createItemsFromJson(jsonData).filter((item) => item.type === 'image');
      const textItems = createTextItemsFromJson(jsonData);
      setImages(images);
      setTextItems(textItems);
    }
  }, [jsonData]);


  // function to add image in canvas
  const createItemsFromJson = (json) => {
    const items = [];
    if (json && json.data && json.data.scenes) {
      const scenes = json.data.scenes;
      let count = 0
      scenes.forEach((scene) => {
        const layers = scene.layers;
        layers.forEach((layer) => {

          if (layer.type === "StaticImage") {
            const newItem = {
              id: layer.id,
              type: "image",
              src: layer.src,
              left: layer.left,
              top: layer.top,
              width: layer.width,
              height: layer.height,
              scaleX: layer.scaleX,
              scaleY: layer.scaleY,
              flipX: layer.flipX,
              flipY: layer.flipY,
              rotation: layer.rotate || 0,
              scale: 1,
              zIndex: 0
            };
            items.push(newItem);
            count++;
          }
          // else if (layer.type === "StaticText") {
          //   const newItem = {
          //     id: layer.id,
          //     type: "text",
          //     text: layer.text,
          //     left: layer.left,
          //     top: layer.top,
          //     width: layer.width,
          //     height: layer.height,
          //     fontFamily: layer.fontFamily,
          //     fontSize: layer.fontSize,
          //     fill: layer.fill,
          //     textAlign: layer.textAlign,
          //     scaleX: layer.scaleX,
          //     scaleY: layer.scaleY
          //   };
          //   items.push(newItem);
          // }
        });
      });
    }
    return items;
  };

  // function to add texts in canvas
  const createTextItemsFromJson = (jsonData) => {
    if (!jsonData || !jsonData.data || !jsonData.data.scenes) {
      return []; // Return an empty array if jsonData or its properties are not available
    }

    const textItems = [];
    const scenes = jsonData.data.scenes;

    scenes.forEach((scene) => {
      const layers = scene.layers;
      layers.forEach((layer) => {
        if (layer.type === "StaticText") {
          const newItem = {
            text: layer.text,
            isSelected: false,
            fontSize: layer.fontSize || 20,
            color: layer.fill || 'black',
            left: layer.left || 0,
            top: layer.top || 0,
            rotation: layer.angle || 0,
            scaleX: layer.scaleX || 1,
            scaleY: layer.scaleY || 1,
            textAlign: layer.textAlign || 'center',
            width: layer.width || 200,
            height: layer.height || 40,
            fontFamily: layer.fontFamily
          };
          textItems.push(newItem);
        }
      });
    });

    return textItems;
  };

  const handleTextDelete = useCallback((index) => {
    const updatedTextItems = [...textItems];
    updatedTextItems.splice(index, 1);
    setTextItems(updatedTextItems);

    if (selectedTextIndex === index) {
      setSelectedTextIndex(null);
      setIsTextSelected(false);
    } else if (selectedTextIndex > index) {
      setSelectedTextIndex(selectedTextIndex - 1);
    }
  }, [selectedTextIndex, textItems])

  const handleTextSelect = useCallback((index) => {
    const updatedTextItems = textItems.map((item, i) => ({
      ...item,
      isSelected: i === index ? !item.isSelected : false,
    }));

    // Deselect image items when a text item is selected
    const updatedImages = images.map((image) => ({
      ...image,
      isSelected: false,
    }));

    setTextItems(updatedTextItems);
    setImages(updatedImages);

    // If a text item is deselected, reset selectedTextIndex and isTextSelected states
    if (updatedTextItems[index].isSelected === false) {
      setSelectedTextIndex(-1);
      setIsTextSelected(false);
    } else {
      setSelectedTextIndex(index);
      setIsTextSelected(true);
      // If a text item is selected, deselect all image items
      setSelectedImageIndex(-1);
      setIsImageSelected(false);
    }
  }, [textItems, images]);

  // texts
  const addTextToViewShot = () => {

    const newTextItem = { text: 'Sample Text', isSelected: false, fontSize: 20, color: 'black', fontFamily: 'OpenSans-Regular', top: 100, left: 80 };

    // Use the functional form of setTextItems to access the updated state in the callback
    setTextItems(prevTextItems => {
      const updatedTextItems = [...prevTextItems, newTextItem];
      const selectedIndex = updatedTextItems.length - 1;

      // Call handleTextSelect and handleEdit with the index

      // handleTextSelect(selectedIndex);
      handleEdit(selectedIndex, newTextItem.text);

      return updatedTextItems;
    });

    // Call handleTextSelect and handleEdit with the index
    // handleTextSelect(selectedIndex);
    // handleEdit(selectedIndex, newTextItem.text);

    // Use useEffect to perform actions after the state update
  };

  const increaseTextSize = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.fontSize = (selectedTextItem.fontSize || 20) + 2;
      setTextItems(updatedTextItems);
    }
  };

  const decreaseTextSize = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.fontSize = (selectedTextItem.fontSize || 20) - 2;
      setTextItems(updatedTextItems);
    }
  };

  const rotateText90Degrees = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.rotation = (selectedTextItem.rotation || 0) + 90;
      setTextItems(updatedTextItems);
    }
  };

  // ------------------------------------------------------------------------------------------

  const [editingTextIndex, setEditingTextIndex] = useState(-1);
  const [editText, setEditText] = useState("")

  const handleEdit = useCallback((index, text) => {
    setEditingTextIndex(index);
    setEditText(text)

  }, [textItems])

  // after onpress save button
  const handleSave = useCallback((updatedText) => {
    const updatedTextItems = [...textItems];
    updatedTextItems[editingTextIndex].text = updatedText;
    setTextItems(updatedTextItems);
    setEditingTextIndex(-1);
    setEditText("")
  }, [textItems, editingTextIndex])

  // disable all images and texts on press canvas tap
  const handleCanvasTap = () => {
    const updatedTextItems = textItems.map((item) => ({
      ...item,
      isSelected: false,
    }));

    // Deselect image items when a text item is selected
    const updatedImages = images.map((image) => ({
      ...image,
      isSelected: false,
    }));

    setTextItems(updatedTextItems);
    setImages(updatedImages);
    setIsImageSelected(false)
    setIsTextSelected(false)
  };

  // animated

  const [loader, setLoader] = useState(true)

  async function shareImage() {

    const uri = await viewShotRef.current.capture();

    const fileName = 'sharedImage.jpg';
    const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

    await RNFS.copyFile(uri, destPath);

    const shareOptions = {
      type: 'image/jpeg',
      url: `file://${destPath}`,
    };

    await Share.open(shareOptions);

  }

  const convertFileToBase64 = async (fileUri) => {
    const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return response;
  };

  const { config, fs } = RNFetchBlob;

  async function downloadImage() {
    const uri = await viewShotRef.current.capture();

    // Convert the file to base64
    const base64Image = await convertFileToBase64(uri);

    // upload image to cdn url 

    const apiUrl = "https://cdn.brandingprofitable.com/base64.php";
    const requestData = {
      base64_content: base64Image, // Use the updated base64 image data here
    };


    // Upload the canvas image to the CDN
    axios
      .post(apiUrl, requestData)
      .then(async (response) => {
        const { status, message, image_url } = response.data;

        if (status === "success") {

          const item = "https://cdn.brandingprofitable.com/" + image_url;


          const getExtension = (filename) => {
            // To get the file extension
            return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
          };

          let date = new Date();
          let ext = getExtension(item);
          ext = '.' + ext[0];

          let PictureDir = fs.dirs.DCIMDir;
          let options = {
            fileCache: true,
            addAndroidDownloads: {
              // Related to Android only
              useDownloadManager: true,
              notification: true,
              path:
                PictureDir +
                '/Branding Profitable/' +
                Math.floor(date.getTime() + date.getSeconds() / 2) +
                ext,
              description: 'Image',
            },
          };


          const downloadResult = await config(options)
            .fetch('GET', item)
            .then((res) => {
              showToastWithGravity("Saved Successfully")
            })
            .catch((error) => {
              showToastWithGravity("Download Failed")
            });
        } else {
        }
      })

  }

  // share 
  const captureAndShareImage = async () => {


    // if (userTeamDetails === 'Purchase' ) {
    if (userTeamDetails === 'Purchase' && !subscritionExp) {


      if (!userPurchasedPlan.custome_categories) {
        Alert.alert(
          'Please Upgrade a Plan..!',
          'Upgrade your plan to share images/videos',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Upgrade',
              onPress: () => {
                navigation.navigate('MlmScreenStack');
              }
            },
          ],
          { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
        );
        setIsProcessing(false)

        return;
      }

      setSelectedTextIndex(-1);
      setIsTextSelected(false);
      setSelectedImageIndex(-1);
      setIsImageSelected(false);

      const updatedTextItems = textItems.map((item, i) => ({
        ...item,
        isSelected: false,
      }));

      // Deselect image items when a text item is selected
      const updatedImages = images.map((image) => ({
        ...image,
        isSelected: false,
      }));

      setImages(updatedImages);
      setTextItems(updatedTextItems);
      try {
        hideAlert5()

        Alert.alert(
          'Share or Download',
          'You want to share or download image?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Share',
              onPress: () => {
                shareImage()
              }
            },
            {
              text: 'Download',
              onPress: () => {
                downloadImage()
              }
            },
          ],
          { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
        );

      } catch (error) {
        console.error('Error sharing image:', error);
      }

    } else {
      showToastWithGravity("Subscribe to share/download");
      navigation.navigate('MlmScreenStack');
    }
  };

  // confirmation for add frame or not
  const FrameAddorNot = () => {
    const updatedTextItems = textItems.map((item, i) => ({
      ...item,
      isSelected: false,
    }));

    // Deselect image items when a text item is selected
    const updatedImages = images.map((image) => ({
      ...image,
      isSelected: false,
    }));

    setImages(updatedImages);
    setTextItems(updatedTextItems);
    showAlert5()
  }
  const YesAddFrame = async () => {

    try {
      const uri = await viewShotRef.current.capture();

      console.log(userPurchasedPlan, userPurchasedPlan.custome_categories, "userPurchasedPlan---")

      hideAlert5()

      navigation.navigate('ChooseCustomFrame', {
        capturedImage: uri,
        isShare: userPurchasedPlan.custome_categories
      });

    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  const [isModalVisible5, setModalVisible5] = useState(false);

  const showAlert5 = () => {
    setModalVisible5(true);
  };

  const hideAlert5 = () => {
    setModalVisible5(false);
  };

  // handle image picker

  const handleImagePicker = (bg) => {
    ImageCropPicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      includeBase64: true,
    })
      .then((response) => {
        if (bg === 'Image') {
          // const newImage = { "flipX": false, "flipY": false, "height": 100, "id": "oa9QUQcPyF2KquaTDu6lP", "left": 150 - 50, "rotation": 0, "scale": 1, "src": response.path, "top": 150 - 50, "type": "image", "width": 100 };
          // setImages((prevImages) => [...prevImages, newImage]);

          if (images.length > 1) {
            setImages(prevImages => {
              const updatedImages = [...prevImages];
              if (updatedImages[1]) {
                updatedImages[1] = {
                  ...updatedImages[1],
                  src: response.path
                };
              }
              return updatedImages;
            });
          }

        } else {
          setFileUri(response.path);
        }
      })
      .catch((error) => {
      });
  };

  // moveimage 
  const moveText = (direction) => {
    if (selectedTextIndex !== null) {
      const updatedText = [...textItems];
      const selectedText = updatedText[selectedTextIndex];
      const moveAmount = 5; // Adjust the value as needed

      switch (direction) {
        case 'up':
          selectedText.top = (selectedText?.top) - moveAmount;
          break;
        case 'down':
          selectedText.top = (selectedText?.top) + moveAmount;
          break;
        case 'left':
          selectedText.left = (selectedText?.left) - moveAmount;
          break;
        case 'right':
          selectedText.left = (selectedText?.left) + moveAmount;
          break;
        default:
          // Invalid direction
          break;
      }

      setTextItems(updatedText);
    }
  };

  const handleColorSelect = useCallback((updatedColor) => {
    const updatedTextItems = [...textItems];
    updatedTextItems[selectedTextIndex].color = updatedColor; // Save the selected color
    setTextItems(updatedTextItems);
  }, [textItems, selectedTextIndex]);

  const [isOpenKit, setIsOpenKit] = useState(false)

  const handleKit = () => {
    setIsOpenKit(!isOpenKit)
  }

  const addInCanvas = (field) => {
    let text = '';

    switch (field) {
      case 'email':
        text = profileData.email;
        break;
      case 'phone':
        text = profileData.mobileNumber;
        break;
      case 'address':
        text = profileData.adress;
        break;
      default:
        // Handle other cases or provide a default text
        text = 'Sample Text';
        break;
    }

    setTextItems([
      ...textItems,
      {
        text,
        isSelected: false,
        fontSize: 20,
        color: 'black',
        width: 250,
        fontFamily: 'OpenSans-Regular',
        top: 100,
        left: 80
      },
    ]);
  };

  const addLogoImage = () => {
    try {
      if (profileData) {
        // const newImage = { "flipX": false, "flipY": false, "height": 100, "id": "oa9QUQcPyF2KquaTDu6lP", "left": 150 - 50, "rotation": 0, "scale": 1, "src": profileData?.businessLogo || profileData?.profileImage, "top": 150 - 50, "type": "image", "width": 100 }

        // setImages((prevImages) => [...prevImages, newImage]);

        if (images.length > 1) {
          setImages(prevImages => {
            const updatedImages = [...prevImages];
            if (updatedImages[1]) {
              updatedImages[1] = {
                ...updatedImages[1],
                src: profileData?.businessLogo || profileData?.profileImage
              };
            }
            return updatedImages;
          });
        }
      } else {
        showToastWithGravity('profile image not found!')
      }
    } catch (error) {
      showToastWithGravity('something went wrong!')
    }
  };

  const handleBoldItalic = (value) => {
    if (value == 'italic') {

      if (selectedTextIndex !== null) {
        const updatedTextItems = [...textItems];
        const selectedTextItem = updatedTextItems[selectedTextIndex];
        if (selectedTextItem.fontStyle == 'italic') {
          selectedTextItem.fontStyle = null
        } else {
          selectedTextItem.fontStyle = 'italic'
        }
        setTextItems(updatedTextItems);
      }
    } else {

      if (selectedTextIndex !== null) {
        const updatedTextItems = [...textItems];
        const selectedTextItem = updatedTextItems[selectedTextIndex];
        if (selectedTextItem.fontWeight == 'bold') {
          selectedTextItem.fontWeight = 'normal'
        } else {
          selectedTextItem.fontWeight = 'bold'
        }
        setTextItems(updatedTextItems);
      }
    }
  };

  const [isOpenFontStyle, setIsOpenFontStyle] = useState(false);

  const hanldeIsOpenFontStyle = () => {
    setIsOpenFontStyle(!isOpenFontStyle);
  }

  const fonts = [
    {
      "label": "Cabin",
      "value": "Cabin"
    },
    {
      "label": "ComicNeue",
      "value": "ComicNeue"
    },
    {
      "label": "Cookie",
      "value": "Cookie"
    },
    {
      "label": "Corinthia",
      "value": "Corinthia"
    },
    {
      "label": "DMSans",
      "value": "DMSans"
    },
    {
      "label": "Gaegu",
      "value": "Gaegu"
    },
    {
      "label": "Inter",
      "value": "Inter"
    },
    {
      "label": "Istok",
      "value": "Istok"
    },
    {
      "label": "IstokWeb",
      "value": "IstokWeb"
    },
    {
      "label": "JimNightshade",
      "value": "JimNightshade"
    },
    {
      "label": "KaiseiHarunoUmi",
      "value": "KaiseiHarunoUmi"
    },
    {
      "label": "KirangHaerang",
      "value": "KirangHaerang"
    },
    {
      "label": "KoHo",
      "value": "KoHo"
    },
    {
      "label": "Kufam",
      "value": "Kufam"
    },
    {
      "label": "LaBelleAurore",
      "value": "LaBelleAurore"
    },
    {
      "label": "Lato",
      "value": "Lato"
    },
    {
      "label": "Lobster",
      "value": "Lobster"
    },
    {
      "label": "Manrope",
      "value": "Manrope"
    },
    {
      "label": "Merriweather",
      "value": "Merriweather"
    },
    {
      "label": "MerriweatherSans",
      "value": "MerriweatherSans"
    },
    {
      "label": "Montserrat",
      "value": "Montserrat"
    },
    {
      "label": "Nunito Sans",
      "value": "Nunito Sans"
    },
    {
      "label": "NunitoSans",
      "value": "NunitoSans"
    },
    {
      "label": "OpenSans",
      "value": "OpenSans"
    },
    {
      "label": "Oswald",
      "value": "Oswald"
    },
    {
      "label": "Outfit",
      "value": "Outfit"
    },
    {
      "label": "PatrickHand",
      "value": "PatrickHand"
    },
    {
      "label": "PatrickHandSC",
      "value": "PatrickHandSC"
    },
    {
      "label": "PlayfairDisplay",
      "value": "PlayfairDisplay"
    },
    {
      "label": "PlaypenSans",
      "value": "PlaypenSans"
    },
    {
      "label": "Poppins",
      "value": "Poppins"
    },
    {
      "label": "Prompt",
      "value": "Prompt"
    },
    {
      "label": "PTSans",
      "value": "PTSans"
    },
    {
      "label": "Raleway",
      "value": "Raleway"
    },
    {
      "label": "Roboto",
      "value": "Roboto"
    },
    {
      "label": "RobotoMono",
      "value": "RobotoMono"
    },
    {
      "label": "Rubik",
      "value": "Rubik"
    },
    {
      "label": "Signika",
      "value": "Signika"
    },
    {
      "label": "Slabo27px",
      "value": "Slabo27px"
    },
    {
      "label": "SourceSansPro",
      "value": "SourceSansPro"
    },
    {
      "label": "Teko",
      "value": "Teko"
    },
    {
      "label": "Ubuntu Mono Regular",
      "value": "Ubuntu Mono Regular"
    },
    {
      "label": "Ubuntu",
      "value": "Ubuntu"
    },
    {
      "label": "UbuntuMono",
      "value": "UbuntuMono"
    },
    {
      "label": "WorkSans",
      "value": "WorkSans"
    }
  ]

  const handleFontFamilySelect = (value) => {
    const index = selectedTextIndex;

    const updatedItems = [...textItems];
    const selectedText = updatedItems[index];

    selectedText.fontFamily = value;
    selectedText.fontWeight = null;
  }

  const handleChange = (event, styles) => {
    // Assuming styles contain top, left, and transform properties
    const { top, left, transform } = styles;

    setTransform(transform)
    setTop(top)
    setLeft(left)
  };

  // text items 
  const TextItem = ({
    text,
    isSelected,
    onDelete,
    onSelect,
    onEdit,
    width,
    height,
    rotation,
    fontSize,
    color,
    top,
    left,
    scaleX,
    scaleY,
    textAlign,
    fontFamily,
    fontWeight,
    fontStyle
  }) => {
    const scaledWidth = width;
    const scaledHeight = height * scaleY;

    console.log(fontStyle, "fontStyle")

    const FontF = fontWeight == "bold" && fontStyle == "italic" ? fontFamily?.split('-')[0] + "-BoldItalic" : fontWeight == "bold" ? fontFamily?.split('-')[0] + "-Bold" : fontStyle == "italic" ? fontFamily?.split('-')[0] + "-Italic" : fontFamily?.split('-')[0] + "-Regular";

    return (
      <TouchableOpacity style={{
        top: top || 150,
        left: left || 110,
        padding: 10,
      }} onPress={onSelect} activeOpacity={0.7}>
        <View
          style={{
            transform: [
              { rotate: `${rotation || 0}deg` },
            ],
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize,
              color,
              textAlign,
              borderColor: isSelected ? 'black' : 'transparent',
              borderWidth: isSelected ? 1 : 0,
              paddingHorizontal: 2,
              paddingVertical: 5,
              // fontWeight,
              // fontStyle,
              fontFamily: FontF,
            }}
          >
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // image item
  const StaticImageItem = React.memo(({ uri, isSelected, onDelete, onSelect, width, height, rotation, top, left, scaleX, scaleY, flipX, flipY, borderRadius, onDragEnd, zIndex, scale }) => {
    const transformStyles = [];

    if (flipX) {
      transformStyles.push({ scaleX: -1 });
    }

    if (flipY) {
      transformStyles.push({ scaleY: -1 })
    }


    return (

      <Image
        source={{ uri }}
        // style={[styles.image, styles.overlay, { height: 400, top: 0 }]}

        style={{
          width: 300,
          height: 300,
          // transform: transformStyles, // Apply the flip transformations here
          borderRadius: borderRadius,
          position: 'absolute',
          top: 0,
          left: 0,
        }}

        resizeMode="cover"
      />

    );
  });

  // image item
  const DraggableImageItem = React.memo(({ uri, isSelected, onDelete, onSelect, width, height, rotation, top, left, scaleX, scaleY, flipX, flipY, borderRadius, onDragEnd, zIndex, scale }) => {
    const transformStyles = [];

    if (flipX) {
      transformStyles.push({ scaleX: -1 });
    }

    if (flipY) {
      transformStyles.push({ scaleY: -1 })
    }

    return (
      <TouchableOpacity onPress={onSelect} style={{ top: newTop, left: newLeft, position: 'absolute', zIndex }}>
        <Image
          source={{ uri }}
          style={{
            width: width * scaleX || width || 100,
            height: height * scaleY || height || 100,
            borderColor: isSelected ? 'black' : 'transparent',
            borderWidth: isSelected ? 2 : 0,
            // transform: transformStyles, // Apply the flip transformations here
            borderRadius: borderRadius,
            transform: nweTransform
          }}
        />
      </TouchableOpacity>
    );
  });

  if (isload || loader) {
    <View style={{ backgroundColor: 'black', flex: 1, justifyContent: "center", alignItems: 'center' }}>
      <ActivityIndicator color={'white'} />
    </View>
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isOpenFontStyle}
          onRequestClose={() => {
            setIsOpenFontStyle(false);
          }}
        >
          <View style={styles.modalBackground2}>
            <View style={styles.modalContent2}>
              <Text style={styles.modalMessage2}>Font Styles</Text>
              <ScrollView style={{ width: '100%', maxHeight: 300 }}>
                {fonts.map((font, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.fontOption}
                    onPress={() => {
                      setIsOpenFontStyle(false);
                      handleFontFamilySelect(font.value)
                    }}
                  >
                    <Text style={styles.fontOptionText}>{font.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => {
                  setIsOpenFontStyle(false);
                }}
              >
                <Text style={styles.okButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
            <Icon name="angle-left" size={30} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.headerText} onPress={() => { navigation.navigate('ProfileScreen') }}>
            Edit
          </Text>
          <TouchableOpacity onPress={FrameAddorNot}>
            <Text style={{ height: 30, width: 30 }}>
              <MaterialCommunityIcons name="share-variant" size={30} color={"white"} />
            </Text>
          </TouchableOpacity>
        </View>

        <ViewShot
          ref={viewShotRef}
          style={{
            width: 300,
            height: 300,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            elevation: 5,
            borderRadius: 10
          }}
          options={{ width: 1024, height: 1024, quality: 1 }}
          onPress={handleCanvasTap}
        >

          {/* images and texts */}
          {images.length !== 0 ? (
            <DraggableImageItem
              uri={images[1].uri || images[1].src}
              isSelected={images[1].isSelected}
              width={images[1].width || 100}
              height={images[1].height || 100}
              rotation={images[1].rotation || 0}
              top={images[1].top || 0}
              left={images[1].left || 0}
              scaleX={images[1].scaleX}
              scaleY={images[1].scaleY}
              flipX={images[1].flipX}
              flipY={images[1].flipY}
              borderRadius={images[1].borderRadius || 0}
              rotate={images[1].rotate}
              scale={images[1].scale}
              zIndex={images[1].zIndex}
            />
          ) : null}


          {/* images and texts */}
          {images.length !== 0 ? (
            <StaticImageItem
              uri={images[0].uri || images[0].src}
              isSelected={images[0].isSelected}
              width={images[0].width || 100}
              height={images[0].height || 100}
              rotation={images[0].rotation || 0}
              top={images[0].top || 0}
              left={images[0].left || 0}
              // onDragEnd={(newTop, newLeft, transform) => handleDragEnd(index, newTop, newLeft, transform)}
              // onDelete={() => handleImageDelete(index)}
              scaleX={images[0].scaleX}
              scaleY={images[0].scaleY}
              flipX={images[0].flipX}
              flipY={images[0].flipY}
              borderRadius={images[0].borderRadius || 0}
              rotate={images[0].rotate}
              scale={images[0].scale}
              zIndex={images[0].zIndex}
            />
          ) : null}

          {images.length !== 0 && (

            <Gestures
              scalable={{ min: 0.5, max: 3 }}
              rotatable={true}
              key={2}
              onChange={handleChange}
              style={{ top: images[1].top, left: images[1].left }}
            >
              <View style={[{ height: 2000, width: 2000, position: 'absolute', opacity: 0.5, marginTop: -1000, marginLeft: -1000, top: images[1].top, left: images[1].left, }]}>
                <Image
                  source={{ uri: 'https://cdn.brandingprofitable.com/upload/653f4de790bdaBRANDING%20PROFIRTABLE.jpg' }}
                  style={[{ opacity: 0, height: 100, width: 100 }]}
                  resizeMode="cover"
                />
              </View>
            </Gestures>

          )}


          {textItems.map((textItem, index) => (
            <Draggable key={index}>
              <TextItem
                text={textItem.text}
                isSelected={textItem.isSelected}
                width={textItem.width || 150}
                height={textItem.height || 50}
                rotation={textItem.rotation || 0}
                fontSize={textItem.fontSize}
                color={textItem.color} // Pass the color value for each text item
                onSelect={() => {
                  setSelectedTextIndex(index);
                  handleTextSelect(index);
                }}
                top={textItem.top || 0}
                left={textItem.left || 0}
                onDelete={() => handleTextDelete(index, textItem.text)}
                onEdit={() => handleEdit(index, textItem.text)} // Pass the onEdit function to the 
                scaleX={textItem.scaleX}
                scaleY={textItem.scaleY}
                fontWeight={textItem.fontWeight}
                fontFamily={textItem.fontFamily}
                fontStyle={textItem.fontStyle}
                textAlign={textItem.textAlign}
              />
            </Draggable>
          ))}
          <TextInputModal
            visible={editingTextIndex !== -1} // Show the modal when there's a text item being edited
            initialValue={editText} // Pass the initial text value when editing
            initialColor={editingTextIndex !== -1 ? textItems[editingTextIndex].color : 'red'} // Pass the initial text value when editing
            onSave={handleSave} // Save the updated text
            onClose={() => setEditingTextIndex(-1)} // Close the modal when editing is done
          />

        </ViewShot>


        <View style={{ width: '100%' }}>
          {
            // image selected
            (isTextSelected && !isImageSelected) ? (
              <View style={{ backgroundColor: '#1A2A3D', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, zIndex: 10 }}>

                {/* heading */}
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width,
                  }}
                >
                  {/* text view */}
                  <View style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 15, paddingTop: 15, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

                    <View style={{ flexDirection: 'row', gap: 0 }}>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          marginRight: 15,
                        }}
                        onPress={handleCanvasTap}
                      >
                        <MaterialCommunityIcons name="close" size={20} color={'lightgray'} />
                      </TouchableOpacity>

                      <View
                        activeOpacity={0.8}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 30,
                          borderRadius: 15,
                          marginRight: 15,
                        }}
                      >
                        <Text style={{ color: 'white', fontFamily: 'Manrope-Regular' }}>
                          Format Text
                        </Text>
                      </View>

                    </View>

                    <View style={{ flexDirection: 'row', gap: 0 }}>
                      {/* edit text */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          marginRight: 15,
                        }}
                        onPress={() => { handleEdit(selectedTextIndex, textItems[selectedTextIndex].text) }}
                      >
                        <MaterialCommunityIcons name="pencil" size={20} color={'lightgray'} />
                      </TouchableOpacity>

                      {/* delte */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          marginRight: 15,
                        }}
                        onPress={() => { handleTextDelete(selectedTextIndex, textItems[selectedTextIndex].text) }}
                      >
                        <MaterialCommunityIcons name="trash-can" size={20} color={'lightgray'} />
                      </TouchableOpacity>

                      {/* joystick */}
                      <View style={{ borderRadius: 100, height: 80, width: 80, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', elevation: 5, gap: -20, marginTop: -60, marginLeft: 0 }}>

                        <TouchableOpacity onPress={() => moveText('up')} style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginb: 5, marginBottom: 10 }}>
                          <Icon name="angle-up" size={30} color="white" />
                        </TouchableOpacity>

                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', margin: 5, flexDirection: 'row' }}>
                          <TouchableOpacity onPress={() => moveText('left')} style={{ padding: 5, }}>
                            <Icon name="angle-left" size={30} color="white" />
                          </TouchableOpacity>
                          <View style={{ borderRadius: 100, height: 25, width: 25, backgroundColor: '#191F26', elevation: 10 }}>

                          </View>
                          <TouchableOpacity onPress={() => moveText('right')} style={{ padding: 5, }}>
                            <Icon name="angle-right" size={30} color="white" />
                          </TouchableOpacity>

                        </View>

                        <TouchableOpacity onPress={() => moveText('down')} style={{ width: '100%', alignItems: 'center', justifyContent: 'center', margin: 5, marginTop: 20 }}>
                          <Icon name="angle-down" size={30} style={{ marginTop: -10 }} color="white" />
                        </TouchableOpacity>

                      </View>

                    </View>

                  </View>
                </View>

                {/* Slider */}
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width
                  }}
                >
                  <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 5, paddingTop: 10 }}>
                    <Slider
                      style={{ width: '100%' }}
                      minimumValue={0}
                      maximumValue={360}
                      step={0.000000001}
                      value={rotationValue}
                      onValueChange={(value) => {
                        const updatedTextItems = [...textItems];
                        updatedTextItems[selectedTextIndex].rotation = value;
                        setTextItems(updatedTextItems);
                      }}
                      thumbStyle={{ backgroundColor: 'darkblue', width: 25, height: 25, borderRadius: 12.5, borderWidth: 1, borderColor: 'white' }}
                      thumbTintColor="white"
                      minimumTrackTintColor="blue"
                      maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
                    />
                  </View>
                </View>

                {/* Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                    alignItems: 'center',
                  }}
                >
                  {/* plus and minus buttons */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        marginRight: 10,
                      }}
                      onPress={decreaseTextSize}
                    >
                      <MaterialCommunityIcons name="minus" size={20} color={'lightgray'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                      }}
                      onPress={increaseTextSize}
                    >
                      <MaterialCommunityIcons name="plus" size={20} color={'lightgray'} />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    {/* Rotate 90 degrees button */}
                    {/* <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: 30,
                                                width: 90,
                                                borderRadius: 10,
                                                flexDirection: 'row',
                                            }}
                                            onPress={() => { setIsOpenColor(true) }}
                                        >
                                            <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>   Style </Text>
                                            <Icon name="font" size={17} color={'lightgray'} />
                                        </TouchableOpacity> */}

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 90,
                        borderRadius: 10,
                        flexDirection: 'row',
                      }}
                      onPress={() => { setIsOpenColor(true) }}
                    >
                      <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}> Color </Text>
                      <MaterialCommunityIcons name="invert-colors" size={20} color={'lightgray'} />
                    </TouchableOpacity>

                    {/* Rotate 90 degrees button */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 50,
                        borderRadius: 10,
                        flexDirection: 'row',
                      }}
                      onPress={rotateText90Degrees}
                    >
                      <MaterialCommunityIcons name="rotate-left" size={20} color={'lightgray'} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    paddingBottom: 20
                  }}
                >
                  <View></View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* Rotate 90 degrees button */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 90,
                        borderRadius: 10,
                        flexDirection: 'row',
                      }}
                      onPress={hanldeIsOpenFontStyle}
                    >
                      <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Style </Text>
                      <MaterialCommunityIcons name="format-text-variant" size={20} color={'lightgray'} />
                    </TouchableOpacity>

                    {/* Rotate 90 degrees button */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 90,
                        borderRadius: 10,
                        flexDirection: 'row',
                      }}
                      onPress={() => { handleBoldItalic('bold') }}
                    >
                      <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Bold </Text>
                      <MaterialCommunityIcons name="format-bold" size={20} color={'lightgray'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 90,
                        borderRadius: 10,
                        flexDirection: 'row',
                      }}
                      onPress={() => { handleBoldItalic('italic') }}
                    >
                      <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Italic </Text>
                      <MaterialCommunityIcons name="format-italic" size={20} color={'lightgray'} />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            ) : (
              <View>
              </View>
            )
          }

          {isopenColor &&

            <View style={{ backgroundColor: '#1A2A3D', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, zIndex: 10 }}>

              {/* heading */}
              <View
                style={{
                  alignItems: 'center',
                  width,
                  height: 250
                }}
              >
                {/* text view */}
                <View style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 10, paddingTop: 15, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 1, justifyContent: 'space-between' }}>

                  <View style={{ flexDirection: 'row', gap: 0 }}>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        marginRight: 15,
                      }}
                      onPress={() => { setIsOpenColor(false) }}
                    >
                      <MaterialCommunityIcons name="close" size={20} color={'lightgray'} />
                    </TouchableOpacity>

                    <View
                      activeOpacity={0.8}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        borderRadius: 15,
                        marginRight: 15,
                      }}
                    >
                      <Text style={{ color: 'white', fontFamily: 'Manrope-Regular' }}>
                        Change Text Color
                      </Text>
                    </View>

                  </View>


                </View>
                <FlatList
                  data={colors}
                  contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
                  horizontal={false} // Set this to false to create vertical rows
                  numColumns={9} // Display 10 items per row
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleColorSelect(item)}
                      style={{
                        width: 27,
                        height: 27,
                        backgroundColor: item,
                        margin: 5,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'black',
                      }}
                    />
                  )}
                />
              </View>

            </View>

          }

          {/* --------------------------------------------------------------------------------------------------------- */}
          {
            isOpenKit &&
            <View style={{ height: 70, backgroundColor: '#1A2A3D', width, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <TouchableOpacity onPress={() => { addLogoImage() }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, borderColor: 'white', borderColor: 'white', borderWidth: 1 }}>
                <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Logo/Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { addInCanvas("email") }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, borderColor: 'white', borderColor: 'white', borderWidth: 1 }}>
                <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { addInCanvas("phone") }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, borderColor: 'white', borderColor: 'white', borderWidth: 1 }}>
                <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { addInCanvas("address") }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, borderColor: 'white', borderColor: 'white', borderWidth: 1 }}>
                <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Address</Text>
              </TouchableOpacity>
            </View>
          }

          {/* bottom */}
          <View style={{ height: 90, backgroundColor: '#1A2A3D', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

            <TouchableOpacity activeOpacity={1} onPress={() => { handleImagePicker('Image') }} style={{ height: 60, width: 50, backgroundColor: '#182738', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }}>

              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center' }}><MaterialCommunityIcons name="image" size={30} color={"white"} /></Text>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>Image</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={addTextToViewShot} style={{ height: 60, width: 50, backgroundColor: '#182738', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }}>

              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center' }}><MaterialCommunityIcons name="format-text" size={30} color={"white"} /></Text>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>Text</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={() => { handleImagePicker('bg') }} style={{ height: 60, width: 50, backgroundColor: '#182738', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }}>

              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center' }}><MaterialCommunityIcons name="image-multiple" size={30} color={"white"} /></Text>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>BG-Image</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={{ height: 60, width: 50, backgroundColor: '#182738', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }} onPress={handleKit}>

              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center' }}><FontAwesome6 name="circle-user" size={30} color={"white"} /></Text>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>User Kit</Text>
              </View>

            </TouchableOpacity>

          </View>
        </View>

      </View >

      {/* confirmation modal of add frame or not */}
      <Modal
        animationType="fade" // You can use "fade" or "none" for animation type
        visible={isModalVisible5}
        transparent={true}
        onRequestClose={hideAlert5}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',

        }}>
          <TouchableOpacity onPress={hideAlert5} style={{ position: 'absolute', top: 10, right: 20, backgroundColor: 'black' }}>
            <Text style={{ fontSize: 30, color: 'white' }}>
              <MaterialCommunityIcons name="close" size={34} color={"white"} />
            </Text>
          </TouchableOpacity>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            height: 230,
            width: 300,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* icon */}
            <TouchableOpacity onPress={hideAlert5} style={{
              backgroundColor: 'red',
              padding: 8,
              borderRadius: 8,
            }}>
              <Text style={{
                color: 'white',

              }}><FontAwesome6 name="expand" size={25} color="white" /></Text>
            </TouchableOpacity>
            {/* title */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 10,
              color: 'red'
            }}>You want to Add Frame?</Text>
            {/* another */}

            <View style={{ flexDirection: 'row', gap: 40 }}>


              <TouchableOpacity onPress={captureAndShareImage} style={{
                width: 70,
                paddingVertical: 5,
                alignItems: 'center',
                justifyContent: "center",
                borderRadius: 8,
                marginTop: 30,
                borderColor: 'lightgray',
                borderWidth: 1
              }}>
                <Text style={{
                  color: 'darkgray',
                  fontFamily: 'Manrope-Bold'
                }}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={YesAddFrame} style={{
                width: 100,
                paddingVertical: 5,
                alignItems: 'center',
                justifyContent: "center",
                borderRadius: 8,
                marginTop: 30,
                backgroundColor: 'red'
              }}>
                <Text style={{
                  color: 'white',
                  fontFamily: 'Manrope-Bold'
                }}>Add Frame</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
};

// text Inpute modal
const TextInputModal = React.memo(({ visible, initialValue, onSave, onClose }) => {
  const [textValue, setTextValue] = useState(initialValue);

  useEffect(() => {
    setTextValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    if (textValue.toString() && textValue.toString().trim() !== '') {
      onSave(textValue.toString());
    }
    onClose();
  };

  const textInputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      textInputRef.current && textInputRef.current.focus();
    }
  }, [visible]);

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="fade">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <TouchableOpacity onPress={handleSave} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
          <MaterialCommunityIcons name="check" size={30} color="white" />
        </TouchableOpacity>

        <View style={{ width: width - 50, alignItems: 'center' }}>

          <TextInput
            ref={textInputRef}
            value={textValue.toString() || ''}
            onChangeText={setTextValue}
            style={{ padding: 10, marginBottom: 10, color: 'white', width: width / 2, textAlign: 'left' }}
            autoFocus={true}
            multiline={true}
            onSubmitEditing={handleSave}
            placeholder='Enter Text'
          />
        </View>

      </View>
    </Modal>
  );
});

export default App

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
    fontFamily: "Manrope-Bold",
  },
  backgroundImage: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Align to the bottom
    alignItems: 'flex-end',
    backgroundColor: `rgba('')`
  },
  modalContent: {
    backgroundColor: 'red',
    width: '100%', // Full width
    padding: 20,
    borderTopLeftRadius: 20, // Round the top corners
    borderTopRightRadius: 20, // Round the top corners
    height: '50%'
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent2: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage2: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#171717'
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
  fontOption: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    alignItems: 'center',
  },
  fontOptionText: {
    fontSize: 16,
  },
})


