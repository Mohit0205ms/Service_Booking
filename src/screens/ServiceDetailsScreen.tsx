import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ServicesStackParamList } from '../navigation/types';
import { Servics } from '../types';
import Colors from '../../constants/Colors';

type Props = {
  navigation: NavigationProp<ServicesStackParamList, 'ServiceDetails'>;
  route: RouteProp<ServicesStackParamList, 'ServiceDetails'>;
};

const ServiceDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { service } = route.params;

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Ionicons name="fitness-outline" size={100} color={Colors.light.primary} style={styles.icon} />
      <Text style={styles.title}>{service.name}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={24} color={Colors.light.secondary} />
          <Text style={styles.detailText}>Duration: {service.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={24} color={Colors.light.secondary} />
          <Text style={styles.detailText}>Price: Rs {service.price}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookingForm', { service })}>
        <Text style={styles.buttonText}>Book This Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailText: {
    fontSize: 18,
    color: Colors.light.textPrimary,
    marginLeft: 15,
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
});

export default ServiceDetailsScreen;
