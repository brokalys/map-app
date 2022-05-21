import type { Estate } from './estate';
import type { Property } from './property';
import type { VZDApartment, VZDHouse, VZDPremise } from './vzd';

export interface Building extends Estate {
  properties?: {
    results: Property[];
  };
  vzd?: {
    apartments: VZDApartment[];
    premises: VZDPremise[];
    houses: VZDHouse[];
  };
}
