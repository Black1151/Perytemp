export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  description: string;
  image: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  description: string;
  expiryDate: string;
  image: string;
}

export interface MedicalProvider {
  id: string;
  provider: string;
  speciality: string;
  location: string;
  contact: string;
  image: string;
}

export interface LegalProvider {
  id: string;
  provider: string;
  speciality: string;
  location: string;
  contact: string;
  image: string;
}

export type HospitalityItem =
  | Hotel
  | Event
  | Reward
  | MedicalProvider
  | LegalProvider;
