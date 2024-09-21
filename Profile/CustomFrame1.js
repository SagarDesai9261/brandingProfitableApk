import Gestures from "react-native-easy-gestures";
import React, { useRef, useState, useEffect, useCallback, isValidElement } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, ScrollView, FlatList, Animated, Dimensions, ImageBackground, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Draggable from 'react-native-draggable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewShot from 'react-native-view-shot';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { ToastAndroid } from 'react-native';
import PaymentLoadingModal from "../Home/PaymentLoading";

const { width } = Dimensions.get('window');

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

const showToastWithGravity = (data) => {
	ToastAndroid.showWithGravityAndOffset(
		data,
		ToastAndroid.SHORT,
		ToastAndroid.BOTTOM,
		0,
		50,
	);
};

const App = ({ navigation, route }) => {
	const viewShotRef = useRef(null);
	const [images, setImages] = useState([]);
	const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
	const [isImageSelected, setIsImageSelected] = useState(false);

	const [businessOrPersonal, setBusinessOrPersonal] = useState('');
	const fetchDataBusinessorPersonal = async () => {
		const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
		setBusinessOrPersonal(businessOrPersonal);
	};

	useEffect(() => {
		fetchDataBusinessorPersonal();
	}, [])
	const [bgImage, setbgImage] = useState([]);
	const [textItems, setTextItems] = useState([]);
	const [selectedTextIndex, setSelectedTextIndex] = useState(-1);
	const [isTextSelected, setIsTextSelected] = useState(false);

	const [rotationValue, setRotationValue] = useState(0);
	const [isopenColor, setIsOpenColor] = useState(false)

	// profile
	const [profileData, setProfileData] = useState(null);
	const [userToken, setUserToken] = useState();

	// loader
	const [loadig, setisloading] = useState(true)

	// text index and edit text
	const [editingTextIndex, setEditingTextIndex] = useState(-1);
	const [editText, setEditText] = useState("");

	const animatedRotation = new Animated.Value(rotationValue);

	useEffect(() => {
		Animated.spring(animatedRotation, {
			toValue: rotationValue,
			friction: 4,
			useNativeDriver: true, // Use the native driver for better performance (requires reanimated 2)
		}).start();
	}, [rotationValue]);

	// custom frames
	const [customFrames, setCustomFrames] = useState([]);

	const { itemId, isRequest, isA4 } = route.params;

	const [runApiOfFrame, setRunApiOfFrame] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (runApiOfFrame) {
			fetchData();
		}
	}, [runApiOfFrame, businessOrPersonal]);

	console.log(isA4)

	// Define the URL for the GET request
	const apiUrl = isA4 == 'yes' ? `https://api.brandingprofitable.com/a4frame/frameimage/${itemId}` : `https://api.brandingprofitable.com/frame/frameimage/${itemId}`

	console.log(apiUrl)

	const fetchData = async () => {
		try {

			if (businessOrPersonal != '') {

				const response = await axios.get(apiUrl);

				if (response.data.statusCode === 200) {
					setRunApiOfFrame(false);
				}
				if (!response.data.data) {
					showToastWithGravity('somthing went wrong!');
					navigation.goBack();
				}
				const imageData = response.data?.data?.frame;
				const data = {
					data: imageData
				};
				setIsLoading(false); // Data loading is complete
				setImages(createItemsFromJson(data));
				setTextItems(createTextItemsFromJson(data));
				setbgImage(createBGImage(data));
			}

		} catch (error) {
			console.log(error, "error to get data of custom frame 1")
			setIsLoading(false); // Set isLoading to false even on error
		}


	};


	// {"Designation": "Kai nai", "_id": "64f5e6fb9ed5b7dd08e669f0", "adhaar": 565656565656, "adress": "Bhavngaar", "dob": "2023-09-03", "email": "gohelmeet121332@gmail.com", "exp": 1693940867, "fullName": "Gohel Meet", "gender": null, "iat": 1693897667, "isPersonal": true, "mobileNumber": 8490803632, "profileImage": "https://www.sparrowgroups.com/CDN/upload/7593947aedc-6cb1-4dd1-832a-51238fc6b59b.jpg"}

	// phone name and image

	// update the user data 
	const phone = profileData?.mobileNumber;
	const username = profileData?.fullName;
	const email = profileData?.email;
	const adress = profileData?.adress;
	const designation = profileData?.Designation;
	const userimage = businessOrPersonal == 'personal' ? profileData?.profileImage : profileData?.businessLogo;
	const businessImage = businessOrPersonal == 'personal' ? null : profileData?.profileImage;

	// {"_id": "6566bc2c2b45266d841ae3b9", "adress": "bhavnagar", "businessLogo": "https://cdn.brandingprofitable.com/upload/6566bbe264b586b3d947b-4079-4fcd-b98a-0dbfd0e52b77.jpg", "businessName": "Software dev", "businessStartDate": "15-11-2023", "businessType": "Art & Design", "email": "gohelmeet221@gmail.com", "exp": 1701836488, "fullName": "Gohel Meet j", "iat": 1701231688, "isPersonal": false, "mobileNumber": 1212121212, "mobileNumberSecond": 5324545425, "profileImage": "https://cdn.brandingprofitable.com/upload/6566bbe78b0d0b675fe4c-be9e-4dc5-85f0-dc54e3fc4c70.jpg", "website": "google.com"}

	// run update 
	const [run, setRun] = useState(true);
	const [runText, setRunText] = useState(true);

	// getting profile data
	useEffect(() => {
		retrieveProfileData()
	}, [retrieveProfileData])

	const retrieveProfileData = async () => {
		try {
			const dataString = await AsyncStorage.getItem('profileData');
			const userToken = await AsyncStorage.getItem('userToken');
			setUserToken(userToken)
			if (dataString) {
				const data = JSON.parse(dataString);
				setProfileData(data);
			}
		} catch (error) {
		}
	};

	// function to split data text and image
	const createItemsFromJson = (json) => {
		const items = [];

		if (json && json.data && json.data.scenes) {
			const scenes = json.data.scenes;
			scenes.forEach((scene) => {
				const layers = scene.layers;

				layers.forEach((layer) => {
					const isAddLogo = layer.src == 'https://cdn.brandingprofitable.com/upload/6565e613c3fdacropped-B_Profitable_Logo.png?auto=compress&cs=tinysrgb&h=60'
					if (layer.type === "StaticImage" && isAddLogo && layer.id != "thisisbgImage1212") {
						if (businessOrPersonal == "business") {
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
								borderRadius: layer.src == "https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60" || layer.src == "https://cdn.brandingprofitable.com/upload/65d82fc6b1a1aprofile%20(1).png?auto=compress&cs=tinysrgb&h=30" ? 100 : 0,
								rotation: layer.rotate || 0,
								scale: 1,
							}
							items.push(newItem);

						} else {
							console.log("business account not found", businessOrPersonal)
						}
					} else if ((layer.type == 'StaticImage' && layer.id != "thisisbgImage1212")) {
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
							borderRadius: layer.src == "https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60" || layer.src == "https://cdn.brandingprofitable.com/upload/65d82fc6b1a1aprofile%20(1).png?auto=compress&cs=tinysrgb&h=30" ? 100 : 0,
							rotation: layer.rotate || 0,
							scale: 1,
						}
						items.push(newItem);

					}
				});
			});
		}
		return items;
	};

	console.log(images.length)

	const createTextItemsFromJson = (jsonData) => {
		if (!jsonData || !jsonData.data || !jsonData.data.scenes) {
			return []; // Return an empty array if jsonData or its properties are not available
		}

		const textItems = [];
		const scenes = jsonData.data.scenes;

		scenes.forEach((scene) => {
			const layers = scene.layers;
			layers.forEach((layer) => {
				if (layer.type === "StaticText" && layer.type != "StaticImage") {
					const newItem = {
						text: layer.text,
						isSelected: false,
						fontSize: parseInt(layer.fontSize) || 20,
						color: layer.fill || 'black',
						left: layer.left - 10|| 0,
						top: layer.top - 10|| 0,
						rotation: layer.angle || 0,
						scaleX: layer.scaleX || 1,
						scaleY: layer.scaleY || 1,
						textAlign: layer.textAlign || 'left',
						// textAlign: "center",
						fontFamily: layer.fontFamily,
						fontStyle: layer.fontStyle,
						fontWeight: layer.fontWeight
					};
					textItems.push(newItem);
				}
			});
		});

		return textItems;
	};

	const createBGImage = (jsonData) => {
		if (!jsonData || !jsonData.data || !jsonData.data.scenes) {
			return []; // Return an empty array if jsonData or its properties are not available
		}

		const textItems = [];
		const scenes = jsonData.data.scenes;

		scenes.forEach((scene) => {
			const layers = scene.layers;
			layers.forEach((layer) => {
				if (layer.id === "thisisbgImage1212") {
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
						fontWeight: 'normal',
						fontStyle: 'normal'
					};
					textItems.push(newItem);
				}
			});
		});

		return textItems;
	};



	// images edit
	const handleImageSelect = useCallback((index) => {
		const updatedImages = images.map((image, i) => ({
			...image,
			isSelected: i === index ? !image.isSelected : false,
		}));

		// Deselect text items when an image is selected
		const updatedTextItems = textItems.map((item) => ({
			...item,
			isSelected: false,
		}));

		setImages(updatedImages);
		setTextItems(updatedTextItems);

		// If an image is deselected, reset selectedImageIndex and isImageSelected states
		if (updatedImages[index].isSelected === false) {
			setSelectedImageIndex(-1);
			setIsImageSelected(false);
		} else {
			setSelectedImageIndex(index);
			setIsImageSelected(true);
			// If an image is selected, deselect all text items
			setSelectedTextIndex(-1);
			setIsTextSelected(false);
		}
	}, [images, textItems]);

	const handleImageDelete = useCallback((index) => {
		const updatedImages = [...images];
		updatedImages.splice(index, 1);
		setImages(updatedImages);

		// If the selected image is deleted, reset selectedImageIndex and isImageSelected states
		if (selectedImageIndex === index) {
			setSelectedImageIndex(null);
			setIsImageSelected(false);
		} else if (selectedImageIndex > index) {
			// If the deleted image is before the selected image, update the selectedImageIndex accordingly
			setSelectedImageIndex(selectedImageIndex - 1);
		}
	}, [images, selectedImageIndex]);

	const increaseImageSize = () => {
		if (selectedImageIndex !== null) {
			const updatedImages = [...images];
			const selectedImage = updatedImages[selectedImageIndex];
			selectedImage.width = (selectedImage.width || 150) + 20;
			selectedImage.height = (selectedImage.height || 150) + 20;
			setImages(updatedImages);
		}
	};

	const decreaseImageSize = () => {
		if (selectedImageIndex !== null) {
			const updatedImages = [...images];
			const selectedImage = updatedImages[selectedImageIndex];
			selectedImage.width = (selectedImage.width || 150) - 20;
			selectedImage.height = (selectedImage.height || 150) - 20;
			setImages(updatedImages);
		}
	};

	const handleBorderRadius = () => {
		if (selectedImageIndex !== null) {
			const updatedImages = [...images];
			const selectedImage = updatedImages[selectedImageIndex];
			if (selectedImage.borderRadius == 0) {
				selectedImage.borderRadius = 100;

			} else {

				selectedImage.borderRadius = 0;
			}
			setImages(updatedImages);
		}
	};

	// text edit
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
			setTextItems(updatedTextItems)
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
					selectedTextItem.fontWeight = null
				} else {
					selectedTextItem.fontWeight = 'bold'
				}
				setTextItems(updatedTextItems);
			}
		}
	};

	// edit text
	const handleEdit = useCallback((index, text) => {
		if (text == username) {
			showToastWithGravity('you can not edit User name!')
		} else {
			setEditingTextIndex(index);
			setEditText(text)

			console.log(text, "selected text")
		}
	}, [textItems])

	// handle save text
	const handleSave = useCallback((updatedText, updatedColor) => {
		const updatedTextItems = [...textItems];
		updatedTextItems[editingTextIndex].text = updatedText;
		setTextItems(updatedTextItems);
		setEditingTextIndex(-1);

	}, [textItems, editingTextIndex])

	// canvas tap
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

	// custom frames

	const handleProfileImageChange = () => {

		// Find the index of the image with the specified id
		const imageIndex = images.findIndex((image) => (
			image.src === 'https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60' || image.src === 'https://cdn.brandingprofitable.com/upload/65d82fc6b1a1aprofile%20(1).png?auto=compress&cs=tinysrgb&h=30' ||
			image.src === profileData?.profileImage ||
			image.src === profileData?.businessLogo
		));

		if (imageIndex !== -1) {
			// Open the image picker and replace the selected image with the new one
			ImageCropPicker.openPicker({
				width: 1000,
				height: 1000,
				cropping: true,
				includeBase64: true,
			})
				.then((response) => {
					const updatedImages = [...images];
					updatedImages[imageIndex] = {
						...updatedImages[imageIndex],
						src: response.path,
					};
					setImages(updatedImages);
				})
				.catch((error) => {
				});
		} else {
			showToastWithGravity("Not have any Profile Image in Canvas")
		}
	};

	const [loader, setLoader] = useState(false)

	// save custom frame
	// Save custom frame
	const saveCustomFrame = async (uri) => {
		try {
			// setLoader(true);

			const apiUrl = `https://api.brandingprofitable.com/savedframe/frame/save`;

			// Load frames from AsyncStorage (no need to await this)
			const framesData = await AsyncStorage.getItem('customFrames');
			let frames = framesData ? JSON.parse(framesData) : [];

			// Create a frame object
			const frame = { name: `frame${frames.length + 1}`, image: uri };


			// Concurrently save to AsyncStorage and make the POST request
			const [savedFrames] = await Promise.all([
				// AsyncStorage.setItem('customFrames', JSON.stringify([...frames, frame])),
				axios.post(apiUrl, {
					mobileNumber: profileData.mobileNumber,
					userId: profileData._id,
					image: uri,
					name: `frame${Math.random(100000, 22222000000)}`,
					is_request_frame: false,
					is_a4frame: isA4 == "yes" ? true : false
				}),
			]);

			// setCustomFrames(savedFrames); // Set the updated frames

			setLoader(false);
			showToastWithGravity("Your Frame Saved!");
			navigation.goBack()
		} catch (error) {
			console.error('Error saving custom frame:', error);
		} finally {
			setLoader(false);
		}
	};

	const handleSaveToLocal = async () => {
		try {

			const uri = await viewShotRef.current.capture();

			setLoader(true)
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
						await saveCustomFrame("https://cdn.brandingprofitable.com/" + image_url);
						// sendFrametoDb(image_url)
					} else {
					}
				})

		} catch (error) {
			console.log("getting error in custom frame", error)
		}
	};

	const convertFileToBase64 = async (fileUri) => {
		const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
		return response;
	};

	// handle
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

		const updatedItems = [...textItems]
		const selectedText = updatedItems[index];

		selectedText.fontFamily = value;
		selectedText.fontWeight = null;

		setTextItems(updatedItems)
	}

	// moveimage 
	const moveImage = (direction) => {
		if (selectedImageIndex !== null) {
			const updatedImages = [...images];
			const selectedImage = updatedImages[selectedImageIndex];
			const moveAmount = 2; // Adjust the value as needed

			switch (direction) {
				case 'up':
					selectedImage.top = (selectedImage.top || 0) - moveAmount;
					break;
				case 'down':
					selectedImage.top = (selectedImage.top || 0) + moveAmount;
					break;
				case 'left':
					selectedImage.left = (selectedImage.left || 0) - moveAmount;
					break;
				case 'right':
					selectedImage.left = (selectedImage.left || 0) + moveAmount;
					break;
				default:
					// Invalid direction
					break;
			}

			setImages(updatedImages);
		}
	};

	// moveimage 
	const moveText = (direction) => {
		if (selectedTextIndex !== null) {
			const updatedText = [...textItems];
			const selectedText = updatedText[selectedTextIndex];
			const moveAmount = 2; // Adjust the value as needed

			switch (direction) {
				case 'up':
					selectedText.top = (selectedText.top || 0) - moveAmount;
					break;
				case 'down':
					selectedText.top = (selectedText.top || 0) + moveAmount;
					break;
				case 'left':
					selectedText.left = (selectedText.left || 0) - moveAmount;
					break;
				case 'right':
					selectedText.left = (selectedText.left || 0) + moveAmount;
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


	useEffect(() => {
		// Update text items
		if (runText && textItems.length !== 0 && userimage && phone && username && email && adress) {
			const updatedTextItems = textItems.map((item) => {
				if (item.text === '1234567890') {
					return { ...item, text: phone }; // Update the text property
				}
				if (item.text === 'Your Name Here') {
					return { ...item, text: username }; // Update the text property
				}
				if (item.text === 'Your Email Here') {
					return { ...item, text: email }; // Update the text property
				}
				if (item.text === 'Your Adress Here') {
					return { ...item, text: adress }; // Update the text property
				}
				if (item.text === 'Your Designation') {
					return { ...item, text: designation }; // Update the text property
				}
				return item; // Keep the item as is if the condition is not met
			});

			setTextItems(updatedTextItems); // Update the state with the modified array
			setRunText(false);
		}

		// Update image items
		if (run && images.length !== 0 && userimage && phone && username && email && adress) {
			const updatedImageItems = images.map((item) => {
				if (item.src === 'https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60' || item.src === 'https://cdn.brandingprofitable.com/upload/65d82fc6b1a1aprofile%20(1).png?auto=compress&cs=tinysrgb&h=30') {
					return { ...item, src: userimage, borderRadius: 100 }; // Update the src property
				}

				if (item.src == "https://cdn.brandingprofitable.com/upload/6565e613c3fdacropped-B_Profitable_Logo.png?auto=compress&cs=tinysrgb&h=60") {
					return { ...item, src: businessImage, borderRadius: 100 }
				}
				return item; // Keep the item as is if the condition is not met
			});
			setImages(updatedImageItems); // Update the state with the modified arra
			setRun(false);
		}
	}, [run, textItems, images, phone, username, userimage, email, adress]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
				<ActivityIndicator color={'white'} />
			</View>
		)
	}

	const handleImagePicker = () => {
		ImageCropPicker.openPicker({
			width: 1000,
			height: 1000,
			cropping: true,
			includeBase64: true,
		})
			.then((response) => {
				// const newImage = {
				// id: layer.id,
				// type: "image",
				// src: layer.src,
				// left: layer.left,
				// top: layer.top,
				// width: layer.width,
				// height: layer.height,
				// scaleX: layer.scaleX,
				// scaleY: layer.scaleY,
				// borderRadius: layer.src == "https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60" || layer.src == "https://cdn.brandingprofitable.com/upload/65d82fc6b1a1aprofile%20(1).png?auto=compress&cs=tinysrgb&h=30" ? 100 : 0,
				// rotation: layer.rotate || 0,
				// scale: 1,
				// }
				const newImage = {
					id: images.length + 1,
					type: "image",
					src: response.path,
					left: 110,
					top: 110,
					width: 70,
					height: 70,
					borderRadius: 0,
					rotation: 0,
					scale: 1,
				};
				setImages((prevImages) => [...prevImages, newImage]);
			})
			.catch((error) => {
			});
	};

	// OpenSans-Regular this is my font family

	const handleDragEnd = (index, top, left, transform) => {
		// console.log(transform, "transform");
		const rotateObject = transform.find(item => item.rotate !== undefined);
		const scaleObject = transform.find(item => item.scale !== undefined);
		const rotateValue = parseFloat(rotateObject.rotate);
		const scaleValue = parseFloat(scaleObject.scale);
		const selectedImage = images[index];
		selectedImage.top = top;
		selectedImage.left = left;
		selectedImage.scale = transform.scale;
		selectedImage.rotation = rotateValue;
		selectedImage.scale = scaleValue;
		setImages(images)
	}


	const handleDataBtnClick = (value) => {
		if (value == 'name') {
			const userItem = textItems.find(item => item.text === username);
			const userIndex = textItems.findIndex(item => item.text === username);

			setSelectedTextIndex(userIndex)

			if (userItem) {
				// Clone the textItems array
				const updatedTextItems = [...textItems];

				// Find the index of the userItem in the cloned array
				const indexToModify = updatedTextItems.findIndex(item => item.text === userItem.text);

				// Clone the userItem and update isSelected to true
				const updatedUserItem = { ...userItem, isSelected: true };

				if (indexToModify !== -1) {
					// Replace the old item with the updated item in the cloned array
					updatedTextItems[indexToModify] = updatedUserItem;

					setTextItems(updatedTextItems);
					setIsTextSelected(true);
				} else {
				}
			} else {
				showToastWithGravity('Username not found');
			}
		} else if (value == 'email') {
			const userItem = textItems.find(item => item.text === email);
			const userIndex = textItems.findIndex(item => item.text === email);
			setSelectedTextIndex(userIndex)

			if (userItem) {
				// Clone the textItems array
				const updatedTextItems = [...textItems];

				// Find the index of the userItem in the cloned array
				const indexToModify = updatedTextItems.findIndex(item => item.text === userItem.text);

				// Clone the userItem and update isSelected to true
				const updatedUserItem = { ...userItem, isSelected: true };

				if (indexToModify !== -1) {
					// Replace the old item with the updated item in the cloned array
					updatedTextItems[indexToModify] = updatedUserItem;

					setTextItems(updatedTextItems);
					setIsTextSelected(true);
				} else {
				}
			} else {
				showToastWithGravity('Email not found');
			}
		} else if (value == 'address') {
			const userItem = textItems.find(item => item.text === email);
			const userIndex = textItems.findIndex(item => item.text === email);
			setSelectedTextIndex(userIndex)

			if (userItem) {
				// Clone the textItems array
				const updatedTextItems = [...textItems];

				// Find the index of the userItem in the cloned array
				const indexToModify = updatedTextItems.findIndex(item => item.text === userItem.text);

				// Clone the userItem and update isSelected to true
				const updatedUserItem = { ...userItem, isSelected: true };

				if (indexToModify !== -1) {
					// Replace the old item with the updated item in the cloned array
					updatedTextItems[indexToModify] = updatedUserItem;

					setTextItems(updatedTextItems);
					setIsTextSelected(true);
				} else {
				}
			} else {
				showToastWithGravity('Address not found');
			}
		}

		else if (value == 'designation') {
			const userItem = textItems.find(item => item.text === designation);
			const userIndex = textItems.findIndex(item => item.text === designation);
			setSelectedTextIndex(userIndex)

			if (userItem) {
				// Clone the textItems array
				const updatedTextItems = [...textItems];

				// Find the index of the userItem in the cloned array
				const indexToModify = updatedTextItems.findIndex(item => item.text === userItem.text);

				// Clone the userItem and update isSelected to true
				const updatedUserItem = { ...userItem, isSelected: true };

				if (indexToModify !== -1) {
					// Replace the old item with the updated item in the cloned array
					updatedTextItems[indexToModify] = updatedUserItem;

					setTextItems(updatedTextItems);
					setIsTextSelected(true);
				} else {
				}
			} else {
				showToastWithGravity('Designation not found');
			}
		}
		else {
			const userItem = textItems.find(item => item.text === phone);
			const userIndex = textItems.findIndex(item => item.text === phone);
			setSelectedTextIndex(userIndex)

			if (userItem) {
				// Clone the textItems array
				const updatedTextItems = [...textItems];

				// Find the index of the userItem in the cloned array
				const indexToModify = updatedTextItems.findIndex(item => item.text === userItem.text);

				// Clone the userItem and update isSelected to true
				const updatedUserItem = { ...userItem, isSelected: true };

				if (indexToModify !== -1) {
					// Replace the old item with the updated item in the cloned array
					updatedTextItems[indexToModify] = updatedUserItem;

					setTextItems(updatedTextItems);
					setIsTextSelected(true);
				} else {
				}
			} else {
				showToastWithGravity('Phone number not found');
			}
		}
	};


	// text items which is displays 
	const TextItem = React.memo(({
		text,
		isSelected,
		onDelete,
		onSelect,
		onEdit,
		width,
		height,
		fontFamily,
		fontSize,
		color,
		top,
		left,
		scaleX,
		scaleY,
		textAlign,
		fontStyle,
		fontWeight
	}) => {



		const FontF = fontWeight == "bold" && fontStyle == "italic" ? fontFamily?.split('-')[0] + "-BoldItalic" : fontWeight == "bold" ? fontFamily?.split('-')[0] + "-Bold" : fontStyle == "italic" ? fontFamily?.split('-')[0] + "-Italic" : fontFamily?.split('-')[0] + "-Regular";

		// const FontF = fontWeight == "bold" && fontStyle == "italic" ? fontFamily + "-BoldItalic" : fontWeight == "bold" ? fontFamily + "-Bold" : fontStyle == "italic" ? fontFamily + "-Italic" : fontFamily + "-Regular";

		console.log(FontF, "FontF")

		return (
			<TouchableOpacity style={{ top, left, padding:10, }} onPress={onSelect} activeOpacity={0.7}>
				<View
					style={{
						borderColor: isSelected ? 'black' : 'transparent',
						borderWidth: isSelected ? 2 : 0,
						// justifyContent: 'center',closeModal
					}}
				>
					<Text
						style={{
							fontSize,
							color,
							textAlign,
							// fontWeight,
							// fontStyle,
							fontFamily: FontF,
							// fontFamily
						}}
					>
						{text}
					</Text>
				</View>
			</TouchableOpacity>
		);
	});

	// my name is gohel meet what is your name please give me your name ui this file hello my name is foehll
	// const ImageItem = React.memo(({ uri, isSelected, onDelete, onSelect, width, height, rotation, top, left, scaleX, scaleY, flipX, flipY, borderRadius, onDragEnd, rotate, scale }) => {
	// const transformStyles = [];

	// if (flipX) {
	// transformStyles.push({ scaleX: -1 });
	// }

	// if (flipY) {
	// transformStyles.push({ scaleY: -1 })
	// }

	// console.log("scale & rotate:", scale, rotation);

	// return (
	// <Gestures
	// scalable={{
	// min: -1,
	// max: 3,
	// }}
	// rotatable={true}
	// key={1}
	// style={{ top, left, position: 'absolute' }}
	// onEnd={(event, styles) => {
	// const newTop = styles.top;
	// const newLeft = styles.left;
	// onDragEnd(newTop, newLeft, styles.transform);
	// }}
	// >
	// <TouchableOpacity onPress={onSelect} >
	// <Image
	// source={{ uri: uri || 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80' }}
	// style={{
	// width: width * scaleX || width || 100,
	// height: height * scaleY || height || 100,
	// borderColor: isSelected ? 'black' : 'transparent',
	// borderWidth: isSelected ? 2 : 0,
	// // transform: transformStyles, // Apply the flip transformations here
	// borderRadius: borderRadius,
	// transform: [{ rotate: `${rotation || 0}deg` }, { scale: scale }]
	// }}
	// />
	// </TouchableOpacity>
	// </Gestures>
	// );
	// });

	const ImageItem = React.memo(({ id, uri, isSelected, borderRadius, onSelect, width, height, rotation, top, left, scaleX, scaleY, scale, onDragEnd }) => {

		const [profileFound, isProfileFound] = useState(false)
		useEffect(() => {
			if (uri == 'https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60' || uri == userimage) {
				isProfileFound(true)
			}
		})
		return (
			<Gestures
				scalable={{
					min: -1,
					max: 3,
				}}
				rotatable={true}
				key={1}
				style={{ top, left, position: 'absolute' }}
				onEnd={(event, styles) => {
					const newTop = styles.top;
					const newLeft = styles.left;
					onDragEnd(newTop, newLeft, styles.transform);
				}}
			>
				<View style={{ position: 'relative', transform: [{ rotate: `${rotation || 0}deg` }] }}>
					<TouchableOpacity onPress={onSelect} >
						<Image
							source={{ uri }}
							style={{
								width: width * scaleX || width || 100,
								height: height * scaleY || height || 100,
								borderColor: isSelected ? 'black' : 'transparent',
								borderWidth: isSelected ? 2 : 0,
								// transform: transformStyles, // Apply the flip transformations here
								borderRadius: borderRadius,
								transform: [{ rotate: `${rotation || 0}deg` }, { scale: scale }]
							}}
						/>
					</TouchableOpacity>
				</View>
			</Gestures>
		);
	});

	// [{"height": 500, "id": "zg1oJM0hmYDcBNWpRS-sO", "left": 0, "scaleX": 0.6, "scaleY": 0.6, "src": "https://cdn.brandingprofitable.com/upload/601pop2.png", "top": 0, "type": "image", "width": 500}] this is bg image

	// if (loader) {
	// return (
	// <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
	// <ActivityIndicator color="white" />
	// </View>
	// )
	// }

	return (
		<LinearGradient
			colors={['#20AE5C', 'black']}
			style={{ flex: 1 }}
			locations={[0.1, 1]}>

			<PaymentLoadingModal visible={loader} closeModal={() => { navigation.goBack(); }} content={'loading...'} />

			<TextInputModal
				visible={editingTextIndex !== -1} // Show the modal when there's a text item being edited
        initialValue={editText} // Pass the initial text value when editing
        // initialColor={editingTextIndex !== -1 ? textItems[editingTextIndex].color : 'red'} // Pass the initial text value when editing
        onSave={handleSave} // Save the updated text
        value={editText}
        onClose={() => setEditingTextIndex(-1)} // Close the modal when editing is done
      />



      <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', }}>

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

        <View style={styles.headerContainer}>
          <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
            <Icon name="angle-left" size={30} color={"black"} />
          </TouchableOpacity>
          <Text style={styles.headerText} onPress={() => { navigation.navigate('ProfileScreen') }}>
            Edit Frame
          </Text>
          <TouchableOpacity onPress={handleSaveToLocal}>
            <Text style={{ height: 30, width: 30 }}>
              <MaterialCommunityIcons name="content-save" size={30} color={"black"} />
            </Text>
          </TouchableOpacity>
        </View>


        <View style={{
              borderWidth: 1,
              borderColor: 'gray',}}>
          <ViewShot
            ref={viewShotRef}
            style={{
              width: 300,
              height: isA4 == "yes" ? 375 : 300,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
            onPress={handleCanvasTap}
            options={{ width: 1080, height: isA4 == 'yes' ? 1350 : 1080, quality: 1 }}
          >
            <ImageBackground
              source={{ uri: bgImage[0]?.src || null }} // Replace with the actual image path
              style={[styles.backgroundImage, { height: isA4 == "yes" ? 375 : 300, }]}
            >

              <View
                style={{ height: '100%', width: '100%', }}
              >
                {/* images and texts */}
                {images.length !== 0 ? (
                  images.map((image, index) => (
                    <ImageItem
                      uri={image.uri || image.src}
                      isSelected={image.isSelected}
                      width={image.width || 100}
                      height={image.height || 100}
                      rotation={image.rotation || 0}
                      top={image.top || 0}
                      left={image.left || 0}
                      onSelect={() => {
                        setSelectedImageIndex(index);
                        handleImageSelect(index);
                      }}
                      onDelete={() => handleImageDelete(index)}
                      scaleX={image.scaleX}
                      scaleY={image.scaleY}
                      flipX={image.flipX}
                      flipY={image.flipY}
                      borderRadius={image.borderRadius || 0}
                      rotate={image.rotate}
                      scale={image.scale}
                      onDragEnd={(newTop, newLeft, transform) => handleDragEnd(index, newTop, newLeft, transform)}
                    />
                  ))
                ) : null}

                {textItems.map((textItem, index) => (
                  <Draggable key={index}>
                    <TextItem
                      key={index}
                      text={textItem.text}
                      isSelected={textItem.isSelected}
                      width={150}
                      height={50}
                      rotation={textItem.rotation || 0}
                      fontSize={textItem.fontSize}
                      fontFamily={textItem.fontFamily}
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
                      textAlign={textItem.textAlign}
                      fontWeight={textItem.fontWeight}
                      fontStyle={textItem.fontStyle}
                    />
                  </Draggable>
                ))}

              </View>

            </ImageBackground>

          </ViewShot>

        </View>



        <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#1A2A3D', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

					<View style={{ flexDirection: 'row', marginTop: 10 }}>
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								justifyContent: 'center',
								alignItems: 'center',
								height: 30,
								width: 70,
								margin: 5,
								borderRadius: 10,
								flexDirection: 'row',
							}}
							onPress={() => { handleDataBtnClick('name') }}
						>
							<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>
								Name
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								justifyContent: 'center',
								alignItems: 'center',
								height: 30,
								width: 70,
								margin: 5,
								borderRadius: 10,
								flexDirection: 'row',
							}}
							onPress={() => { handleDataBtnClick('phone') }}
						>
							<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>
								Phone
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								justifyContent: 'center',
								alignItems: 'center',
								height: 30,
								width: 70,
								margin: 5,
								borderRadius: 10,
								flexDirection: 'row',
							}}
							onPress={() => { handleDataBtnClick('email') }}
						>
							<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>
								Email
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								justifyContent: 'center',
								alignItems: 'center',
								height: 30,
								width: 70,
								margin: 5,
								borderRadius: 10,
								flexDirection: 'row',
							}}
							onPress={() => { handleDataBtnClick('address') }}
						>
							<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>
								Address
							</Text>
						</TouchableOpacity>

					</View>
					<View style={{ flexDirection: 'row', marginVertical: 10, }}>
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								justifyContent: 'center',
								alignItems: 'center',
								height: 30,
								width: 90,
								margin: 5,
								borderRadius: 10,
								flexDirection: 'row',
							}}
							onPress={handleImagePicker}
						>
							<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>
								Add Image
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								justifyContent: 'center',
								alignItems: 'center',
								height: 30,
								width: 120,
								borderRadius: 10,
								flexDirection: 'row',
								margin: 5
							}}
							onPress={handleProfileImageChange}
						>
							<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Change Profile</Text>

						</TouchableOpacity>


						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								justifyContent: 'center',
								alignItems: 'center',
								height: 30,
								width: 80,
								margin: 5,
								borderRadius: 10,
								flexDirection: 'row',
							}}
							onPress={() => { handleDataBtnClick('designation') }}
						>
							<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>
								Designation
							</Text>
						</TouchableOpacity>

					</View>

					{

						(isImageSelected && !isTextSelected) ? (

							<>

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
														Format Image
													</Text>
												</View>

											</View>

											<View style={{ flexDirection: 'row', gap: 0 }}>

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
													onPress={() => { handleImageDelete(selectedImageIndex, images[selectedTextIndex]) }}
												>
													<MaterialCommunityIcons name="trash-can" size={20} color={'lightgray'} />
												</TouchableOpacity>

												{/* joystick */}
												<View style={{ borderRadius: 100, height: 80, width: 80, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', elevation: 5, gap: -20, marginTop: -60, marginLeft: 0 }}>

													<TouchableOpacity onPress={() => moveImage('up')} style={{ width: '100%', alignItems: 'center', justifyContent: 'center', padding: 5 }}>
														<Icon name="angle-up" size={30} color="white" />
													</TouchableOpacity>

													<View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 5, flexDirection: 'row' }}>
														<TouchableOpacity onPress={() => moveImage('left')} style={{ padding: 5, }}>
															<Icon name="angle-left" size={30} color="white" />
														</TouchableOpacity>
														<View style={{ borderRadius: 100, height: 25, width: 25, backgroundColor: '#191F26', elevation: 10 }}>

														</View>
														<TouchableOpacity onPress={() => moveImage('right')} style={{ padding: 5, }}>
															<Icon name="angle-right" size={30} color="white" />
														</TouchableOpacity>
													</View>

													<TouchableOpacity onPress={() => moveImage('down')} style={{ width: '100%', alignItems: 'center', justifyContent: 'center', padding: 5 }}>
														<Icon name="angle-down" size={30} color="white" />
													</TouchableOpacity>

												</View>

											</View>

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
											marginTop: 20
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
													width: 150,
													borderRadius: 15,
													marginRight: 15,
													flexDirection: 'row'
												}}
												onPress={handleBorderRadius}
											>
												<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Square & Round </Text>
												<MaterialCommunityIcons name="border-outside" size={20} color={'lightgray'} />
											</TouchableOpacity>
										</View>
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
													marginRight: 15,
												}}
												onPress={decreaseImageSize}
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
												onPress={increaseImageSize}
											>
												<MaterialCommunityIcons name="plus" size={20} color={'lightgray'} />
											</TouchableOpacity>
										</View>
									</View>

								</View>
							</>


						) : (isTextSelected && !isImageSelected) ? (
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
													Formate Text
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

												<TouchableOpacity onPress={() => moveText('up')} style={{ width: '100%', alignItems: 'center', justifyContent: 'center', margin: 5, marginBottom: 10 }}>
													<Icon name="angle-up" size={30} color="white" />
												</TouchableOpacity>

												<View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', margin: 5, flexDirection: 'row' }}>
													<TouchableOpacity onPress={() => moveText('left')} style={{ margin: 5, }}>
														<Icon name="angle-left" size={30} color="white" />
													</TouchableOpacity>
													<View style={{ borderRadius: 100, height: 25, width: 25, backgroundColor: '#191F26', elevation: 10 }}>

													</View>
													<TouchableOpacity onPress={() => moveText('right')} style={{ margin: 5, }}>
														<Icon name="angle-right" size={30} color="white" />
													</TouchableOpacity>
												</View>

												<TouchableOpacity onPress={() => moveText('down')} style={{ width: '100%', alignItems: 'center', justifyContent: 'center', margin: 5, marginTop: 10 }}>
													<Icon name="angle-down" size={30} color="white" />
												</TouchableOpacity>

											</View>

										</View>

									</View>
								</View>

								{/* Buttons */}
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										paddingHorizontal: 20,
										alignItems: 'center',
										paddingVertical: 20
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
												marginRight: 15,
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
											onPress={() => { setIsOpenColor(true) }}
										>
											<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>Text Color </Text>
											<MaterialCommunityIcons name="invert-colors" size={20} color={'lightgray'} />
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
											onPress={handleCanvasTap}
										>
											<MaterialCommunityIcons name="check" size={20} color={'lightgray'} />
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
										<TouchableOpacity
											activeOpacity={0.8}
											style={{
												backgroundColor: 'rgba(0, 0, 0, 0.1)',
												justifyContent: 'center',
												alignItems: 'center',
												height: 30,
												width: 120,
												borderRadius: 10,
												flexDirection: 'row',
											}}
											onPress={hanldeIsOpenFontStyle}
										>
											<Text style={{ color: 'lightgray', fontFamily: 'Manrope-Regular' }}>{textItems[selectedTextIndex].fontFamily.length > 8 ? textItems[selectedTextIndex].fontFamily.substring(0, 8) + "..." : textItems[selectedTextIndex].fontFamily} </Text>
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
									height: 200
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

					{/* bottom */}
				</View>

			</View >
		</LinearGradient>
	);
};

// const TextInputModal = React.memo(({ visible, initialValue, initialColor, onSave, onClose }) => {
// const [textValue, setTextValue] = useState(initialValue);
// const [textColor, setTextColor] = useState(initialColor || 'black');

// useEffect(() => {
// setTextValue(initialValue);
// }, [initialValue]);

// const handleSave = () => {
// onSave(textValue); // Pass both the textValue and textColor to the parent onSave function
// onClose();
// };

// return (
// <View style={{ display: 'flex', position:'absolute', top:0, left:0 }}>
// <View
// style={{
// flex: 1,
// justifyContent: 'center',
// alignItems: 'center',
// backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark background
// }}
// >
// <TextInput
// value={textValue || ""}
// onChangeText={setTextValue}
// placeholder='add Text'
// style={{ padding: 10, marginBottom: 10, width: width, textAlign: 'center', borderRadius: 10, color: textColor }}
// onSubmitEditing={handleSave}
// />
// </View>
// </View>
// );
// });

// text Inpute modal
const TextInputModal = React.memo(({ visible, initialValue, onSave, onClose }) => {
	const [textValue, setTextValue] = useState(initialValue);

	console.log(textValue, "falskjfalsfjlfadalsdfjaklsdfjaslfjsdklf")

	useEffect(() => {
		setTextValue(initialValue);
	}, [initialValue]);

	const handleSave = () => {
		if (textValue != "") {
			onSave(textValue);
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
						value={textValue.toString()}
						onChangeText={setTextValue}
						style={{ padding: 10, marginBottom: 10, color: 'white', width: width - 70, textAlign: 'center' }}
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




export default App;

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
		color: 'black',
		fontFamily: "Manrope-Bold",
		// fontStyle:'italic'
	},
	backgroundImage: {
		width: 300,
		justifyContent: 'center',
		alignItems: 'center',
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
