export interface Data {
  price: number;
  source: string;
  category: string;
  type: string;
  rent_type: string;
  calc_price_per_sqm: number;
  area: number;
  rooms: number;
  floor_min: number | null;
  floor_max: number | null;
  date: string;
}
