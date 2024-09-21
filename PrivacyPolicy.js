import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const PrivacyPolicy = ({ navigation }) => {
    return (
        <LinearGradient colors={['#050505', '#1A2A3D']}
            style={{ flex: 1, justifyContent: "space-between" }}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
                    Privacy Policy & Terms
                </Text>
            </View>

            <ScrollView style={{ padding: 20, flex: 1, paddingTop: 10 }}>
                <View style={{ paddingBottom: 40 }}>
                    {/* 1 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, }}>
                        Effective Date: Sep 10, 2023
                    </Text>

                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        Welcome to the BrandingProfitable application, provided by KuberTree Company. By using our
                        services, you acknowledge that you have read and understood our Privacy Policy outlined
                        below.
                    </Text>

                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        KuberTree, We are committed to protecting your privacy. {'\n'}This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application Branding-Profitable.
                    </Text>

                    {/* 2 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, marginTop: 15 }}>
                        Information We Collect
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        We may collect the following types of information when you use our App:{'\n'}

                        Personal Information: We may collect personal information that you provide directly to us, such as your name, email address, and other contact information.{'\n'}

                        Usage Information: We may collect information about your use of the App, including your device information, app usage, and browsing history.
                    </Text>

                    {/* 3 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, marginTop: 15 }}>
                        How We Use Your Information
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        We may use the information we collect for various purposes, including:{'\n'}

                        To provide, maintain, and improve the App's functionality.{'\n'}

                        To send you updates, promotional materials, and marketing communications.{'\n'}

                        To respond to your inquiries, comments, or requests.{'\n'}

                        To comply with legal and regulatory requirements.{'\n'}
                    </Text>

                    {/* 4 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, marginTop: 15 }}>
                        Sharing Your Information
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        We may share your information with third parties only in the following circumstances:{'\n'}

                        With your consent.{'\n'}

                        To comply with legal obligations.{'\n'}

                        To protect our rights, privacy, safety, or property.{'\n'}
                    </Text>

                    {/* 5 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, marginTop: 15 }}>
                        Security
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        We take reasonable measures to help protect your information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
                    </Text>

                    {/* 6 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, marginTop: 15 }}>
                        Contact Us
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        If you have any questions or concerns about this Privacy Policy, please contact us.
                    </Text>

                </View>
                <View>
                    <Text style={styles.headerText}>
                        Terms & Conditions
                    </Text>
                </View>
                <View style={{ paddingBottom: 40 }}>
                    {/* 1 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, }}>
                        Effective Date: Nov 09, 2023
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You’re not allowed to copy or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages or make derivative versions. The app itself, and all the trademarks, copyright, database rights, and other intellectual property rights related to it, still belong to Kubertree Pvt Ltd .

                    </Text>

                    {/* 2 */}
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        Kubertree Pvt Ltd is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you’re paying for.

                    </Text>

                    {/* 3 */}
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        The Branding profitable app stores and processes personal data that you have provided to us, to provide our Service. It’s your responsibility to keep your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone’s security features and it could mean that the Branding profitable app won’t work properly or at all.

                    </Text>

                    {/* 4 */}
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        KUBER TREE Pvt Ltd built the Branding profitable app as a Commercial app. This SERVICE is provided by Kubertree Pvt Ltd and is intended for use as is.{'\n'}

                        If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
                        {'\n'}

                        To comply with legal obligations.{'\n'}

                        To protect our rights, privacy, safety, or property.{'\n'}
                    </Text>

                    {/* 5 */}
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at Branding profitable unless otherwise defined in this Privacy Policy.{"\n"}

                    </Text>
                    {/* 5 */}
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        You should be aware that there are certain things that Kubertree Pvt Ltd will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi or provided by your mobile network provider, but Kubertree Pvt Ltd cannot take responsibility for the app not working at full functionality if you don’t have access to Wi-Fi, and you don’t have any of your data allowance left. {"\n"}
                    </Text>
                    {/* 5 */}
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        With respect to Kubertree Pvt Ltd ’s responsibility for your use of the app, when you’re using the app, it’s important to bear in mind that although we endeavor to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. Kubertree Pvt Ltd accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app.{"\n"}
                    </Text>

                    {/* 6 */}
                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginVertical: 10, marginTop: 15 }}>
                        Contact Us
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', fontSize: 13, color: 'white', }}>
                        If you have any questions or concerns about this Privacy Policy, please contact us.
                    </Text>

                </View>
            </ScrollView>

        </LinearGradient>
    )
}

export default PrivacyPolicy;

const styles = StyleSheet.create({
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontFamily: "Manrope-Bold",
        marginLeft: 0,
    },
})