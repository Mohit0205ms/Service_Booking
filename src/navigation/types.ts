import { Servics } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type ServicesStackParamList = {
  ServicesList: undefined;
  ServiceDetails: { service: Servics };
  BookingForm: { service: Servics };
};

export type MainTabParamList = {
  Services: undefined;
  Bookings: undefined;
};
