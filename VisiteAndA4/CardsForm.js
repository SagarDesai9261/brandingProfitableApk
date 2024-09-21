import Share from 'react-native-share';// import PDFView from 'react-native-view-pd

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, ScrollView, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert, PermissionsAndroid, ToastAndroid, Platform, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cardData } from './CardData';
import moment from 'moment';
import axios from 'axios';
import PaymentLoadingModal from '../Home/PaymentLoading';
import RNFetchBlob from 'rn-fetch-blob';

const { height, width } = Dimensions.get('window')

const CardsForm = ({ navigation, route }) => {

    const { dataHTML } = route.params;

    console.log(dataHTML, "dataHTML")

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    };

    const [loading, setLoading] = useState(true)

    const [data, setData] = useState({
        fullName: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        whatsapp: '',
        insta: '',
        twitter: '',
        facebook: '',
        googlemap: '',
        youtube: '',
        telegram: '',
    });

    // divider
    const DividerWithText = ({ value }) => {
        return (
            <View style={styles.containerDivider}>
                <View style={styles.divider} />
                <Text style={[styles.label, { marginHorizontal: 10 }]}>{value}</Text>
                <View style={styles.divider} />
            </View>
        );
    };
    const [profileData, setProfileData] = useState(null);
    const [fullName, setFullName] = useState('');
    const [visitingCredits, setVisitingCredits] = useState(0)

    const fetchData = async () => {
        const profileDataString = await AsyncStorage.getItem('profileData');
        const cardData = await AsyncStorage.getItem('carduserdata');

        if (profileDataString) {
            const dataProfile = JSON.parse(profileDataString);
            setProfileData(dataProfile);

            console.log(dataProfile, "data profile")

            setData({
                ...data,
                "fullName": dataProfile?.fullName,
                "phone": dataProfile?.mobileNumber.toString(),
                "role": dataProfile?.Designation,
                "email": dataProfile?.email,
                "website": dataProfile?.website,
                "address": dataProfile?.adress,
                "whatsapp": dataProfile?.mobileNumber.toString()
            })

            try {
                console.log("running function api")
                const response = await axios.get(`https://api.brandingprofitable.com/Plan/credits/${dataProfile?.mobileNumber}`);
                console.log(response.data, "visiting card get from response ");
                console.log(`https://api.brandingprofitable.com/Plan/credits/${dataProfile?.mobileNumber}`)
                setVisitingCredits(response.data.data.visiting_card)
                setLoading(false)
            } catch (error) {
                setVisitingCredits(undefined)
                console.error("visiting_count error", error)
                setLoading(false)
            }
        }


        if (cardData) {
            const data = JSON.parse(cardData)
            setData(data)
        }


    };

    useEffect(() => {
        fetchData();
    }, []);

    const resources = {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    };

    const downloadPdf = async (filePath) => {
        try {


        } catch (error) {
            console.log(error, "eror in donwload pdf")
        }
    }

    const shareBase64PDF = async (filePath) => {
        try {

            // Create base64 data URI
            // const base64URI = `data:application/pdf;base64,${base64Data}`;

            // // Define options for sharing
            // const options = {
            //     title: 'Share PDF',
            //     url: base64URI,
            //     type: 'application/pdf',
            //     fileName: 'visiting-card.pdf'
            // };

            // // Share the PDF file
            // await Share.open(options);

            // pdf sharing
            const imageFileName = `visiting_card_${Date.now()}.pdf`;

            const imageResponse = await RNFetchBlob.config({
                fileCache: true,
                path: `${RNFetchBlob.fs.dirs.CacheDir}/${imageFileName}`,
            }).fetch('GET', filePath);

            const imagePath = imageResponse.path();

            const shareOptions = {
                title: 'Share Image with Branding Profitable!',
                url: `file://${imagePath}`,
                type: 'application/pdf',
                failOnCancel: false,
            };

            await Share.open(shareOptions);

            console.log('PDF shared successfully');
        } catch (error) {
            console.error('Error sharing PDF:', error);
        }
    };

    const { config, fs } = RNFetchBlob;

    const getExtension = (filename) => {
        // To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };

    const movePDFTodoDownloads = async (filePath) => {
        try {
            // const dirPath = `${RNFS.DownloadDirectoryPath}/Business Card`;
            // await RNFS.mkdir(dirPath);
            // const newFilePath = `${dirPath}/visiting_card_${Date.now()}.pdf`;
            // await RNFS.moveFile(filePath, newFilePath);

            // download visiting card

            let date = new Date();
            let ext = getExtension(filePath);
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
                .fetch('GET', filePath)
                .then((res) => {
                    console.log('Download success -> ', JSON.stringify(res));
                    return "Saved Successfully";
                })
                .catch((error) => {
                    console.log('Download failed -> ', error);
                    return "Download Failed";
                });

            showToastWithGravity("File Saved to Your DCIM Folder")

            const convertFileToBase64 = async (fileUri) => {
                const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
                return response;
            };

            // const base64 = await convertFileToBase64("https://cdn.brandingprofitable.com/upload/66065cde9b27cg1.jpg");

            // console.warn(base64, "base64") 

            showToastWithGravity(downloadResult);

            setLoading(false)

            //   navigation.navigate("PDFExample", {data: file.base64, path: dirPath})

            // shareBase64PDF(file.base64, filename);


            Alert.alert(
                'Visiting Card',
                'Share Or Download E - Visiting Card',
                [
                    {
                        text: 'Share',
                        style: 'cancel',
                        onPress: () => {
                            shareBase64PDF(filePath);
                        }
                    },
                    {
                        text: 'View',
                        onPress: () => {
                            navigation.navigate("PDFExample", { data: filePath, })
                        }
                    },
                ],
                { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
            );



            //   console.log(file.base64)

            //   const res = await axios.post("https://cdn.brandingprofitable.com/base64.php", {
            //     "base64_content": file.base64
            //   })

            //   console.log(res.data)

        } catch (error) {
            console.error('Error handling PDF:', error);
        }
    };

    const handleSubmit = async (data) => {
        // setPdfLoad(true);

        try {

            if (visitingCredits == undefined) {

                Alert.alert(
                    'Unlock Visiting Card Credits',
                    'To Download Visiting Card, please Purchase a plan.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Purchase',
                            onPress: () => {
                                navigation.navigate('MlmScreenStack');
                            }
                        },
                    ],
                    { cancelable: true } // Set to false if you don't want to allow tapping outside to dismiss
                );

                return;
            } else if (visitingCredits == 0) {
                Alert.alert(
                    'Unlock Visiting Card Credits',
                    'To Download Visiting Card, please Upgrade a plan.',
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

                return;
            }

            setLoading(true)

            const response = await axios.get(`https://api.brandingprofitable.com/Plan/visiting_save/${profileData?.mobileNumber}`);

            console.log("Success Minus Response:", response.data)
            const html = dataHTML.replace(/Your Name Here/g, data.fullName || "")
                .replace(/Your Designation/g, data.role || "")
                .replace(/1234567890/g, data.phone || "")
                .replace(/Your Email Here/g, data.email || "")
                .replace(/EmailLink/g, "mailto:" + data.email || "")
                .replace(/Your Adress Here/g, data.address || "")
                .replace(/AddressLink/g, data.googlemap || "")
                .replace(/WhatsappLink/g, "https://wa.me/" + data.whatsapp || "")
                .replace(/InstagramLink/g, data.insta || "")
                .replace(/TwitterLink/g, data.twitter || "")
                .replace(/FacebookLink/g, data.facebook || "")
                .replace(/GoogleMapLink/g, data.googlemap || "")
                .replace(/YoutubeLink/g, data.youtube || "")
                .replace(/TelegramLink/g, data.telegram || "")
                .replace(/PhoneLink/g, `tel:${data.phone}` || "")
                .replace("https://cdn.brandingprofitable.com/upload/66587c749d0c5istockphoto-1327592506-612x612.jpg",  profileData?.profileImage)
                .replace("https://cdn.brandingprofitable.com/upload/65d82fc6b1a1aprofile%20(1).png?auto=compress&amp;cs=tinysrgb&amp;h=30",  profileData?.profileImage)
                .replace("https://cdn.brandingprofitable.com/upload/665890a95b74bbusiness_circle-removebg-preview.png",  profileData?.businessLogo)
                .replace("https://cdn.brandingprofitable.com/upload/6565e613c3fdacropped-B_Profitable_Logo.png",  profileData?.businessLogo)

            await AsyncStorage.setItem('carduserdata', JSON.stringify(data));

            const currentDate = moment().format("DD-MM-YYYY HH-mm-ss")

            // const options = {
            //     html,
            //     fileName: `E-Visiting_Card_${currentDate.split(" ")[1]}`,
            //     directory: 'Business Card',
            //     base64: true
            // };
            // const file = await RNHTMLtoPDF.convert(options);

            const res = await axios.post("https://visitingcardbp.dohost.in/convert", {
                html
            });
            console.log(html, "this is html code")

            console.log("response of html to pdf:", res.data)

            const filePath = res.data.pdf_path;

            const apilevel = Platform.Version;

            if (apilevel >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );
                if (granted) {
                    await movePDFTodoDownloads(filePath);
                } else {
                    showToastWithGravity("give permission to download");
                }
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                )
                if (granted) {
                    await movePDFTodoDownloads(filePath);
                } else {
                    showToastWithGravity("give permission to download");
                }
            }
            fetchData();
            // setPdfLoad(false);
        } catch (error) {
            Alert.alert('Error', error.toString());
            // setPdfLoad(false);
            fetchData()
        }
    };

    const handleInputChange = (key, value) => {
        setData({
            ...data,
            [key]: value,
        });
    };

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']}
            style={{ flex: 1, justifyContent: "space-between" }}>

            <PaymentLoadingModal visible={loading} closeModal={() => { navigation.goBack(); }} content={'loading...'} />

            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    Business Card
                </Text>
            </View>

            <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                <View style={styles.profileContainer}>
                    {/* Payment Amount Input */}

                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Full Name</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={data.fullName}
                            onChangeText={(text) => handleInputChange('fullName', text)}
                            autoCapitalize="words"
                        />
                    </View>

                    {
                        dataHTML.includes("1234567890") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Phone</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone"
                                    value={data.phone}
                                    onChangeText={(text) => handleInputChange('phone', text)}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </>
                    }

                    {
                        dataHTML.includes("Your Designation") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Role</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Role"
                                    value={data.role}
                                    onChangeText={(text) => handleInputChange('role', text)}
                                    keyboardType="default"
                                />
                            </View>
                        </>
                    }

                    {
                        dataHTML.includes("Your Email Here") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Email</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={data.email}
                                    onChangeText={(text) => handleInputChange('email', text)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </>
                    }

                    {/* {
                        dataHTML.includes("TwitterLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Website</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Website"
                                    value={data.website}
                                    onChangeText={(text) => handleInputChange('website', text)}
                                    autoCapitalize="none"
                                    keyboardType="url"
                                />
                            </View>
                        </>
                    } */}

                    {
                        dataHTML.includes("Your Adress Here") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Address</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Address"
                                    value={data.address}
                                    onChangeText={(text) => handleInputChange('address', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    }

                    {/*  */}

                    {
                        dataHTML.includes("InstagramLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Insta Link</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Insta Link"
                                    value={data.insta}
                                    onChangeText={(text) => handleInputChange('insta', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>

                        </>
                    }

                    {
                        dataHTML.includes("WhatsappLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Whatsapp Number</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Whatsapp Number"
                                    value={data.whatsapp}
                                    onChangeText={(text) => handleInputChange('whatsapp', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    }

                    {
                        dataHTML.includes("FacebookLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>FaceBook Link</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Facebook Link"
                                    value={data.facebook}
                                    onChangeText={(text) => handleInputChange('facebook', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    }

                    {
                        dataHTML.includes("GoogleMapLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Google Map</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Map Link"
                                    value={data.googlemap}
                                    onChangeText={(text) => handleInputChange('googlemap', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    }


                    {
                        dataHTML.includes("TwitterLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Twitter</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Twitter Link"
                                    value={data.twitter}
                                    onChangeText={(text) => handleInputChange('twitter', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    }



                    {
                        dataHTML.includes("YoutubeLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Youtube</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YouTube Link"
                                    value={data.youtube}
                                    onChangeText={(text) => handleInputChange('youtube', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    }


                    {
                        dataHTML.includes("TelegramLink") &&
                        <>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Telegram</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Telegram Link"
                                    value={data.telegram}
                                    onChangeText={(text) => handleInputChange('telegram', text)}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    }

                    {/* divider */}
                    {/* <View style={[styles.labelContainer, { marginVertical: 5, marginTop: 10 }]}>
						<DividerWithText value={""} />
					</View> */}

                    <TouchableOpacity onPress={() => { handleSubmit(data) }} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "80%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, marginTop: 30 }} >
                        <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                            Create Card
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: 30,
        maxHeight: height
    },
    containerDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
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
        justifyContent: 'flex-start',
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
        alignItems: 'flex-start',
        marginTop: 20
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
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    openButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 15,
        marginTop: -10,
        fontFamily: 'Manrope-Regular'
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        fontFamily: 'Manrope-Bold',
        color: 'white'
    },
    inputContainer1: {
        borderColor: 'gray',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        borderRadius: 8,
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
        width: '70%'
    },
    input1: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center', width: '100%'
    },
});

export default CardsForm
