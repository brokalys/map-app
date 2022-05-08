import type { Data } from './data';

export interface Property extends Data {
  source: string;
  type: string;
}
