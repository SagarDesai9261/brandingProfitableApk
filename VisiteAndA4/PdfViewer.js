import axios from 'axios';
import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Share, Linking  } from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({route}) => {
  const data = route.params.data;
  const source = { uri: data, cache: true };

  return (
    <View style={styles.container}>
        <Pdf  
        trustAllCerts={false}
            source={source}
            onLoadComplete={(numberOfPages,filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page,numberOfPages) => {
                console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={async (uri) => {
              try {
                await Linking.openURL(uri);
              } catch (error) {
                console.error("error in share pdf", error)
              }
            }}
            style={styles.pdf}/>
    </View>
)
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
});

export default PdfViewer