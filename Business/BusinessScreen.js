import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import BannerComponent from './AdBanner'

import Header from '../Header';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed
const imageWidth = (width - 48) / 3; // Calculate the image width based on the number of columns and margins

const BusinessScreen = ({ navigation, route }) => {
  const { businessFromAll } = route.params ?? '';
  const MyBusiness = 'Information & Technology';
  const [userBusiness, setUserBusiness] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loaderMore, setLoaderMore] = useState(false);

  const [text, setText] = useState('');

  // page 
    // const [page, setPage] = useState(1)
    // const [pageLimit, setPageLimit] = useState(1)
    // const [loaderMore, setLoaderMore] = useState(false)

    const fetchData = useCallback(async () => {
      try {
        setLoaderMore(true);
        const response = await axios.get(
          `https://api.brandingprofitable.com/my_business/my_businessdata?page=${page}`
        );
  
        if (data.length > 0) {
          setData((prevData) => [...prevData, ...response.data.data]);
        } else {
          setData(response.data.data);
        }
  
        setPage(page + 1);
        setPageLimit(response.data.totalPages);
        setLoaderMore(false);
      } catch (error) {
        console.log('Error fetching data.... business screen:', error);
      } finally {
        setLoading(false);
      }
    }, [data, page]);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const loadmoredata = () => {
      if (!loaderMore && page < pageLimit) {
        fetchData();
      }
    };

  const retrieveProfileData = useCallback(async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
        setUserBusiness(data.Designation || data.businessType);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  }, []);

  // const fetchData = useCallback(async () => {
  //   try {
  //     setLoaderMore(true)
  //     const response = await axios.get(
  //       `https://api.brandingprofitable.com/my_business/my_businessdata?page=${page}`
  //       // 'https://api.brandingprofitable.com/my_business/my_business/pagination'
  //     );
  //     console.log(`https://api.brandingprofitable.com/my_business/my_businessdata?page=${page}`)
  //     if (data.length > 0) {
  //       setData((prevData) => [...prevData, ...response.data.data]);
        
  //       setPage(page + 1)
  //       console.log(page + 1)
  //     } else {
  //       setData(response.data.data)
  //       setPage(page + 1)
  //       console.log(page + 1)
  //     }
  //     const result = response.data.data;
  //     setPageLimit(response.data.totalPages)
  //     setData(result);
  //     setLoaderMore(false);
  //   } catch (error) {
  //     console.log('Error fetching data.... business screen:', error);
  //   }
  //   setLoading(false);
  // }, []);

  // const loadmoredata = () => {
  //   if (pageLimit>page) {
  //     fetchData();
  //   }
  // }

  const businessCopy = data.filter((name) => name.businessTypeName === userBusiness);

  const filteredData = data.filter((name) => name.businessTypeName !== userBusiness);

  const filteredDataForSearch = data.filter((item) => {
    const businessTypeName = item.businessTypeName.toLowerCase();
    const searchText = text.toLowerCase();

    if (businessTypeName.includes(searchText)) {
      return true;
    }

    return false;
  });

  const handleImagePress = (item, index) => {
    navigation.navigate('EditBusiness', {
      items: item.items,
      bannername: item.businessTypeName,
      index: index ? index : '',
    });
  };

  const renderCategoriesInGrid = (categories) => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 3) {
      const row = (
        <View key={`row_${i}`} style={styles.categoryRow}>
          {categories.slice(i, i + 3).map((item, index) => (
            <TouchableOpacity
              key={item.businessTypeName}
              onPress={() => handleImagePress(item)}
            >
              <View style={styles.categoryItem}>
                <FastImage
                  source={{ uri: 'https://cdn.brandingprofitable.com/' + (item?.items[0].comp_iamge || item?.items[0].imageUrl) }}
                  style={[styles.image]}
                />
                <Text style={styles.categoryText}>{item.businessTypeName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
      rows.push(row);
    }
    return rows;
  };

  useEffect(() => {
    retrieveProfileData();
    fetchData();
  }, [retrieveProfileData]);

  if (loading) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="red" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom: 50 }}>
      <Header />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer} onScroll={loadmoredata}>
          {/* <ScrollView contentContainerStyle={styles.scrollViewContainer} onTouchEnd={() => { console.log("reached...!") }}> */}
          <View style={styles.searchContainer}>
            <Text style={[styles.searchText]}>
              <Feather name="search" size={20} />
            </Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Search"
              style={[styles.searchText, { fontSize: 15, fontFamily: 'Inter-Med', width: '80%' }]}
              placeholderTextColor={'lightgray'}
            />
          </View>

          <View style={{ width: width, marginVertical: 10 }}>
            <BannerComponent />
          </View>

          <View style={{ width: width - 25, alignSelf: 'center' }}>

            {text !== '' && filteredDataForSearch.length !== 0 ? (
              // Render search results
              renderCategoriesInGrid(filteredDataForSearch)
            ) : text !== '' && filteredDataForSearch.length === 0 ? (
              <View style={styles.container}>
                <Text style={{ color: 'white' }}>No Images Found</Text>
              </View>
            ) : (
              <>
                {renderCategoriesInGrid(filteredData)}
              </>
            )}

            {
              loaderMore && <ActivityIndicator color={'white'} />
            }
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default BusinessScreen;

const styles = StyleSheet.create({
  headerContainer: {
    height: 65,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  buisnessTitle: {
    fontSize: 19,
    color: 'black',
    fontFamily: 'Manrope-Bold',
  },
  yourBuisness: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
  },
  image: {
    borderRadius: 10,
    margin: 7,
    width: imageWidth,
    height: imageWidth,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: 'white',
  },
  BannerItem: {
    width: '100%',
  },
  bannerHeader: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
  },
  bannerHeaderText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Manrope-Bold',
  },
  flatListContainer: {
    width: width,
    paddingBottom: 50,
  },
  scrollViewContainer: {
    paddingBottom: 50,
  },
  imageScrollView: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 10,
    marginVertical: 0,
    alignItems: 'center',
    width: width - 35,
    elevation: 5,
    backgroundColor: 'white',
    // marginBottom: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  searchText: {
    marginRight: 3,
    color: 'black',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: itemWidth,
    borderRadius: 10,
  },
  categoryText: {
    color: 'white',
    fontFamily: 'Manrope-Bold',
    marginTop: -5,
    textAlign: 'center',
    fontSize: 14,
    width: 100
  },
});
