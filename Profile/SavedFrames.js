import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, Alert, Button, ActivityIndicator, ToastAndroid, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.3; // Adjust the number of columns as needed

const aspectRatio = 300 / 380; // Desired aspect ratio
const itemHeight = itemWidth / aspectRatio;

const SavedFrames = ({ navigation }) => {

	const [selectedOption, setSelectedOption] = useState("Custom Frame")

	const [customFrames, setCustomFrames] = useState([]);
	const [a4Frames, setA4Frames] = useState([]);
	const [loader, setLoader] = useState(true)

	const [item, setItem] = useState(customFrames?.length > 0 ? customFrames[0].image : null);

	const showToastWithGravity = (data) => {
		ToastAndroid.showWithGravityAndOffset(
			data,
			ToastAndroid.LONG,
			ToastAndroid.CENTER,
			0,
			0
		)
	}

	// getting profile data 
	const [profileData, setProfileData] = useState(null);

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

	useEffect(() => {
		retrieveProfileData();
	}, []);

	const [displayToast, setdisplayToast] = useState(true)

	useEffect(() => {

		if (displayToast) {
			showToastWithGravity("longpress to delete frame!")
			setdisplayToast(false)
		}

	})


	// {
	// "image": "https://cdn.brandingprofitable.com/upload/6525a1a60933b.png"
	// }
	// const deleteSavedFrames = async (item) => {
	// try {
	// const apiUrl = `https://api.brandingprofitable.com/savedframe/savedframe/remove/${profileData._id}`
	// const imageUrl = item.image;

	// const response = await fetch(apiUrl, {
	// method: 'DELETE',
	// headers: {
	// 'Content-Type': 'application/json',
	// },
	// body: JSON.stringify({
	// image: imageUrl,
	// }),
	// });

	// console.log("api url: ", apiUrl);
	// console.log("api body: ", {
	// image: item.image,
	// });

	// if (response.ok) {
	// console.log("Delete successful");
	// } else {
	// console.log("Delete request failed");
	// }
	// } catch (error) {
	// console.log("Error in delete saved frame in saved frame screen", error);
	// }
	// };

	const deleteSavedFrames = async (item) => {
		try {
			setLoader(true)
			const apiUrl = `https://api.brandingprofitable.com/savedframe/savedframe/remove/${profileData._id}`
			const imageUrl = item.image;

			const response = await axios.delete(apiUrl, {
				data: {
					image: imageUrl,
				},
			});

			loadCustomFrames();
			showToastWithGravity("Deleted successfully");
			setLoader(false)
		} catch (error) {
			console.log("Error in delete saved frame in saved frame screen", error);
		}
	};

	const fetchSavedUserFrames = async () => {
		try {
			if (!profileData?._id) {
				return;
			}

			const response = await axios.get(
				`https://api.brandingprofitable.com/savedframe/saved/frame/v2/${profileData?._id}`
			);

			const result = response.data.data;
			await AsyncStorage.setItem('customFrames', JSON.stringify(result));

setTimeout(() => {
	setLoader(false); 
}, 500);
	return result;
	} catch (error) {
	return error;
	}
	};



	const loadCustomFrames = async () => {
		try {

			setLoader(true)
			// const framesData = await AsyncStorage.getItem('customFrames');
			// if (framesData) {
			// const frames = JSON.parse(framesData);
			// setCustomFrames(frames);
			// }

			const savedFrames = await fetchSavedUserFrames();
			const filterCustomFrames = savedFrames?.filter(item => item.is_a4frame !== true);
			const filterA4Frames = savedFrames?.filter(item => item.is_a4frame === true);
			// const filterCustomFrames = savedFrames.filter(item => item.isa4frame);

			setCustomFrames(filterCustomFrames)
			setA4Frames(filterA4Frames)

			if (filterA4Frames.length != 0 && filterCustomFrames.length == 0) {
				setSelectedOption("A4 Frames")

				console.log("filterA4Frames[0]", filterA4Frames[0])
				setItem(filterA4Frames[0]?.image)
			}else if (filterCustomFrames.length != 0){
				setSelectedOption("Custom Frames")
				setItem(filterCustomFrames[0]?.image)
			}

			// if (savedFrames?.length != 0 && savedFrames) {
			// setCustomFrames(savedFrames);
			// } else {
			// setCustomFrames([])
			// }
		} catch (error) {
			console.error('Error loading custom frames:', error)
		}
	};

	useEffect(() => {
		// Add a listener to the focus event to reload the screen
		const unsubscribe = navigation.addListener('focus', loadCustomFrames);

		// Clean up the listener when the component unmounts
		return () => unsubscribe();
	}, [navigation, profileData]);

	const handleImagePress = (image) => {
		setItem(image);
	};

	useEffect(() => {
		const saveCustomFrames = async () => {
			try {
				await AsyncStorage.setItem('customFrames', JSON.stringify(customFrames));
			} catch (error) {
				console.error('Error saving custom frames:', error);
			}
		};

		saveCustomFrames();
	}, [customFrames]);

	const [i, seti] = useState(true)

	// if (customFrames && i) {
	// setTimeout(() => {
	// setLoader(false)
	// setItem(customFrames[0]?.image);
	// seti(false)
	// }, 1000);
	// }

	const handleImageLongPress = (item) => {
		Alert.alert(
			'Delete Image',
			'Are you sure you want to delete this image?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: () => deleteImage(item) },
			],
			{ cancelable: true }
		);
	};

	const deleteImage = (item) => {
		// const updatedFrames = customFrames.filter((frame) => frame.name !== item.name);
		// setCustomFrames(updatedFrames);
		deleteSavedFrames(item);

	};

	// const MemoizedFastImage = React.memo(({ item }) => (
	// <TouchableOpacity
	// style={styles.imageContainer}
	// onPress={() => handleImagePress(item.image)}
	// onLongPress={() => handleImageLongPress(item)}
	// >
	// <FastImage source={{ uri: item.image }} style={styles.image} />
	// </TouchableOpacity>
	// ));

	// const renderItem = ({ item }) => (
	// <MemoizedFastImage item={item} />
	// );

	const renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={styles.imageContainer}
				onPress={() => handleImagePress(item.image)}
				onLongPress={() => handleImageLongPress(item)}
			>
				<Image source={{ uri: item.image }} resizeMode="stretch" style={[styles.image, { height: selectedOption == "A4 Frames" ? itemHeight : itemWidth }]} />
			</TouchableOpacity>
		)
	};


	if (loader) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'black' }}>
				<ActivityIndicator color={'white'} />
			</View>
		)
	}

	return (
		<>
			{customFrames?.length === 0 && a4Frames.length == 0 ? (
				<View style={styles.container}>
					<Text style={{ color: 'white', fontFamily: 'Manrope-Regular' }}>
						No frames Found
					</Text>
				</View>
			) : (
				<LinearGradient
					colors={['#20AE5C', 'black']}
					style={styles.container}
					locations={[0.1, 1]}
				>

					<Modal
						animationType="fade"
						transparent={true}
						visible={loader}
					>
						<View style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
						}}>
							<View style={{ padding: 20, borderRadius: 10, backgroundColor: 'white' }}>
								<ActivityIndicator color="black" />
							</View>
						</View>
					</Modal>

					<View style={styles.mainImageContainer}>
						{item && <Image source={{ uri: item }} style={[styles.mainImage, { width: selectedOption == "A4 Frames" ? 241 : 300 }]} />}
					</View>
					<View style={{ width: 120, zIndex: 1, height: 40, }}>
						<SelectDropdown
							defaultValue={selectedOption}
							data={[
								'A4 Frames', "Custom Frames"
							]} // Use the language names
							onSelect={(selectedItem, index) => {
								if (selectedItem == 'A4 Frames' && a4Frames.length != 0) {
									setItem(a4Frames[0].image)
								} else if (selectedItem == 'Custom Frames' && customFrames.length != 0) {
									setItem(customFrames[0].image)
								} else {
									setItem(null)
								}
								setSelectedOption(selectedItem);
							}}
							buttonTextAfterSelection={(selectedItem, index) => {
								return selectedItem;
							}}
							rowTextForSelection={(item, index) => {
								return item;
							}}
							buttonStyle={{ backgroundColor: 'red', height: 25, borderRadius: 100, width: 120, }}
							rowTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 12, color: "black" }}
							buttonTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 12, color: "white" }}
							defaultButtonText='Select Language'
							dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
						/>
					</View>
					<FlatList
						data={selectedOption === "A4 Frames" ? a4Frames : customFrames}
						numColumns={3}
						keyExtractor={(item) => item.name}
						renderItem={renderItem}
						ListEmptyComponent={() => (
							<View style={styles.emptyListContainer}>
								<Text>No frames found</Text>
							</View>
						)}
					/>

				</LinearGradient>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 20,
		backgroundColor: 'black'
	},
	flatListContainer: {
		marginTop: 30,
		paddingBottom: 60
	},
	imageContainer: {
		alignItems: 'center',
		margin: 5,
		borderColor: 'gray',
		borderWidth: 0.5,
		borderRadius: 10,
	},
	image: {

		width: itemWidth,
		borderRadius: 10,
	},
	name: {
		marginTop: 5,
		textAlign: 'center',
	},
	mainImage: {
		height: 300,
		width: 300,
		borderRadius: 10,
		resizeMode: 'stretch', 
	},
	mainImageContainer: {
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 10,
		marginBottom: 20
	},
	headerContainer: {
		height: 50,
		width: '100%',
		marginBottom: 30,
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	iconContainer: {
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
		width: 50,
		borderRadius: 100
	},
	emptyListContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
});

export default SavedFrames;
