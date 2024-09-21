import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from './Profile';
// import CustomFrame from "./App";
// import SavedFrames from './SavedFrames';
// import CustomFrames from './CustomFrames';
// import CustomFramesRequest from './CustomFrameRequest';
// import fullScreenProfile from './fullScreenProfile';
// import CustomFrame2 from './CustomFrame2';
// import EditProfile from './EditProfile';
// import Frames from './Frames';
// import CustomFrameForm from "./App";
// import ViewProfile from './ViewProfile';
// import StackCustom from '../RequestFrames/StackCustom';

const Stack = createNativeStackNavigator();

const StackProfile = () => {
  return (
      <Stack.Navigator >
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false, animation: 'slide_from_left' }} />
        
      </Stack.Navigator>
  );
};

export default StackProfile;