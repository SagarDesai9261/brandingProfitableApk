import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { calendarFormat } from 'moment';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const DynamicCustom = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    // Define the URL for the GET request
    const apiUrl = 'https://api.brandingprofitable.com/cd_section/cds_category_with_image';

    // Make the GET request using Axios
    axios
      .get(apiUrl)
      .then(response => {
        // Handle the successful response
        setData(response.data.data); // Use response.data.data instead of response.data
        setLoading(false);
      })
      .catch(error => {
        // Handle errors
        console.error('Error fetching response.data.data:', error)
        setLoading(false);
      });

  }, []);

  const handleImagePress = (item, index) => {
    console.log("first")
    navigation.navigate('EditCustomChoice', {
      items: item.items,
      bannername: item.cds_categoryName,
      index: index?index:''
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <>
      {/* container */}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {data.map((item) => (
            <View key={item.cds_categoryName} style={styles.BannerItem}>
              <View>
                <View style={styles.bannerHeader}>
                  <Text style={styles.bannerHeaderText}>
                    {item.cds_categoryName}
                  </Text>
                  <TouchableOpacity onPress={() => handleImagePress(item)}>
                    <Text style={[styles.bannerHeaderText,{width:30,height:30,textAlign:'right',}]}>
                      <Icon name="angle-right" size={32} color={"white"} />
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imageScrollView}
                >
                  {item.items.slice(0,10).map((imageItem, index) => (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => handleImagePress(item, index)}
                    >
                      <FastImage
                        source={{ uri: "https://cdn.brandingprofitable.com/" + imageItem.imageUrl }}
                        style={[styles.image, { marginLeft: index === 0 ? 20 : 0 }]}
                        onLoadEnd={() => Image.prefetch("https://cdn.brandingprofitable.com/" + imageItem.imageUrl)}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          ))}
        </ScrollView >
      </View >
    </>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: "center",
  },
  image: {
    borderRadius: 10,
    margin: 7,
    width: 95,
    height: 95,
    marginHorizontal:12,
    borderWidth:1,
    borderColor:'white'
  },
  BannerItem: {
    width: width
  },
  bannerHeader: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20
  },
  bannerHeaderText: {
    fontSize: 16,
    color: 'white',
    fontFamily:'Manrope-Bold'
  },
  flatListContainer: {
    width: width,
    paddingBottom: 50
  },
  scrollViewContainer: {
    paddingBottom: 50,
  },
  imageScrollView: {
    flexDirection: 'row',
  },
});

export default DynamicCustom;
