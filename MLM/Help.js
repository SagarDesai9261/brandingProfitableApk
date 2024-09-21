import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const Help = () => {
  const handleComposeEmail = () => {
    const email = 'info@brandingprofitable.com';
    const subject = 'Your Subject Here';
    const body = 'Your email body goes here.';

    // Create the mailto URL
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the default mail client
    Linking.openURL(mailtoUrl)
      .catch((err) => console.error('Error opening mail client:', err));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help Center</Text>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionContent}>
          If you have any further questions or need assistance, please contact us at{' '}
          {/* <Text style={styles.link}>info@brandingprofitable.com</Text>. */}
          <TouchableOpacity onPress={handleComposeEmail}>
        <Text style={styles.link}>info@brandingprofitable.com</Text>
      </TouchableOpacity>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>About Refer & Earn</Text>
        <Text style={styles.sectionContent}>
           Refer & Earn, is a business model that allows individuals to earn income by promoting and selling products or services to customers. Participants in an Refer & Earn program can also build a network of distributors under them, earning commissions based on the sales and recruitment efforts of their downline.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>Refer & Earn Terminology</Text>
        <Text style={styles.sectionContent}>
          - Upline: Refers to the distributors above you in your Refer & Earn organization.
          {'\n'}
          - Downline: Refers to the distributors you've recruited and those recruited by them.
          {'\n'}
          - Compensation Plan: The structure that outlines how you earn money in the Refer & Earn program.
        </Text>
      </TouchableOpacity>

      {/* Add more Refer & Earn-related sections as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF', // Blue color
  },
  sectionContent: {
    fontSize: 16,
    marginTop: 10,
    color: '#444',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default Help;
