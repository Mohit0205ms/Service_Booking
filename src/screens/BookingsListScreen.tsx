import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../navigation/types';
import { Booking } from '../types';
import { getBookings, saveBookings } from '../storage/storage';
import Colors from '../../constants/Colors';

type Props = {
  navigation: NavigationProp<MainTabParamList, 'Bookings'>;
};

const BookingsListScreen: React.FC<Props> = ({ navigation }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(booking =>
      booking.serviceName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.date.includes(searchText) ||
      (booking.notes && booking.notes.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredBookings(filtered);
  }, [bookings, searchText]);

  useFocusEffect(
    React.useCallback(() => {
      loadBookings();
    }, [])
  );

  const loadBookings = async () => {
    const currentBookings = await getBookings();
    setBookings(currentBookings);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  }, []);

  const handleDelete = async (bookingId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure to delete this booking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const updated = bookings.filter(b => b.id !== bookingId);
          await saveBookings(updated);
          setBookings(updated);
        },
      },
    ]);
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness-outline" size={24} color={Colors.light.primary} />
        </View>
        <View style={styles.bookingDetails}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <View style={styles.dateTimeRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.light.secondary} />
            <Text style={styles.details}>{item.date}</Text>
            <Ionicons name="time-outline" size={16} color={Colors.light.secondary} style={styles.timeIcon} />
            <Text style={styles.details}>{item.time}</Text>
          </View>
          {item.notes && <Text style={styles.notes}>Notes: {item.notes}</Text>}
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color={Colors.light.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Bookings</Text>

      {/* Search Input */}
      {bookings.length > 0 && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.light.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings..."
            placeholderTextColor={Colors.light.secondary}
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode="while-editing"
          />
        </View>
      )}

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={100} color={Colors.light.secondary} style={styles.emptyIcon} />
          <Text style={styles.empty}>No bookings yet. Book a service first!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchText ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-circle-outline" size={60} color={Colors.light.secondary} />
                <Text style={styles.emptyText}>No bookings found matching "{searchText}"</Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.light.primary}
              colors={[Colors.light.primary]}
              progressBackgroundColor={Colors.light.card}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 20,
  },
  empty: {
    fontSize: 20,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  bookingItem: {
    backgroundColor: Colors.light.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.input,
  },
  bookingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginRight: 15,
  },
  bookingDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 10,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeIcon: {
    marginLeft: 15,
  },
  details: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 5,
  },
  notes: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});

export default BookingsListScreen;
