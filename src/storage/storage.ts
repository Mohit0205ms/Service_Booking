import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types';

const BOOKINGS_KEY = 'bookings';

export const getBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsStr = await AsyncStorage.getItem(BOOKINGS_KEY);
    return bookingsStr ? JSON.parse(bookingsStr) : [];
  } catch (e) {
    console.error('Error loading bookins', e);
    return [];
  }
};

export const saveBookings = async (bookings: Booking[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookigs', e);
  }
};
