import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SavedFrames from './SavedFrames';
import MainCustomFrame from './MainCustomFrames';
import MainCustomFrameA4 from './MainCustomFramesA4';
import { Alert } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const Frames = ({ route }) => {
  const a4_have = route?.params?.a4_have;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, color: 'gray' }, // Inactive tab text color
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: 'white', // Active tab text color
        tabBarIndicatorStyle: { backgroundColor: 'white' }, // Active tab indicator color
      }}
      initialRouteName={a4_have ? 'CustomFramesProfileA4' : 'CustomFramesProfile'} // Conditionally set initial route name
    >
      <Tab.Screen name="CustomFramesProfile" component={MainCustomFrame} options={{ title: 'Custom Frame' }} />
      <Tab.Screen name="CustomFramesProfileA4" component={MainCustomFrameA4} options={{ title: 'A4 Frame' }} />
      <Tab.Screen name="SavedFramesProfile" component={SavedFrames} options={{ title: 'Saved' }} />
    </Tab.Navigator>
  );
};

export default Frames;
