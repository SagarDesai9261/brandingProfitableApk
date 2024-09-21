import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Request from './Index';
import RequestEdit from './CustomFrameRequest';

const StackCustom = () => {
  return (
      <Stack.Navigator >
        <Stack.Screen name="Request" component={Request} options={{animation: 'slide_from_left' }} />
        <Stack.Screen name="RequestEdit" component={RequestEdit} options={{ headerShown: false, animation: 'slide_from_right' }} />
      </Stack.Navigator>
  );
};

export default StackCustom;