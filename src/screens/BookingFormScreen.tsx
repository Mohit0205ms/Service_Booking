import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ServicesStackParamList, MainTabParamList } from '../navigation/types';
import { Servics } from '../types';
import { saveBookings, getBookings } from '../storage/storage';
import Colors from '../../constants/Colors';

type Props = {
  navigation: NavigationProp<ServicesStackParamList, 'BookingForm'> & NavigationProp<MainTabParamList>;
  route: RouteProp<ServicesStackParamList, 'BookingForm'>;
};

const BookingFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { service } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'error' | 'success'>('success');
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadBookedDates = async () => {
      const bookings = await getBookings();
      const booked = new Set<string>();
      bookings.forEach(booking => {
        if (booking.serviceId === service.id) {
          booked.add(booking.date);
        }
      });
      setBookedDates(booked);
    };
    loadBookedDates();
  }, [service.id]);

  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const isDateTimeValid = (selectedDate: string, selectedTime: string) => {
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    return selectedDateTime >= now;
  };

  const selectDate = () => {
    setIsDatePickerVisible(true);
  };

  const selectTime = () => {
    setIsTimePickerVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setIsDatePickerVisible(false);
    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      if (selectedDate < new Date()) {
        showToast('Please select a future date', 'error');
        return;
      }
      if (bookedDates.has(selectedDateString)) {
        showToast('This date is already booked for this service', 'error');
        return;
      }

      setDate(selectedDateString);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setIsTimePickerVisible(false);
    if (selectedTime) {
      const selectedTimeString = selectedTime.toTimeString().substring(0, 5);
      if (date && !isDateTimeValid(date, selectedTimeString)) {
        showToast('Please select a future time', 'error');
        return;
      } else if (!date) {
        showToast('Please select a date first', 'error');
        return;
      }

      setTime(selectedTimeString);
    }
  };

  const handleConfirm = async () => {
    if (!date.trim() || !time.trim()) {
      showToast('Please select date and time', 'error');
      return;
    }

    if (!isDateTimeValid(date, time)) {
      showToast('Selected date and time cannot be in the past', 'error');
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      serviceId: service.id,
      serviceName: service.name,
      date,
      time,
      notes: notes.trim() || undefined,
    };
    const currentBookings = await getBookings();
    currentBookings.push(newBooking);
    await saveBookings(currentBookings);
    // Reset form after successful booking
    setDate('');
    setTime('');
    setNotes('');
    showToast('Booking confirmed successfully', 'success');
    setTimeout(() => {
      (navigation as any).navigate('Bookings');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <Ionicons name="calendar-outline" size={80} color={Colors.light.primary} style={styles.icon} />
        <Text style={styles.title}>Book Service</Text>
        <View style={styles.serviceCard}>
          <Ionicons name="fitness-outline" size={24} color={Colors.light.secondary} />
          <Text style={styles.serviceLabel}>{service.name}</Text>
        </View>
        <TouchableOpacity style={styles.inputContainer} onPress={selectDate}>
          <Ionicons name="calendar" size={24} color={Colors.light.secondary} style={styles.inputIcon} />
          <Text style={[styles.input, { color: date ? Colors.light.textPrimary : '#AAAAAA' }]}>
            {date || 'Select Date'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.inputContainer} onPress={selectTime}>
          <Ionicons name="time-outline" size={24} color={Colors.light.secondary} style={styles.inputIcon} />
          <Text style={[styles.input, { color: time ? Colors.light.textPrimary : '#AAAAAA' }]}>
            {time || 'Select Time'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.secondary} />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={24} color={Colors.light.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.notes]}
            placeholder="Notes (optional)"
            placeholderTextColor="#AAAAAA"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>

      {isDatePickerVisible && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
      {isTimePickerVisible && (
        <DateTimePicker
          value={time ? new Date(`1970-01-01T${time}`) : new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Toast visible={toastVisible} message={toastMessage} onHide={hideToast} type={toastType} />
    </KeyboardAvoidingView>
  );
};

// Simple toast component
const Toast = ({ visible, message, onHide, type }: { visible: boolean; message: string; onHide: () => void; type: 'error' | 'success' }) => {
  if (!visible) return null;

  React.useEffect(() => {
    const timer = setTimeout(onHide, 3000);
    return () => clearTimeout(timer);
  }, [visible, onHide]);

  const toastStyle = type === 'error' ? styles.toastError : styles.toastSuccess;

  return (
    <View style={styles.toastContainer}>
      <View style={[styles.toast, toastStyle]}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
    width: '100%',
    maxWidth: 300,
  },
  serviceLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  notes: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: Colors.light.danger,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toastError: {
    backgroundColor: '#FF4444',
  },
  toastSuccess: {
    backgroundColor: '#4CAF50',
  },
});

export default BookingFormScreen;
