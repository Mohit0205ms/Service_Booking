import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServicesListScreen from '../screens/ServicesListScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import BookingFormScreen from '../screens/BookingFormScreen';
import { Servics } from '../types';

export type ServicesStackParamList = {
  ServicesList: undefined;
  ServiceDetails: { service: Servics };
  BookingForm: { service: Servics };
};

const ServicesStack = createNativeStackNavigator<ServicesStackParamList>();

const ServicesStackNavigator: React.FC = () => {
  return (
    <ServicesStack.Navigator>
      <ServicesStack.Screen
        name='ServicesList'
        component={ServicesListScreen}
        options={{ headerShown: false }}
      />
      <ServicesStack.Screen
        name='ServiceDetails'
        component={ServiceDetailsScreen}
      />
      <ServicesStack.Screen name='BookingForm' component={BookingFormScreen} />
    </ServicesStack.Navigator>
  );
};

export default ServicesStackNavigator;
