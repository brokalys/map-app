import type { Data } from './data';

export interface VZDApartment extends Data {
  category: string;
  price: number;
  area: number;
}

export interface VZDHouse extends Data {
  category: string;
  price: number;
  area: number;
}

export interface VZDPremise extends Data {
  category: string;
  price: number;
  area: number;
}

export interface VZDLand extends Data {
  category: string;
  price: number;
  area: number;
}

export type VZDProperty = VZDApartment | VZDHouse | VZDPremise | VZDLand;
