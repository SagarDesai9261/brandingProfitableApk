import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome';
import DynamicSection from './DynamicSectionA4';
import TodayBannerA4 from '../Home/Category/TodayA4';

const A4Screen = ({navigation}) => {
  return (
    <LinearGradient colors={['#050505', '#1A2A3D']}
      style={{ flex: 1, justifyContent: "space-between" }}>

      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          A4 Content
        </Text>
      </View>

      <TodayBannerA4 />

      <DynamicSection />

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 16,
    color: 'white',
    fontFamily: "Manrope-Bold",
    marginLeft: 20,
  },
})

export default A4Screen