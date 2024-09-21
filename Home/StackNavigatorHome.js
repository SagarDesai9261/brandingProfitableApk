import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import CategoriesScreen from './SubCategoriesScreen/CategoriesScreen';
import TrendingScreen from './SubCategoriesScreen/TrendingScreen';
import EditHomeDynamic from './EditHomeDynamic';
import CategoryA4Screen from './SubCategoriesScreen/CategoryA4Screen';

const Stack = createNativeStackNavigator();

const StackHome = ({dataisLoaded, dataToSendInHome}) => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }} /> */}
      <Stack.Screen name="HomeScreen" options={{ headerShown: false }}>
        {props => <Home {...props} dataisLoaded={dataisLoaded} dataToSendInHome={dataToSendInHome} />}
      </Stack.Screen>
      <Stack.Screen name="category" component={CategoriesScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
      {/* <Stack.Screen name="meetgohel" component={CategoryA4Screen} options={{ headerShown: false, animation: 'slide_from_left' }} /> */}
      <Stack.Screen name="trending" component={TrendingScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="trendingA4" component={TrendingScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
};

export default StackHome;