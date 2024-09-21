import React from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid } from 'react-native';

const App = () => {

  const requestPermission = async () => {
    const apilevel = Platform.Version;

    console.log("Platform Version:", apilevel)

    if (apilevel >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      if (granted) {
        alert("permission granted")
      } else {
        alert("permission denied")
      }
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      )
      if (granted) {
        alert("permission granted")
      } else {
        alert("permission denied")
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text onPress={requestPermission}>API Version {Platform.Version?.toString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;