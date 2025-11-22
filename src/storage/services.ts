import { Servics } from '../types';

// JSON-style dummy data for services
const servicesData: Servics[] = [
  {
    id: 1,
    name: 'Gym Membership Consultation',
    duration: '30 mins',
    price: 499,
  },
  {
    id: 2,
    name: 'Personal Training Session',
    duration: '60 mins',
    price: 999,
  },
  {
    id: 3,
    name: 'Diet Planning Call',
    duration: '45 mins',
    price: 799,
  },
  {
    id: 4,
    name: 'Group Fitness Class',
    duration: '45 mins',
    price: 249,
  },
  {
    id: 5,
    name: 'Nutrition Assessment',
    duration: '90 mins',
    price: 1499,
  },
  {
    id: 6,
    name: 'Sports Injury Recovery',
    duration: '60 mins',
    price: 1299,
  },
  {
    id: 7,
    name: 'Yoga Therapy Session',
    duration: '50 mins',
    price: 899,
  },
  {
    id: 8,
    name: 'Cardio Fitness Assessment',
    duration: '40 mins',
    price: 699,
  },
  {
    id: 9,
    name: 'Weight Management Program',
    duration: '60 mins',
    price: 1899,
  },
  {
    id: 10,
    name: 'Post-Surgery Rehabilitation',
    duration: '45 mins',
    price: 1099,
  }
];

// Function to get services (simulates JSON loading)
export const getServices = (): Promise<Servics[]> => {
  return new Promise((resolve) => {
    // Simulate network delay for more realistic behavior
    setTimeout(() => {
      resolve(servicesData);
    }, 500);
  });
};

// Legacy export for backward compatibility
export const servicess = servicesData;
