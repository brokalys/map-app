import type { Estate } from './estate';
import type { Property } from './property';
import type { VZDLand } from './vzd';

export interface Land extends Estate {
  properties?: {
    results: Property[];
  };
  vzd?: {
    land: VZDLand[];
  };
}
