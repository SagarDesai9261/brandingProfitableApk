import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const UplineDetails = ({ route, navigation }) => {
    const { userTeamDetails } = route.params;

    console.log("userTeamDetails:", userTeamDetails)

    return (
        <LinearGradient
            colors={['#20AE5C', 'black']}
            style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}
            locations={[0.1, 1]}>

            {/* header */}
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
                        <Icon name="angle-left" size={30} color={"black"} />
                    </TouchableOpacity>
                    <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
                        Up-Line
                    </Text>
                </View>
                <View></View>
            </View>

            <View style={styles.card}>
                <Text style={styles.heading}>Sponsor Details</Text>
                <View style={styles.separator}></View>
                <View style={styles.detail}>
                    <Text style={styles.label}>Sponsor Id:</Text>
                    <Text style={styles.value}>{userTeamDetails?.referal?.number}</Text>
                </View>
                {/* 
                <View style={styles.detail}>
                    <Text style={styles.label}>User Level:</Text>
                    <Text style={styles.value}>{userTeamDetails?.referal?.user_leval}</Text>
                    {"referal": {"add_side": "left", "number": "515", "parent_id": "511", "referral_id": "511", "user_leval": "V"}, "sponsor": {"add_side": "left", "number": "515", "parent_id": "511", "referral_id": "511", "user_leval": "V"}}
                </View>
                 */}
                <View style={styles.detail}>
                    <Text style={styles.label}>User Name:</Text>
                    <Text style={styles.value}>{userTeamDetails?.referal?.fullName || "MJ Gohel"}</Text>
                </View>
                <View style={{ height: 20 }}></View>
                <Text style={styles.heading}>Referal Details</Text>
                <View style={styles.separator}></View>
                <View style={styles.detail}>
                    <Text style={styles.label}>Referal Id:</Text>
                    <Text style={styles.value}>{userTeamDetails?.sponsor?.number}</Text>
                </View>
                {/* <View style={styles.detail}>
                    <Text style={styles.label}>User Level:</Text>
                    <Text style={styles.value}>{userTeamDetails?.sponsor?.user_leval}</Text>
                </View> */}
                <View style={styles.detail}>
                    <Text style={styles.label}>User Name:</Text>
                    <Text style={styles.value}>{userTeamDetails?.sponsor?.fullName || "MJ Gohel"}</Text>
                </View>
            </View>

            <View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        elevation: 5,
        marginBottom: 20
    },
    heading: {
        fontSize: 18,
        marginBottom: 16,
        color: '#333',
        fontFamily: 'Manrope-Bold'
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 16,
    },
    detail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontFamily: 'Manrope-Regular',
        color: '#666',
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Manrope-Bold',
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    headerText: {
        fontSize: 17,
        color: 'black',
        fontFamily: 'Manrope-Bold',
        textAlign: 'center'
    }
});

export default UplineDetails;
