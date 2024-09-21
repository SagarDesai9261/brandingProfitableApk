// RefundPolicy.js
import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const RefundPolicy = ({ navigation }) => {
    return (
        <LinearGradient
            colors={['#050505', '#1A2A3D']}
            style={{ flex: 1, justifyContent: 'space-between' }}
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
                    Refund Policy
                </Text>
            </View>

            <ScrollView style={{ padding: 20, flex: 1, paddingTop: 10 }}>
                <View style={{ paddingBottom: 40 }}>
                    <Text style={styles.effectiveDate}>
                        Branding Profitable Refund Policy
                    </Text>
                    <Text style={styles.effectiveDate}>
                        Effective Date: 08-11-2023
                    </Text>
                    <Text style={styles.policyText}>
                        Welcome to the BrandingProfitable application, provided by KuberTree Company. By using our
                        services, you acknowledge that you have read and understood our Refund Policy outlined
                        below.
                    </Text>

                    <Text style={styles.policyText}>
                        Thank you for using the Branding Profitable app. This Refund Policy explains the terms and conditions for refunds, returns, and billing related to our services.
                    </Text>

                    <Text style={styles.heading}>
                        1. Refund Eligibility
                    </Text>
                    <Text style={styles.policyText}>
                        We offer a free service, and therefore, no refunds are applicable for the usage of our app. Since our app is provided at no cost, there are no monetary transactions or charges associated with its use.
                    </Text>

                    <Text style={styles.heading}>
                        2. Canceling Paid Services
                    </Text>
                    <Text style={styles.policyText}>
                        As of the effective date of this Refund Policy, the Branding Profitable app does not offer any paid services or products that would require cancellation or refund. Any future paid services, if introduced, will have their refund and cancellation policies clearly defined within the respective terms and conditions.
                    </Text>

                    <Text style={styles.heading}>
                        3. Contact Information
                    </Text>
                    <Text style={styles.policyText}>
                        If you have any questions or concerns about this Refund Policy, please don't hesitate to contact us at the following email address:
                    </Text>
                    <Text style={styles.email}>
                        Email: info@brandingprofitable.com
                    </Text>

                    <Text style={styles.heading}>
                        4. Changes to this Refund Policy
                    </Text>
                    <Text style={styles.policyText}>
                        We reserve the right to make changes to this Refund Policy from time to time. Any updates or modifications to this policy will be effective upon posting the revised version on this page. We encourage you to check this page periodically to stay informed about our refund policies.
                    </Text>

                    <Text style={styles.heading}>
                        5. Additional Information
                    </Text>
                    <Text style={styles.policyText}>
                        This Refund Policy is separate from our Privacy Policy and Terms and Conditions. Please refer to those documents for information about data collection, usage, and your rights and responsibilities as a user of the Branding Profitable app.
                    </Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = {
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    effectiveDate: {
        fontFamily: 'Manrope-Bold',
        fontSize: 16,
        color: 'white',
        marginVertical: 10,
    },
    heading: {
        fontFamily: 'Manrope-Bold',
        fontSize: 16,
        color: 'white',
        marginVertical: 10,
        marginTop: 15,
    },
    policyText: {
        fontFamily: 'Manrope-Regular',
        fontSize: 13,
        color: 'white',
    },
    email: {
        fontFamily: 'Manrope-Regular',
        fontSize: 13,
        color: 'white',
        textDecorationLine: 'underline',
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontFamily: "Manrope-Bold",
        marginLeft: 0,
    },
};

export default RefundPolicy;
