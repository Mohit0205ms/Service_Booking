import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ServicesStackParamList } from '../navigation/types';
import { getServices } from '../storage/services';
import { Servics } from '../types';
import Colors from '../../constants/Colors';

type Props = {
  navigation: NavigationProp<ServicesStackParamList, 'ServicesList'>;
};

const ServicesListScreen: React.FC<Props> = ({ navigation }) => {
  const [services, setServices] = useState<Servics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setError(null);
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const renderService = ({ item }: { item: Servics }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('ServiceDetails', { service: item })}
    >
      <View style={styles.serviceContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness-outline" size={24} color={Colors.light.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>{item.duration} - Rs {item.price}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.light.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Services</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.light.danger} />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderService}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  serviceItem: {
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.input,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: Colors.light.danger,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServicesListScreen;
