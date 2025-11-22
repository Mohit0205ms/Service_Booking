import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ServicesStackNavigator from './ServicesStackNavigator';
import BookingsListScreen from '../screens/BookingsListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Colors from '../../constants/Colors';

export type MainTabParamList = {
  Services: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.light.card,
          borderTopColor: Colors.light.input,
        },
        headerStyle: {
          backgroundColor: Colors.light.card,
        },
        headerTintColor: Colors.light.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Services"
        component={ServicesStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" color={color} size={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Reset the services stack to ServicesListScreen when pressing the services tab
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Services' }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
