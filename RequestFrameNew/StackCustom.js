import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import RequestFrame from './RequestFrame';
import EditCustomRequestFrame from './EditCustomRequestFrame';

const StackCustom = () => {
  return (
      <Stack.Navigator >
        <Stack.Screen name="RequestFrame" component={RequestFrame} options={{animation: 'slide_from_left' }} />
        <Stack.Screen name="EditCustomRequestFrame" component={EditCustomRequestFrame} options={{ headerShown: false, animation: 'slide_from_right' }} />
      </Stack.Navigator>
  );
};

export default StackCustom;