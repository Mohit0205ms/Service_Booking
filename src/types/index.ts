export interface Servics {
  id: number;
  name: string;
  duration: string;
  price: number;
}

export interface Booking {
  id: string;
  serviceId: number;
  serviceName: string;
  date: string;
  time: string;
  notes?: string;
}
