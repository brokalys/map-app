import type { Property } from './property';
import type { VZDApartment, VZDHouse, VZDPremise } from './vzd';

export interface Building {
  id: number;
  bounds: string;

  properties?: {
    results: Property[];
  };
  vzd?: {
    apartments: VZDApartment[];
    premises: VZDPremise[];
    houses: VZDHouse[];
  };
}
